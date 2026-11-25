# 插件接口 v2：ctx、schema 与消息管线

这页解决一个问题：**插件以后怎么写，宿主为此要改什么，按什么顺序改。**

现状的问题一句话：`api` 已经是个上下文对象的雏形（`api.on` / `api.tool` / `api.settings`），
但它没有名字、没有生命周期、没有服务树，配置也只能写成平铺数组 `{ key, label, type }`。
目标不是再造一个 Koishi，而是把这几块补齐，让写 AuraBot 插件的手感和写 Koishi 插件一致。

## 目标与非目标

**目标**

- 插件写法统一成 `export const config` + `export function apply(ctx, config)`
- 配置由 schema 描述，面板自动生成；`panel.js` 只用于自定义页面
- 插件有生命周期：定时器、监听器随插件卸载自动清
- 消息从纯字符串升级成元素树，支持 `h.text` / `h.image` / `h.voice` / `h.forward`
- 一条消息可以有多个消费者（中间件 / 指令 / AI），消费与否是显式语义

**非目标**

- 不把 Koishi 运行时（`koishi` 包、数据库、console）装进宿主进程
- 不追求任意 Koishi 插件二进制兼容；只保证 API 同名同形
- 不在本仓库实现宿主；本仓库只出规范、模板和检查脚本

## 三个概念

| 概念 | 是什么 | 谁创建 |
| --- | --- | --- |
| 插件 | 一个 `apply(ctx, config)`，有名字、有版本、有配置 | 作者 |
| ctx | 宿主给插件的受控上下文：配置、日志、指令、工具、定时器、bot 列表 | 宿主，按插件隔离 |
| session | 一次具体的会话上下文：哪个 bot、哪个群、谁说的、说了什么 | 宿主，每条消息一个 |

ctx 是「插件级的」，session 是「消息级的」。多机器人场景下，**session 自带 bot**，这是寻址不歧义的前提。

## 插件入口

```ts
import { Schema } from '@aurabot/plugin-api'

export const name = '语音点歌'

export const config = Schema.object({
  enabled: Schema.boolean().default(true),
  source: Schema.union(['both', 'bilibili', 'netease']).default('both'),
  maxMinutes: Schema.natural().min(4).max(30).default(10),
})

export function apply(ctx, config) {
  // 注册指令、工具、中间件、定时器
}
```

`api: 1` 的老插件不需要改：`export default { settings, setup(api) }` 由适配器接在同一个 ctx 上跑。

`apply` 可以是 `async`；插件里所有对外动作（发消息、请求、读写文件）都是异步的，
统一 `await`，不存在同步版本。

## ctx 面

| 成员 | 用途 |
| --- | --- |
| `ctx.config` | 本插件的配置（schema 校验后的对象） |
| `ctx.root.config` | 全局配置，见「全局配置」 |
| `ctx.logger` | 带插件名前缀的日志 |
| `ctx.command()` | 注册指令：用户直接触发，不经过 AI |
| `ctx.tool()` | 注册给 AI 调用的工具；用户不能直接调，必须由模型决定调用并传参 |
| `ctx.middleware()` | 注册消息中间件 |
| `ctx.on()` / `ctx.emit()` | 监听 / 触发事件。宿主内置事件按白名单暴露；插件之间可以自定义事件名互发 |
| `ctx.setInterval()` / `ctx.setTimeout()` | 定时器，由 Cordis 在插件卸载时自动回收 |
| `ctx.bots` | bot 列表：`ctx.bots[0]`；按 id 取用 `ctx.bots('1787850032')` |
| `ctx.bot(id)` | 取单个 bot 实例（`ctx.bots(id)` 的别名） |
| `ctx.broadcast()` | 多 bot 广播；必须显式调用，没有默认值 |
| `ctx.llm` | 模型能力：润色、改写、摘要；后期扩到生成图片 / 视频 |

**`ctx.send` 不存在。** 发送一律走 bot 或 session，原因见下一节。

