import { prepareImages } from './storage.js';

async function get(url, signal, json = true) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw Error(`HTTP ${response.status}: ${url}`);
  return json ? response.json() : response.text();
}

export async function provision({ runtime, usb, ui, signal, locale }) {
  const t = (zh, en) => (locale === 'zh_CN' ? zh : en);
  const { log, confirm, choose } = ui;
  const index = runtime.api;
  log(t('RuyiSDK 设备安装向导', 'RuyiSDK Device Provisioning Wizard'));
  if (!(await confirm(t('继续？', 'Continue?')))) return;
  const [entities, packages, hierarchy, plugins] = await Promise.all(
    ['entities', 'packages', 'hierarchy', 'plugins/index'].map((name) =>
      get(`${index}${name}.json`, signal),
    ),
  );
  const sorted = (list) =>
    list.sort((left, right) =>
      left.display_name < right.display_name
        ? -1
        : left.display_name > right.display_name
          ? 1
          : 0,
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
  const device = await pick(
    t('请选择开发板', 'Select your device'),
    sorted(entities.filter((item) => item.type === 'device')),
  );
  const variants = sorted(
    entities.filter(
      (item) =>
        item.type === 'device-variant' &&
        device.related.includes(`device-variant:${item.id}`),
    ),
  );
  const variant = await pick(
    t('请选择硬件变体', 'Select the hardware variant'),
    variants,
    variants.map((item) => `${device.display_name} (${item.display_name})`),
  );
  const related = hierarchy[`device-variant:${variant.id}`] ?? [];
  const combo = await pick(
    t('请选择系统配置', 'Select a system configuration'),
    sorted(
      entities.filter(
        (item) =>
          item.type === 'image-combo' &&
          related.includes(`image-combo:${item.id}`),
      ),
    ),
  );
  const detail = async (row) =>
    get(
      index +
        row.file_path
          .replace(/\.toml$/, '.json')
          .split('/')
          .map(encodeURIComponent)
          .join('/'),
      signal,
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
  const customize =
    groups.some((group) => group.length > 1) &&
    (await confirm(t('要自定义软件包版本吗？', 'Customize package versions?')));
  const selected = [];
  for (const group of groups) {
    const stable = group.find((row) => !row.version.includes('-'));
    const row =
      customize && group.length > 1
        ? await pick(
            group[0].package,
            group,
            group.map((item) => item.version),
          )
        : (stable ?? group[0]);
    selected.push(await detail(row));
  }
  log(
    selected
      .map(
        (pkg) =>
          `${pkg.category}/${pkg.package} ${pkg.version}  (${pkg.data.provisionable.strategy})`,
      )
      .join('\n'),
  );
  if (selected.some((pkg) => pkg.data.provisionable.strategy === 'dd-v1')) {
    log(
      t(
        'dd-v1 需要直接写入电脑连接的磁盘。网页不支持，请用本机 ruyi device provision。',
        'dd-v1 writes a host block device. Web flashing is unsupported. Use native ruyi device provision.',
      ),
    );
    return;
  }
  if (!navigator.usb || !window.showDirectoryPicker) {
    log(
      t(
        '此浏览器不支持设备刷写，请使用桌面 Chrome 或 Edge。',
        'Device flashing requires desktop Chrome or Edge.',
      ),
    );
    return;
  }
  if (
    !(await confirm(
      t('下载并准备以上软件包？', 'Download and prepare these packages?'),
    ))
  )
    return;
  const root = await ui.directory();
  log(`${root.name}/RuyiImages/`);
  const plans = [];
  const catalog = await messages();
  for (const pkg of selected) {
    const { strategy, partition_map: paths } = pkg.data.provisionable;
    const args = {
      strategy,
      paths,
      modules: plugins.modules,
      messages: catalog,
      locale,
    };
    const plan = await runtime.run({ kind: 'preview', ...args });
    const files = await prepareImages(pkg, {
      root,
      runtime,
      signal,
      log,
      localFile: ui.localFile,
      progress: ui.progress,
    });
    plans.push({ ...plan, args, files });
  }
  plans.sort((left, right) => right.priority - left.priority);
  log(
    t(
      '请核对目标设备和以下刷写步骤：',
      'Review the target and the flashing steps:',
    ),
  );
  for (const plan of plans) for (const step of plan.steps) log(`  • ${step}`);
  await ui.device();
  log(`${t('目标', 'Target')}: ${usb.label}`);
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
    !(await confirm(
      t(
        '确认 fastboot 识别的是要刷写的这块开发板？',
        'Is the selected fastboot device the correct board?',
      ),
    ))
  )
    return;
  usb.acceptSelection = false;
  usb.changed();
  ui.flashing?.();
  for (const plan of plans)
    await runtime.run({ kind: 'flash', ...plan.args }, (argv) =>
      usb.execute(argv, plan.files),
    );
  log(t('刷写步骤成功完成。', 'Flashing finished successfully.'));
  await postInstall();
}
