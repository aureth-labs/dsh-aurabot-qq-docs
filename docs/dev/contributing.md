# 贡献指南

这套东西有五个仓库，改哪个、走什么流程，先分清楚。

## 五个仓库分别收什么

| 仓库 | 收什么 | 怎么提 |
| --- | --- | --- |
| [主仓库](https://github.com/aureth-labs/dsh-aurabot-qq) | AuraBot 宿主本体（QQ 网关、聊天中枢、内置模块、面板） | 改 `main` 提 PR |
| [社区模块仓库](https://github.com/aureth-labs/dsh-aurabot-qq-mods) | 社区模块的源码（一模块一作者维护） | 改 `main` 提 PR，一 PR 一个模块 |
| [文档仓库](https://github.com/aureth-labs/dsh-aurabot-qq-docs) | 文档站源码（就是你在看的这个） | 改 `main` 提 PR |
| [市场仓库](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev) | `registry.jsonl` 收录表、构建器 | 改 `main` 提 PR |
| [模板仓库](https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template) | 模块模板、Actions、发版脚本 | 用「Use this template」开自己的仓库，不用改这个 |

**想让自己的模块进市场**：不用往市场仓库塞代码，只在 `registry.jsonl` 加一行链接，提 PR。
模块的代码放在**你自己的仓库**里，或者提给社区模块仓库。

## 提模块 PR 前

在社区模块仓库或你自己的仓库里跑（文档仓库只跑最后一条）：

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
pnpm-lock.yaml                 ← 依赖锁（用 pnpm，跟 DSH 保持一致）
pnpm-workspace.yaml            ← pnpm 设置（放行 esbuild 的构建脚本）
.github/workflows/build.yml    ← 构建校验
```

1. 改对应 `.md`，写作要求见[文档写作规范](/dev/docs-style)
2. 本地预览：`pnpm docs:dev`
3. 本地构建：`pnpm docs:build`（CI 跑的就是这条）
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
