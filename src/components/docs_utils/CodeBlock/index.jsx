/**
 * CodeBlock - 主入口文件
 * 
 * 模块化的代码块组件，专为 RuyiSDK 网站设计
 * 采用 Next.js 风格的 UI，支持语法高亮、复制、多语言切换等功能
 * 
 * @module CodeBlock
 * 
 * 文件结构：
 * ├── index.jsx          # 主入口（当前文件）
 * ├── CodeBlock.jsx      # 代码渲染核心
 * ├── Header.jsx         # 顶部标题栏
 * ├── CopyButton.jsx     # 复制按钮
 * ├── LangSwitcher.jsx   # 语言切换器
 * ├── Icons.jsx          # 图标组件
 * └── styles.css         # 样式文件
 * 
 * Props:
 * @param {string} code - 代码内容
 * @param {string} lang - 语言类型，默认 'bash'
 * @param {Array} langs - 多语言版本选项 [{lang: 'js', code: '...'}, ...]
 * @param {string} filename - 文件名，会覆盖默认标题
 * @param {string} title - 自定义标题，默认 'Terminal'
 * @param {boolean} copiable - 是否显示复制按钮，默认 true
 * 
 * 使用示例：
 * ```jsx
 * import CodeBlock from '@site/src/components/docs_utils/CodeBlock';
 * 
 * // 基础使用
 * <CodeBlock lang="javascript" code={`console.log('Hello');`} />
 * 
 * // 带文件名
 * <CodeBlock lang="python" filename="app.py" code={`print('Hello')`} />
 * 
 * // 多语言切换
 * <CodeBlock 
 *   lang="javascript"
 *   langs={[
 *     { lang: 'javascript', code: 'console.log("Hello");' },
 *     { lang: 'python', code: 'print("Hello")' },
 *     { lang: 'go', code: 'fmt.Println("Hello")' }
 *   ]}
 * />
 * 
 * // 自定义标题，禁用复制
 * <CodeBlock 
 *   lang="bash" 
 *   title="示例命令"
 *   copiable={false}
 *   code={`$ echo "example"`} 
 * />
 * ```
 */

import CodeBlock from './CodeBlock';

// 导出主组件
export default CodeBlock;

// 导出子组件（供高级用法）
export { default as Header } from './Header';
export { default as CopyButton } from './CopyButton';
export { default as LangSwitcher } from './LangSwitcher';
export { CopyIcon, CopiedIcon } from './Icons';
