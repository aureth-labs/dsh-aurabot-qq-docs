# V2 插件接口设计

本文记录 AuraBot V2 的插件接口约定和主仓库实施顺序。除明确标注为 V1 兼容行为的内容外，本页均为设计稿，不表示当前版本已经实现。

V1 已有 `api.on()`、`api.tool()` 和 `api.settings()`，但缺少统一的插件上下文、生命周期和结构化消息。V2 保留现有模块的兼容入口，同时将新插件统一为 `apply(ctx, config)`。

## 目标与边界

设计目标：

- 使用 `export const config` 和 `export function apply(ctx, config)` 定义插件。
- 通过 Schema 自动生成配置面板，并支持 `disabled`、`experimental` 等元信息。
- 通过 Cordis 生命周期回收事件、定时器和其他资源。
- 使用元素树表达文本、媒体和合并转发等消息内容。
- 明确指令、中间件和模型工具的不同触发方式。
- 让业务代码通过 Bot 和 Session 处理具体机器人及会话。

不在该设计中：

- 不在 AuraBot 进程内运行完整的 Koishi 应用。
- 不承诺兼容依赖 Koishi 数据库、Console 或其他专有服务的现有包。
- 不在文档仓库实现主仓库代码。

## 核心对象

| 对象 | 含义 | 创建方 |
| --- | --- | --- |
| 插件 | 导出名称、配置和 `apply` 的代码包 | 插件作者 |
| `ctx` | 当前插件的受控上下文，提供配置、日志、注册接口和 Bot 列表 | 宿主，按插件实例隔离 |
| `session` | 一次消息处理上下文，包含来源 Bot、平台、用户、频道和内容 | 宿主，每条入站消息创建 |

`ctx` 属于插件实例，`session` 属于一次消息处理。Session 携带来源 Bot，主动发送时不会因存在多个机器人而失去目标。

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
  ctx.command('song <keyword:text>')
    .action(async ({ session }, keyword) => {
      await session.send(`正在搜索：${keyword}`)
    })
}
```

V1 的 `export default { settings, setup(api) }` 通过兼容层加载，不要求现有模块立即改写。

`apply` 可以是异步函数。模板中的指令和中间件默认使用 `async (session, next) => {}`；也允许注册同步函数，但同步函数中的耗时操作会阻塞消息处理。发送、网络请求和文件操作应使用 `await`。

### 配置元信息

配置描述采用与 Koishi 一致的 Schema 元信息形式：

```ts
export const config = Schema.object({
  enabled: Schema.boolean().default(true),
  source: Schema.union(['both', 'bilibili', 'netease'])
    .default('both')
    .description('搜索源'),
  maxMinutes: Schema.natural().min(4).max(30).default(10)
    .description('单次点歌最长时长（分钟）'),
  voiceOnly: Schema.boolean().default(false)
    .experimental()
    .description('只发送语音'),
  internalToken: Schema.string()
    .role('secret')
    .disabled()
    .description('由宿主注入'),
})
```

| 元信息 | 面板行为 |
| --- | --- |
| `description()` | 在字段下方显示说明 |
| `default()` / `required()` | 设置默认值或执行必填校验 |
| `disabled()` | 字段只读，不接受提交修改 |
| `hidden()` | 不显示字段，但值仍参与校验 |
| `deprecated()` | 标记为已废弃，仍允许修改 |
| `experimental()` | 标记为实验性，默认折叠 |
| `role('secret')` | 对输入内容打码 |

`experimental()` 对应 Koishi 的实验性配置语义。仍在开发中的全局配置也使用该标记，不能只写在文档里。

普通插件只需要导出 `config`，不需要另外编写 `panel.js`。

### 自定义面板

图表、批量操作或独立页面可以使用自定义前端入口。入口源码经过构建生成 `dist/index.js`，由面板动态加载。

前端代码只获得面板侧的最小上下文，可以注册页面和菜单，通过宿主公开接口读取数据，不能直接访问后端上下文。

## Context 接口

| 成员 | 用途 |
| --- | --- |
| `ctx.config` | 当前插件经过 Schema 校验的配置 |
| `ctx.root.config` | 框架全局配置 |
| `ctx.logger` | 带插件名称的日志接口 |
| `ctx.command()` | 注册指令；用户可直接触发，不需要先进入模型会话，执行结果可以回写模型上下文 |
| `ctx.tool()` | 注册模型工具；用户不能直接调用，由模型决定调用并传入参数 |
| `ctx.middleware()` | 注册消息中间件 |
| `ctx.server` | HTTP 服务，提供 `get`、`post`、`put`、`patch`、`delete`、`head`、`options` 和 `all` 等方法 |
| `ctx.on()` / `ctx.emit()` | 监听或触发事件；宿主只公开规定的事件，插件也可以定义自己的事件名供其他插件监听 |
| `ctx.setInterval()` / `ctx.setTimeout()` | 注册到 Cordis 当前插件作用域的定时器，卸载时自动回收 |
| `ctx.bots` | 可枚举的 Bot 列表，可使用 `ctx.bots[0]`，也可通过 `ctx.bots('<id>')` 按 ID 取实例 |
| `ctx.bot(id)` | `ctx.bots(id)` 的别名 |
| `ctx.broadcast()` | 显式向多个 Bot 广播，不是默认发送方式 |
| `ctx.platform()` / `ctx.guild()` / `ctx.private()` | 创建带派发过滤条件的上下文 |
| `ctx.llm` | 模型能力，包括润色、改写和摘要；图片、视频生成属于后续扩展 |

不提供 `ctx.send()`。主动发送必须指定 Bot 或使用当前 Session，避免在多机器人环境中产生歧义。

定时器由 AuraBot 自身的 Cordis 生命周期管理实现，不需要依赖外部扩展回收。插件卸载或禁用时，注册在当前作用域内的定时器会被清理。

## Session 接口

```ts
session.bot
session.platform
session.channelId
session.userId
session.selfId
session.content
session.elements

