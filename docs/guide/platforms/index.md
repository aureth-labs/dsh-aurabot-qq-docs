# 平台连接

一个适配器实例连接一个机器人账号。安装适配器后，AuraBot 根据它的 Schema 展示连接参数。主人身份由平台和用户 ID 共同确定，群聊和私聊的频道 ID 直接使用平台原值。

| 接入方式 | 适用场景 | V2 交付位置 |
| --- | --- | --- |
| QQ · OneBot v11 | 已有支持 OneBot v11 的 QQ 网关 | 默认发行组合，[接入 QQ](qq.md) |
| QQ 官方 | 使用 QQ 开放平台的群聊或单聊机器人 | 主框架构建产物 `dist/adapters/adapter-qq-official` |
| Telegram Bot API | 使用 BotFather 创建的账号，通过长轮询接收消息 | 官方社区仓的 [Telegram 适配器](telegram.md) |
| Satori | 接入支持 Satori HTTP 和 WebSocket 的服务端，平台名来自其登录信息 | 主框架构建产物 `dist/adapters/adapter-satori` |

随框架启用的聊天沙盒使用回环地址。打开控制台的「聊天沙盒」即可在本机检验消息和指令。
