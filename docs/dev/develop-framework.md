# 框架开发环境

本文面向 AuraBot 主仓库开发者，说明本机环境、DSH 插件加载方式、热重载和 TypeScript 迁移。社区插件的目录结构与发布流程见[插件开发](/dev/why-typescript)。

文中路径来自一套 Windows 开发环境。实际开发时应替换为自己的安装目录，不要照抄用户名和盘符。

## 本机环境

| 项目 | 路径或版本 |
| --- | --- |
| DSH CLI | `D:\software_apps\DeepSeekharness\dsh\dsh.cmd` |
| DSH | `0.2.2-rc.5` |
| Node.js | `v24.8.0` |
| DSH 数据目录 | `C:\Users\shangxue\.dsh` |
| Web UI 配置档案 | `C:\Users\shangxue\.dsh\profiles\web` |
| 配置档案补丁 | `C:\Users\shangxue\.dsh\profiles\web\cordis.patch.yml` |
| 启动日志 | `C:\Users\shangxue\.dsh\logs\startup-*.log` |
| AuraBot 主仓库 | `D:\QQbots\project\github\aurabot\plugins\dsh-aurabot-qq-v2` |
| 社区插件仓库 | `D:\QQbots\project\github\aurabot\plugins\dsh-aurabot-qq-mods` |
| 已安装的社区插件 | `C:\Users\shangxue\.dsh\plugins-data\aurabot\modules\<id>` |

设置 `AURABOT_DATA_DIR` 可以更改 AuraBot 的数据目录。未设置时使用上表中的 `plugins-data` 路径。

## 启动与检查

启动 Web UI：

```powershell
cd D:\software_apps\DeepSeekharness\dsh
.\dsh.cmd web
```

端口被占用时，改用其他端口。以下示例使用日志中出现过冲突的 `8787`，实际端口以启动输出为准：

```powershell
.\dsh.cmd web --port 8788 --no-open
```

加载顺序如下：

```text
DSH CLI
 └─ 配置档案
     ├─ package.json 中的 dsh.profile.bundles
     ├─ profiles/<profile>/cordis.patch.yml
     ├─ 启动参数 --patch <file>
     └─ AuraBot
         └─ plugins-data/aurabot/modules/<id>/index.mjs
             └─ lib/index.js
```

配置按以下顺序叠加：

1. `dsh.profile.bundles` 中各组合包附带的补丁。
2. 当前配置档案的 `cordis.patch.yml`。
3. DSH 数据目录下的全局 `cordis.patch.yml`。
4. 启动命令中的各个 `--patch` 文件。

同一插件出现多次时，后面的配置按 `id` 覆盖前面的整项 `config`，不是逐字段合并。启动前可以检查叠加结果：

```powershell
.\dsh.cmd --profile web --dump-config
```

## 加载主仓库源码

开发主仓库时，不必在每次修改后重新打包安装。新建一个补丁文件，将 AuraBot 入口指向本地源码：

```yaml
- insert:
    - id: aurabot-dev
      name: 'D:/QQbots/project/github/aurabot/plugins/dsh-aurabot-qq-v2/src/host.js'
```

启动时追加该补丁：

```powershell
.\dsh.cmd web --patch D:\QQbots\project\github\aurabot\plugins\dev.patch.yml
```

`name` 使用绝对路径可以避免相对路径的解析歧义。通过包管理器链接整个仓库时，也可以执行：

```powershell
cd D:\QQbots\project\github\aurabot\plugins\dsh-aurabot-qq-v2
D:\software_apps\DeepSeekharness\dsh\dsh.cmd plugin --profile web add .
```

该命令会将仓库链接到配置档案，并把包名加入 `dsh.profile.bundles`。

## 配置主仓库 HMR

修改 AuraBot 主仓库的 HMR 监听范围，只需编辑当前配置档案的 `cordis.patch.yml`，不需要为此修改 DSH 源码。文件位置为：

```text
C:\Users\shangxue\.dsh\profiles\<profile>\cordis.patch.yml
```

在顶层数组末尾添加以下项目。它与已有的 `ui-settings-general` 等项目同级：

