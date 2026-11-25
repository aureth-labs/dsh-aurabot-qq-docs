# 接入平台

平台不是写死在框架里的，一个平台就是一个**适配器插件**：它负责登录、上下线、把平台消息
归一化成统一的消息对象，再把你发出去的东西还原成平台认识的样子。

因为它是插件，所以：**同一个平台可以开多份**（挂多个账号），而处理逻辑仍然是同一套。

## 支持情况

| 平台 | 状态 | 怎么接 |
| --- | --- | --- |
| QQ | 已支持 | OneBot v11 网关（SnowLuma / NapCat / LLOneBot / Lagrange），见[接入 QQ](/guide/platforms/qq) |
| QQ 官方 | 规划中 | QQ 开放平台 |
| Telegram | 规划中 | Bot API |
| Discord | 规划中 | Bot API |

没有现成适配器也能自己写：适配器只是插件的一种，注册的能力不同而已，写法见[插件接口 v2](/reference/plugin-api)。

## 多个账号怎么发消息

消息发出去时要指明从哪个机器人发，不能笼统地「发到平台」：

```ts
// 主动发到某个群 / 频道
await session.sendMessage(channelId, content)

// 主动私聊某个人
await session.sendPrivateMessage(userId, content)

// 手上只有机器人 id 时，先取实例
await ctx.bots(robotId).sendMessage(channelId, content)
```

`ctx.bots` 是列表，也可以按 id 取具体那一只——接了两个 QQ 号时，这是唯一不会发错的办法。
