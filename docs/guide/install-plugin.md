# 装社区模块

模块（module）是 AuraBot 里的功能件：点歌、生图、语音、桌宠都是模块。
和 DSH 插件不同，模块**不用改 profile、不用重启 DSH**，在面板里装完就能用。

## 面板里装（推荐）

1. 打开 Aurabot 面板 →「生活」分组 →「模块市场」
2. 搜关键词（如 `点歌`、`生图`、`语音`），或者直接翻列表
3. 点安装 → 选版本 → 等它下完
4. 回面板「模块市场 → 已安装」，启用，然后按模块自己的 README 配置

市场里能装的模块，代码都在作者自己的仓库和 Release 里，市场只存索引：

```text
读 market.json → 选版本 → 下载 zip → 校验 sha256 → 解压
              → 读 package.json 里的 aurabot 字段 → 加载 main
```

索引源（自动构建，每天重建）：

```text
https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json
```

## 命令行装（DSH 组合包）

模块如果是以 DSH 组合包的形式发布，也可以用 DSH 自己的插件命令：

```bash
dsh plugin --profile <profile> add <来源>
```

| 写法 | 用途 |
| --- | --- |
| `github:owner/repo` | 从 GitHub 装，走仓库里的构建脚本 |
| `github:owner/repo#<commit-sha>` | 同上，但锁死提交，推荐 |
| `./local-plugin` | 本地目录，开发时用 |
| `some-package` | 已经发布到 npm 的包 |
| `./pkg-1.0.0.tgz` | 打包好的 tarball |

组合包装完要重启 DSH；面板市场装的模块不用。

## 自己写的模块放哪

```text
%USERPROFILE%\.dsh\plugins-data\aurabot\modules\<你的模块>\
```

放进去就生效，**保存即热重载**，升级 AuraBot 也不会覆盖这个目录。
模块的最小结构见[插件结构](/dev/anatomy)。

## 权限与安全

装模块时面板会显示它声明了哪些能力（`network`、`filesystem`、`process`、`plugin-internals` 等）。
**这些只是声明，不是沙箱**——模块和 AuraBot 在同一个进程里跑，能碰到你的账号配置。

| 声明 | 实际含义 |
| --- | --- |
| `network` | 会往外发请求 |
| `filesystem` | 会读写本机文件 |
| `process` | 会起外部程序（ffmpeg、python 之类） |
| `plugin-config` | 能读写自己的模块设置 |
| `plugin-internals` | 用了 AuraBot 内部接口，升级后可能失效 |

所以：只装你看得懂来源的模块；看到 `process` 就先翻一眼它的 README 说要跑什么。

## 更新与卸载

都在「模块市场 → 已安装」里点。卸载不会删模块自己存在数据目录里的东西，
想清干净就手动删 `modules/<模块名>/`。

## 模块改了没生效

| 现象 | 原因 |
| --- | --- |
| 改 `src/*.ts` 没反应 | 宿主加载的是构建产物，先 `npm run build` |
| 改 `index.mjs` 没反应 | 等 3 秒（宿主每 3 秒扫一次目录），还不行就看面板日志 |
| 装了新版本没变化 | 组合包要重启 DSH |

开发细节见[如何开发我们的框架](/dev/develop-framework)。
