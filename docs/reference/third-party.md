# 第三方声明与致谢

AuraBot 主仓库采用 MIT 许可证，完整文本见主仓库的 `LICENSE`。本页记录移植、参考和运行依赖的第三方项目。涉及代码移植的部分保留对应许可原文，更新相关文件时不得删除这些声明。

## 桌宠

桌宠模块和素材不在主仓库。署名与许可信息见[社区模块仓库](https://github.com/aureth-labs/dsh-aurabot-qq-mods)的 `modules/pet/THIRD-PARTY-NOTICES.md` 和 README。

## 目的引擎：Mieksido/surfcore（MIT）

| 项 | 内容 |
| --- | --- |
| 项目 | [Mieksido/surfcore](https://github.com/Mieksido/surfcore) |
| 许可 | MIT |
| 移植范围 | `src/purpose/engine.js` 的纯逻辑核心：配置归一化、排程、素材摘要、目标假设、候选选择、提示词构建、回执解析、状态迁移 |
| 来源文件 | 该项目的 `src/purpose-engine.js` |

`src/purpose/module.js` 和 `src/modules/purpose/index.js` 是 AuraBot 新增的接入代码，不属于移植范围。移植逻辑已按 AuraBot 的模块接口和配置方式调整。

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

项目根据这些参数实现了自己的原生接口，没有 catbus 运行时依赖，也不读取或修改 catbus 的源码和账号文件。

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

## 设计参考

以下项目用于研究 DSH 插件机制和功能设计，没有复制其代码：

| 项目 | 参考了什么 |
| --- | --- |
| [Yuuyuko-uu](https://github.com/Yuuyuko-uu) 的 dsh-qq-bridge | QQ 桥接方式 |
| dsh-speak-up | 主动搭话判定 |
| dsh-feiyu-mood | 心情机制 |
| dsh-fish-memory | 记忆组织方式 |
| [Emotionana](https://github.com/Emotionana) 的 persona-memory | 人物画像、群印象、分层记忆和人物关系 |

## 依赖与许可

| 组件 | 许可 | 用途 |
| --- | --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | 见官方仓库 | 宿主 |
| `edge-tts` | LGPL-3.0 | 默认 TTS |
| Applio / RVC | 见各自仓库 | 翻唱换声 |
| audio-separator | MIT | 人声与伴奏分离 |
| `ffmpeg` | LGPL / GPL（取决于构建） | 抽音、混音、缩图 |
| OneBot v11 实现（SnowLuma 等） | 见各自项目 | QQ 网关 |

分发时应保留各自的许可文件。AuraBot 不提供音色模型，用户需要自行导入并确认使用授权。
