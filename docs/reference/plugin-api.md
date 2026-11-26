# AuraBot V2 插件接口

从 `@aurabot/plugin-api` 导入 `Ctx`、`Schema`、`h`、`Bot` 和 `UnsupportedApiError`。插件通过具名导出 `name`、`config` 和 `apply(ctx, config)` 启动。版本、平台范围和能力声明写入 package.json 的 aurabot 段，版本号本身使用顶层 version。

## 作用域与配置

`apply` 收到当前实例启动时的配置。事件回调里读取 `ctx.config` 可以取得最新设置。配置中声明 `aurabot.reloadOnConfig` 的插件会在设置更新后重启。用 `ctx.setInterval`、`ctx.setTimeout`、`ctx.on` 和 `ctx.effect` 注册的资源随当前实例释放。通过 `ctx.provide` 提供服务，使用 `ctx.get` 查询可选服务。

`ctx.updateConfig(patch)` 合并当前实例的配置，按 Schema 校验后保存，也接受一个从当前配置计算补丁的函数。超出范围或类型不符会抛出异常，整次更新都不会落盘。附加实例的配置只保存它覆盖的字段；主实例的密码字段不会继承。面板保存同样会检查当前插件的 Schema。

## 在指定会话发送和读取流水

在指令或中间件中，用 `await session.send(content)` 回复当前会话。定时任务可以保存 `session.target`，稍后用 `ctx.sendTo(target, content)` 投递。目标保留平台、机器人实例、会话类型和平台原始 ID，文件、图片和语音都通过元素树发送。

```ts
const target = { platform: 'telegram', botId: 'office', type: 'private', id: '42' } as const
await ctx.sendTo(target, h.text('提醒时间到了'), { proactive: true })
const entries = ctx.chatLog.read(target, '2026-11-27')
```

主动发送开启 `proactive` 后，收到投递确认才记录发言。也可用 `ctx.chatLog.append(target, who, text, userId)` 追加活动。读写都按当前人格和目标隔离，原有 QQ 日流水归默认 OneBot 实例；已标记遗忘的消息从结果中排除。广播返回每个目标的投递结果。

## 入站、回复和模型工具

| 调用 | 行为 |
| --- | --- |
| `ctx.command(...).action(...)` | 用户输入指令，当前会话直接执行 |
| `ctx.middleware(async (session, next) => …)` | 处理消息或调用 next 继续 |
| `ctx.tool(spec)` | 向模型提供带参数描述的工具 |
| `ctx.tool(where => …)` | 按本次调用上下文决定可用工具 |
| `session.send(content)` | 在原会话发送一条消息，可多次 await |
| `session.execute(text)` | 继承当前身份并再次执行消息管线 |
| `ctx.isOwner(session)` | 按平台、用户和授权的 Bot 实例判断主人 |
| `ctx.llm.generate({ text, system? })` | 调用宿主配置的模型 |
| `ctx.think(prompt, options)` | 发起带人格的后台模型回合 |

## 消息和平台

用 `h.text`、`h.image`、`h.voice` 和 `h.file` 构造元素。`h.parse` 和 `h.select` 支持解析与查询。适配器根据能力表处理输出。

用 `await session.send(h.poke())` 回戳当前发言人。也可以传入目标 ID，或写成 `<poke id="123"/>`。OneBot v11 在群里按元素顺序发送消息和戳一戳，私聊只允许戳当前接收人。缺少此能力的平台显示「[戳一戳]」。

需要按目标发送时，保存平台、Bot 实例、会话类型和目标 ID，使用 `ctx.bots.get(botId, platform)` 选取原 Bot。

适配器包声明 `aurabot.kind: "adapter"`。在 apply 中等待 `ctx.adapter(spec, config)`，在 connect 中完成握手并返回 Bot，接收平台事件后使用 runtime.emitMessage 投递入站消息。物理连接断开或恢复时，更新 Bot 状态并调用 `runtime.statusChanged(reason?)`，原实例的 ID 在重连期间稳定。平台专有调用使用 `bot.internal(action, params)`。只适用于 QQ 的插件声明 `aurabot.platforms: ["qq"]`。

