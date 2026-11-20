import Button from '../common/Button';
import styles from './imager.module.css';
import { translate } from '@docusaurus/Translate';
import { CircuitBoard, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const vendorId = (device) => device.id.split('-', 1)[0];
const selectedOption = (options, id) =>
  options.length === 1
    ? options[0]
    : options.find((option) => option.id === id);

function SelectField({ label, value, options, onChange, disabled }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled || options.length < 2}
        onChange={(event) => onChange(event.target.value)}
      >
        {!value && (
          <option value="" disabled>
            —
          </option>
        )}
        {options.map(({ id, display_name }) => (
          <option key={id} value={id}>
            {display_name}
          </option>
        ))}
      </select>
    </label>
  );
}

function SystemForm({ catalog, vendors, locked, onSelect }) {
  const [manufacturerId, setVendor] = useState('');
  const [boardId, setBoard] = useState('');
  const [variantId, setVariant] = useState('');
  const [imageId, setImage] = useState('');
  const manufacturers = [...new Set(catalog.devices.map(vendorId))]
    .map((id) => ({ id, display_name: vendors[id] ?? id }))
    .sort((left, right) => left.display_name.localeCompare(right.display_name));
  const vendor = selectedOption(manufacturers, manufacturerId);
  const boards = catalog.devices.filter(
    (item) => vendorId(item) === vendor?.id,
  );
  const board = selectedOption(boards, boardId);
  const variants = board ? catalog.variants(board) : [];
  const variant = selectedOption(variants, variantId);
  const images = variant ? catalog.images(variant) : [];
  const image = selectedOption(images, imageId);
  useEffect(() => onSelect(image ?? null), [image, onSelect]);
  return (
    <>
      <div className={styles.fields}>
        <SelectField
          label={translate({
            id: 'tryruyi.imager.vendor',
            message: '开发板厂商',
          })}
          value={vendor?.id ?? ''}
          options={manufacturers}
          disabled={locked}
          onChange={(id) => {
            setVendor(id);
            setBoard('');
            setVariant('');
            setImage('');
          }}
        />
        <SelectField
          label={translate({ id: 'tryruyi.imager.board', message: '板卡型号' })}
          value={board?.id ?? ''}
          options={boards}
          disabled={locked}
          onChange={(id) => {
            setBoard(id);
            setVariant('');
            setImage('');
          }}
        />
        <SelectField
          label={translate({
            id: 'tryruyi.imager.variant',
            message: '硬件版本',
          })}
          value={variant?.id ?? ''}
          options={variants}
          disabled={locked}
          onChange={(id) => {
            setVariant(id);
            setImage('');
          }}
        />
        <SelectField
          label={translate({ id: 'tryruyi.imager.image', message: '系统镜像' })}
          value={image?.id ?? ''}
          options={images}
          disabled={locked}
          onChange={setImage}
        />
      </div>
      {((board && !variants.length) || (variant && !images.length)) && (
        <p role="status">
          {translate({
            id: 'tryruyi.imager.unavailable',
            message: '索引中没有适用于此硬件的镜像。',
          })}
        </p>
      )}
    </>
  );
}

function PackageVersions({
  options: { groups, defaults, inspect },
  editable,
  prepare,
}) {
  const [rows, setRows] = useState(defaults);
  const [result, setResult] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    inspect(rows, signal).then(
      (details) => {
        if (!signal.aborted) setResult({ rows, ...details });
      },
      (error) => {
        if (!signal.aborted) setResult({ rows, issue: error.message });
      },
    );
    return () => controller.abort();
  }, [rows, inspect]);
  const current = result?.rows === rows ? result : null;
  return (
    <>
      <div className={`${styles.fields} ${styles.packages}`}>
        {groups.map((group, index) => (
          <SelectField
            key={group[0].file_path}
            label={group[0].package}
            value={rows[index].version}
            options={group.map(({ version }) => ({
              id: version,
              display_name: version,
            }))}
            disabled={!editable}
            onChange={(version) =>
              setRows((previous) =>
                previous.map((row, position) =>
                  position === index
                    ? group.find((item) => item.version === version)
                    : row,
                ),
              )
            }
          />
        ))}
      </div>
      {editable &&
        (current?.issue ? (
          <p role="status">{current.issue}</p>
        ) : (
          <Button
            size="sm"
            disabled={!current}
            onClick={() => prepare(current.packages)}
          >
            {translate({
              id: 'tryruyi.imager.download',
              message: '下载并准备镜像',
            })}
          </Button>
        ))}
    </>
  );
}

