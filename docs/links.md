# 链接

代码散在几个仓库里，各管一段。**用哪个，取决于你是想用，还是想改。**

## 仓库

| 仓库 | 版本 | 干什么 |
| --- | --- | --- |
| [dsh-aurabot-qq](https://github.com/aureth-labs/dsh-aurabot-qq) | V1 | 现在能直接用的宿主：接 QQ、面板、模块市场。以维护为主 |
| [dsh-aurabot-qq-v2](https://github.com/aureth-labs/dsh-aurabot-qq-v2) | V2 | 主框架。TypeScript 重写，插件改成 `ctx` 写法。本站文档按它写 |
| [dsh-aurabot-qq-mods](https://github.com/aureth-labs/dsh-aurabot-qq-mods) | — | 社区模块的源码，一个目录一个模块 |
| [dsh-aurabot-qq-plugins-template](https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template) | — | 插件模板。写新插件从这里 fork，别从零建目录 |
| [dsh-aurabot-qq-market-dev](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/tree/market) | — | 市场索引。`market` 分支上的 `market.json` 是面板真正读的东西 |
| [dsh-aurabot-qq-docs](https://github.com/aureth-labs/dsh-aurabot-qq-docs) | — | 本站的源码 |

## 给 AI 看的说明

想让模型帮你写插件，把这份文件整个丢给它：

```text
https://aureth-labs.github.io/dsh-aurabot-qq-docs/llms.txt
```

里面是目录约定、清单字段、API 速查和从零写一个插件的步骤，比让它读整个文档站省事。

## 上游与相关项目

| 项目 | 关系 |
| --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | 宿主。AuraBot 是它的插件 |
| [Magpie](https://github.com/yetone/magpie) | 模型网关，独立项目，我们只推荐不维护 |

## 反馈

文档写错了去[文档仓库提 Issue](https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues)；
模块的问题找模块作者，别提到文档仓库来。
