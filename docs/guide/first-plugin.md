# 写第一个插件

最快的方式不是从空白开始，而是复制一个能跑的参照。

| 参照 | 适合看什么 |
| --- | --- |
| `modules/hello`（模板仓库） | 最小骨架：一个 AI 工具 |
| `modules/ping`（模板仓库） | 一个面板路由 + 面板按钮 |
| `modules/tell-owner`（示例插件） | 工具 + 面板 + 设置项 + 本地存储 |
| `modules/playmusic`（示例插件） | 搜索、下载、发语音条这类完整业务 |

## 1. 拿模板

打开 [模板仓库](https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template)，点 **Use this template**，
或者下载 zip 解压后 push 到自己的仓库。

仓库里已经有两个示例模块和一套 Actions，你要做的是改名和写业务。

## 2. 建模块目录

```bash
cp -r modules/hello modules/voice-song
```

## 3. 改清单

`modules/voice-song/package.json`：

```json
{
  "name": "voice-song",
  "version": "1.0.0",
  "description": "点歌：搜原唱、下载、抽成语音条发出去",
  "aurabot": {
    "displayName": "语音点歌",
    "category": "social",
    "capabilities": ["filesystem", "network", "process"]
  }
}
```

- `name` 只写包名，**不要加用户名前缀**
- `capabilities` 按真实用到的写：`network` 联网、`filesystem` 读写文件、`process` 起子进程（比如 ffmpeg）
- `artifact` 不用管，CI 会填

## 4. 写后台

`src/index.ts` 导出插件对象，`setup(api)` 里注册能力：

```ts
export default {
  id: 'voice-song',
  name: '语音点歌',
  version: '1.0.0',
  api: 1,
  description: '搜原唱、下载、抽成语音条',
  setup(api) {
    api.tool(({ chat }) => {
      if (!chat || chat.kind === 'system') return []
      return api.defineTool({
        name: 'voice_song_search',
        description: '按歌名搜候选',
        properties: { song: { type: 'string', description: '歌名' } },
        required: ['song'],
        execute: async (args) => ({ ok: true, message: '搜到 ' + args.song }),
      })
    })
    api.route('/status', () => ({ ok: true }))
  },
}
```

业务代码放 `src/` 的子目录（`providers/`、`utils/`），入口只做接线。

## 5. 写面板（可选）

`client/panel.ts` 必须是这一种写法：

```ts
declare const React: any
declare const h: any
declare const ui: any
declare const call: (path: string, body?: any) => Promise<any>

export default function Panel(props: { toast(msg: string, kind?: string): void }) {
  const [info, setInfo] = React.useState(null)
  React.useEffect(() => { call('/status').then(setInfo) }, [])
  return h(ui.Card, { title: '状态' }, h('pre', null, JSON.stringify(info, null, 2)))
}
```

构建时会把 `export default function` 换成 `return function`，因为宿主是用 `new Function(body)` 跑的。
写成箭头函数或 `export default Panel` 会构建失败。

## 6. 本地跑

```bash
cd modules/voice-song
npm install
npm run build    # src → lib，client → dist
npm run check    # tsc --noEmit
npm test
```

## 7. 发版

push 到默认分支。Actions 发现版本变了就打包发 Release，并把 `artifact` 回写进 `package.json`。
`lib/`、`dist/`、`node_modules/`、`.aurabot/` 都不进仓库。

## 8. 收进市场

在市场仓库的 `registry.jsonl` 加一行，就是你浏览器里那个文件的地址：

```
https://github.com/<你>/<仓库>/blob/main/modules/voice-song/package.json
```

构建会读它、校验、生成 `market.json`。链接原样保留，不会改写成别的域名。

## 常见坑

| 现象 | 原因 |
| --- | --- |
| 市场报「缺 aurabot.artifact」 | 还没跑过 CI，或者版本没变所以没重新构建 |
| 市场报「name 只写包名本身」 | 写了 `用户名/包名` 或带了 `@` |
| 面板空白 | `dist/panel.js` 不是「函数体 + return」，多半是没按 `export default function` 写 |
| 构建后找不到入口 | `main` 和 `tsconfig.outDir` 对不上（默认 `lib/index.js` 对 `lib`） |
| 运行时报 `Cannot find package` | 用了运行时依赖；改成构建期 bundle |

## 延伸阅读

- 目录和字段逐个解释：[插件结构](/dev/anatomy)
- 为什么推荐 TypeScript：[为什么用 TypeScript](/dev/why-typescript)
- 发版流水线细节：[构建与发布](/dev/build-release)
- 面板怎么写：[面板：client → dist](/dev/panel)