function Prompt({ prompt, settle }) {
  if (!prompt?.title) return null;
  return (
    <>
      <p className={styles.question}>{prompt.title}</p>
      {prompt.kind === 'confirm' && (
        <div className={styles.actions}>
          <Button size="sm" onClick={() => settle(true)}>
            {translate({ id: 'tryruyi.imager.yes', message: '是' })}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => settle(false)}>
            {translate({ id: 'tryruyi.imager.no', message: '否' })}
          </Button>
        </div>
      )}
    </>
  );
}

function Status({ message }) {
  return message ? (
    <p className={styles.status} role="status">
      {message}
    </p>
  ) : null;
}

function FlashStep({ text }) {
  const parts = [];
  let start = 0;
  for (const match of text.matchAll(/\[(yellow|green)\]([\s\S]*?)\[\/\]/g)) {
    parts.push(text.slice(start, match.index));
    parts.push(
      <span key={match.index} className={styles[match[1]]}>
        {match[2]}
      </span>,
    );
    start = match.index + match[0].length;
  }
  parts.push(text.slice(start));
  return parts;
}

export default function ImagerPanel({
  prompt,
  catalog,
  hasImage,
  preparing,
  packageOptions,
  steps,
  panelStatus,
  complete,
  writing,
  restart,
  settle,
  selectSystem,
}) {
  const question = <Prompt prompt={prompt} settle={settle} />;
  return (
    <div className={styles.panels}>
      <section className={styles.panel}>
        <header className={styles.heading}>
          <h2>
            <CircuitBoard size={22} aria-hidden="true" />
            {translate({ id: 'tryruyi.imager.setup', message: '配置开发板' })}
          </h2>
          {hasImage || complete ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={writing && !complete}
              onClick={restart}
            >
              <RotateCcw size={14} aria-hidden="true" />
              {complete && !catalog
                ? translate({ id: 'tryruyi.imager.retry', message: '重试' })
                : translate({
                    id: 'tryruyi.device.restart',
                    message: '重新开始',
                  })}
            </Button>
          ) : null}
        </header>
        {catalog ? (
          <SystemForm {...catalog} locked={preparing} onSelect={selectSystem} />
        ) : (
          !complete && (
            <p role="status">
              {translate({
                id: 'tryruyi.imager.loading',
                message: '正在读取开发板索引…',
              })}
            </p>
          )
        )}
        <Status message={panelStatus.setup} />
        {!hasImage && question}
      </section>
      <section className={styles.panel}>
        <h2>
          {translate({ id: 'tryruyi.imager.prepare', message: '准备镜像' })}
        </h2>
        {!hasImage && (
          <p>
            {translate({
              id: 'tryruyi.imager.prepareHint',
              message: '选择系统镜像后，可在这里查看和准备软件包。',
            })}
          </p>
        )}
        {packageOptions && (
          <PackageVersions
            options={packageOptions}
            editable={prompt?.kind === 'packages'}
            prepare={settle}
          />
        )}
        <Status message={panelStatus.prepare} />
        {hasImage && steps === null && question}
      </section>
      <section className={styles.panel}>
        <h2>
          {translate({ id: 'tryruyi.imager.steps', message: '刷写步骤' })}
        </h2>
        {steps === null ? (
          <p>
            {translate({
              id: 'tryruyi.imager.stepsHint',
              message: '镜像准备完成后，在这里核对刷写步骤和目标开发板。',
            })}
          </p>
        ) : (
          <>
            {steps.length > 0 && (
              <div className={styles.review}>
                <ol>
                  {steps.map((step, index) => (
                    <li key={index}>
                      <FlashStep text={step} />
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <Status message={panelStatus.flash} />
            {question}
          </>
        )}
      </section>
    </div>
  );
}
