# V1 模块 API

本文记录 AuraBot V1 的公开模块接口。V2 插件采用 `apply(ctx, config)`，不要把两套接口混写，设计见[插件接口 V2](plugin-api.md)。

V1 用户模块位于 AuraBot 数据目录的 `modules/<id>/`，主仓库升级不会覆盖该目录。完整接口文件由 AuraBot 启动时更新：

```text
%USERPROFILE%\.dsh\plugins-data\aurabot\modules\API.md
```

该文件由程序生成，不要直接修改。

## 模块入口

```js
/** @type {import('../aurabot').AurabotModule} */
export default {
  id: 'weather',
  name: '查天气',
  version: '0.1.0',
  api: 1,
  description: '查询指定城市的天气',
  defaults: { city: '北京' },
  settings: [{ key: 'city', label: '城市', type: 'text' }],
  panel: 'panel.js',
  tab: 'voice',
  setup(api) {
    api.on('message', async (msg) => {
      if (msg.text !== '天气') return false
      await api.reply(msg, '晴，20 度')
      return true
    })
    return {}
  },
}
```

| 字段 | 说明 |
| --- | --- |
| `id` | 以小写字母开头，只含小写字母、数字和 `-`，长度为 2 到 40 个字符，与目录名一致 |
| `api` | 模块接口版本，当前为 `1` |
| `settings` | 自动生成面板表单的字段描述 |
| `panel` | 自定义面板入口，可写 `'panel.js'` 或 `true` |
| `tab` | 将设置并入指定内置页面；不填写时使用独立页面 |
| `setup(api)` | 启动时调用，可以是异步函数；返回值作为模块导出 |

入口为 `index.mjs` 或 `index.js`，使用 ESM。以 `_` 或 `.` 开头的目录不会加载。目录内文件变化后，AuraBot 会创建快照并重新加载整个模块，不要修改 `.aurabot-cache/`。

## 发送消息

| 接口 | 说明 |
| --- | --- |
| `api.send(chatId, text)` | 按聊天流程拆分并发送；支持 `<voice>`、`<sticker:名字>` 和 `<poke>`，经过 `reply` 事件 |
| `api.sendText(chatId, text)` | 发送一条纯文本 |
| `api.reply(msg, text)` | 回复指定消息；群聊使用引用，私聊直接发送 |
| `api.sendImage(chatId, source)` | 发送本地路径或 URL 指向的图片 |
| `api.sendFile(chatId, path, filename?)` | 发送文件，需要先启用文件发送 |
| `api.sendVoiceFile(chatId, path)` | 将音频文件作为语音发送 |
| `api.sendSegments(chatId, segments)` | 发送 OneBot 消息段 |
| `api.onebot(action, params)` | 调用 OneBot 接口 |

`chatId` 使用 `private:<QQ号>` 或 `group:<群号>`。`api.isOwner(msg.userId)` 用于判断发言人是否为主人。

## 调用模型

| 接口 | 说明 |
| --- | --- |
| `api.ask({ system, text, maxTokens })` | 独立调用一次模型，不加入人格，不写入当前会话 |
| `api.think(prompt, { title, timeoutMs })` | 带人格和记忆生成回答，但不自动发送 |

网络请求可以使用 Node.js 的 `fetch`。应设置超时，例如 `AbortSignal.timeout(8000)`。

## 注册能力

以下注册接口返回清理函数，模块停止时也会自动清理：

| 接口 | 说明 |
| --- | --- |
| `api.on(event, fn)` | 监听事件 |
| `api.emit(event, ...args)` | 触发供其他模块监听的事件 |
| `api.tool(fn)` / `api.defineTool(definition)` | 注册模型工具 |
| `api.context(fn)` | 在每轮对话前补充上下文 |
| `api.rule(fn)` | 在每轮系统提示词中补充规则 |
| `api.command({ name, aliases, desc, run })` | 注册主人指令，返回文本发送到指令来源会话 |
| `api.every(ms, fn, name?)` / `api.later(ms, fn)` | 注册定时或延时任务 |
| `api.route(path, handler)` | 注册 `/aurabot/api/ext/<id>/<path>` 接口 |
| `api.onDispose(fn)` | 注册停止时的清理逻辑 |

配置与数据接口：

| 接口 | 说明 |
| --- | --- |
| `api.config()` / `api.setConfig(patch)` | 读取或修改框架配置 |
| `api.settings()` / `api.saveSettings()` | 读取或保存当前模块设置 |
| `api.dataDir()` | 获取当前模块的数据目录 |

## 事件

可以消费或拦截消息的事件：

