# 如何开发我们的框架

这页解决三件事：**本机怎么起一套能改代码的环境**、**DSH 下 TypeScript 插件的正确写法**、
**改完怎么让它立刻生效**。主框架 TypeScript 化的迁移顺序也放在最后。

下面的路径和版本都是本机实测结果，换机器时按自己的安装位置替换。

## 本机现状

| 东西 | 位置 / 版本 |
| --- | --- |
| DSH CLI 安装目录 | `D:\software_apps\DeepSeekharness\dsh`（入口 `dsh.cmd`） |
| DSH 版本 | `0.2.2-rc.5` |
| Node | `v24.8.0` |
| `$DSH_HOME` | `C:\Users\shangxue\.dsh` |
| WebUI profile | `C:\Users\shangxue\.dsh\profiles\web` |
| profile 清单 | `profiles/web/package.json`（`dsh.profile.bundles`） |
| 用户 patch 层 | `profiles/web/cordis.patch.yml` |
| 启动日志 | `C:\Users\shangxue\.dsh\logs\startup-*.log` |
| 主框架仓库 | `D:\QQbots\project\github\aurabot\plugins\dsh-aurabot-qq-v2` |
| 社区插件仓库 | `D:\QQbots\project\github\aurabot\plugins\dsh-aurabot-qq-mods` |
| 已安装的社区插件 | `C:\Users\shangxue\.dsh\plugins-data\aurabot\modules\<id>\` |

社区插件目录可以用环境变量 `AURABOT_DATA_DIR` 改到别处；没设时就是上表最后一行。

## 谁加载谁

```text
dsh CLI
 └─ profile（profiles/web）
     ├─ bundles：@deepseek-ai/dsh-base → @deepseek-ai/dsh-web-app
     ├─ profiles/web/cordis.patch.yml        你的覆盖层
     └─ --patch <file>                        启动时再叠一层（可重复）
         └─ 插件行：id + name + config
             └─ AuraBot 宿主（src/host.js）
                 └─ plugins-data/aurabot/modules/<id>/index.mjs
                     └─ lib/index.js               编译产物
```

配置按层叠，**后面的层按行覆盖前面的层**，而且 patch 会替换整行 `config`，不是逐键合并。
顺序是：

1. `dsh.profile.bundles` 里各个组合包的 patch，按列表顺序
2. profile 自己的 `cordis.patch.yml`
3. `$DSH_HOME/cordis.patch.yml`（本机全局，当前不存在）
4. 每个 `--patch <path>`，按命令行顺序

先看叠完长什么样，不用启动：

```powershell
cd D:\software_apps\DeepSeekharness\dsh
.\dsh.cmd --profile web --dump-config
```

## 起本地工作区

### 日常启动

```powershell
cd D:\software_apps\DeepSeekharness\dsh
.\dsh.cmd web
```

端口被占（日志里 `EADDRINUSE: 127.0.0.1:8787`）就换一个：

```powershell
.\dsh.cmd web --port 8788 --no-open
```

### 把本地源码挂进 profile

改 DSH 插件时不要反复打包安装，写一个 overlay 直接指源码绝对路径：

```yaml
# dev.patch.yml
- insert:
    - id: aurabot-dev
      name: 'D:/QQbots/project/github/aurabot/plugins/dsh-aurabot-qq-v2/src/host.js'
```

```powershell
.\dsh.cmd web --patch D:\QQbots\project\github\aurabot\plugins\dev.patch.yml
```

插件行的 `name` 用绝对路径最稳。相对路径是按**配置文件所在目录**解析的，
而 patch 不会改变 loader 的 profile 基准目录，混用很容易找错文件。

### 按包安装（AuraBot 本体）

组合包声明了 `dsh.bundle` 时，走 `dsh plugin` 装进 profile：

```powershell
cd D:\QQbots\project\github\aurabot\plugins\dsh-aurabot-qq-v2
D:\software_apps\DeepSeekharness\dsh\dsh.cmd plugin --profile web add .
```

它会用 pnpm 把 checkout 链接进 profile，并把包名追加到 `dsh.profile.bundles`。
卸载是 `... remove dsh-aurabot-qq`。

## 在 DSH 下写 TypeScript 插件

官方口径就一句话：**插件是一个导出 `apply` 的模块，能力全部挂在 `ctx` 上。**

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-plugin'

export function apply(ctx: Context) {
  ctx.effect(() => {
    const timer = setInterval(() => {}, 5000)
    return () => clearInterval(timer)
  })
}
```

