# 常见问题

## 一定要 Windows 吗

不。插件本体在 Windows / Linux / macOS 都能跑。Windows 省事的地方在于
QQ 网关（SnowLuma）和翻唱（RVC）支持最好；Linux 接自己的 OneBot v11 就行，语音要 Python 虚拟环境。

## 会被腾讯封号吗

和所有第三方 QQ 机器人一样有风险。用的是你自己的号和你自己选的网关，
所以：别拿主号、别群发、别高频打扰陌生人。

## 装完插件，左侧栏没出现 Aurabot

1. 重启 DSH（`dsh plugin add` 之后必须重启）
2. 确认装的是对的 profile：`dsh plugin --profile <name> list`
3. 看 DSH 自己的日志，加载失败通常有明确报错

## 机器人不回复

按这个顺序查：

| 检查项 | 在哪看 |
| --- | --- |
| 总开关开了吗 | 面板「概览」 |
| 是不是还在试运行 | 面板「概览」 |
| 网关连上了吗 | 面板「连接」显示在线与否 |
| 模型报错了吗 | 面板「模型」，或 DSH「设置 → 模型」 |
| 群聊要不要回 | 面板「群聊」，有的群默认只围观 |

## 模型报 401 / 403

密钥问题。回到 DSH「设置 → 模型」重填，注意有些提供商除了密钥还要 project 或账号 ID。

## 面板打不开或一保存就 403

放反代了但没配 `security.trustedProxy` 和 `security.publicHostname`，
见[配置 AuraBot](/guide/configure#放到反向代理后面)。

## 我的配置和记忆在哪，换电脑怎么带走

```
%USERPROFILE%\.dsh\plugins-data\aurabot\
```

走面板「系统 → 备份」打 zip，不要手拷单个文件。

## 模块改了没生效

自己写的模块保存即热重载；装了新版本要重启 DSH。
面板「已安装」页有模拟测试，可以用它确认是不是只有发送环节没通。

## 文档有错 / 想加内容

每页右上角有「在 GitHub 上编辑此页」，直接改 `docs` 分支；或者去
[市场仓库](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/issues) 提 Issue。
