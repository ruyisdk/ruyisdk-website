import React, { createContext, useContext, useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

const ReleaseContext = createContext(null);

export default function ReleaseProvider({ children }) {
  const [releaseData, setReleaseData] = useState(null);

  useEffect(() => {
    fetch('https://api.ruyisdk.cn/releases/latest-pm')
      .then(res => res.json())
      .then(data => setReleaseData(data))
      .catch(err => console.error('API releases/latest-pm 获取版本信息失败', err));
  }, []);

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
    return <CodeBlock language="bash">$ wget </CodeBlock>;
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];

  return <CodeBlock language="bash">{`$ wget ${link}`}</CodeBlock>;
}

