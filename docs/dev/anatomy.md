# 插件结构

本页描述当前 TypeScript 模板和 V1 模块接口。V2 的 `ctx` 写法见[V2 插件接口设计](../reference/plugin-api.md)。

::: warning

V1 示例

以下代码和字段说明属于 V1，仅用于维护现有模块，对当前 V2 开发没有参考价值。V2 插件接口仍在开发中。
:::

模板使用 `package.json` 作为清单，并在构建时生成兼容市场所需的文件。

## 目录

```text
my-plugin/
├─ package.json
├─ tsconfig.json
├─ tsconfig.client.json
├─ build.mjs
├─ src/
│  └─ index.ts
├─ client/
│  └─ panel.ts
├─ test/
│  └─ *.test.mjs
├─ README.md
└─ LICENSE
```

后台源码位于 `src/`，编译到 `lib/`。自定义面板源码位于 `client/`，编译到 `dist/`。`lib/` 和 `dist/` 都是构建产物，不放在 `src/` 中，也不提交到源码仓库。

## 清单

```json
{
  "name": "playmusic",
  "version": "1.0.0",
  "description": "搜索歌曲并发送语音",
  "type": "module",
  "packageManager": "pnpm@11.1.2",
  "license": "MIT",
  "main": "lib/index.js",
  "aurabot": {
    "displayName": "语音点歌",
    "category": "fun",
    "capabilities": ["network"],
    "api": 1,
    "minPluginVersion": "1.2.0",
    "panel": "./dist/panel.js"
  }
}
```

| 字段 | 说明 |
| --- | --- |
| `name` | 包名，不包含作者名 |
| `version` | 发布新版本时必须更新 |
| `type` | 当前发布格式要求为 `module` |
| `packageManager` | 固定 pnpm 版本；仓库统一使用 pnpm |
| `main` | 实际加载的 JavaScript 入口 |
| `aurabot.displayName` | 面板显示名称 |
| `aurabot.category` | 市场分类 |
| `aurabot.capabilities` | 能力声明 |
| `aurabot.api` | AuraBot 接口版本 |
| `aurabot.panel` | 可选的面板产物路径 |
| `aurabot.artifact` | 发布流程写入的下载地址、校验值和大小 |

能力声明应与实际行为一致。常见值包括 `network`、`filesystem`、`process` 或 `exec`、`plugin-internals`；支持的完整集合以当前 schema 为准。

## 后台入口

V1 接口使用默认导出对象：

```ts
export default {
  id: 'playmusic',
  name: '语音点歌',
  version: '1.0.0',
  api: 1,
  setup(api) {
    api.tool(({ chat }) => {
      if (!chat || chat.kind === 'system') return []
      return api.defineTool({
        name: 'play_music',
        description: '按关键词搜索歌曲',
        properties: {
          keyword: { type: 'string', description: '歌名或歌手' },
        },
        required: ['keyword'],
        execute: async ({ keyword }) => ({ ok: true, keyword }),
      })
    })

    api.route('/status', () => ({ ok: true }))
  },
}
```

| 接口 | 用途 |
| --- | --- |
| `api.tool()` | 注册模型工具 |
| `api.route()` | 注册当前模块的面板路由 |
| `api.log` | 写入 AuraBot 日志 |

完整定义见宿主的 [API.md](https://github.com/aureth-labs/dsh-aurabot-qq/blob/main/src/modules/API.md)。

## 多插件仓库

```text
repo/
├─ modules/
│  ├─ ping/
│  └─ playmusic/
└─ .github/workflows/release.yml
```

每个目录维护自己的清单、版本和构建产物。市场收录清单可以指向同一仓库中的多个 `package.json`。
