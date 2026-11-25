# 写第一个插件

本例使用模板仓库创建一个可构建的 V1 模块。只用于本地实验时，也可以先阅读[快速试用模块](/dev/module-quickstart)。

## 创建目录

从[模板仓库](https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template)创建自己的仓库，再复制最小示例：

```bash
cp -r modules/hello modules/voice-song
```

## 修改清单

编辑 `modules/voice-song/package.json`：

```json
{
  "name": "voice-song",
  "version": "1.0.0",
  "description": "按歌名搜索候选歌曲",
  "type": "module",
  "main": "lib/index.js",
  "aurabot": {
    "displayName": "语音点歌",
    "category": "social",
    "capabilities": ["network"]
  }
}
```

`name` 只写包名。需要文件或外部进程时，再声明相应能力，不要预先声明未使用的权限。

## 编写入口

```ts
export default {
  id: 'voice-song',
  name: '语音点歌',
  version: '1.0.0',
  api: 1,
  setup(api) {
    api.tool(({ chat }) => {
      if (!chat || chat.kind === 'system') return []
      return api.defineTool({
        name: 'voice_song_search',
        description: '按歌名搜索候选歌曲',
        properties: {
          song: { type: 'string', description: '歌名' },
        },
        required: ['song'],
        execute: async ({ song }) => ({ ok: true, song }),
      })
    })

    api.route('/status', () => ({ ok: true }))
  },
}
```

业务代码按职责放入 `src/providers/`、`src/utils/` 等目录，入口文件只负责注册和组装。

## 本地验证

以模板声明的包管理器为准。npm 模板通常执行：

```bash
npm install
npm run check
npm run build
npm test
```

将构建结果放入 AuraBot 实际加载的模块目录，使用模拟测试或试运行验证。只修改源码而不构建，运行时不会获得新逻辑。

## 可选面板

面板入口必须采用 `export default function Panel(...)` 形式，具体原因和示例见[编写面板](/dev/panel)。

## 发布与收录

更新版本后推送源码，由仓库的 CI 构建并发布 Release。随后在市场收录清单中添加该插件 `package.json` 的 GitHub 地址：

```text
https://github.com/<owner>/<repo>/blob/main/modules/voice-song/package.json
```

市场生成索引后，面板才能检索到该插件。

## 常见错误

| 现象 | 检查项 |
| --- | --- |
| 市场提示缺少 `artifact` | CI 是否已发布该版本 |
| 包名校验失败 | `name` 是否包含作者名或 `@` |
| 面板空白 | 面板产物格式和浏览器控制台 |
| 找不到入口 | `main` 与实际构建路径 |
| 运行时缺少依赖 | 是否在构建期打包运行时依赖 |
