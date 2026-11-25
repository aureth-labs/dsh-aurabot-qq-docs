# 开始编写文档

本站使用 VitePress。文档是 `docs/` 目录下的 Markdown 文件，主题和导航配置位于 `docs/.vitepress/`。

## 本地环境

安装 Node.js 22 或更高版本，然后启用 pnpm：

```bash
corepack enable
pnpm install
```

启动预览：

```bash
pnpm docs:dev
```

终端会显示本地地址。修改 Markdown、Vue 组件或样式后，页面会自动更新。

提交前执行完整构建：

```bash
pnpm docs:build
```

构建失败时先修正报错，不要直接提交。

## 文件位置

| 内容 | 目录 |
| --- | --- |
| 安装与使用 | `docs/guide/` |
| 功能说明 | `docs/features/` |
| 主仓库本体、社区插件与文档开发 | `docs/dev/` |
| 接口与设计资料 | `docs/reference/` |
| 导航和侧栏 | `docs/.vitepress/config.mts` |
| 主题组件 | `docs/.vitepress/theme/components/` |
| 公共静态文件 | `docs/public/` |

新增页面后，还要在 `config.mts` 中加入对应侧栏。没有加入侧栏的页面仍可访问，但读者很难从目录中找到它。

`docs/dev/` 在侧栏中分为三组：

| 分组 | 内容 |
| --- | --- |
| 主仓库本体开发 | DSH 工作区、AuraBot 主仓库加载、HMR 和框架迁移 |
| 插件开发 | 社区模块的源码结构、接口、构建和市场发布 |
| 文档开发 | 文档站维护、写作规范、术语和贡献流程 |

不要把主仓库的 HMR 配置写进社区插件教程。前者由 DSH 加载器处理，后者由 AuraBot 扫描构建产物，两套重载机制不同。

## 修改顺序

1. 先读[写作规范](/dev/docs-style)和[术语表](/dev/glossary)。
2. 修改正文；涉及界面名称、命令或字段时，以当前代码为准。
3. 检查站内链接、代码块语言和命令格式。
4. 运行 `pnpm docs:build`。
5. 按[贡献指南](/dev/contributing)提交修改。

写作规范规定表达形式，术语表规定名称。修改术语表会同时影响全站，提交时应说明原因。
