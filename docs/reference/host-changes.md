# 主框架改造清单

本文列出新插件市场对主仓库的兼容要求。新的 `package.json`、`lib/` 与 `market.json` 格式应与 V1 的 `module.json`、`index.mjs` 和 `index.json` 并存，避免现有模块失效。

插件上下文、配置和消息管线的改造见[插件接口 V2](/reference/plugin-api)。本页各项仍属于改造计划，不表示当前版本已经支持。

## 清单读取

| 项目 | V1 | 目标 |
| --- | --- | --- |
| 清单 | `modules/<id>/module.json` | `modules/<id>/package.json` 中的 `aurabot` |
| 旧格式 | 必须存在 | 缺少新格式时回退读取 |

- [ ] 实现统一的 `readManifest(dir)`，优先读取 `package.json.aurabot`，否则读取 `module.json`。
- [ ] 面板、市场页和安装器共用该函数。
- [ ] 新格式缺少 `aurabot.artifact` 时返回明确错误。

验收标准：只有 `package.json` 的模块可以正常显示详情、能力声明并参与安装。

### 字段映射

| `module.json` | `package.json` | 说明 |
| --- | --- | --- |
| `id` | `name` | 市场条目的 owner 单独保存 |
| — | `owner` | 来自收录地址 |
| `name` | `aurabot.displayName` | 缺省时回退到包名 |
| `version` | `version` | 语义化版本 |
| `description` | `description` | 功能说明 |
| `category` | `aurabot.category` | 单选分类 |
| `platforms` | `aurabot.platforms` | 缺省为 `["qq"]` |
| `capabilities` | `aurabot.capabilities` | 能力声明 |
| `minPluginVersion` | `aurabot.minPluginVersion` | 最低宿主版本 |
| `api` | `aurabot.api` | 接口版本 |
| `requires` | `aurabot.requires` | 模块依赖 |
| `panel` | `aurabot.panel` | 缺省为 `./dist/panel.js` |
| `build.out` | 不再需要 | 构建由作者仓库完成 |

## 入口解析

| 项目 | V1 | 目标 |
| --- | --- | --- |
| 入口 | 根目录的 `index.mjs` 或 `index.js` | `package.json` 的 `main`，默认 `lib/index.js` |
| 模块格式 | 不统一检查 | 只支持 ESM，拒绝 CommonJS 并给出提示 |

- [ ] `entryOf(dir)` 优先读取 `main`，找不到时回退到旧入口。
- [ ] 加载错误包含实际读取的文件路径。
- [ ] 同步修改打包和冒烟测试中的入口判断。

验收标准：入口位于 `main.js` 或 `dist/entry.js` 时可以加载，不再强制要求 `index.mjs`。

## 模块标识

| 项目 | V1 | 目标 |
| --- | --- | --- |
| `package.json.name` | 平铺包名 | 仍由作者填写平铺包名 |
| 对外 ID | 与目录名相同 | 市场按 owner 和包名组成 `owner/name` |
| 同名模块 | 冲突 | 不同作者的同名模块可以共存 |
| 安装目录 | `modules/<id>/` | `modules/<scope>/<name>/` |

- [ ] 配置键、面板路由和日志统一使用完整的 `owner/name`。
- [ ] `requires` 先解析内置模块，再解析完整 ID。
- [ ] V1 的平铺 ID 保持不变。
- [ ] 市场在同一 scope 内处理重名，宿主使用最终分配的 ID。

验收标准：`a/music` 和 `b/music` 可以同时安装、启用，并分别保存配置。

## 安装与校验

| 项目 | V1 | 目标 |
| --- | --- | --- |
| 索引 | `registry` 分支的 `index.json` | 一个或多个 `market.json` |
| 下载地址 | `assetsBase`、tag 和文件名拼接 | 条目直接提供 `artifact.url` |
| 完整性 | 无统一校验 | 校验 `sha256` 和 `size` |

- [ ] 下载后先计算 SHA-256 并核对大小，不一致时保留旧版本。
- [ ] 解压时拒绝绝对路径和包含 `..` 的路径。
- [ ] 安装失败时回滚，不能留下不完整的模块目录。

验收标准：修改压缩包后安装会被拒绝，旧版本仍可使用。

## 版本与更新

- [ ] 使用语义化版本比较，不按字符串比较。
- [ ] `minPluginVersion` 不满足时，在安装前提示所需的最低版本。
- [ ] 更新检查只读取 `market.json`，不直接访问作者仓库。
- [ ] 条目从市场消失后保留本地副本，但不再提示更新。

## 多市场源

- [ ] 增加 `market.sources: string[]`，官方源排在第一位。
- [ ] 同一 ID 按源的顺序处理，冲突时记录来源。
- [ ] 每个源独立容错，一个源不可用时不影响其他源。

验收标准：配置两个源后均可检索；停用其中一个源不影响另一个。

## 来源展示

- [ ] 详情页显示 `owner/repo`。
- [ ] `verified: false` 显示「未审核」，安装前要求确认。
- [ ] 保留并展示 `capabilities`。

## 待确认事项

1. 是否校验 GitHub provenance 或 attestation；第一阶段可以只校验 SHA-256。
2. 模块 ID 变化后，是否迁移 `data/<id>/`。
3. V1 的 `module.json.panel` 回退规则如何长期保留。

已确定采用 ESM、默认面板路径 `./dist/panel.js` 和安装目录 `modules/<scope>/<name>/`。

## 仓库职责

- 市场仓库负责收录清单和索引生成。
- 模板仓库负责构建流程和 Release 示例。
- 市场仓库的 `verified.json` 负责审核标记。
- 主仓库负责加载、安装、校验和兼容旧模块。
