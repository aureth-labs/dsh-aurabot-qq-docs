# 贡献指南

根据修改内容选择仓库。文档、框架、社区模块和市场索引分别维护。

## 仓库分工

| 仓库 | 内容 | 修改方式 |
| --- | --- | --- |
| [框架 V1](https://github.com/aureth-labs/dsh-aurabot-qq) | 当前框架、内置模块和面板 | 向默认分支提交 PR |
| [框架 V2](https://github.com/aureth-labs/dsh-aurabot-qq-v2) | V2 重写与插件接口 | 按仓库当前分支约定提交 |
| [社区模块](https://github.com/aureth-labs/dsh-aurabot-qq-mods) | 社区模块源码 | 一个 PR 聚焦一个模块 |
| [插件模板](https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template) | 开发、构建和发布模板 | 修改模板或基于模板创建仓库 |
| [市场仓库](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev) | 收录清单和索引构建器 | 修改 `registry.jsonl` 或构建逻辑 |
| [文档仓库](https://github.com/aureth-labs/dsh-aurabot-qq-docs) | 本站源码 | 修改文档并提交 PR |

## 插件修改

我们的插件、框架和文档仓库统一使用 pnpm，并通过 `package.json` 的 `packageManager` 固定版本。安装依赖时执行：

```bash
pnpm install --frozen-lockfile
```

提交前检查：

- 版本号和入口一致；
- 能力声明与实际行为一致；
- 构建产物不直接提交到源码目录；
- 外部服务和权限要求已写入 README。

## 文档修改

先阅读[开始编写文档](/dev/documentation)、[写作规范](/dev/docs-style)和[术语表](/dev/glossary)。

```bash
pnpm install
pnpm docs:build
```

本地预览使用：

```bash
pnpm docs:dev
```

新增页面时同步修改 `docs/.vitepress/config.mts`。修改术语时，应同时检查其他页面，避免同一概念出现多种名称。

## 收录插件

在市场仓库的 `registry.jsonl` 中添加一行 GitHub `blob` 地址：

```text
https://github.com/<owner>/<repo>/blob/main/modules/my-plugin/package.json
```

不要添加 JSON 逗号，也不要改成其他下载域名。构建结果和失败原因见 `market` 分支中的索引与报告。

## 问题反馈

问题单应包含版本、操作步骤、期望结果、实际结果和相关日志。凭据、Cookie 和访问令牌必须脱敏。

文档问题使用[文档 Issue 模板](https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues/new/choose)。代码问题提交到对应实现仓库。
