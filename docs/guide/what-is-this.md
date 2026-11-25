# 这是什么

一句话：**AuraBot 是 DeepSeek Harness 的一个插件**，把 QQ 接进 DSH 的会话里，再给她加人格、记忆、语音、画图这些能力。

所以它不是一个独立程序，你不需要单独运行一个「AuraBot.exe」。装好 DSH，再把 AuraBot 装进去。

## 四层，从下往上

| 层 | 名字 | 干什么 | 谁维护 |
| --- | --- | --- | --- |
| 1 | DeepSeek Harness（宿主） | 管模型、会话、工作区、Web UI、插件加载 | DeepSeek 官方 |
| 2 | AuraBot（插件） | 接 QQ，管人格、记忆、权限、语音、画图、翻唱 | 我们这个仓库 |
| 3 | 模块（module） | AuraBot 里的功能件：点歌、生图、TTS、桌宠…… | 社区作者各自维护 |
| 4 | 市场（market） | 只存索引 `market.json`，不存代码 | 我们 |

记住一句就不容易绕晕：**模块住在 AuraBot 里，AuraBot 住在 DSH 里**。

## 一条消息怎么走

```text
QQ 群里有人说话
   └─ 网关（SnowLuma / NapCat / LLOneBot）→ OneBot v11
        └─ AuraBot：判断要不要回、查权限、拼人格与记忆
             └─ DSH：调模型
                  └─ 模型决定：直接回 / 调工具（画图、点歌、搜网页）
                       └─ AuraBot：把结果发回 QQ（文字 / 图片 / 语音条）
```

上游是网关的事，下游是模型的事，中间那一层才是 AuraBot 在干的活。

## 市场为什么不存代码

作者在自己的 GitHub 仓库里写模块，CI 构建、发 Release；市场只维护一份索引：

```text
作者仓库 push
   └─ Actions：npm ci → build → 打 zip → 发 Release
        └─ 回写 package.json.aurabot.artifact{url,sha256,size}（bot commit，[skip ci]）

市场仓库
   registry.jsonl（一行一个 package.json 的 GitHub 链接）
   └─ 构建：拉取 → 校验 → market.json + report.md
        └─ 发布到 market 分支

宿主
   market.json → 选版本 → 下载 zip → 校验 sha256 → 解压 → 加载 main
```

好处很直接：作者改代码不用等谁审批，你装的时候还能核对 `sha256`。

## 收录规则（作者关心）

- 作者只写包名（如 `playmusic`），id 由市场用仓库 owner 拼成 `owner/name`
- 同一 owner 下重名，后来的自动加 `-2`、`-3`
- 只允许 ESM（`"type": "module"`），CJS 直接拒绝
- 自动收录一律 `verified: false`，是否审核看 `verified.json`
- 撤回某个版本：自己删 Release、改版本号，下次全量重建就看不到了

## 你要准备什么

| 东西 | 用来干什么 | 必需吗 |
| --- | --- | --- |
| 一台电脑 | Windows 最省事（网关和翻唱支持最好） | 必需 |
| 一个 QQ 小号 | 给机器人用，别拿主号试 | 必需 |
| 一个大模型 API 密钥 | 她的大脑 | 必需 |
| 一个网关 | 让机器人号上线 | 必需 |
| `ffmpeg` | 点歌、部分语音处理 | 用到才要 |
| Python | `edge-tts`、RVC 翻唱 | 用到才要 |

## 下一步

按顺序走：

1. [装 DeepSeek Harness](/guide/install)
2. [配置模型](/guide/models)
3. [安装 AuraBot](/guide/install-aurabot)
4. [接入 QQ](/guide/connect-qq)
5. [认识面板](/guide/configure)

想直接看能干什么：[功能总览](/features/)。
想自己写模块：[写第一个插件](/dev/first-plugin)。
想看设计取舍：[架构与决策](/reference/architecture)、[主框架改造清单](/reference/host-changes)。