## session 面

```ts
session.bot          // 这条消息从哪个 bot 来
session.platform     // qq / …
session.channelId    // 群号；私聊时是对方 id
session.userId
session.selfId
session.content      // 纯文本视图，由 elements 派生
session.elements     // 结构化视图
await session.send(...)     // 发回当前会话
await session.execute(...)  // 把这句内容当成当前用户新发的一条消息，重新走管线
```

`session.send()` 可以调用多次，调用几次就发几条——这是插件自己的选择。
所有发送方法都是异步的，`send` / `sendMessage` / `sendPrivateMessage` / `broadcast` 一律要 `await`。

### 发送面

```ts
await session.send(h.text('解析好了：'), h.image(url))

await session.bot.sendMessage(channelId, content)          // 主动发到某个会话
await session.bot.sendPrivateMessage(userId, content)      // 私聊

await ctx.bot('qq-2').sendMessage(channelId, content)      // 指定另一个 bot
await ctx.broadcast(content)                               // 全 bot 广播（显式）
```

为什么不用 `ctx.send`：多机器人下它是歧义的。`ctx.send` 只能表示「所有 bot 都发」，
而「发到哪个会话」必须有归属，所以交给 bot 和 session。

### `session.execute()`

```ts
const result = await session.execute('tell 主人的插件坏了')
```

等价于「当前 session 真的收到了这条消息」：完整走一遍指令解析和中间件链。
如果最终命中 action 或中间件发了消息，**会真的发到平台**——它不是「只跑逻辑不发送」。

- 前缀由全局配置 `commandPrefixes` 决定，默认 `[null, '/']`（无前缀和 `/` 都认）
- 递归深度限 1：`execute` 里再 `execute` 直接拒绝
- 返回值：action 的返回值；被中间件消费时返回 `undefined`
- 和 `session.send()` 的区别：`execute` 会重新解析（可能触发指令或中间件），`send` 直接原样发出去

## 元素

消息内部统一用元素树表示，宿主注入全局 `h`（和 Koishi 一样，不用 import）。

`h` 本身是函数，默认写法是「类型 + 属性」，`h.text()` 这些只是语法糖：

```ts
h('text', { content: '你好啊' })          // 等价于 h.text('你好啊')
h('image', { src: 'https://…/cover.jpg' }) // 等价于 h.image(url)
```

```ts
await session.send(h.text('这个视频好看'), h.image('https://…/cover.jpg'))
await session.send(h.voice(fileUrl))
await session.send(h.forward([
  { userId: '10001', userName: '小明', elements: [h('text', { content: '这视频好看' })] },
  { userId: '10002', userName: '小红', elements: [h.image(pic)] },
]))
```

除了构造函数，还要提供一组处理函数（不只是「消息块」）：

| 方法 | 用途 |
| --- | --- |
| `h.parse(text)` | 字符串 → 元素数组 |
| `h.select(elements, type)` | 按类型筛选（`h.select(el, 'image')`） |
| `h.stringify(elements)` | 元素数组 → 纯文本 |
| `h.normalize(elements)` | 合并相邻文本、去掉空元素 |
| `h.escape(text)` | 转义成可放进元素树的安全文本 |

| 元素 | 说明 |
| --- | --- |
| `h.text` / `h.at` | 文本、@ |
| `h.image` / `h.voice` / `h.video` / `h.file` | 媒体 |
| `h.forward` | 合并转发 |
| `h.quote` | 引用回复 |
| `h.face` | 表情 |

规则：

1. `session.elements` 是结构化的；`session.content` 由它派生纯文本，正则照旧能用
2. 能力查询 `session.bot.supports('forward' | 'voice' | 'image')`
3. 不支持时降级：合并转发 → 多条文本 + 链接；语音 → 附带文件

### 坏 XML 的容错

模型不一定听话。装了上下文总结、自动压缩这类插件的用户，经常遇到模型吐出**别的框架的标签**，
或者标签没闭合：