```yaml
- id: hmr
  disabled: false
  config:
    base: 'D:/QQbots/project/github/aurabot/plugins/dsh-aurabot-qq-v2'
    root: ['.']
    ignored: ['**/node_modules', '**/.*', 'cache', 'data', 'test']
```

`base` 应改为本机 AuraBot 主仓库的绝对路径。保存补丁后，DSH 会重新加载发生变化的插件。

### 配置档案名称

`<profile>` 是启动命令 `dsh --profile <name>` 使用的名称。通过 Web UI 启动时，本机默认使用 `web`，对应 `~/.dsh/profiles/web/cordis.patch.yml`。不要把补丁写入另一个配置档案，否则当前实例不会读取它。

### 必须覆盖 `root`

Web UI 的组合包已经注册 `hmr`，但默认配置为 `root: []`。该值只监听配置文件，不监听源码。必须将其显式覆盖为 `root: ['.']`，并通过 `base` 指向主仓库，源码修改才会进入监听范围。

也可以只写一个绝对路径：

```yaml
- id: hmr
  disabled: false
  config:
    root: ['D:/QQbots/project/github/aurabot/plugins/dsh-aurabot-qq-v2']
    ignored: ['**/node_modules', '**/.*', 'cache', 'data', 'test']
```

两种写法都用于监听源码。`base` 配合 `root: ['.']` 更便于区分仓库位置与监听范围。

### 监听参数

| 字段 | 作用 |
| --- | --- |
| `base` | 解析相对 `root` 的基准目录 |
| `root` | 监听的目录；`[]` 表示不监听源码 |
| `ignored` | 不参与监听的目录或文件模式 |
| `debounce` | 合并连续文件事件的等待时间，默认 `100` 毫秒 |

忽略规则应保留 `node_modules`、数据目录和测试产物，避免无关文件触发重载。如果规则误排除了 `src`，修改源码同样不会生效。

HMR 重新加载插件时，会先卸载旧实例并执行清理函数，再加载新模块并调用 `apply`。生效需要满足三个条件：

1. 插件配置具有稳定的 `id`。
2. 修改的文件属于 DSH 加载器已经加载的模块图。
3. 文件不是由 AuraBot 自行绕过 DSH 加载器导入的。

社区插件由 AuraBot 自行扫描和导入，因此不使用这套 HMR 机制。

## DSH 插件写法

DSH 插件通过 `apply` 注册能力，并在 Cordis 生命周期内管理资源：

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'example'

export function apply(ctx: Context) {
  ctx.effect(() => {
    const timer = setInterval(() => {
      ctx.logger.debug('running')
    }, 5000)

    return () => clearInterval(timer)
  })
}
```

插件卸载时，Cordis 会回收已注册的监听器和效果。自行建立的连接、文件句柄或定时器应在 `ctx.effect()` 的清理函数中释放。依赖其他服务时，通过 `inject` 声明。

配置使用 Schemastery 描述：

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

export interface Config {
  greeting: string
  maxRetries: number
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('你好'),
  maxRetries: Schema.number().default(3),
})

export function apply(ctx: Context, config: Config) {
  ctx.logger.info('%s', config.greeting)
}
```

这里的 `Config` 是符合 Standard Schema 接口的配置描述，不是普通对象。

## TypeScript 加载

Node.js 24 可以加载使用可擦除语法的 TypeScript 文件，但 `enum`、命名空间、构造函数参数属性等语法需要额外转译。该方式适合临时调试，不能替代发布构建。

正式开发可以采用两种方式：

- 由 DSH 加载器配合 TypeScript 运行环境加载源码。
- 将 TypeScript 编译到 `lib/`，由发布入口加载 JavaScript。

发布包应包含编译后的 JavaScript，不能假定用户环境支持直接运行 TypeScript。

## 社区插件重载

AuraBot 为社区插件实现了独立的文件监听和重载流程：

1. 每 3 秒扫描一次社区插件目录。
2. 根据目录内文件的修改时间计算版本标识。
3. 版本变化后停止旧实例。
4. 将插件复制到 `.aurabot-cache/<版本标识>/`，再导入新快照。

