# AuraBot V2 插件接口

从 `@aurabot/plugin-api` 导入 `Ctx`、`Schema`、`h`、`Bot` 和 `UnsupportedApiError`。插件通过具名导出 `name`、`config` 和 `apply(ctx, config)` 启动。版本、平台范围和能力声明写入 package.json 的 aurabot 段，版本号本身使用顶层 version。

## 作用域与配置

`apply` 收到当前实例启动时的配置。事件回调里读取 `ctx.config` 可以取得最新设置。配置中声明 `aurabot.reloadOnConfig` 的插件会在设置更新后重启。用 `ctx.setInterval`、`ctx.setTimeout`、`ctx.on` 和 `ctx.effect` 注册的资源随当前实例释放。通过 `ctx.provide` 提供服务，使用 `ctx.get` 查询可选服务。

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

用 `h.text`、`h.image`、`h.voice` 和 `h.file` 构造元素。`h.parse` 和 `h.select` 支持解析与查询。适配器根据能力表处理输出。需要按目标发送时，保存平台、Bot 实例、会话类型和目标 ID，使用 `ctx.bots.get(botId, platform)` 选取原 Bot。

适配器包声明 `aurabot.kind: "adapter"`。在 apply 中等待 `ctx.adapter(spec, config)`，在 connect 中完成握手并返回 Bot，接收平台事件后使用 runtime.emitMessage 投递入站消息。平台专有调用使用 `bot.internal(action, params)`。只适用于 QQ 的插件声明 `aurabot.platforms: ["qq"]`。

[完整示例与本地运行](../dev/first-plugin)

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