await session.send(content)
await session.execute(content)
```

`session.content` 是从 `session.elements` 派生的纯文本视图。`session.send()` 向当前会话发送消息，可以调用多次，每次调用发送一次，不受中间件的消费返回值限制。

### 主动发送

```ts
await session.send(h.text('解析完成'), h.image(url))

await session.bot.sendMessage(channelId, content)
await session.bot.sendPrivateMessage(userId, content)

await ctx.bot('qq-2').sendMessage(channelId, content)
await ctx.broadcast(content)
```

`sendMessage(channelId, content)` 向指定频道发送，`sendPrivateMessage(userId, content)` 向指定用户发起私聊。它们都是 Bot 的异步方法，不是适配器的业务接口。

所有发送形式都应使用 `await`，包括 `send`、`sendMessage`、`sendPrivateMessage` 和 `broadcast`。

### `session.execute()`

```ts
const result = await session.execute('tell 主人的插件坏了')
```

该调用以当前用户和当前 Session 的身份构造一条新的入站消息，重新执行完整消息管线。它可能命中指令，也可能由中间件或模型处理；处理过程中调用的发送方法会实际向平台发消息。

例如：

```ts
await session.execute('echo 你好啊')
```

如果已注册的 `echo` 指令会发送参数，平台将收到「你好啊」。`session.execute()` 不是仅在本地执行 action 的快捷函数。

- 指令前缀由全局 `commandPrefixes` 管理，默认允许无前缀和 `/`。
- 递归深度限制为 1，在 `execute` 产生的管线中再次调用 `execute` 会被拒绝。
- 指令命中时返回 action 的返回值；中间件消费时返回 `undefined`。
- 无法匹配指令并不必然抛错，因为消息还可以继续进入中间件或模型阶段。

`session.send()` 与 `session.execute()` 的区别在于，前者直接发送内容，后者重新构造并处理入站消息。

## 消息元素

消息内部使用元素树表示。宿主提供全局 `h`，采用 Satori 元素定义作为基线，不要求插件另行导入。

`h` 是构造函数，类型和属性是通用写法：

```ts
h('text', { content: '你好啊' })
h('image', { src: 'https://example.com/cover.jpg' })
```

常用类型提供便捷函数：

```ts
await session.send(h.text('这个视频不错'), h.image(coverUrl))
await session.send(h.voice(fileUrl))
await session.send(h.forward([
  {
    userId: '10001',
    userName: '小明',
    elements: [h('text', { content: '这个视频不错' })],
  },
  {
    userId: '10002',
    userName: '小红',
    elements: [h.image(coverUrl)],
  },
]))
```

| 元素 | 用途 |
| --- | --- |
| `h.text` / `h.at` | 文本和提及 |
| `h.image` / `h.voice` / `h.video` / `h.file` | 媒体与文件 |
| `h.forward` | 合并转发 |
| `h.quote` | 引用回复 |
| `h.face` | 表情 |

处理函数也是接口的一部分：

| 方法 | 用途 |
| --- | --- |
| `h.parse(text)` | 将字符串解析为元素数组 |
| `h.select(elements, type)` | 按类型筛选元素 |
| `h.stringify(elements)` | 生成纯文本视图 |
| `h.normalize(elements)` | 合并相邻文本并移除空元素 |
| `h.escape(text)` | 转义可放入元素树的文本 |

### 自定义元素与平台能力

元素类型不设固定白名单。插件可以构造自定义元素：

```ts
await session.send(h('music-card', {
  title: '正在播放',
  cover: coverUrl,
}))
```

自定义元素是否能够发送由适配器决定。不同平台可以只支持 `text`，也可以支持 `markdown`、`html` 或完整 Satori 元素。

| 适配器能力 | 出站处理 |
| --- | --- |
| `text` | 处理文本，其他内容按规则降级为文本或链接 |
| `markdown` | 处理文本和 Markdown 元素 |
| `html` | 处理文本和 HTML 元素 |
| `satori` | 处理完整元素树，自定义元素可以透传 |

`session.bot.supports(type)` 查询当前 Bot 的能力。适配器负责序列化和降级，插件不应自行猜测平台格式。

### 异常标签处理

模型可能输出其他系统的标签或未闭合标签：

```text
</ACP>
你好啊，很高兴第二次遇到你
```

出站解析不能把标签原文直接发给用户，也不能因此丢弃整条消息。处理原则是：

1. 已识别的标签解析为相应元素。
2. 未识别或未闭合的标签不进入出站文本。
3. 标签之外的正常文本仍然保留。

上述示例发送的文本为「你好啊，很高兴第二次遇到你」，不包含 `</ACP>`。

## 全局配置

全局配置由主仓库的 Schema 定义，在面板中单独显示，与插件配置分开：

```ts
export const globalConfig = Schema.object({
  contextEcho: Schema.boolean().default(true),
  echoLimitPerSession: Schema.natural().default(20),
  echoMaxChars: Schema.natural().default(500),
  middlewareTimeout: Schema.natural().default(3000),
  commandPrefixes: Schema.array(
    Schema.union([Schema.string(), Schema.const(null)]),
  ).default([null, '/']),
  middlewareAfterCommand: Schema.boolean()
    .default(false)
    .experimental(),
})
```

| 配置项 | 含义 |
| --- | --- |
| `contextEcho` | 是否将插件和中间件的出站消息写回模型上下文 |
| `echoLimitPerSession` | 每个会话保留的出站回写条数上限 |
| `echoMaxChars` | 单条回写内容的字符数上限 |
| `middlewareTimeout` | 中间件超时时间，单位为毫秒 |
| `commandPrefixes` | 指令前缀列表，`null` 表示允许无前缀 |
| `middlewareAfterCommand` | 指令消费后是否继续进入中间件，属于实验性配置 |

插件通过 `ctx.root.config` 读取全局配置，通过 `ctx.config` 读取自身配置。

## 消息管线

```text
入站消息
 └─ command      匹配并执行指令
     └─ middleware  指令未消费时进入中间件
         └─ llm       模型处理、调用工具并发送