快照路径随版本变化，因此不会继续命中旧文件的 Node.js 模块缓存。入口仍为插件根目录的 `index.mjs` 或 `index.js`。

修改 TypeScript 源码后行为没有变化，通常不是文件监听失效，而是入口加载的构建产物没有更新。

| 现象 | 检查位置 | 处理方法 |
| --- | --- | --- |
| 修改 `src/` 后行为不变 | `lib/` 是否重新生成 | 执行插件项目的构建命令 |
| 已构建但仍运行旧代码 | 修改目录与 AuraBot 实际读取目录是否一致 | 将插件安装到实际数据目录，或在面板重新加载 |
| 重载后状态仍是旧值 | 模块外缓存、外部进程和未清理的定时器 | 在卸载逻辑中释放资源，避免在模块外保存运行状态 |

### TypeScript 源码重载方案

现有重载机制只会重新导入产物。要让修改 `src/*.ts` 后直接生效，需要增加源码构建或加载环节。

| 方案 | 实现方式 | 适用范围 |
| --- | --- | --- |
| 宿主按需转译 | 在生成快照时使用 esbuild 将 `src/index.ts` 转为 ESM | 计划中的默认开发体验 |
| Node.js 类型剥离 | 直接导入 `src/index.ts` | 仅限可擦除语法的临时调试 |
| 插件监听构建 | 在插件项目运行 `tsc --watch`，持续更新 `lib/` | 当前版本即可使用 |

按需转译应接入现有快照流程，并扩展入口识别。它只负责生成可执行代码，不代替 `tsc --noEmit` 类型检查。该方案尚未落地前，可使用监听构建。

例如，插件项目的 `package.json` 已定义 `build` 为 `tsc -p tsconfig.build.json` 时，可以添加：

```json
{
  "scripts": {
    "dev": "tsc -p tsconfig.build.json --watch --preserveWatchOutput"
  }
}
```

在插件目录运行：

```powershell
pnpm dev
```

该进程持续更新 `lib/`，AuraBot 的目录扫描再加载新产物。停止监听进程不会撤销已经生成的文件。

## 主仓库 TypeScript 迁移

主仓库的 TypeScript 重写按可独立验证的顺序进行：

1. 添加 `tsconfig.json`，`module` 和 `moduleResolution` 使用 `NodeNext`，先通过 `allowJs` 与 `checkJs` 检查现有代码。
2. 按 `core`、`tools`、`onebot`、`features`、`host` 的顺序迁移，每次只处理一个目录。
3. 设置 `rootDir: src` 和 `outDir: lib`，将发布入口切换到 `lib/host.js`，并把 `lib/` 加入发布文件清单。
4. 开启严格类型检查，补齐公开接口类型。

迁移期间保留 JavaScript 与 TypeScript 混合构建能力。发布包必须包含 `lib/`；从源码仓库直接安装时，还需要明确构建步骤，避免安装后缺少入口。

```powershell
pnpm check
pnpm build
```

AuraBot 主仓库和插件仓库统一使用 pnpm，并在 `package.json` 中通过 `packageManager` 固定版本。DSH 源码也使用 pnpm，开发时不要混用 npm、Yarn 或 Bun。

## 故障排查

| 现象 | 可能原因 | 处理方法 |
| --- | --- | --- |
| 插件一直不加载 | `inject` 声明的服务尚未提供 | 检查依赖服务与启动日志 |
| 启动时报 `EADDRINUSE` | Web UI 端口已被占用 | 更换端口或停止旧进程 |
| 修改主仓库源码没有反应 | `root` 仍为 `[]`，或 `src` 被忽略 | 检查当前配置档案中的 `hmr` 覆盖项 |
| 修改配置档案没有反应 | 补丁写入了其他配置档案 | 核对启动命令中的 `<profile>` |
| 安装发布包后找不到入口 | 发布包没有 `lib/`，或入口字段未更新 | 检查构建结果和发布文件清单 |
| 社区插件修改后仍运行旧代码 | 未构建，或修改了非加载目录 | 按社区插件重载一节逐项检查 |
