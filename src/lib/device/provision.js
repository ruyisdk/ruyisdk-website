import { packageFastboot } from './spacemit.js';
import { desktopDisks, diskCommand } from './disk.js';
import { prepareImages } from './storage.js';

const indexTimeoutMs = 15_000;

function deviceCatalog(entities, hierarchy) {
  const rows = (type, related) =>
    entities
      .filter(
        (item) =>
          item.type === type &&
          (!related || related.includes(`${type}:${item.id}`)),
      )
      .sort((left, right) =>
        left.display_name < right.display_name
          ? -1
          : left.display_name > right.display_name
            ? 1
            : 0,
      );
  return {
    devices: rows('device'),
    variants: (device) => rows('device-variant', device.related ?? []),
    images: (variant) =>
      rows('image-combo', hierarchy[`device-variant:${variant.id}`] ?? []),
  };
}

export async function provision({ runtime, usb, ui, signal, locale }) {
  const t = (zh, en) => (locale === 'zh_CN' ? zh : en);
  const { log, confirm, choose } = ui;
  const index = runtime.api;
  async function get(url, requestSignal = signal, json = true) {
    requestSignal.throwIfAborted();
    const controller = new AbortController();
    const cancel = () => controller.abort(requestSignal.reason);
    requestSignal.addEventListener('abort', cancel);
    const timer = setTimeout(
      () =>
        controller.abort(
          new Error(
            t(`读取索引超时：${url}`, `Index request timed out: ${url}`),
          ),
        ),
      indexTimeoutMs,
    );
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw Error(`HTTP ${response.status}: ${url}`);
      return await (json ? response.json() : response.text());
    } catch (error) {
      controller.signal.throwIfAborted();
      throw error;
    } finally {
      clearTimeout(timer);
      requestSignal.removeEventListener('abort', cancel);
    }
  }
  async function vendorNames() {
    if (locale === 'zh_CN') {
      try {
        return await get(`${index}vendors/zh-Hans.json`);
      } catch {
        signal.throwIfAborted();
      }
    }
    return get(`${index}vendors/en.json`);
  }
  if (!ui.selectSystem) {
    log(t('RuyiSDK 设备安装向导', 'RuyiSDK Device Provisioning Wizard'));
    if (!(await confirm(t('继续？', 'Continue?')))) return;
  }
  const [entities, packages, hierarchy, plugins] = await Promise.all(
    ['entities', 'packages', 'hierarchy', 'plugins/index'].map((name) =>
      get(`${index}${name}.json`),
    ),
  );
  const pick = async (
    title,
    items,
    labels = items.map((item) => item.display_name),
  ) => {
    if (!items.length)
      throw Error(t('索引中没有可用选项。', 'No options in this index.'));
    return items[await choose(title, labels)];
  };
  const catalog = deviceCatalog(entities, hierarchy);
  let combo;
  if (ui.selectSystem) {
    combo = await ui.selectSystem(catalog, await vendorNames());
  } else {
    const device = await pick(
      t('请选择开发板', 'Select your device'),
      catalog.devices,
    );
    const variants = catalog.variants(device);
    const variant = await pick(
      t('请选择硬件变体', 'Select the hardware variant'),
      variants,
      variants.map((item) => `${device.display_name} (${item.display_name})`),
    );
    combo = await pick(
      t('请选择系统配置', 'Select a system configuration'),
      catalog.images(variant),
    );
  }
  const detail = async (row, requestSignal = signal) =>
    get(
      index +
        row.file_path
          .replace(/\.toml$/, '.json')
          .split('/')
          .map(encodeURIComponent)
          .join('/'),
      requestSignal,
    );
  const config = (await detail(combo)).data['image-combo'];
  const messages = () =>
    get(`${runtime.base}device-runtime/messages.toml`, signal, false);
  const postInstall = async () => {
    if (!config.postinst_msgid) return;
    const text = await messages();
    log(
      await runtime.run({
        kind: 'message',
        text,
        id: config.postinst_msgid,
        locale,
      }),
    );
  };
  if (!config.package_atoms.length) {
    await postInstall();
    return;
  }
  const groups = config.package_atoms.map((atom) => {
    const rows = packages.filter(
      (row) => `${row.category}/${row.package}` === atom,
    );
    if (!rows.length) throw Error(`Unavailable package: ${atom}`);
    return rows;
  });
  const defaults = groups.map(
    (group) => group.find((row) => !row.version.includes('-')) ?? group[0],
  );
  const inspect = async (rows, requestSignal = signal) => {
    const packages = await Promise.all(
      rows.map((row) => detail(row, requestSignal)),
    );
    let issue;
    if (
      !desktopDisks() &&
      packages.some((pkg) => pkg.data.provisionable.strategy === 'dd-v1')
    )
      issue = t(
        'dd-v1 需要直接写盘。请用 Ruyi Imager 桌面应用打开此页面，或在本机运行 ruyi device provision。',
        'dd-v1 requires raw disk access. Open this page in the Ruyi Imager desktop app or run ruyi device provision locally.',
      );
    else if (
      !window.showDirectoryPicker ||
      (packages.some((pkg) => pkg.data.provisionable.strategy !== 'dd-v1') &&
        !navigator.usb)
    )
      issue = t(
        '此浏览器不支持设备刷写，请使用桌面 Chrome 或 Edge。',
        'Device flashing requires desktop Chrome or Edge.',
      );
    return { packages, issue };
  };
  let selected;
  if (ui.preparePackages) {
    selected = await ui.preparePackages({ groups, defaults, inspect });
  } else {
    const customize =
      groups.some((group) => group.length > 1) &&
      (await confirm(
        t('要自定义软件包版本吗？', 'Customize package versions?'),
      ));
    const rows = [...defaults];
    if (customize) {
      for (const [index, group] of groups.entries()) {
        if (group.length > 1)
          rows[index] = await pick(
            group[0].package,
            group,
            group.map((item) => item.version),
          );
      }
    }
    const result = await inspect(rows);
    selected = result.packages;
    log(
      selected
        .map(
          (pkg) =>
            `${pkg.category}/${pkg.package} ${pkg.version}  (${pkg.data.provisionable.strategy})`,
        )
        .join('\n'),
    );
    if (result.issue) {
      log(result.issue);
      return;
    }
    if (
      !(await confirm(
        t('下载并准备以上软件包？', 'Download and prepare these packages?'),
      ))
    )
      return;
  }
  const usesFastboot = selected.some(
    (pkg) => pkg.data.provisionable.strategy !== 'dd-v1',
  );
  ui.fastbootRequired?.(usesFastboot);
  const root = await ui.directory();
  log(`${root.name}/RuyiImages/`);
  const plans = [];
  const disks = new Map();
  const host = desktopDisks();
  ui.trace?.(`packages-index: ${plugins.revision}`);
  const messageCatalog = await messages();
  for (const pkg of selected) {
    const { strategy, partition_map: paths } = pkg.data.provisionable;
    const description = `${pkg.package} ${pkg.version} (${strategy})`;
    const targets = Object.create(null);
    if (strategy === 'dd-v1') {
      for (const slot of Object.keys(paths)) {
        if (!disks.has(slot)) {
          signal.throwIfAborted();
          const target = await host.selectDisk(slot);
          if (!target) {
            log(t('已取消。', 'Cancelled.'));
            return;
          }
          disks.set(slot, target);
        }
        targets[slot] = disks.get(slot);
      }
    }
    ui.trace?.(`Prepare: ${description}`);
    const args = {
      strategy,
      paths,
      blockDevices: Object.fromEntries(
        Object.entries(targets).map(([key, target]) => [key, target.label]),
      ),
      modules: plugins.modules,
      messages: messageCatalog,
      locale,
    };
    const plan = await runtime.run({ kind: 'preview', ...args });
    const files = await prepareImages(pkg, {
      root,
      runtime,
      signal,
      log: (line) => {
        ui.trace?.(line);
        log(line);
      },
      localFile: ui.localFile,
      progress: ui.progress,
    });
    const execute =
      strategy === 'dd-v1'
        ? diskCommand({
            paths,
            targets,
            files,
            host,
            runtime,
            signal,
            log: ui.trace ?? log,
            directory: root.name,
            pkg,
          })
        : await packageFastboot(usb, runtime, strategy, paths, files);
    plans.push({ ...plan, args, execute, description });
  }
  plans.sort((left, right) => right.priority - left.priority);
  const steps = plans.flatMap((plan) => plan.steps);
  if (ui.review) ui.review(steps);
  else {
    log(
      t(
        '请核对目标设备和以下刷写步骤：',
        'Review the target and the flashing steps:',
      ),
    );
    for (const step of steps) log(`  • ${step}`);
  }
  if (usesFastboot) {
    await ui.device();
    log(`${t('目标', 'Target')}: ${usb.label}`);
  }
  const target = usb.device;
  if (
    !(await confirm(
      t(
        '执行上述刷写操作？此操作会覆盖目标设备上的数据。',
        'Proceed with flashing? This overwrites data on the selected device.',
      ),
    ))
  )
    return;
  if (
    usesFastboot &&
    !(await confirm(
      t(
        '确认 fastboot 识别的是要刷写的这块开发板？',
        'Is the selected fastboot device the correct board?',
      ),
    ))
  )
    return;
  if (usesFastboot) {
    usb.acceptSelection = false;
    usb.confirmTarget(target, (label) =>
      confirm(
        t(
          `重连后检测到新的 USB 设备 ${label}。确认这是同一块开发板，并继续写入？`,
          `USB reconnected as ${label}. Confirm this is the same board and resume flashing?`,
        ),
      ),
    );
    usb.changed();
  }
  ui.flashing?.();
  await host?.setFlashing?.(true);
  try {
    for (const plan of plans) {
      ui.trace?.(`Flash: ${plan.description}`);
      await runtime.run(
        { kind: 'flash', ...plan.args, snapshot: plan.snapshot },
        plan.execute,
      );
      ui.trace?.(`Flash OK: ${plan.description}`);
    }
  } finally {
    await host?.setFlashing?.(false);
  }
  log(t('刷写步骤成功完成。', 'Flashing finished successfully.'));
  await postInstall();
}