几条硬规矩：

- 通过 `ctx` 注册的东西（事件、工具、定时器）在插件卸载时自动回收；自己开的连接用 `ctx.effect()` 返回清理函数
- 需要别的服务就声明 `inject`，框架会等依赖就绪再调用 `apply`
- 配置用 Schemastery，**不要导出普通对象**，否则不满足 Cordis 的 Standard Schema 接口

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

export const name = 'my-plugin'

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

插件还能写成对象形式或 `Service` 类形式，但普通功能插件用函数形式就够了。

## 热重载

### DSH 侧：`@deepseek-ai/dsh-hmr`

WebUI 的 base 组合包已经挂了 `hmr` 行，但默认是：

```yaml
- id: hmr
  name: '@deepseek-ai/dsh-hmr'
  disabled: !!js '!ctx.get(''profileContext'')'
  config:
    root: []
```

`root: []` 表示**只监听配置文件，不监听源码**。要改源码即时生效，在自己的 patch 层里覆盖它：

```yaml
- id: hmr
  disabled: false
  config:
    base: 'D:/QQbots/project/github/aurabot/plugins/dsh-aurabot-qq-v2'
    root: ['.']
    ignored: ['**/node_modules', '**/.*', 'cache', 'data', 'test']
```

| 字段 | 默认 | 含义 |
| --- | --- | --- |
| `base` | Context 的 base URL（profile 目录） | `root` 的解析基准 |
| `root` | `["."]` | 监听哪些目录；`[]` 只监听配置 |
| `ignored` | `node_modules` / 点目录 / `cache` / `data` | 排除路径 |
| `debounce` | `100` | 合并文件事件的毫秒数 |

保存文件后它做的顺序是：**卸载旧实例（回卷所有 effect）→ 重新 import → 再跑一遍 `apply`**。
改 `cordis.patch.yml` 也会触发同样的流程，按 `id` 只重挂变化的那几行。

三个前提，缺一个就不生效：

1. 插件行有稳定的 `id`。没有 `id` 的行每次读配置都会生成新 id，任何编辑都被当成「删了再加」
2. 文件在 ESM / CJS 模块图里。hmr 只替换 loader 加载过的模块
3. 代码不是被宿主自己 `require` / `import` 进来的——那种模块 hmr 看不到

第 3 条正好解释 AuraBot 社区插件为什么不吃这一套，见下一节。

### TypeScript 能不能直接跑

本机 Node `v24.8.0` 实测可以直接 `import()` 一个 `.ts` 文件，靠的是内置类型剥离。
但它只吃**可擦除语法**：`enum`、`namespace`、构造函数参数属性、装饰器元数据都会报错。

所以分两种场景：

- 临时调试、语法简单：`.ts` 可以直挂，不用构建
- 正式开发、要用完整 TS 语法：编译到 `lib/`，或者用 `node --import tsx` 跑

发布包一律发编译后的 JS，不要指望用户的 Node 版本和语法都刚好合适。

### AuraBot 社区插件：已经有一套自己的热重载

社区插件不走 Cordis loader，hmr 管不到。AuraBot 在 `src/core/modules.js` 里自己做了一套：

1. 每 3 秒扫一次 `plugins-data/aurabot/modules/`（`setInterval(sync, 3000)`）
2. 用整个模块目录里所有文件的 mtime 算一个「版本戳」
3. 戳变了就停掉旧实例，把整个目录快照到 `.aurabot-cache/<戳>/`，再从快照 `import`

快照路径每次不同，绕开了 Node 的模块缓存，所以**只要文件变了，内存里就是新代码**。
入口只认根目录的 `index.mjs` 或 `index.js`。

那为什么改完 tell-owner，在终端里触发还是旧行为？按代码路径排，最常见就三种：

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 改了 `src/*.ts`，行为没变 | 没跑 `npm run build`。宿主加载的是 `lib/index.js`，`src` 变了但产物没变 | `npm run build`，3 秒内自动重载 |
| 构建了但仍是旧的 | 改的不是宿主加载的那个目录（比如改的是仓库里的 `modules/`，宿主读的是 `plugins-data/`） | 用面板「重新加载」，或把产物落到宿主目录 |
| 面板显示已重载，调用还是旧 | 插件把状态缓存在模块外（全局变量、定时器闭包、外部进程） | 清理自己的缓存；状态放 `ctx` 或数据目录 |