[完整示例与本地运行](../dev/first-plugin)

频道 ID 使用平台返回的原始值。某些平台在群聊和私聊中复用相同编号，可用 `bot.getChannel(channelId, session.type)` 或 `bot.getMessageList(channelId, { channelType: session.type, limit: 20 })` 指明会话类型。

聊天模型默认接收原图。全局 `media.receiveImages` 控制是否接收图片，`media.maxImageMB` 和 `media.maxImages` 限制单图和单条消息，默认分别为 16 MB 和 8 张。图片读取失败时继续处理用户文本及成功读取的图片。

### 读取引用消息

入站消息包含引用时，命令和中间件可以从 `session.quote` 读取原消息的 `id` 和 `channelId`。宿主先查当前平台、Bot 账号与会话的本地记录，再向适配器查询。能确认来源时返回 `userId` 和 `content`；已撤回的引用带有 `deletedAt`。

```ts
ctx.command("引用内容").action(async ({ session }) => {
  const quote = session.quote
  if (!quote) return session.send("请引用一条消息")
  if (quote.deletedAt) return session.send("原消息已撤回")
  return session.send(quote.content || "未能读取原消息正文")
})
```

## 服务依赖

插件可导出 `export const inject = ['llm']`，也可以在 package.json 中声明 `aurabot.inject`。宿主等待这些服务就绪后调用 `apply`。提供者退出时，依赖它的实例会释放命令、定时器和监听器。服务恢复后，仍启用的实例会重新启动。

用 `ctx.provide('服务名', 实现对象)` 提供服务。同一个服务名只能由一个实例持有；面板会显示冲突双方的实例名。可选功能通过 `ctx.services.get(name)` 查询。默认的 `llm` 插件提供 `ctx.llm.generate`、`polish`、`rewrite` 和 `summarize`。替换模型实现时，先停用原提供者，再启用实现同一接口的插件。

## 消息和平台事件

| `ctx.on` 事件 | 参数与调用时机 |
| --- | --- |
| `before-parse` | 解析入站消息前按注册顺序调用，可异步替换 `draft.elements`。 |
| `message` | 指令和中间件运行前收到 `Session`。`userId` 是发送者，`id` 是消息 ID，`sn` 是适配器给出的事件序号。 |
| `before-send` | 参数含 `bot`、`target` 和待发送的 `elements`。监听器返回 `true` 即取消此次发送。 |
| `send` | 发送成功后触发。平台返回消息 ID 时写入 `messageId`。平台将一条内容拆为多条消息时，每个 ID 触发一次。 |
| `guild-member-added`、`guild-member-removed`、`guild-member-updated` | 成员变更。事件提供 `botId`、`guildId`、`userId` 与平台资源 `data`。 |
| `friend-request`、`guild-request`、`guild-member-request` | 好友、邀请或入群申请。申请标识和附言可从 `data.message` 读取。 |
| `message-deleted`、`message-updated` | 撤回或编辑。按 `platform`、`botId`、`channelId` 与 `messageId` 定位消息。 |

对支持撤回且返回频道和消息 ID 的适配器，可在 `send` 监听器里调用 `await event.bot.deleteMessage(event.channelId, event.messageId)`。主动私信时频道 ID 取决于平台回执。试运行、入队和被取消的发送不会触发成功事件。

## 按会话选择模型

「会话模型」插件在启用「注册指令」后提供 `/model`。默认只有主人可以操作，私聊和群聊各有开关。选择目标时可用列表序号或完整的 `供应商/模型`。`/model 默认` 清除当前房间的选择。

插件可通过 `ctx.llm.config.model.list()` 读取模型目录，用 `get(session.target, session.bot.selfId)` 读取该房间的覆盖项。用 `set(target, selfId, { provider, model })` 保存，传 `null` 则清除。设置随登录身份和房间持久化，应用于后续对话及其中的工具轮次。