```text
</ACP>
你好啊 很高兴第二次遇到你
```

不能整条丢掉，也不能原样发出去。解析规则：

1. 认识的标签正常解析成元素
2. **不认识的标签连同标签本身丢掉，但保留标签外的文本**
3. 没闭合的标签当作普通文本，或者按「丢弃标签、保留内容」处理

上例的结果是一条 `<text>你好啊 很高兴第二次遇到你</text>`，而不是把 `</ACP>` 也发出去。

## 全局配置

和插件自己的配置分开，挂在宿主自己的 schema 上，面板里单独一页：

```ts
export const globalConfig = Schema.object({
  contextEcho: Schema.boolean().default(true),        // 出站消息是否回写上下文
  echoLimitPerSession: Schema.natural().default(20),  // 每会话最多记几条
  echoMaxChars: Schema.natural().default(500),        // 单条最多记多少字
  middlewareTimeout: Schema.natural().default(3000),  // 中间件超时
  commandPrefixes: Schema.array(Schema.string()).default([null, '/']), // 认哪些指令前缀，null = 无前缀
  middlewareAfterCommand: Schema.boolean().default(false),            // 指令消费后是否仍进中间件（开发中）
})
```

插件里读 `ctx.root.config.contextEcho`。插件自己的 `ctx.config` 不受全局项影响。

## 消息管线

```text
入站消息
  └─ command     先匹配指令，命中就执行 action
       └─ middleware  指令没消费，才进中间件（默认阶段）
            └─ llm       AI 消费 → 模型 → ctx.tool → 发送
```

只允许三个阶段：`command` / `middleware` / `llm`，默认是 `middleware`。
顺序是固定的——**先指令，后中间件**，因为消息刚进来时应该优先匹配用户显式写的指令；
没人消费才轮到中间件，最后才是 AI。

中间件用名字定位，不用数字：

```ts
ctx.middleware(fn, { before: 'llm', timeout: 3000, onError: 'skip' })
```

`onError: 'skip'`：这个中间件出错当没过（记日志、继续下一个），一个坏插件不能把整条管线打死。

### 指令消费后要不要继续走中间件

默认**不继续**（和 Koishi 一致）。代价是有个真实的坑：用户发 `@机器人 BV123456`，
恰好有个指令就叫 `BV123456`，指令消费掉消息，负责解析 BV 号的中间件就永远等不到。

所以留一个全局配置 `middlewareAfterCommand`（默认 `false`，标注「开发中」），
需要「指令和中间件都要跑」的场景自己打开。默认值先保持不跑，避免一个消息被多个消费者重复处理。

### 消费语义

| 写法 | 含义 |
| --- | --- |
| `await session.send(...)` | 发一条消息；可调用多次 |
| `return` | 本条已处理完，不再往下传；**不会**自动再发一条 |
| `return next()` | 交给下一个中间件，最终可能落到 AI |
| `await session.execute(...)` | 当成新消息重新走管线，会真的发出去 |

`return` 不带值当「消费」，是为了避免「框架发一次 + 插件再发一次」。
返回字符串不自动当回复——要说话就 `session.send`。

### 出站回写上下文

插件或中间件发出的消息，默认写回当前会话的上下文，标记为 `assistant / self-sent`。
否则用户下一句「谢谢」，AI 不知道自己刚发过链接，会再贴一遍。

回写受全局配置控制（`contextEcho` / `echoLimitPerSession` / `echoMaxChars`），
单条消息可以 `{ echo: false }` 关掉。

## 平台层：Satori 是基线

元素树直接采用 Satori 的元素定义（`<message><text/><img src/></message>` 那一套）。
好处是接新平台时只做序列化，不做语义翻译。

适配器三条路：

| 方案 | 复用度 | 代价 | 结论 |
| --- | --- | --- | --- |
| 直接 import `@koishijs/plugin-adapter-*` | 高 | 要跑一个 Koishi App，两套调度 | 不做 |
| **宿主实现 Satori client，对接 satori server** | 平台全覆盖 | 一个 WebSocket + 协议编解码 | 中期方案 |
| 移植 `@satorijs/adapter-onebot` | 单平台 | 几百行 | 已有 OneBot，够用 |