```

阶段固定为 `command`、`middleware` 和 `llm`。中间件默认位于 `middleware` 阶段，通过阶段名定位，不使用数字优先级：

```ts
ctx.middleware(async (session, next) => {
  if (!session.content) return next()
  await session.send('已处理')
}, { before: 'llm', timeout: 3000, onError: 'skip' })
```

`onError: 'skip'` 表示记录错误后继续后续处理，避免单个插件异常中断整条管线。

### 指令消费后的处理

默认情况下，指令消费消息后不再进入中间件，与 Koishi 的处理顺序一致。这样可能产生冲突：消息同时匹配某个指令和 BV 号解析中间件时，指令会先消费消息。

`middlewareAfterCommand` 用于控制指令消费后是否继续进入中间件，默认值为 `false`。该配置标记为实验性，默认值和具体适用场景仍需通过实现与测试确认。

### 消费与发送

| 写法 | 含义 |
| --- | --- |
| `await session.send(...)` | 发送一条消息；在同一处理器中可以调用多次 |
| `return` | 消费当前消息，不再向下传递；框架不会因此自动发送回复 |
| `return next()` | 交给后续处理器，最终可能进入模型阶段 |
| `await session.execute(...)` | 构造新的入站消息并重新执行完整管线 |

消费消息和发送消息是两个独立行为。`return` 只控制传递，不限制此前或此后可以调用多少次 `session.send()`。返回字符串不自动作为回复，发送必须显式调用发送接口。

### 派发过滤器

```ts
ctx.platform('qq').middleware(async (session, next) => {
  return next()
})

