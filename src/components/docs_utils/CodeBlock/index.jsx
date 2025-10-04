/**
 * CodeBlock - 主入口文件
 * 
 * 模块化的代码块组件，专为 RuyiSDK 网站设计
 * 采用 Next.js 风格的 UI，支持语法高亮、复制等功能
 * 
 * @module CodeBlock
 * 
 * 文件结构：
 * ├── index.jsx          # 主入口（当前文件）
 * ├── CodeBlock.jsx      # 代码渲染核心
 * ├── Header.jsx         # 顶部标题栏
 * ├── CopyButton.jsx     # 复制按钮
 * ├── Icons.jsx          # 图标组件
 * └── styles.css         # 样式文件
 * 
 * 使用示例：
 * ```jsx
 * import CodeBlock from '@site/src/components/docs_utils/CodeBlock';
 * 
 * <CodeBlock lang="javascript" code={`console.log('Hello');`} />
 * <CodeBlock lang="python" filename="app.py" code={`print('Hello')`} />
 * ```
 */

import CodeBlock from './CodeBlock';

// 导出主组件
export default CodeBlock;

// 导出子组件（供高级用法）
export { default as Header } from './Header';
export { default as CopyButton } from './CopyButton';
export { CopyIcon, CopiedIcon } from './Icons';
