import React, { createContext, useContext } from 'react';
import CodeBlock from '@site/src/components/Docs/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDataWithApiFallback from '@site/src/utils/hooks/useDataWithApiFallback';
import latestPm from '@site/static/data/api/api_ruyisdk_cn/releases_latest_pm.json';

const ReleaseContext = createContext(null);
const PM_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-pm';


export function extractFileName(downloadUrl) {
  if (!downloadUrl) return null;
  
  try {
    const urlParts = downloadUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const cleanFileName = fileName.split('?')[0];
    
    return cleanFileName;
  } catch (error) {
    console.error('提取文件名失败:', error);
    return null;
  }
}

export function generateChmodCommand(downloadUrl) {
  const fileName = extractFileName(downloadUrl);
  if (!fileName) return 'chmod +x ./ruyi';
  
  return `chmod +x ./${fileName}`;
}

export default function ReleaseProvider({ children }) {
  const { data: releaseData } = useDataWithApiFallback(latestPm, PM_RELEASE_LATEST_API);

  return (
    <ReleaseContext.Provider value={releaseData}>
      {children}
    </ReleaseContext.Provider>
  );
}

export function useReleaseData() {
  return useContext(ReleaseContext);
}

export function DownloadRuyi({ arch }) {
  const data = useReleaseData();

  if (!data) {
    return (
      <BrowserOnly fallback={<pre><code>$ wget </code></pre>}>
        {() => <CodeBlock lang="bash" hasInput input="1" code={`$ wget`} />}
      </BrowserOnly>
    );
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];

  return (
    <BrowserOnly fallback={<pre><code>{`$ wget ${link || ''}`}</code></pre>}>
      {() => <CodeBlock lang="bash" hasInput input="1" code={`$ wget ${link}`} />}
    </BrowserOnly>
  );
}

export function FileName({ arch }) {
  const data = useReleaseData();

  if (!data) {
    return <code>ruyi</code>;
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];
  const fileName = extractFileName(link);

  return <code>{fileName || 'ruyi'}</code>;
}

export function ChmodCommand({ arch }) {
  const data = useReleaseData();

  if (!data) {
    return <CodeBlock lang="bash" hasInput input="1" code={`$ chmod +x ./ruyi`} />;
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];
  const fileName = extractFileName(link);

  return <CodeBlock lang="bash" hasInput input="1" code={`$ chmod +x ./${fileName || 'ruyi'}`} />;
}

export function CpCommand({ arch }) {
  const data = useReleaseData();

  if (!data) {
    return <CodeBlock lang="bash" hasInput input="1" code={`$ sudo cp -v ./ruyi /usr/local/bin/ruyi`} />;
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];
  const fileName = extractFileName(link);

  return <CodeBlock lang="bash" hasInput input="1" code={`$ sudo cp -v ./${fileName || 'ruyi'} /usr/local/bin/ruyi`} />;
}