ctx.platform('qq', 'discord').command('ping')
ctx.guild('123456').on('message', handler)
ctx.private().on('message', handler)
```

第一阶段支持 `platform`、`selfId`、`guild`、`channel` 和 `private` 维度。过滤器只影响消息派发，不改变插件实例的生命周期。多个过滤器叠加时的组合规则仍待确认。

### 出站消息回写

插件或中间件发送的消息默认写回当前会话的模型上下文，标记为 `assistant / self-sent`。这样模型可以知道自己已经发送过哪些内容。

回写数量和内容长度由全局配置限制。单次发送可以使用 `{ echo: false }` 禁止回写。

## Satori 与适配器

元素树采用 Satori 的元素定义。平台接入时，适配器负责平台消息与元素树之间的转换，业务插件不直接处理平台专有消息段。

| 接入方案 | 特点 | 结论 |
| --- | --- | --- |
| 直接导入 Koishi 平台适配器 | 需要同时运行 Koishi 应用和两套调度 | 不采用 |
| 实现 Satori Client，对接 Satori Server | 可以复用现有协议服务 | 中期方案 |
| 移植 `@satorijs/adapter-onebot` | 适用于已有 OneBot 接入 | 当前平台方案 |

纯逻辑 Koishi 插件可以评估通过模块别名提供有限兼容；依赖 `ctx.database`、`ctx.console` 等服务的插件不在兼容目标内。

### 适配器插件

适配器是一类特殊插件，可以向宿主注册 Bot，并处理连接、断开、入站解码和出站投递。社区可以在独立仓库维护适配器，不必向主仓库提交平台实现。

```ts
import { Schema } from '@aurabot/plugin-api'

export const name = '示例平台适配器'
export const reusable = true

export const config = Schema.object({
  selfId: Schema.string().required(),
  token: Schema.string().role('secret'),
})

