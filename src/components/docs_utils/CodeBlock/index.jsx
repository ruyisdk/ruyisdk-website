/**
 * CodeBlock - Main entry file
 * 
 * Modular code block component designed for RuyiSDK website
 * Features Next.js style UI with syntax highlighting, copy, multi-language switching
 * 
 * @module CodeBlock
 * 
 * File structure:
 * ├── index.jsx          # Main entry (current file)
 * ├── CodeBlock.jsx      # Code rendering core
 * ├── Header.jsx         # Header component
 * ├── CopyButton.jsx     # Copy button
 * ├── LangSwitcher.jsx   # Language switcher
 * ├── Icons.jsx          # Icon components
 * └── styles.css         # Styles
 * 
 * Props:
 * @param {string} code - Code content
 * @param {string} lang - Language type, defaults to 'bash'
 * @param {Array} langs - Multi-language options [{lang: 'js', code: '...'}, ...]
 * @param {string} filename - Filename, overrides default title
 * @param {string} title - Custom title, defaults to 'Terminal'
 * @param {boolean} copiable - Whether to show copy button, defaults to true
 * 
 * Usage examples:
 * ```jsx
 * import CodeBlock from '@site/src/components/docs_utils/CodeBlock';
 * 
 * // Basic usage
 * <CodeBlock lang="javascript" code={`console.log('Hello');`} />
 * 
 * // With filename
 * <CodeBlock lang="python" filename="app.py" code={`print('Hello')`} />
 * 
 * // Multi-language switching
 * <CodeBlock 
 *   lang="javascript"
 *   langs={[
 *     { lang: 'javascript', code: 'console.log("Hello");' },
 *     { lang: 'python', code: 'print("Hello")' },
 *     { lang: 'go', code: 'fmt.Println("Hello")' }
 *   ]}
 * />
 * 
 * // Custom title, disable copy
 * <CodeBlock 
 *   lang="bash" 
 *   title="Example command"
 *   copiable={false}
 *   code={`$ echo "example"`} 
 * />
 * ```
 */

import CodeBlock from './CodeBlock';

export default CodeBlock;

export { default as Header } from './Header';
export { default as CopyButton } from './CopyButton';
export { default as LangSwitcher } from './LangSwitcher';
export { CopyIcon, CopiedIcon } from './Icons';
