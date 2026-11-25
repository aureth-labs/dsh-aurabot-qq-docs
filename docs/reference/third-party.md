# 第三方与致谢

AuraBot 本体是 MIT（见仓库 `LICENSE`）。有少量代码从别的开源项目移植或借鉴，按各自许可在这里逐文件署名并附许可原文。

## 桌宠

桌宠模块和素材**都不在主仓库**，署名和许可见
[dsh-aurabot-qq-mods](https://github.com/aureth-labs/dsh-aurabot-qq-mods) 的
`modules/pet/THIRD-PARTY-NOTICES.md` 与仓库 README。

## 目的引擎：Mieksido/surfcore（MIT）

| 项 | 内容 |
| --- | --- |
| 项目 | [Mieksido/surfcore](https://github.com/Mieksido/surfcore) |
| 许可 | MIT |
| 移植范围 | `src/purpose/engine.js` 的纯逻辑核心：配置归一化、排程、素材摘要、目标假设、候选选择、提示词构建、回执解析、状态迁移 |
| 来源文件 | 该项目的 `src/purpose-engine.js` |

接线层 `src/purpose/module.js` 与模块壳 `src/modules/purpose/index.js` 是为 AuraBot 新写的，**不属于移植范围**。逻辑按 AuraBot 的模块与配置语境做了改写。

```text
MIT License

Copyright (c) 2026 Derpyu520 and qq-bridge / QSH contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## B 站弹幕参数：catbus（MIT）

| 项 | 内容 |
| --- | --- |
| 项目 | catbus（作者 cv-cat） |
| 许可 | MIT |
| 借鉴范围 | `src/platforms/bilibili/web/api.ts`、`sign.ts` 里的弹幕表单与 WBI `dm_img_*` 初始参数 |

按这些参数整理成了本项目自己的原生接口。**没有运行时 catbus 依赖**，不读取也不修改 catbus 的源码和账号文件。

```text
MIT License

Copyright (c) 2026 cv-cat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 参考过思路、没有复制代码的

这些项目在 DSH 插件机制上先踩过坑，我们看的是经验不是代码：

| 项目 | 参考了什么 |
| --- | --- |
| [Yuuyuko-uu](https://github.com/Yuuyuko-uu) 的 dsh-qq-bridge | QQ 桥接的接法 |
| dsh-speak-up | 主动搭话的判定 |
| dsh-feiyu-mood | 心情机制 |
| dsh-fish-memory | 记忆的组织方式 |
| [Emotionana](https://github.com/Emotionana) 的 persona-memory | 人物记忆（人物画像、群印象、分层记忆、人物关系） |

## 依赖与许可

| 组件 | 许可 | 用在哪 |
| --- | --- | --- |
| DeepSeek Harness | 见官方仓库 | 宿主 |
| `edge-tts` | LGPL-3.0 | 默认 TTS |
| Applio / RVC | 见各自仓库 | 翻唱换声 |
| audio-separator | MIT | 人声与伴奏分离 |
| `ffmpeg` | LGPL / GPL（取决于构建） | 抽音、混音、缩图 |
| OneBot v11 实现（SnowLuma 等） | 见各自项目 | QQ 网关 |

分发时请保留各自的许可文件。**插件不带任何音色模型**——用户自己导入并自负授权。