export function adapter(config) {
  return {
    platform: 'example',
    async connect() {},
    async disconnect() {},
    decode(raw) {},
    async deliver(target, elements) {},
  }
}
```

适配器遵循以下约定：

- 不通过 `ctx.adapter()` 注册。适配器通过独立的 `adapter()` 导出提供声明式契约。
- 适配器默认允许多实例，同一平台可以接入多个账号，共用一套处理逻辑。
- 普通插件默认单实例，只有导出 `reusable = true` 才允许多份配置。
- 连接、断开和重连由面板与宿主管理，不通过 Context 操作适配器开关。
- `sendMessage()` 和 `sendPrivateMessage()` 是 Bot 方法，不是适配器契约；适配器只实现底层 `deliver()`。
- 入站消息由 `decode()` 转换为元素树后进入消息管线，适配器不处理业务逻辑。

适配器插件化扩大了宿主需要兼容的生命周期范围。Bot 注册表、重连、去重和适配器能力边界必须在开放社区适配器前明确。

## 实施顺序

每个阶段都应有独立验收。设计中的阶段编号用于表达依赖，不表示当前完成度。

### S0：Bot 与 Session

- [ ] 实现 `Bot` 的 `id`、`platform`、`selfId`、`sendMessage`、`sendPrivateMessage` 和 `supports`。
- [ ] 现有 `api.send()` 内部迁移到 Bot，外部行为保持不变。
- [ ] 统一群聊、私聊、指令和定时任务的 Session 构造。
- [ ] 发送目标统一包含平台、Bot、会话类型和 ID。

验收：同一业务逻辑可以处理群消息、私聊和定时任务。

### S1：Context 兼容层

- [ ] 支持 `export function apply(ctx, config)`。
- [ ] 将 V1 的 `on`、`tool`、`server`、`use` 和 `dataDir` 等能力映射到 Context。
- [ ] 使用 Context 适配 V1 的 `setup(api)`。
- [ ] 在日志中标明加载的是 V1 还是 V2 接口。

验收：现有 V1 模块无需修改即可继续加载。

### S2：Schema 配置

- [ ] 引入字段类型、默认值和描述。
- [ ] 实现 `disabled`、`hidden`、`deprecated`、`experimental`、`role('secret')` 和 `required`。
- [ ] 将 V1 的 `settings` 自动转换为 Schema。
- [ ] 提供全局配置页。
- [ ] 校验失败时在面板显示错误，不静默使用默认值。
- [ ] 将自定义面板改为可选的 `dist/index.js` 前端入口。

验收：没有自定义面板的插件也能完成全部普通配置，实验性字段有明确标记。

### S3：生命周期

- [ ] 实现 `ctx.setInterval()`、`ctx.setTimeout()`、`ctx.on()` 和 `ctx.effect()`。
- [ ] 禁用或卸载时自动释放资源。
- [ ] 静态检查未纳入生命周期的 `setInterval` 和 `process.on`。

验收：插件禁用后，相关定时器和监听器不再触发。

### S4：消息元素

- [ ] 提供全局 `h` 和常用元素。
- [ ] 实现 `h.parse()`、`h.select()`、`h.stringify()` 和 `h.normalize()` 等处理函数。
- [ ] 支持自定义元素和适配器能力表。
- [ ] 实现异常标签容错。
- [ ] 建立 `session.elements` 与 `session.content` 的派生关系。
- [ ] 完成 OneBot 消息段与元素树的双向转换和降级。

验收：支持合并转发的平台可以发送 `h.forward`，不支持的平台按适配器规则降级。

### S5：消息管线

- [ ] 实现 `command → middleware → llm` 和按名称定位。
- [ ] 实现指令前缀与实验性的 `middlewareAfterCommand`。
- [ ] 实现平台、频道和私聊过滤器。
- [ ] 区分消费、继续传递和多次发送。
- [ ] 实现超时与错误隔离。
- [ ] 实现出站回写及其上限。
- [ ] 实现走完整管线且具有递归保护的 `session.execute()`。

验收：中间件发送解析结果后，模型不会重复处理已消费消息，并能读取已发送内容。

### S6：接口正式化

- [ ] 使用 `package.json.aurabot.api = 2`，保留 V1 兼容。
- [ ] 提供 `@aurabot/plugin-api` 类型包；该包承载插件接口类型，尚未发布前模板需要明确替代方案。
- [ ] 同步模板仓库和模块规范。
- [ ] 在市场标明接口版本。

验收：模板创建的 V2 插件通过类型检查和构建。

### S7：Satori 平台层

- [ ] 实现 Satori Client 的连接、鉴权和重连。
- [ ] 实现元素树与 Satori 消息的序列化。
- [ ] 使用一个非 QQ 平台验证业务插件复用。

验收：新增平台时，业务插件无需修改。

### S8：适配器插件化

- [ ] 确定 `adapter()` 的连接、断开、解码、投递和能力声明。
- [ ] 实现普通插件的 `reusable` 和适配器默认多实例。
- [ ] 支持 Bot 动态上线、下线和重连。
- [ ] 由宿主统一包装 Bot 的发送方法。
- [ ] 在市场和面板中区分普通插件与适配器插件。
- [ ] 提供独立的官方适配器参考仓库。

验收：安装外部适配器后可以接入新平台，同一平台可以运行两个账号实例，业务插件无需修改。

## 依赖关系

| 阶段 | 前置依赖 | 可并行工作 |
| --- | --- | --- |
| S0 | 无 | — |
| S1 | S0 | 与 S2 并行 |
| S2 | 无 | 与 S1 并行 |
| S3 | S1 | 与 S4 并行 |
| S4 | S0 | 与 S3 并行 |
| S5 | S1、S2、S4 | — |
| S6 | S1 至 S5 | — |
| S7 | S4 | 可与 S5 并行 |
| S8 | S0、S7 | — |

主顺序为 S0，随后并行 S1 与 S2，再并行 S3 与 S4，之后完成 S5 和 S6。S7 是独立的平台工作，S8 在 Bot 与 Satori 基础完成后实施。

## 不采用的设计

- 不在宿主中运行完整的 Koishi 应用。
- 不为所有 Koishi 插件提供二进制兼容。
- 不提供无法确定目标 Bot 的 `ctx.send()`。
- 不使用数字作为中间件阶段优先级。
- 不使用 `ctx.adapter()` 管理适配器。

## 待确认事项

- [ ] 全局配置是否允许按 Bot 覆盖。
- [ ] 元素定义是否需要独立的版本标识。
- [ ] 出站回写的默认上限是否适合长会话。
- [ ] `middlewareAfterCommand` 的默认行为和兼容策略。
- [ ] 适配器插件可以访问哪些宿主能力。
- [ ] 多个过滤器叠加时采用交集还是替换语义。
