# 链接

各仓库分别维护框架、插件、市场或文档。使用现有版本与参与 V2 开发需要访问不同的仓库。

## 仓库

| 仓库 | 版本 | 干什么 |
| --- | --- | --- |
| [dsh-aurabot-qq](https://github.com/aureth-labs/dsh-aurabot-qq) | V1 | 当前可用的 AuraBot 框架、面板和模块系统 |
| [dsh-aurabot-qq-v2](https://github.com/aureth-labs/dsh-aurabot-qq-v2) | V2 | TypeScript 重写的框架与 `ctx` 插件接口 |
| [dsh-aurabot-qq-mods](https://github.com/aureth-labs/dsh-aurabot-qq-mods) | — | 社区模块的源码，一个目录一个模块 |
| [dsh-aurabot-qq-plugins-template](https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template) | — | 新插件的目录、构建和发布模板 |
| [dsh-aurabot-qq-market-dev](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/tree/market) | — | 收录清单和 `market` 分支上的市场索引 |
| [dsh-aurabot-qq-docs](https://github.com/aureth-labs/dsh-aurabot-qq-docs) | — | 本站源码 |

## 给 AI 的说明文件

| 文件 | 用途 |
| --- | --- |
| [llms.txt](https://aureth-labs.github.io/dsh-aurabot-qq-docs/llms.txt) | 插件目录、清单字段、API 和开发步骤 |
| [deepseekharness.txt](https://aureth-labs.github.io/dsh-aurabot-qq-docs/deepseekharness.txt) | 在本地目录安装 DSH、生成启动与停止脚本并验收 |

部署 DSH 时发送：

```text
https://aureth-labs.github.io/dsh-aurabot-qq-docs/deepseekharness.txt
```

开发插件时发送 `llms.txt`。两个文件都位于 `public/`，必须使用完整线上地址。

## 上游与相关项目

| 项目 | 关系 |
| --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | 加载 AuraBot 的宿主 |
| [Magpie](https://github.com/yetone/magpie) | 独立模型网关，不是 AuraBot 的组件 |

## 反馈

文档问题提交到[文档仓库 Issues](https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues/new/choose)。框架或模块问题应提交到对应代码仓库。
