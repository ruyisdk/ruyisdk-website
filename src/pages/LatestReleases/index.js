import React, { createContext, useContext, useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

const ReleaseContext = createContext(null);

// 提取文件名的函数
export function extractFileName(downloadUrl) {
  if (!downloadUrl) return null;
  
  try {
    // 从URL中提取文件名
    const urlParts = downloadUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    // 移除查询参数（如果有）
    const cleanFileName = fileName.split('?')[0];
    
    return cleanFileName;
  } catch (error) {
    console.error('提取文件名失败:', error);
    return null;
  }
}

// 生成chmod命令的函数
export function generateChmodCommand(downloadUrl) {
  const fileName = extractFileName(downloadUrl);
  if (!fileName) return 'chmod +x ./ruyi';
  
  return `chmod +x ./${fileName}`;
}

// 测试函数（开发环境使用）
export function testFileNameExtraction() {
  const testUrls = [
    'https://github.com/ruyisdk/ruyi/releases/download/v2.0.0/ruyi-v2.0.0-linux-amd64',
    'https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/v2.0.0/ruyi-v2.0.0-linux-aarch64',
    'https://example.com/download/ruyi-v1.5.0-linux-riscv64?token=abc123',
    null,
    ''
  ];
  
  testUrls.forEach((url, index) => {
    const fileName = extractFileName(url);
    const chmodCommand = generateChmodCommand(url);
    console.log(`Test ${index + 1}:`, { url, fileName, chmodCommand });
  });
}

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

function useReleaseData() {
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

// 修改：返回文件名的组件
export function FileName({ arch }) {
  const data = useReleaseData();

  if (!data) {
    return <code>ruyi</code>;
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];
  const fileName = extractFileName(link);

  return <code>{fileName || 'ruyi'}</code>;
}

// 新增：返回完整chmod命令的组件
export function ChmodCommand({ arch }) {
  const data = useReleaseData();

  if (!data) {
    return <CodeBlock language="bash">$ chmod +x ./ruyi</CodeBlock>;
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];
  const fileName = extractFileName(link);

  return <CodeBlock language="bash">{`$ chmod +x ./${fileName || 'ruyi'}`}</CodeBlock>;
}

// 新增：返回完整cp命令的组件
export function CpCommand({ arch }) {
  const data = useReleaseData();

  if (!data) {
    return <CodeBlock language="bash">$ sudo cp -v ruyi /usr/local/bin/ruyi</CodeBlock>;
  }

  const link = data.channels.stable.download_urls[`linux/${arch}`]?.[1];
  const fileName = extractFileName(link);

  return <CodeBlock language="bash">{`$ sudo cp -v ${fileName || 'ruyi'} /usr/local/bin/ruyi`}</CodeBlock>;
}

