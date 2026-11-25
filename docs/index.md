---
layout: home

hero:
  name: AuraBot 插件市场
  text: 索引、构建约定与作者接入
  tagline: 插件住在作者自己的仓库里，市场只负责收录与校验
  actions:
    - theme: brand
      text: 从装 DSH 开始
      link: /guide/install
    - theme: alt
      text: 我直接写插件
      link: /guide/first-plugin
    - theme: alt
      text: market.json 镜像
      link: https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json

features:
  - title: 代码不托管在这里
    details: 作者用自己的 GitHub 仓库写插件、跑 Actions、发 Release。市场不存放源码，也不需要你往官方仓库提 PR 改代码。
  - title: 一行链接就是收录
    details: 在 registry.jsonl 里加一行 package.json 的 GitHub 链接，下次构建就出现在 market.json 里。
  - title: 前后端都是 TypeScript
    details: 后台 src/ 编译到 lib/，面板 client/ 编译到 dist/；一个仓库、一种语言、一次构建。
  - title: 类型对得上就基本不会错
    details: 推荐 TypeScript，但不是硬性要求——直接写 JavaScript 也能用同一套流程发布。
---

## 从这里开始

第一次来，按这个顺序走一遍就能跑起来：

| 步骤 | 页面 | 你会得到 |
| --- | --- | --- |
| 1 | [这是什么](/guide/what-is-this) | 搞清楚插件、模块、市场三者的关系 |
| 2 | [装 DeepSeek Harness](/guide/install) | 宿主的 Web UI 能打开 |
| 3 | [配置模型](/guide/models) | 填一个 API 密钥，会话能说话 |
| 4 | [接入 QQ](/guide/connect-qq) | 机器人号上线，能收发消息 |
| 5 | [安装插件](/guide/install-plugin) | AuraBot 出现在侧栏 |
| 6 | [配置 AuraBot](/guide/configure) | 人格、权限、试运行都调好 |
| 7 | [写第一个插件](/guide/first-plugin) | 自己的插件跑进面板 |

只想写插件的话，从第 7 步开始，前六步跳到 [插件结构](/dev/anatomy) 补概念。

## 三个仓库的关系

| 仓库 | 干什么 |
| --- | --- |
| 作者仓库（你自己的） | 写插件、跑 Actions、发 Release，把 zip 地址回写进 `package.json` |
| [模板仓库](https://github.com/shangxueink/dsh-aurabot-qq-plugins-template) | 点 **Use this template** 直接开写，自带 Actions 和两个示例 |
| 市场仓库（本仓库） | 维护 `registry.jsonl`，拉取校验，生成 `market.json` 并发布到 `market` 分支 |

## 插件市场镜像源

宿主读的索引就是这里（自动构建，每天重建一次）：

```
https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json
```

同分支下还有一份人看的构建报告 `report.md`，记录这次收录了哪些、跳过了哪些、为什么跳过。

## 开发要看的几页

| 页面 | 什么时候看 |
| --- | --- |
| [为什么用 TypeScript](/dev/why-typescript) | 犹豫选 TS 还是 JS |
| [插件结构](/dev/anatomy) | 不知道文件该放哪、字段该怎么填 |
| [构建与发布](/dev/build-release) | 准备发第一个版本 |
| [面板：client → dist](/dev/panel) | 要给自己插件做一页 UI |
| [文档写作规范](/dev/docs-style) | 想改这些文档 |
| [贡献指南](/dev/contributing) | 想收录插件、提 PR |

## 给 AI 用的规范

如果你打算让模型帮你写插件，把
[`llms.txt`](https://aureth-labs.github.io/dsh-aurabot-qq-market-dev/llms.txt) 丢给它，
里面有完整的目录约定、`package.json` 字段、API 速查表和从零写插件的八个步骤。