Koishi 插件同理：只有纯逻辑（`ctx.command` / `ctx.middleware` / `ctx.http`）的可以用包名别名（module alias）shim，
依赖 `ctx.database`、`ctx.console` 的不做兼容。

### 适配器也是一种插件

官方不可能覆盖所有平台，社区一定会有人想自己写。所以适配器不应该是宿主里的特例，
而是一类**特殊插件**：自己注册 bot，拿到机器人的完整生命周期——上线、下线、收到消息、下发消息。

```ts
export function apply(ctx, config) {
  ctx.adapter({
    platform: 'my-platform',
    async connect() { /* 建立连接，返回 bot 实例 */ },
    async disconnect() { /* 下线清理 */ },
    async sendMessage(bot, channelId, elements) { /* 下发 */ },
    async sendPrivateMessage(bot, userId, elements) { /* 私聊 */ },
  })
}
```

- 好处：官方仓库不用背所有平台；社区仓库（`aurabot-adapters` 之类）可以单独维护，作者参考成本低
- 代价：兼容面从「简单交互插件」扩大到「生命周期插件」。宿主必须先把 adapter 契约、bot 注册表、
  重连与去重定死，否则社区适配器一多就会互相踩
- 结论：方向认可，但不和前六个阶段混在一起做，单独排到 S8，先定契约再放开

## 宿主改造清单

按依赖顺序排。每阶段都能独立发版，前三个阶段对作者零破坏。

### S0 地基：Bot 与 Session

- [ ] `Bot`：`id` / `platform` / `selfId` / `sendMessage` / `sendPrivateMessage` / `supports`
- [ ] 现有 `api.send(chatId, ...)` 内部改走 `bot.sendMessage`，外部行为不变
- [ ] `Session`：一条入站消息构造一个，群 / 私聊 / 指令 / 定时任务都走同一个工厂
- [ ] 发送目标统一 `{ platform, botId, type: 'group' | 'private', id }`

**验收**：同一段业务逻辑，从群消息、私聊、定时任务三种来源进来都能跑。

### S1 = P0：ctx 别名（零破坏）

- [ ] 支持 `export function apply(ctx, config)`
- [ ] `ctx` 上挂 v1 的全部方法（`on` / `tool` / `route` / `use` / `dataDir` …）
- [ ] `setup(api)` 适配器：`api` 就是 `ctx` 的别名，老插件零改动
- [ ] 加载时按入口形态判断，日志里注明 v1 / v2

**验收**：现有 80 多个插件不改一行，照常加载运行。

### S2 = P1：Schema 配置

- [ ] 引入 `Schema`（`boolean` / `string` / `number` / `natural` / `union` / `object` / `array` / `default` / `description`）
- [ ] 老 `settings` 数组自动转换，面板渲染一致
- [ ] `app.config` 全局配置页
- [ ] 校验失败在面板里就地提示，不要静默回落默认值

**验收**：一个只有 schema、没有 `panel.js` 的插件，所有配置项都能在面板里改。

### S3 = P2：生命周期

- [ ] `ctx.setInterval` / `ctx.setTimeout` / `ctx.on` / `ctx.effect`
- [ ] 卸载 / 禁用时自动 dispose；`ctx.on('dispose')`
- [ ] `scripts/check.mjs` 静态检测裸 `setInterval` / `process.on`，给警告

**验收**：面板里禁用插件后，定时器与监听器不再触发。

### S4：元素模型

- [ ] 注入全局 `h`：`text` / `at` / `image` / `voice` / `video` / `file` / `forward` / `quote` / `face`
- [ ] `h` 是函数：`h('text', { content })`；同时提供 `h.parse` / `h.select` / `h.stringify` / `h.normalize`
- [ ] 坏标签容错：不认识的 XML 标签丢弃、标签外的文本保留
- [ ] `session.elements` 结构化，`session.content` 派生
- [ ] 入站 OneBot 消息段 → 元素树；出站反序列化 + 降级
- [ ] `bot.supports()` 能力表

