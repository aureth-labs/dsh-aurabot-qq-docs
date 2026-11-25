# 贡献指南

这套东西有四个仓库，改哪个、走什么流程，先分清楚。

## 四个仓库分别收什么

| 仓库 | 收什么 | 怎么提 |
| --- | --- | --- |
| [文档仓库](https://github.com/aureth-labs/dsh-aurabot-qq-docs) | 文档站源码 | 改 `main` 提 PR |
| [市场仓库](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev) | 收录表、构建器 | 改 `main` 提 PR |
| [模板仓库](https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template) | 插件模板、Actions、发版脚本 | fork 或用「Use this template」开自己的仓库 |
| [示例插件仓库](https://github.com/shangxueink/dsh-aurabot-qq-market-dev-plugins) | 两个能跑的完整示例 | 参考，不用改 |

**想让自己的插件进市场**：不用往市场仓库塞代码，只在 `registry.jsonl` 加一行链接，提 PR。

## 提 PR 前

```bash
npm install
npm run check
npm test
```

三条都过再提。CI 会重跑一遍，过不了不会合并。

## 文档怎么改

文档源码在文档仓库 `main` 分支的 `docs/` 目录：

```text
docs/                          ← 文档源码（本页就在这）
package.json                   ← VitePress 依赖
.github/workflows/build.yml    ← 构建校验
```

1. 改对应 `.md`，写作要求见[文档写作规范](/dev/docs-style)
2. 本地预览：`npm run docs:dev`
3. 本地构建：`npm run docs:build`（CI 跑的就是这条）
4. 提 PR 到 `main` 分支

合并后 `main` 上的 Pages 工作流会自动构建并发布到
[文档站](https://aureth-labs.github.io/dsh-aurabot-qq-docs/)。

::: tip 页面右上角的编辑按钮
每页都有「在 GitHub 上编辑此页」，点进去就是对应的 Markdown 文件，改完直接提 PR。
:::

## 收录一个新插件

在 `registry.jsonl` 末尾加一行，保持一行一个链接，不要加逗号：

```text
https://github.com/<owner>/<repo>/blob/main/modules/my-plugin/package.json
```

- 链接保持 `blob` 形式，**不用**改成 `raw.githubusercontent.com`
- `#` 开头是注释行，可以写说明
- 提交后等 CI，构建报告在 `market` 分支的 `report.md`

## 报告问题

去 [市场仓库 Issues](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/issues) 提，
带上：哪一步、期望什么、实际什么、日志或截图。

插件本身的问题找作者仓库 —— 市场只存索引，不托管代码。

## 代码风格

- TypeScript，`strict` 打开
- 不写没必要的注释，命名说清意图
- 提交信息用 `feat:` / `fix:` / `docs:` / `ci:` 前缀，一句话说清改了什么
