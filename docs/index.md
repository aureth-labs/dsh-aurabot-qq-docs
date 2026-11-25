---
layout: home

hero:
  name: AuraBot
  text: 让 QQ 里的她，有自己的脑子
  tagline: DeepSeek Harness 的插件形态——接一个机器人号，她就能聊天、画图、唱歌、记住你
  actions:
    - theme: brand
      text: 从装 DSH 开始
      link: /guide/install
    - theme: alt
      text: 我想接画图和语音
      link: /features/
    - theme: alt
      text: 我要写插件
      link: /dev/why-typescript

features:
  - title: 她不是客服，是有性格的一个号
    details: 人格卡、心情、人物记忆、主动搭话都在面板里调，不是一串 if-else 拼出来的回复。
  - title: 能画、能唱、能说话
    details: 画图接 DSH 已装好的生图模型；语音走 TTS 念出来；翻唱用 RVC 把嗓子换成你导入的音色。
  - title: 装在 DSH 里，不是套壳
    details: AuraBot 是 DeepSeek Harness 的插件，跟 DSH 共用模型、工作区与 Web UI，不另起一个程序。
  - title: 社区模块随装随卸
    details: 面板「模块市场」一键装，作者用自己的仓库发版，市场只维护索引。写模块就是写 TypeScript。
---

## 按你的目的走

三条路，挑一条进，不用从头读到尾。

| 我想…… | 去哪 |
| --- | --- |
| 从零把机器人跑起来 | [装 DeepSeek Harness](/guide/install) → [配置模型](/guide/models) → [安装 AuraBot](/guide/install-aurabot) → [接入 QQ](/guide/connect-qq) |
| 已经能聊天了，想加功能 | [功能总览](/features/) → 画图 / 语音 / TTS / 翻唱 / 点歌 |
| 想自己写一个插件 | [为什么用 TypeScript](/dev/why-typescript) → [插件结构](/dev/anatomy) → [写第一个插件](/dev/first-plugin) |

## 从零到能说话

第一次装，按这个顺序走一遍。中途卡住就翻[常见问题](/guide/faq)。

| 第几步 | 页面 | 这一步结束时你会得到 |
| --- | --- | --- |
| 1 | [这是什么](/guide/what-is-this) | 分得清宿主、AuraBot、模块、市场 |
| 2 | [装 DeepSeek Harness](/guide/install) | 浏览器里能打开 DSH 的 Web UI |
| 3 | [配置模型](/guide/models) | 填一个密钥，会话能正常回话 |
| 4 | [安装 AuraBot](/guide/install-aurabot) | 左侧栏出现 Aurabot 入口 |
| 5 | [接入 QQ](/guide/connect-qq) | 机器人号在群里上线，能收发消息 |
| 6 | [认识面板](/guide/configure) | 知道每个开关在哪一页，先试运行再开总开关 |
| 7 | [装社区模块](/guide/install-plugin) | 会从模块市场装卸东西 |

## 功能一览

每一项都要先有第 1 到第 6 步。功能页只讲「怎么配」和「配错了会怎样」。

| 功能 | 什么时候用 | 需要额外准备 |
| --- | --- | --- |
| [画图](/features/image) | 想让她发一张图，而不是一段描述 | 一个能生图的模型（DSH 里已接入，或用内置三条路） |
| [语音](/features/voice) | 想听到她说话，而不是只看文字 | `edge-tts`；第三方 TTS 另需密钥 |
| [TTS：换一个嗓子](/features/tts) | 内置音色不好听，想换成豆包 / 千问 | 对应平台的密钥与音色 ID |
| [翻唱](/features/cover) | 让她用某个音色唱歌 | Windows + RVC 环境 + 音色模型 |
| [点歌](/features/music) | 想让她直接甩一条歌过来 | 网易云 / 哔哩的搜索通道，社区模块可选 |

## 三个东西别搞混

| 名字 | 是什么 | 在哪 |
| --- | --- | --- |
| DeepSeek Harness | 宿主，负责模型、会话、工作区、Web UI | 你自己装的那个程序 |
| AuraBot | 宿主的一个插件，把 QQ 接进会话，加人格与记忆 | `dsh plugin add github:aureth-labs/dsh-aurabot-qq` |
| 社区模块 | AuraBot 里的功能件，一个模块一件事 | 面板「模块市场」，索引来自 `market.json` |

## 给 AI 用的规范

打算让模型帮你写插件，把
[`llms.txt`](https://aureth-labs.github.io/dsh-aurabot-qq-docs/llms.txt) 丢给它：
里面是目录约定、`package.json` 字段、API 速查表和从零写插件的步骤。

## 文档本身

- 写错了、缺了：直接点每页右上角「在 GitHub 上编辑此页」
- 想提 Issue：[文档仓库](https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues)
- 想改格式：先看[文档写作规范](/dev/docs-style)