| 事件 | 参数 | 返回值 |
| --- | --- | --- |
| `message` | `msg` | `true` 表示消费，不再进入后续聊天处理 |
| `poke` | 原始事件 | `true` 表示消费 |
| `reply` | `text, { chatId, userText }` | 新字符串用于改写，`null` 表示取消发送 |

`message` 在群聊回复决策之前触发，因此可以处理没有提及机器人的消息。

以下钩子可以修改生成和发送过程。返回新值表示替换，返回 `null` 表示拦截，不返回值表示保持不变：

| 事件 | 修改内容 |
| --- | --- |
| `group/decide` | 群聊是否回复及回复方式：`must`、`engaged` 或 `interject` |
| `prompt` | 提交给模型的内容 |
| `reply/items` | 拆分后的文本、语音、表情或图片条目 |
| `send` | 最终发送到 QQ 的消息段 |
| `model` | 当前会话使用的模型，同步执行 |
| `persona` | 人格文本，同步执行 |
| `rules` | 规则文本，同步执行 |

只读通知事件包括 `activity`、`onebot`、`onebot/state`、`config`、`module/start`、`module/stop` 和 `song/sung`。

消息对象的主要字段：

```js
{
  kind: 'private' | 'group',
  chatId: 'private:123' | 'group:456',
  userId,
  groupId,
  nickname,
  role,
  text,
  messageId,
  mentioned,
  replyId,
  images,
  stickers,
  records,
  forwards,
  raw,
}
```

`text` 是纯文本视图：对机器人的提及时移除，提及其他用户时保留为「@昵称」，图片表示为「[图片]」。引用消息的内容不在 `text` 中，需要使用 `replyId` 调用 `get_msg` 获取。

## 模型工具

```js
api.tool(({ chat, level, sessionId }) => {
  if (chat.kind === 'system') return []
  return api.defineTool({
    name: 'weather_now',
    description: '查询指定城市的当前天气',
    properties: {
      city: { type: 'string', description: '城市名' },
    },
    required: ['city'],
    execute: async ({ city }) => ({
      ok: true,
      message: `${city} 晴，20 度`,
    }),
  })
})
```

| `level` | 使用场景 |
| --- | --- |
| `full` | 主人私聊，具有完整工具权限 |
| `social` | 群聊和其他用户私聊 |
| `chat` | 不提供工具 |

只允许主人执行的工具，应在 `execute` 内调用 `api.core.hub.turnSendersAllOwner(sessionId)` 校验。`turnHasOwner` 只表示本轮存在主人，不能防止同一轮中的其他用户借用权限。

工具名称和描述会影响模型侧缓存，不应频繁修改。

## 面板

`settings` 支持自动生成表单：

```js
settings: [
  { key: 'city', label: '城市', type: 'text', hint: '城市名称' },
  { key: 'times', label: '每天次数', type: 'number', min: 0, max: 10 },
  { key: 'on', label: '启用', type: 'switch' },
  { key: 'mode', label: '模式', type: 'select', options: ['a', 'b'] },
  { key: 'key', label: 'API Key', type: 'password' },
]
```

自定义面板入口提供 `React`、`h`、`ui` 和 `call`，并返回组件：

```js
const { useState } = React

return function Panel({ settings, save, toast }) {
  return h(
    ui.Card,
    { title: '天气设置' },
    h('p', null, `城市：${settings.city}`),
    h(ui.Btn, {
      onClick: async () => toast((await call('/hi')).message),
    }, '测试接口'),
  )
}
```

`ui` 提供 `Card`、`Btn`、`Switch`、`Row`、`Empty` 和 `Select`。

## 替换与调用模块

用户模块与内置模块同名时，用户模块替代内置实现。面板的「已安装」页面也可以将内置模块复制到 `modules/<id>/` 后修改。

`api.use('<id>')` 获取其他模块的导出。常用导出包括：

| ID | 导出 |
| --- | --- |
| `voice` | `speak(text)` |
| `mood` | `state()`、`label()`、`nudge()`、`contextLine()` |
| `memory` | `add()`、`recall()`、`list()`、`remove()`、`contextFor()` |
| `stickers` | `match()`、`pickForReply()`、`addFromBuffer()`、`rename()` |

在需要时获取模块，不要在 `setup` 中长期保存实例，因为目标模块可能被停用或替换。`api.lazy('memory')` 可以在每次访问时解析当前实例。

## 接口稳定性

| 使用范围 | 兼容性 |
| --- | --- |
| `api.*` 公开接口 | 按 `api` 版本维护兼容 |
| `api.core`、`api.dsh`、`api.lib()` | 主仓库内部接口，升级可能变化 |

使用内部接口时，应在 README 中声明 `plugin-internals` 能力和版本要求。
