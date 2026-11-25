# 插件结构

一个插件就是一个目录，目录里最小只需要两样东西：`package.json` 和编译后的入口。
我们推荐的结构是：

```
my-plugin/
├── package.json          ← 唯一的清单，市场也读它
├── tsconfig.json         ← 后台编译：src/ → lib/
├── tsconfig.client.json  ← 面板编译：client/ → dist/
├── build.mjs             ← 一次编译两边的脚本
├── src/
│   └── index.ts          ← 后台逻辑，编译成 lib/index.js
├── client/
│   └── panel.ts          ← 面板 UI，编译成 dist/panel.js
├── test/
│   └── *.test.mjs        ← 可选，node --test 跑
├── README.md
└── LICENSE
```

**`lib/` 和 `dist/` 是产物，不进 Git**，由 CI 构建后打进 zip。

## package.json：一个文件说清一切

```json
{
  "name": "playmusic",
  "version": "1.0.0",
  "description": "点歌：搜歌、放歌、发语音条",
  "type": "module",
  "license": "MIT",
  "main": "lib/index.js",
  "aurabot": {
    "displayName": "语音点歌",
    "category": "fun",
    "capabilities": ["network"],
    "api": 1,
    "minPluginVersion": "1.2.0",
    "panel": "./dist/panel.js",
    "artifact": {
      "url": "https://github.com/<owner>/<repo>/releases/download/<tag>/playmusic-1.0.0.zip",
      "sha256": "<构建时自动回写>",
      "size": 12345
    }
  }
}
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | **只写包名**，不要带用户名。市场会用仓库 owner 拼成 `owner/name` |
| `version` | 是 | 改代码就升版本，否则客户端不会更新 |
| `type` | 是 | 必须是 `module`，只支持 ESM |
| `main` | 是 | 入口，指向编译产物，通常是 `lib/index.js` |
| `aurabot.displayName` | 是 | 面板里显示的名字 |
| `aurabot.category` | 是 | 单选，写错会被构建跳过 |
| `aurabot.capabilities` | 是 | 如实声明会用到什么能力 |
| `aurabot.panel` | 否 | 面板文件，默认 `./dist/panel.js` |
| `aurabot.artifact` | 发布时 | `url` / `sha256` / `size`，由发版脚本回写 |
| `aurabot.api` | 是 | 宿主 API 版本，当前 `1` |

### capabilities

声明你实际会碰的东西，用户装的时候能看到：

| 值 | 含义 |
| --- | --- |
| `network` | 会发 HTTP 请求 |
| `filesystem` | 会读写本地文件 |
| `exec` | 会起子进程 |
| `tts` | 会合成语音 |

**如实写，别虚报也别漏报。** 它不是沙箱，只是给用户的知情提示。

## src/index.ts：插件本体

宿主加载 `main`，拿到的必须是一个**默认导出的对象**：

```ts
export default {
  id: 'owner/name',
  name: '语音点歌',
  version: '1.0.0',
  api: 1,
  panel: './dist/panel.js',
  defaults: {},
  settings: [],

  setup(api) {
    api.tool(({ chat }) => {
      if (!chat || chat.kind === 'system') return []
      return api.defineTool({
        name: 'play_music',
        description: '按关键词点一首歌并发语音条',
        properties: { keyword: { type: 'string', description: '歌名或歌手' } },
        required: ['keyword'],
        execute: async ({ keyword }) => ({ ok: true, message: `正在找 ${keyword}` }),
      })
    })

    api.route('/ping', () => ({ ok: true }))
    api.log.info('[playmusic] 已启动')
    return {}
  },
}
```

三个最常用的入口：

| API | 干什么 |
| --- | --- |
| `api.tool(fn)` | 注册一个给模型调用的工具，`fn` 按会话返回工具列表 |
| `api.route(path, fn)` | 注册面板能 `call()` 的内部路由，不走网络 |
| `api.log` | 写面板日志 |

完整接口见宿主的 [API.md](https://github.com/aureth-labs/dsh-aurabot-qq/blob/main/src/modules/API.md)。

## 一个仓库放多个插件

可以，而且推荐 —— 星数能互相带动。约定很简单：

```
repo/
├── modules/
│   ├── ping/      ← 一个插件一个目录，各有自己的 package.json
│   └── playmusic/
└── .github/workflows/release.yml
```

发版脚本逐个比 `version`，谁变了就构建谁、发谁的 Release。
市场那边是**一行一个 `package.json` 链接**，所以同一个仓库可以收录多条。

## 下一步

- 编译细节：[构建与发布](/dev/build-release)
- 面板怎么写：[面板：client → dist](/dev/panel)
