# 平台连接

适配器负责平台登录、连接维护、消息转换和实际投递。框架处理统一后的消息对象，因此业务插件不需要分别实现各平台的消息格式。

## 支持状态

| 平台 | 状态 | 连接方式 |
| --- | --- | --- |
| QQ | 已支持 | OneBot v11，见[接入 QQ](/guide/platforms/qq) |
| QQ 官方 | 规划中 | QQ 开放平台 |
| Telegram | 规划中 | Bot API |
| Discord | 规划中 | Bot API |

适配器可以作为独立插件开发。同一适配器配置多个实例时，可以管理多个机器人账号，业务处理仍由同一套插件完成。

## 指定发送对象

主动发送消息时，需要明确机器人实例和接收对象：

```ts
await session.sendMessage(channelId, content)
await session.sendPrivateMessage(userId, content)
await ctx.bots(robotId).sendMessage(channelId, content)
```

`ctx.bots` 可枚举机器人实例，也可按 ID 取得指定实例。发送接口均为异步操作。
