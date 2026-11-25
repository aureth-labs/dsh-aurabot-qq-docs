# 接入 QQ

AuraBot 不直接和腾讯的服务器打交道，它连的是一个 **OneBot v11 网关**。
网关负责让机器人号上线，插件只负责「收到消息 → 想 → 发回去」。

```text
QQ ⇄ 网关（SnowLuma / NapCat / LLOneBot / Lagrange）⇄ AuraBot ⇄ DSH 会话
```

## 路线 A：SnowLuma（Windows 推荐）

1. 从 [SnowLuma Releases](https://github.com/SnowLuma/SnowLuma/releases) 下载解压，启动
2. 在它的面板里本人同意协议（控制台密码自动生成，记得存好）
3. 用机器人小号登录
4. 回到 AuraBot 设置向导，点「接入机器人号」

这条路线插件会主动去拉起连接，你不用自己拼 WebSocket 地址。

## 路线 B：接已有的 OneBot v11

NapCat、LLOneBot、Lagrange、Docker 版 SnowLuma 都行。做法：

1. 在这些工具里开 **正向 WebSocket**（不是反向，也不是 HTTP）
2. 记下地址，形如 `ws://127.0.0.1:3001`，有 token 就一起记下来
3. 在 AuraBot 向导里填地址和 token —— **插件只连接，不启动网关**

## Linux / Docker 三个坑

| 坑 | 怎么办 |
| --- | --- |
| 容器里填 `127.0.0.1` 连不上 | 容器里的回环是容器自己，填宿主机或另一个容器能访问到的主机名 |
| 语音功能报缺依赖 | 装 `python3-venv` 或 [uv](https://docs.astral.sh/uv/) |
| 翻唱（RVC）用不了 | 目前只支持 Windows |

## 接上之后先别急着上线

默认是「总开关关 + 试运行开」，试运行只生成回复、不真的发到 QQ。
先在面板里看她会怎么回，确认没问题再打开总开关。

## 关于封号

用的是你自己的号和你自己选的网关，风险和你用其他 QQ 机器人框架一样。
别拿主号当机器人，别群发，别高频打扰陌生人 —— 这几条比任何技术手段都管用。
