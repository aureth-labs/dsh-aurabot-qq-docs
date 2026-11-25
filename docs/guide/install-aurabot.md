# 安装 AuraBot

把 AuraBot 这个**插件**装进已经跑起来的 DeepSeek Harness。装完左侧栏多一个 `Aurabot`，点进去跟着向导走。

::: tip 先确认前置
DSH 能打开、模型能回话，再来装。没配好模型的话向导里那一步会一直报错。
见[装 DeepSeek Harness](/guide/install) 和[配置模型](/guide/models)。
:::

## 先确认 profile

DSH 的所有插件都装在某个 **profile** 里。桌面版通常是 `desktop`，`npx dsh web` 默认是 `default`。

```bash
dsh plugin --profile <profile> list
```

输出的列表里没有 `aurabot` 就是还没装。**装错 profile 是「装完左侧栏没东西」最常见的原因**。

## 装

Windows 桌面版：

```powershell
& "$env:LOCALAPPDATA\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd" `
  plugin --profile desktop add github:aureth-labs/dsh-aurabot-qq
```

Linux / Docker（容器里就进容器执行）：

```bash
dsh plugin --profile <profile> add github:aureth-labs/dsh-aurabot-qq
```

想锁死某个提交（推荐）：在仓库后面加 `#<commit-sha>`。

DSH 自带的插件市场页也能搜到 AuraBot，点安装等价于上面这条命令。

## 装完必须重启

插件是在 DSH 启动时加载的，不重启就没有新入口。

```text
桌面版：关掉窗口，再从开始菜单打开
命令行版：Ctrl+C 停掉，再跑一次 npx @deepseek-ai/dsh web
```

## 五步向导

第一次打开 AuraBot 会自动出现设置向导。以后想重走，在「连接」页点「重新走一遍设置向导」；如果升级前已连上 QQ 且核对通过，向导会显示「使用现有连接，进入面板」，点它就保留现有设置。

### 1. 两个 QQ 号

| 填什么 | 说明 |
| --- | --- |
| 机器人 QQ 号 | 给她用的号，**一定要用小号** |
| 你的 QQ 号（主人） | 操作电脑、改配置只认这个号 |

### 2. 选网关

| 路线 | 什么时候选 |
| --- | --- |
| 用 SnowLuma（Windows） | 你还没装过任何 QQ 机器人 |
| 接我已有的 OneBot 机器人 | 已经有 NapCat / LLOneBot / Lagrange / Docker 版 SnowLuma，或者在 Linux / Docker 上跑 |

选第二条就填正向 WebSocket 地址（和 token），**插件只连接，不启动、不注入**。见[接入 QQ](/guide/connect-qq)。

### 3. 启动 SnowLuma 并同意协议

1. 点「启动 SnowLuma」，它在后台运行，不弹黑窗口
2. 控制台密码由插件**自动生成并保存**，你不用设也不用记
3. 面板里显示用户协议与隐私说明，读完勾选「我已阅读并同意」

SnowLuma 的协议不允许别的程序替你下载安装，所以下载解压这一步要你自己来（只做一次）。

> 如果你之前自己设过 SnowLuma 控制台密码，这里会提示「插件登不上」，点「重置为自动密码」。

### 4. 接入机器人号

1. 另开一个 QQ 登录机器人号，可以最小化；主号照常开着
2. 点「接入机器人号」。**只给登录机器人号的那个进程接入**，主号永远不会被碰
3. 点「看看有哪些 QQ 进程」可以亲眼确认：主号那一行写着「不会碰」
4. 等十几秒，看到「连上了」就成功

### 5. 先试运行，再上线

**推荐先试运行**：她照常思考，但只把要说的话写进日志，不真的发出去。

1. 用主号给机器人号发一句「在吗」
2. 去「日志」页看她本来要回什么
3. 没问题就关掉右上角的「试运行」

QQ 会话默认放在 `%USERPROFILE%\Aurabot\qq-chats`，想放到别的盘就在「连接」页填完整路径。

## 验证装成功了没

```bash
dsh plugin --profile <profile> list
```

| 现象 | 说明 |
| --- | --- |
| 列表里有 `aurabot`，左侧栏有入口 | 装好了 |
| 列表里有，左侧栏没有 | 没重启，或者打开的是另一个 profile |
| 列表里没有 | profile 填错，或者命令报错了没注意 |
| 报版本不匹配 / 缺依赖 | DSH 太旧，先升级 DSH |

## 更新与卸载

```bash
# 更新：重跑一遍 add
dsh plugin --profile <profile> add github:aureth-labs/dsh-aurabot-qq

# 卸载：只摘插件，不删数据目录
dsh plugin --profile <profile> remove aurabot
```

更新不动数据目录，人格、记忆、配置、模块都在 `%USERPROFILE%\.dsh\plugins-data\aurabot\`。保险起见先走面板「系统 → 备份」。

想彻底清干净，自己删上面那个目录。

## 下一步

- 让机器人号上线：[接入 QQ](/guide/connect-qq)
- 认路面板：[认识面板](/guide/configure)
- 加功能：[功能总览](/features/)