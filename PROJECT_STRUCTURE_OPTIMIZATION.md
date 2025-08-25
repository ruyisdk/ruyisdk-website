# RuyiSDK 项目结构优化方案

## 🎯 优化目标

1. **分离主题组件和业务组件**
2. **建立清晰的组件分类**
3. **遵循 Docusaurus 最佳实践**
4. **提高代码可维护性**

## 📁 优化后的目录结构

```
src/
├── components/                    # 业务组件
│   ├── common/                   # 通用业务组件
│   │   ├── CodeBlock/           # 代码块组件
│   │   ├── StatisticalData/     # 数据统计组件
│   │   └── SlideNews/           # 新闻轮播组件
│   ├── homepage/                 # 首页相关组件
│   │   ├── MainDisplay/         # 主展示组件
│   │   ├── NewsShowcase/        # 新闻展示组件
│   │   ├── RuyiInLive/          # 实时数据组件
│   │   └── WeChatLink/          # 微信链接组件
│   ├── boards/                   # 开发板相关组件
│   │   ├── BoardSelector/       # 开发板选择器
│   │   └── BoardDetailPopup/    # 开发板详情弹窗
│   ├── community/                # 社区相关组件
│   │   ├── QQGroupList/         # QQ群列表
│   │   ├── MeetupCards/         # 聚会卡片
│   │   └── Subscription/        # 订阅组件
│   └── features/                 # 功能组件
│       ├── TerminalShow/        # 终端展示
│       ├── DemoDisplay/         # 演示展示
│       └── Comment/             # 评论组件
├── theme/                        # 主题组件 (Docusaurus 标准)
│   ├── Layout/                  # 布局组件
│   ├── Navbar/                  # 导航栏组件
│   ├── Footer/                  # 页脚组件
│   ├── AnnouncementBar/         # 公告栏组件
│   ├── BlogLayout/              # 博客布局
│   ├── BlogListPage/            # 博客列表页
│   └── Heading/                 # 标题组件
├── pages/                       # 页面组件
│   ├── Home/                    # 首页
│   ├── CallToAction/           # 行动号召页
│   └── LatestReleases/         # 最新发布页
├── css/                         # 样式文件
│   └── custom.scss             # 全局样式
└── utils/                       # 工具函数
    ├── constants.js             # 常量定义
    ├── helpers.js               # 辅助函数
    └── hooks/                   # 自定义 Hooks
        ├── useDashboardClient.js
        └── useLocalization.js
```

## 🔄 迁移步骤

### 第一步：创建新的目录结构

```bash
# 创建新的目录结构
mkdir -p src/components/{common,homepage,boards,community,features}
mkdir -p src/theme/{Layout,Navbar,Footer,AnnouncementBar,BlogLayout,BlogListPage,Heading}
mkdir -p src/utils/hooks
```

### 第二步：移动组件文件

#### 移动业务组件到对应目录：

```bash
# 通用组件
mv src/components/CodeBlock src/components/common/
mv src/components/StatisticalData src/components/common/
mv src/components/SlideNews src/components/common/

# 首页组件
mv src/components/HomepageComponent/* src/components/homepage/
rmdir src/components/HomepageComponent

# 开发板组件
mv src/components/BoardsFinder src/components/boards/

# 社区组件
mv src/components/QQGroupList src/components/community/
mv src/components/MeetupCards src/components/community/
mv src/components/Subscription src/components/community/

# 功能组件
mv src/components/TerminalShow src/components/features/
mv src/components/DemoDisplay src/components/features/
mv src/components/Comment src/components/features/
```

#### 移动主题组件：

```bash
# 主题组件保持原位，但需要清理
# src/theme/ 目录下的组件是 Docusaurus 标准的主题组件
# 这些组件应该保持在这里
```

### 第三步：更新导入路径

需要更新所有文件中的导入路径，例如：

```javascript
// 更新前
import MainDisplay from "../../components/HomepageComponent/MainDisplay";

// 更新后
import MainDisplay from "../../components/homepage/MainDisplay";
```

### 第四步：创建索引文件

为每个组件目录创建 `index.js` 文件，方便导入：

```javascript
// src/components/common/index.js
export { default as CodeBlock } from './CodeBlock';
export { default as StatisticalData } from './StatisticalData';
export { default as SlideNews } from './SlideNews';

// src/components/homepage/index.js
export { default as MainDisplay } from './MainDisplay';
export { default as NewsShowcase } from './NewsShowcase';
export { default as RuyiInLive } from './RuyiInLive';
export { default as WeChatLink } from './WeChatLink';
```

## 🎨 主题组件说明

### Docusaurus 主题组件标准

`src/theme/` 目录下的组件是 Docusaurus 的标准主题组件：

- **Layout**: 页面布局组件
- **Navbar**: 导航栏组件  
- **Footer**: 页脚组件
- **AnnouncementBar**: 公告栏组件
- **BlogLayout**: 博客布局组件
- **BlogListPage**: 博客列表页组件
- **Heading**: 标题组件

这些组件通过 `@theme/` 别名进行导入，例如：
```javascript
import Layout from '@theme/Layout';
import Footer from '@theme/Footer';
```

## 📝 最佳实践

### 1. 组件命名规范
- 使用 PascalCase 命名组件
- 组件文件名与组件名保持一致
- 目录名使用 kebab-case

### 2. 导入路径规范
- 业务组件使用相对路径导入
- 主题组件使用 `@theme/` 别名导入
- 工具函数使用 `@site/src/utils/` 导入

### 3. 文件组织
- 每个组件一个目录
- 包含 `index.js`、`styles.module.css` 等文件
- 复杂组件可以包含子组件

### 4. 类型定义
- 为 TypeScript 项目添加类型定义
- 使用 PropTypes 或 TypeScript 接口

## 🔧 自动化脚本

创建迁移脚本 `scripts/restructure.js`：

```javascript
const fs = require('fs');
const path = require('path');

// 迁移脚本内容
const migrations = [
  {
    from: 'src/components/HomepageComponent',
    to: 'src/components/homepage'
  },
  // ... 其他迁移规则
];

// 执行迁移
migrations.forEach(migration => {
  if (fs.existsSync(migration.from)) {
    fs.renameSync(migration.from, migration.to);
    console.log(`Moved ${migration.from} to ${migration.to}`);
  }
});
```

## ✅ 验证清单

- [ ] 创建新的目录结构
- [ ] 移动所有组件到正确位置
- [ ] 更新所有导入路径
- [ ] 创建组件索引文件
- [ ] 测试所有页面功能正常
- [ ] 验证主题组件正常工作
- [ ] 更新文档说明

## 🚀 后续优化

1. **添加 TypeScript 支持**
2. **实现组件文档**
3. **添加单元测试**
4. **优化构建配置**
5. **添加代码规范检查** 