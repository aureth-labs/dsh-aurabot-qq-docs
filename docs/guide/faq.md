# 常见问题

按症状查，别从头读。

## 一定要 Windows 吗

不。AuraBot 本体在 Windows / Linux / macOS 都能跑。Windows 省事的地方在于 QQ 网关（SnowLuma）和翻唱（RVC）支持最好；Linux 接自己的 OneBot v11 就行，语音要 Python 虚拟环境。

## 会被腾讯封号吗

和所有第三方 QQ 机器人一样有风险。用的是你自己的号和你自己选的网关，所以：别拿主号、别群发、别高频打扰陌生人。

## 装完 AuraBot，左侧栏没出现

1. 重启 DSH（`dsh plugin add` 之后必须重启）
2. 确认装的是对的 profile：`dsh plugin --profile <name> list`
3. 看 DSH 自己的日志，加载失败通常有明确报错

细节见[安装 AuraBot](/guide/install-aurabot#验证装成功了没)。

## 左侧栏有了，但她不回话

按顺序查：

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

放反代了但没配 `security.trustedProxy` 和 `security.publicHostname`，见[认识面板](/guide/configure#放到反向代理后面)。

## 画不出图

先确认「画图」页里到底走的是哪条路：内置三条，还是 DSH 已接入的模型。走第四条时**必须自己选一个模型**，不选就等于没接管。完整排查见[画图](/features/image#出不来图怎么查)。

## 不发语音条 / 没声音

`edge-tts` 没装，或者语音开关没开。先在面板「语音」页点「试听」——试听不通是合成的问题，试听通而 QQ 里没有是发送或权限的问题。见[语音](/features/voice)。

## 翻唱用不了

目前只在 Windows 上跑通。另外翻唱要 RVC 环境 + 一个音色，两样缺一样都不动。失败时不会报错，只是退回原声，原因写在面板日志里。见[翻唱](/features/cover)。

## 点歌发不出来

九成是缺 `ffmpeg`。见[点歌](/features/music#排错)。

## 我的配置和记忆在哪，换电脑怎么带走

```text
%USERPROFILE%\.dsh\plugins-data\aurabot\
```

走面板「系统 → 备份」打 zip，不要手拷单个文件。

## 模块改了没生效

自己写的模块保存即热重载；装了新版本要重启 DSH。面板「已安装」页有模拟测试，可以用它确认是不是只有发送环节没通。开发细节见[如何开发我们的框架](/dev/develop-framework)。

## 文档有错 / 想加内容

每页右上角有「在 GitHub 上编辑此页」，直接改[文档仓库](https://github.com/aureth-labs/dsh-aurabot-qq-docs)的 `main` 分支；或者去[文档仓库提 Issue](https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues)。