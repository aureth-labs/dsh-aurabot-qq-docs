---
layout: home

hero:
  name: AuraBot
  text: 住在 QQ 里的 AI 伙伴
  tagline: DeepSeek Harness 的插件形态——有人格、有心情、有记忆；能聊天、看图、发语音、唱歌、写空间、刷 B 站
  actions:
    - theme: brand
      text: 从装 DSH 开始
      link: /guide/install
    - theme: alt
      text: 她会做什么
      link: /features/
    - theme: alt
      text: 我要写模块
      link: /dev/why-typescript

features:
  - title: 像「人」一样聊天
    details: 群里停顿时她会等一段、看完整段再回；被叫必回，没人叫按话题插话；会引用、会发表情、会发语音，不想接话也可以不接。
  - title: 一切皆模块
    details: 连「回不回、提示词怎么写、回复怎么拆条、用哪个模型」都能用模块改写；面板一键装卸社区模块，升级不覆盖你自己写的。
  - title: 长期记忆
    details: 她记的事、整理出的长期记忆、人物小档案、相处经验和说话方式；按相关度 + 时间 + 遗忘曲线回忆，越常想起越难忘。
  - title: 安全默认
    details: 总开关关、试运行开；群聊和非主人会话没有本机工具；敏感操作要「这一轮说话的人全是主人」才放行。
---

## 按你的目的走

| 我想…… | 去哪 |
| --- | --- |
| 从零把机器人跑起来 | [装 DeepSeek Harness](/guide/install) → [配置模型](/guide/models) → [安装 AuraBot](/guide/install-aurabot) → [接入 QQ](/guide/connect-qq) |
| 已经能聊天了，想加功能 | [功能总览](/features/) |
| 想让她画图 / 说话 / 唱歌 | [画图](/features/image) · [语音](/features/voice) · [翻唱](/features/cover) |
| 想自己写一个模块 | [为什么用 TypeScript](/dev/why-typescript) → [插件结构](/dev/anatomy) → [写第一个插件](/dev/first-plugin) |
| 只想十五分钟试一下 | [十五分钟写一个模块](/dev/module-quickstart) |

## 从零到能说话

第一次装，按这个顺序走。卡住就翻[常见问题](/guide/faq)。

| 第几步 | 页面 | 这一步结束时你会得到 |
| --- | --- | --- |
| 1 | [这是什么](/guide/what-is-this) | 分得清宿主、AuraBot、模块、市场 |
| 2 | [装 DeepSeek Harness](/guide/install) | 浏览器里能打开 DSH 的 Web UI |
| 3 | [配置模型](/guide/models) | 填一个密钥，会话能正常回话 |
| 4 | [安装 AuraBot](/guide/install-aurabot) | 左侧栏出现 Aurabot，向导能走完 |
| 5 | [接入 QQ](/guide/connect-qq) | 机器人号上线，能收发消息 |
| 6 | [认识面板](/guide/configure) | 知道每个开关在哪一页 |
| 7 | [QQ 命令与白名单](/guide/commands) | 能直接在 QQ 里管她 |

## 她能做什么

| 能力 | 一句话 | 页面 |
| --- | --- | --- |
| 私聊 & 群聊 | 每个私聊/群对应一个独立会话，能看她想了什么、调了什么工具 | [人格、心情与群聊](/features/chat) |
| 人格 & 心情 | 人格卡可切换、按节编辑；被夸被凶会推动心情，影响语气与回复快慢 | [人格、心情与群聊](/features/chat) |
| 长期记忆 | 记忆库、人物档案、相处经验、说话方式、空间日记都进上下文 | [记忆](/features/memory) |
| 表情包 | 自动收、AI 起名打标签、按语境挑表情；商城表情原样发 | [表情包](/features/sticker) |
| 语音条 & 唱歌 | edge-tts / 本地 CosyVoice、GPT-SoVITS / 任意 HTTP TTS；翻唱导入 RVC 音色 | [语音](/features/voice) · [翻唱](/features/cover) |
| 画图 | 内置三条路，或直接用 DSH 里已接好的生图模型 | [画图](/features/image) |
| 点歌 | 搜原唱、抽成 mp3，以语音条发回来 | [点歌](/features/music) |
| QQ 空间 | 结合当天聊天写说说，回评论、逛好友动态 | [QQ 空间](/features/qzone) |
| 刷 B 站 | 挑视频看、读字幕热评、写评论、私聊分享；可发弹幕 | [刷 B 站](/features/bilibili) |
| 桌宠（可选） | 住在桌面上：待机动作、碎碎念、干活状态联动，不打扰 QQ | [桌宠](/features/pet) |
| 主动找你 | 主动搭话 / 目的引擎；可设醒着时间、频率、上限 | [主动搭话](/features/speakup) |
| 模块市场 | 面板一键装卸社区模块，配置和登录状态保留 | [装社区模块](/guide/install-plugin) |

## 四个东西别搞混

| 名字 | 是什么 | 在哪 |
| --- | --- | --- |
| DeepSeek Harness | 宿主，负责模型、会话、工作区、Web UI | 你自己装的那个程序 |
| AuraBot | 宿主的一个插件，把 QQ 接进会话，加人格与记忆 | `dsh plugin add github:aureth-labs/dsh-aurabot-qq` |
| 社区模块 | AuraBot 里的功能件，一个模块一件事 | 面板「模块市场」，索引来自 `market.json` |
| 市场 | 只存索引，不存代码 | [市场仓库](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev) |

## 数据在哪

```text
%USERPROFILE%\.dsh\plugins-data\aurabot\
├─ config.json     设置
├─ personas\       人格
├─ modules\        你自己写的模块（升级不覆盖）
├─ local\          本地接口脚本（语音 / 生图 / 翻唱 / 识别）
├─ logs\           日志
└─ ...             记忆、表情、日记
```

换电脑走面板「系统 → 备份」打成 zip，**不要手拷单个文件**。

## 给 AI 用的规范

打算让模型帮你写模块，把
[`llms.txt`](https://aureth-labs.github.io/dsh-aurabot-qq-docs/llms.txt) 丢给它：
里面是目录约定、清单字段、API 速查和从零写模块的步骤。

## 文档本身

- 写错了、缺了：每页右上角「在 GitHub 上编辑此页」
- 提 Issue：[文档仓库](https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues)
- 改格式前先看[文档写作规范](/dev/docs-style)
- 第三方代码与许可：[第三方与致谢](/reference/third-party)