**验收**：`h.forward` 在 QQ 出合并转发，在不支持的平台降级为多条文本。

### S5：管线与中间件

- [ ] 阶段 `command → middleware → llm`，`before` / `after` 按名字定位，默认 `middleware`
- [ ] 全局配置 `commandPrefixes`（默认 `[null, '/']`）与 `middlewareAfterCommand`（默认 `false`）
- [ ] 消费语义：`return` / `return next()` / 多次 `session.send`
- [ ] `{ timeout, onError: 'skip' }`
- [ ] 出站回写上下文 + 全局配置
- [ ] `session.execute()` 走完整管线（含递归保护）

**验收**：B 站解析中间件回链接后，AI 不再重复回复，且知道「自己发过」。

### S6 = P3：契约正式化

- [ ] `package.json.aurabot.api = 2`，v1 长期保留
- [ ] 类型包 `@aurabot/plugin-api`（只发类型，不强制 npm 发布）
- [ ] 模板仓库与 `MODULE_SPEC.md` 同步更新
- [ ] 市场上标注 v1 / v2

**验收**：模板仓库新建的插件默认就是 v2 写法，`npm run check` 通过。

### S7：平台层

- [ ] 宿主实现 Satori client（连接、鉴权、重连）
- [ ] 元素树 ↔ Satori 消息序列化
- [ ] 用 satori server 接一个非 QQ 平台做验证

**验收**：接一个新平台，插件代码零改动。

### S8：适配器插件化

- [ ] 定 `ctx.adapter()` 契约：`connect` / `disconnect` / `sendMessage` / `sendPrivateMessage` / 能力声明
- [ ] bot 注册表支持动态增删（上线、下线、重连）
- [ ] 入站消息由适配器构造 session 后交给管线，适配器不碰业务逻辑
- [ ] 市场与面板区分「普通插件」和「适配器插件」，标注 requires 的 platform
- [ ] 出一个官方适配器仓库做参考实现

**验收**：一个仓库外的适配器插件装上就能让新平台上线收发消息，插件代码零改动。

## 依赖与顺序

| 阶段 | 依赖 | 可并行 |
| --- | --- | --- |
| S0 Bot / Session | 无 | — |
| S1 ctx 别名 | S0 | 与 S2 并行 |
| S2 Schema | 无 | 与 S1 并行 |
| S3 生命周期 | S1 | 与 S4、S5 并行 |
| S4 元素 | S0 | 与 S3、S5 并行 |
| S5 管线 | S1、S4（富媒体）、S2（全局配置） | — |
| S6 正式化 | S1–S5 全部 | — |
| S7 平台层 | S4（元素树） | 可与 S5 并行 |
| S8 适配器插件化 | S0（Bot）、S7（协议） | — |

一句话顺序：**S0 →（S1 ∥ S2）→（S3 ∥ S4）→ S5 → S6，S7 单独立项，S8 在 S7 之后。**

## 明确不做

- 不把 Koishi 运行时装进宿主进程
- 不为任意 Koishi 插件做二进制兼容
- 不做 `ctx.send` 这种无归属的发送入口
- 不用数字优先级排中间件

## 待定

- [ ] ctx 用 cordis 还是自研容器（只影响宿主实现，不影响作者写法）
- [ ] 元素 schema 是否带版本号（`h.v2.forward`）
- [ ] 全局配置是全局唯一，还是允许每 bot 覆盖
- [ ] `contextEcho` 默认开会不会让长会话上下文膨胀过快，需要实测
- [ ] `middlewareAfterCommand` 在什么场景下默认打开才合理（先标「开发中」）
- [ ] 适配器插件化的兼容边界：允许它用多少宿主内部能力
