# 安装插件

DSH 的插件有两种装法：面板点一下，或者命令行一条 `dsh plugin add`。
两种装的都是**组合包（bundle）**，装完要重启 DSH 才会加载。

## 方式一：插件市场（面板）

DSH 自带插件市场页面，AuraBot 面板里也有「模块市场」。

我们这套市场（[market.json](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json)）
的工作方式是：

```
读 market.json → 选版本 → 下载 zip → 校验 sha256 → 解压
              → 读 package.json 里的 aurabot 字段 → 加载 main
```

所以市场里能装的插件，代码都在作者自己的仓库和 Release 里，市场只存索引。

## 方式二：命令行

```bash
dsh plugin --profile <profile> add <来源>
```

`<来源>` 支持这几种：

| 写法 | 用途 |
| --- | --- |
| `github:owner/repo` | 从 GitHub 装，走仓库里的构建脚本 |
| `github:owner/repo#<commit-sha>` | 同上，但锁死提交，推荐 |
| `./local-plugin` | 本地目录，开发时用 |
| `some-package` | 已经发布到 npm 的包 |
| `./pkg-1.0.0.tgz` | 打包好的 tarball |

Windows 桌面版要把 `dsh` 换成完整路径：

```powershell
& "$env:LOCALAPPDATA\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add github:aureth-labs/dsh-aurabot-qq
```

## 装 AuraBot 本体

```bash
dsh plugin --profile <profile> add github:aureth-labs/dsh-aurabot-qq
```

重启 DSH，左侧栏「自动化任务」下面会出现 **Aurabot**，进去跟着设置向导走。

## 从 GitHub 装意味着什么

带构建脚本的包，安装时会在**你的机器上执行它的代码**，而且不在任何沙箱里。
所以：

- 只装你看得懂来源的包
- 尽量锁 commit：`github:owner/repo#<sha>`
- 我们的模板仓库走的是另一条路 —— 作者用 Actions 构建好 zip 发 Release，
  客户端只下载产物、校验 sha256，不跑作者的构建脚本

## 卸载与更新

```bash
dsh plugin --profile <profile> remove <包名>
dsh plugin --profile <profile> add github:owner/repo   # 重跑一遍就是更新
```

更新不会动你的数据目录，配置、人格、记忆都保留。
