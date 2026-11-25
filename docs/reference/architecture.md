# 插件市场架构

本文说明新插件市场的代码托管、构建和索引方案。该方案与 V1 的 `module.json`、`index.json` 安装协议不同，宿主兼容工作见[主框架改造清单](/reference/host-changes)。

## 职责划分

代码、构建产物和市场索引分别维护：

- 作者仓库保存源码，并通过 GitHub Actions 构建和发布产物。
- 市场仓库保存 `package.json` 地址清单，生成并发布 `market.json`。
- 宿主读取市场索引，下载并校验产物，再加载清单指定的入口。

市场不负责托管插件源码、执行插件构建或管理运行时依赖。

## 数据流

```text
作者仓库提交
 └─ GitHub Actions：安装依赖、构建、生成压缩包、发布 Release
     └─ 回写 package.json.aurabot.artifact 中的 url、sha256 和 size

市场仓库
 registry.jsonl
 └─ 市场构建：读取清单、校验字段、生成 market.json 和 report.md
     └─ 发布索引

宿主
 market.json
 └─ 下载压缩包、校验 sha256 和 size、解压
     └─ 读取 package.json.aurabot，加载 main 指定的入口
```

## 决策记录

| 编号 | 决策 | 原因 |
| --- | --- | --- |
| D1 | 代码与索引分离，市场不托管源码 | 作者可以独立维护代码和版本 |
| D2 | 市场使用来源仓库的 owner 与包名组成 `owner/name` | 避免不同作者的同名包冲突 |
| D3 | 构建在作者仓库完成，产物发布到 Release | 市场不执行作者代码 |
| D4 | `package.json` 是清单的唯一来源，自定义字段放在 `aurabot` 中 | 保持 npm 工具链兼容，避免维护重复字段 |
| D5 | 入口由 `main` 指定，后台产物默认放在 `lib/` | 不再依赖固定的 `index.mjs` 文件名 |
| D6 | 每次全量重建索引，无效条目记入报告并跳过 | 不需要维护增量状态，单条错误不阻塞其他条目 |
| D7 | `registry.jsonl` 每行保存一个原始 GitHub 地址 | 作者可以直接提交浏览器中的文件地址 |
| D8 | 排序同时考虑仓库 star、模块数量和最近提交 | 减少多模块仓库仅凭 star 排序造成的偏差 |
| D9 | 自动收录的条目默认 `verified: false` | 收录不等于安全审核 |
| D10 | 后台源码使用 `src/*.ts`，面板源码使用 `client/*.ts` | 后台与面板共用 TypeScript 开发方式 |

## 清单格式

```json
{
  "name": "playmusic",
  "version": "1.2.0",
  "type": "module",
  "packageManager": "pnpm@11.1.2",
  "main": "lib/index.js",
  "aurabot": {
    "displayName": "语音点歌",
    "panel": "./dist/panel.js",
    "category": "social",
    "capabilities": ["network"],
    "minPluginVersion": "1.2.0",
    "api": 1,
    "requires": [],
    "artifact": {
      "url": "https://example.com/playmusic.zip",
      "sha256": "<sha256>",
      "size": 12345
    }
  }
}
```

完整字段约束以市场仓库的 `schemas/package.schema.json` 为准。`artifact` 由作者仓库的自动化流程回写，市场只读取。`panel` 缺省为 `./dist/panel.js`。

`name` 只写包名，不添加作者前缀。市场从收录地址确定 owner，再组成 `owner/name`。

## 依赖策略

默认在构建时使用 esbuild 将依赖打包进 `lib/`，安装后不再执行依赖安装。

WASM 或原生模块无法打包时，可以在首次运行时下载固定版本的运行时，但必须在 README 中写明来源和 SHA-256。市场不支持在插件安装后创建 `node_modules`。

## 索引构建

在市场仓库执行：

```bash
pnpm run market
```

该命令读取 `registry.jsonl`，生成 `dist/market.json` 和 `dist/report.md`。

- 单条失败默认只写入报告；使用 `--strict` 时才将失败作为构建错误。
- `verified.json` 中的条目标记为 `verified: true`。
- 删除收录清单中的一行后，该条目会在下次全量构建时移除。
- 作者删除 Release 或修改版本后，下一次索引构建反映最新可读取状态。

## 排序草案

排序方案尚未定稿，当前草案使用以下信息：

- 页面展示仓库 star 数。
- 排序参考 `log10(stars) / sqrt(仓库中的模块数)`。
- 辅助参考最近一次提交时间。

下载量需要在有可靠统计数据后再加入，不能使用估算值。

## 安全边界

1. 市场不执行作者代码。
2. 市场只检查字段、URL 和 SHA-256 格式。
3. 宿主下载后校验 SHA-256 和文件大小。
4. 自动收录不等于审核通过，安装界面应显示审核状态。
5. 索引只反映本次构建时可读取的发布状态，不提供撤回通知。
