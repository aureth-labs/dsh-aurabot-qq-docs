# 接入 Telegram

在 Telegram 的 BotFather 创建机器人，取得 Bot Token。准备机器人的 Token 和主人的数字用户 ID。用户名可以改变，配置主人时使用数字 ID。

1. 从包含 `shangxueink/adapter-telegram` 的 V2 市场源安装「Telegram」。开发版可使用社区仓生成的本地镜像。
2. 在机器人接入配置里选择 Telegram，填入主人 ID 和 Bot Token。默认 Bot API 地址是 `https://api.telegram.org`。
3. 保存后等待账号上线，在 Telegram 打开和机器人的私聊，点「开始」，发送一条消息。群聊中可使用 `@机器人用户名` 或直接回复机器人的消息。

适配器用长轮询接收消息。如果同一账号已配置 webhook，或已被另一个长轮询进程使用，先处理原有连接再重试。群消息的可见范围由 Telegram 的隐私模式和权限决定。[Telegram 官方 Bot FAQ](https://core.telegram.org/bots/faq)

当前适配器支持文本、提及、引用、消息编辑、撤回和表态。收到媒体时以类型占位显示。每个账号单独管理轮询连接，停用插件会关闭正在等待的请求。