面板上有「重新加载」按钮，走的是 `reload(id)`：停实例、清错误、重扫、再启动。
日志里会打印「模块「xxx」文件改了，重新加载」，没有这行就说明版本戳没变。

### 让 TypeScript 源码也吃上 HMR

社区插件也是 TypeScript 写的，凭什么只有宿主能吃 HMR？问题出在**加载的是产物**：
宿主 import 的是 `lib/index.js`，改 `src` 只会让版本戳变、重载发生，但重新 import 的仍是旧 JS。

DSH 能直接热重载 TS，是因为它的 loader 把 `.ts` 当模块本身加载（tsx / Node 类型剥离）。
照这个思路，社区插件有三条路：

| 方案 | 做法 | 代价 |
| --- | --- | --- |
| A. 宿主按需转译 | 扫到 `src/index.ts` 时，用 esbuild 转成 ESM 写进 `.aurabot-cache/<戳>/index.mjs` 再 import | 宿主多一个 esbuild 依赖 |
| B. Node 类型剥离 | 直接 `import('…/src/index.ts')`，靠 Node 24 内置剥离 | 只支持可擦除语法，`enum` / 装饰器不行 |
| C. 插件侧 `tsc --watch` | 开发时常驻 `tsc -w`，产物持续写 `lib/`，现有 3 秒扫描自动接住 | 每个插件多一个进程，零宿主改动 |

推荐 **A 作为默认**（体验对齐 DSH），C 作为兜底（今天就能用），B 只用于临时调试。

A 的落点很具体：`importUser()` 现在把整个目录复制到快照再 import，把入口那一份换成
「转译后的 ESM」即可，版本戳和重载流程都不用动；同时把入口识别从 `index.mjs` / `index.js`
扩到 `src/index.ts`。

在 A 落地前，还有两个限制要知道：

- 这套只保证**代码**是新的，不做类型检查。类型错误要自己跑 `npm run check`
- 版本戳跳过 `node_modules`。社区插件自己装的依赖变了，不会触发重载

## 主框架 TypeScript 化（P0）

现状是 `src/**/*.js`，`type: module`，DSH 直接加载 `src/host.js`。目标是全量 TS + 编译产物，
分四步走，每一步都能单独发版：

1. **铺类型**：加 `tsconfig.json`（`module` / `moduleResolution` 都用 `NodeNext`，`allowJs` + `checkJs` 先开），
   CI 跑 `tsc --noEmit`，把存量错误清零
2. **逐目录改名**：`core → tools → onebot → features → host`，一次一个目录，改完跑测试
3. **切产物**：`rootDir: src`、`outDir: lib`，`main` 改 `lib/host.js`，`files` 加 `lib`；
   `dsh.bundle.patch` 指向的 `cordis.patch.yml` 不变
4. **收紧**：`strict: true`、去掉 `any`、补公开类型

开发期两条命令：

```powershell
npm run check      # tsc --noEmit
npm run build      # tsc -p tsconfig.build.json，产物进 lib/
```

迁移期间宿主仍可以加载 `src/host.js`（JS 与 TS 混跑靠 `allowJs`），
但发布包必须带 `lib/`，否则 `dsh plugin add` 装上去只会看到一个空目录。

## 排障

| 现象 | 多半是 | 处理 |
| --- | --- | --- |
| 插件一直不加载，也没有报错 | `inject` 的服务没人提供，fiber 停在 PENDING | 用官方的 `FiberState.PENDING` 诊断片段枚举 `ctx.registry` |
| 启动失败 `EADDRINUSE` | WebUI 端口被占 | `--port` 换端口，或关掉旧进程 |
| 改了 `.ts` 没反应 | hmr 的 `root` 还是 `[]`，或者入口不在 loader 模块图里 | 覆盖 `hmr` 行；确认插件行用的是绝对路径 |
| 发布包装上后加载失败 | git 安装拿到的是源码，没有 `lib/` | 加 `prepare` 脚本，或发预构建的 tarball / npm 包 |
| 社区插件改了没生效 | 没构建，或改错了目录 | 见上一节的三种情况 |
