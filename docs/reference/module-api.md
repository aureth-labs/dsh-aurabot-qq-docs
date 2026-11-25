# 模块 API 速查

模块是 AuraBot 的最小功能单位：表情包、语音、心情、记忆、空间、B 站、翻唱、生图都是模块。
你写的模块放在数据目录 `modules/<id>/`，升级不覆盖，保存即生效。

完整版一直在你的数据目录里：`%USERPROFILE%\.dsh\plugins-data\aurabot\modules\API.md`（插件每次启动更新，**别改它**）。

## 模块长什么样

```js
/** @type {import('../aurabot').AurabotModule} */
export default {
  id: 'weather',
  name: '查天气',
  version: '0.1.0',
  api: 1,
  description: '一句话说明',
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
| `id` | 小写字母开头，小写字母 / 数字 / `-`，2 到 40 字，**和文件夹同名** |
| `api` | 按哪一版扩展接口写的，现在是 `1` |
| `settings` | 面板自动生成表单 |
| `panel` | 自定义面板，写 `'panel.js'` 或 `true` |
| `tab` | 把这个模块的设置并进哪个内置页（`voice` `song` `bili` `mood` …），不写就独占一页 |
| `setup(api)` | 启动时调一次，可以 async；返回值就是这个模块的**导出** |

入口文件叫 `index.mjs`（或 `index.js`，ESM）。文件夹以 `_` 或 `.` 开头的不加载。
模块可以拆多个文件，任何文件改动都会在几秒内整体重载——插件先把文件夹快照到 `modules/<id>/.aurabot-cache/` 再加载，**这个目录别动**。

## 发消息

| 接口 | 作用 |
| --- | --- |
| `api.send(chatId, text)` | 用她平时的方式发：会拆条，支持 `<voice>` `<sticker:名字>` `<poke>`，会经过 `reply` 事件 |
| `api.sendText(chatId, text)` | 原样发一条文字 |
| `api.reply(msg, text)` | 回某一条：群里以引用回复发出，私聊直接发 |
| `api.sendImage(chatId, 路径或网址)` | 发图 |
| `api.sendFile(chatId, 路径, 文件名?)` | 当文件发（要先开「发文件」） |
| `api.sendVoiceFile(chatId, 音频文件)` | 把音频文件当语音条发 |
| `api.sendSegments(chatId, [...])` | 发任意 OneBot 消息段 |
| `api.onebot(action, params)` | 直接调 OneBot 接口 |

`chatId` 是 `private:QQ号` 或 `group:群号`。判断主人用 `api.isOwner(msg.userId)`。

## 用模型

| 接口 | 作用 |
| --- | --- |
| `api.ask({ system, text, maxTokens })` | 问一次模型，不带人格、不进会话 |
| `api.think(prompt, { title, timeoutMs })` | 让**她**（带人格与记忆）想一想，返回回答但不发送 |

联网直接用 Node 的 `fetch`，记得 `AbortSignal.timeout(8000)`。

## 往插件里加东西

都返回一个「撤掉」函数，模块停下时自动撤。

| 接口 | 作用 |
| --- | --- |
| `api.on(事件, fn)` | 听事件 |
| `api.emit(事件, ...)` | 给别的模块发事件 |
| `api.tool(fn)` / `api.defineTool({...})` | 给她加 AI 工具 |
| `api.context(fn)` | 每轮聊天前塞进上下文的话 |
| `api.rule(fn)` | 补一条规则（进系统提示词，每轮重新调用） |
| `api.command({ name, aliases, desc, run })` | 主人发 `/名字` 时触发，返回的文字回到发命令的那个聊天 |
| `api.every(ms, fn, 名字?)` / `api.later(ms, fn)` | 定时 / 延时 |
| `api.route('/路径', handler)` | 加一个 `/aurabot/api/ext/<id>/路径` 接口 |
| `api.onDispose(fn)` | 收尾 |

配置相关：`api.config()` 读整份配置，`api.setConfig(patch)` 改；`api.settings()` / `api.saveSettings()` 管本模块设置；`api.dataDir()` 拿本模块数据目录。

## 事件

**能接管消息的**：

| 事件 | 参数 | 返回 |
| --- | --- | --- |
| `message` | `msg` | `true` = 我接管，她不再处理 |
| `poke` | 原始事件 | `true` = 我接管 |
| `reply` | `text, { chatId, userText }` | 新文字 = 改写，`null` = 这次不发 |

`message` 在「回不回」的决定**之前**就到，所以没人 @ 她的消息你也能接。

**改她怎么想、怎么说的**（返回新值就替换，`null` 拦下，不返回就不改）：

| 事件 | 改什么 |
| --- | --- |
| `group/decide` | 群里这条回不回、怎么回（`must` / `engaged` / `interject`） |
| `prompt` | 交给她的内容，可以加背景、去图片 |
| `reply/items` | 拆好的回复条目（文字 / 语音 / 表情 / 图片） |
| `send` | 最终发给 QQ 的消息段 |
| `model` | 这个聊天用哪个模型（同步） |
| `persona` | 她的人格全文（同步） |
| `rules` | 她的规则全文（同步） |

**只看不改的**：`activity`、`onebot`、`onebot/state`、`config`、`module/start`、`module/stop`、`song/sung`。

`msg` 的关键字段：

```js
{
  kind: 'private' | 'group',
  chatId: 'private:123' | 'group:456',
  userId, groupId, nickname, role,
  text, messageId, mentioned, replyId,
  images, stickers, records, forwards, raw,
}
```

`text` 是纯文字：@ 她的那段去掉了，@ 别人写成「@昵称」，图片写成「[图片]」。**引用的内容不在里面**，要的话用 `replyId` 去 `get_msg` 拿。

## 工具

```js
api.tool(({ chat, level, sessionId }) => {
  if (chat.kind === 'system') return []
  return api.defineTool({
    name: 'weather_now',
    description: '查某个城市现在的天气。别人问天气时用。',
    properties: { city: { type: 'string', description: '城市名' } },
    required: ['city'],
    execute: async ({ city }) => ({ ok: true, message: `${city} 晴 20 度` }),
  })
})
```

| 参数 | 含义 |
| --- | --- |
| `level: 'full'` | 主人私聊，完整权限 |
| `level: 'social'` | 群聊和别人私聊 |
| `level: 'chat'` | 没有工具 |

只想给主人用：在 `execute` 里判断 `api.core.hub.turnSendersAllOwner(sessionId)`。
**别用 `turnHasOwner`**——它只表示本轮「有人是主人」，主人和群友同轮时别人能借权。

工具的名字和描述尽量别常改，改一次模型侧的缓存就失效一次。

## 面板

写了 `settings` 就自动生成表单：

```js
settings: [
  { key: 'city', label: '城市', type: 'text', hint: '小字说明' },
  { key: 'times', label: '每天几次', type: 'number', min: 0, max: 10 },
  { key: 'on', label: '开关', type: 'switch' },
  { key: 'mode', label: '模式', type: 'select', options: ['a', 'b'] },
  { key: 'key', label: 'API Key', type: 'password' },
]
```

自己画面板就放 `panel.js`，拿 `React` / `h` / `ui` / `call`，最后 `return` 一个组件：

```js
const { useState } = React
return function Panel({ settings, save, toast }) {
  return h(ui.Card, { title: '我的面板' },
    h('p', null, '城市：' + settings.city),
    h(ui.Btn, { onClick: async () => toast((await call('/hi')).message) }, '调一下接口'))
}
```

`ui` 里有 `Card` `Btn` `Switch` `Row` `Empty` `Select`。

## 替换内置模块

写一个**同名**的模块，内置的就不加载了。面板「已安装」页也能对内置模块点「复制一份来改」，源码会复制到 `modules/<id>/`。

内置模块导出的东西可以 `api.use('voice')` 拿到，比如：

| id | 导出 |
| --- | --- |
| `voice` | `speak(文字)` |
| `mood` | `state()` `label()` `nudge()` `contextLine()` |
| `memory` | `add()` `recall()` `list()` `remove()` `contextFor()` |
| `stickers` | `match()` `pickForReply()` `addFromBuffer()` `rename()` |

用的时候再拿，别在 `setup` 里存着——对方可能被关掉或替换。懒人写法是 `api.lazy('memory')`，每次访问都去找当时在跑的那个。

## 升级会不会坏

| 你用的东西 | 稳定性 |
| --- | --- |
| `api.*` 公开接口 | 按 `api` 版本走，升级保持兼容 |
| `api.core` / `api.dsh` / `api.lib()` | 插件内部接口，**升级后可能变** |

用了 `plugin-internals` 就在 README 里写清楚，别让用户以为它永远不坏。