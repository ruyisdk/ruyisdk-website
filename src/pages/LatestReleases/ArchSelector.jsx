import React, { useMemo, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { DownloadRuyi, useReleaseData } from '@site/src/pages/LatestReleases';
import styles from './ArchSelector.module.css';

function detectArchDefault() {
  if (typeof navigator === 'undefined') return 'x86_64';
  const ua = (navigator.userAgent || '').toLowerCase();
  const uaArch = (navigator.userAgentData && navigator.userAgentData.architecture) || '';

  if (/riscv64|risc-v|riscv/.test(ua) || /riscv64/.test(uaArch)) return 'riscv64';
  if (/aarch64|arm64/.test(ua) || /arm64/.test(uaArch)) return 'aarch64';
  return 'x86_64';
}

export default function ArchSelector() {
  const data = useReleaseData();
  const [arch, setArch] = useState(detectArchDefault());

  const link = useMemo(() => {
    if (!data) return '';
    return data.channels.stable.download_urls[`linux/${arch}`]?.[1] || '';
  }, [data, arch]);

  const filename = useMemo(() => {
    try {
      if (!link) return '';
      const url = new URL(link);
      const last = url.pathname.split('/').filter(Boolean).pop();
      return last || '';
    } catch (e) {
      return link.split('/').pop() || '';
    }
  }, [link]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.label}>选择架构：</span>
        <select className={styles.select} value={arch} onChange={(e) => setArch(e.target.value)}>
          <option value="x86_64">x86_64</option>
          <option value="aarch64">aarch64</option>
          <option value="riscv64">riscv64</option>
        </select>
      </div>

      <DownloadRuyi arch={arch} />

      <div className={styles.commands}>
        <div className={styles.hint}>下载完成后，请根据上方链接中的实际文件名执行以下命令（命令会随架构自动更新）：</div>
        <BrowserOnly fallback={
          filename ? (
            <>
              <pre><code>{`$ chmod +x ./${filename}`}</code></pre>
              <pre><code>{`$ sudo cp -v ${filename} /usr/local/bin/ruyi`}</code></pre>
            </>
          ) : (
            <>
              <pre><code>$ chmod +x ./ruyi</code></pre>
              <pre><code>$ sudo cp -v ruyi /usr/local/bin/ruyi</code></pre>
            </>
          )
        }>
          {() => (
            filename ? (
              <>
                <CodeBlock language="bash">{`$ chmod +x ./${filename}`}</CodeBlock>
                <CodeBlock language="bash">{`$ sudo cp -v ${filename} /usr/local/bin/ruyi`}</CodeBlock>
              </>
            ) : (
              <>
                <CodeBlock language="bash">$ chmod +x ./ruyi</CodeBlock>
                <CodeBlock language="bash">$ sudo cp -v ruyi /usr/local/bin/ruyi</CodeBlock>
              </>
            )
          )}
        </BrowserOnly>
      </div>
    </div>
  );
} 