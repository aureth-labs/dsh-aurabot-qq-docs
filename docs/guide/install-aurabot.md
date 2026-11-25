# 安装 AuraBot

这一步只干一件事：把 AuraBot 这个**插件**装进已经跑起来的 DeepSeek Harness。
装完左侧栏多一个 `Aurabot`，点进去跟着向导走。

::: tip 先确认前置
DSH 能打开、模型能回话，再来装。没配好模型的话向导里那一步会一直报错。
见[装 DeepSeek Harness](/guide/install) 和[配置模型](/guide/models)。
:::

## 先确认 profile

DSH 的所有插件都装在某个 **profile** 里。桌面版通常是 `desktop`，`npx dsh web` 默认是 `default`。

```bash
dsh plugin --profile <profile> list
```

输出的列表里没有 `aurabot` 就是还没装。不确定自己的 profile 叫什么，就先用 `list` 看一眼
——**装错 profile 是「装完左侧栏没东西」最常见的原因**。

## 方式一：命令行装

```bash
dsh plugin --profile <profile> add github:aureth-labs/dsh-aurabot-qq
```

想锁死某个提交（推荐，避免上游改了什么你被动跟上）：

```bash
dsh plugin --profile <profile> add github:aureth-labs/dsh-aurabot-qq#<commit-sha>
```

Windows 桌面版没有把 `dsh` 加进 PATH，换成完整路径：

```powershell
& "$env:LOCALAPPDATA\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd" `
  plugin --profile desktop add github:aureth-labs/dsh-aurabot-qq
```

## 方式二：面板里装

DSH 自带的插件市场页可以直接搜到 AuraBot，点安装等价于上面那条命令。
两个入口装的是同一个东西，装完一样要重启。

## 装完必须重启

```bash
# 桌面版：关掉窗口再从开始菜单打开
# 命令行版：Ctrl+C 停掉，再跑一次
npx @deepseek-ai/dsh web
```

插件是在 DSH 启动时加载的，不重启就不会出现新入口。

## 装完看到什么

1. 左侧栏在「自动化任务」下面多一个 **Aurabot**
2. 点进去是设置向导，第一次会让你：
   - 填**主人的 QQ 号**（就是你自己，敏感操作的判断依据）
   - 选**机器人号怎么来**（SnowLuma 一键拉起，或者填已有的 OneBot v11 地址）
   - 挑一张**人格卡**（后面可以改）
3. 装完的默认状态是 **总开关关 + 试运行开**，她只读消息、只生成回复，不发出去

向导走完先别开总开关，去[认识面板](/guide/configure)把试运行看一遍。

## 验证装成功了没

```bash
dsh plugin --profile <profile> list
```

| 看到的现象 | 说明 |
| --- | --- |
| 列表里有 `aurabot`，左侧栏有入口 | 装好了 |
| 列表里有，左侧栏没有 | 没重启，或者打开的是另一个 profile |
| 列表里没有 | profile 填错，或者命令报错了没注意 |
| 报缺 `aurabot` 依赖 / 版本不匹配 | DSH 太旧，先升级 DSH |

## 更新

重跑一遍 `add` 就是更新，DSH 会拉新版本覆盖：

```bash
dsh plugin --profile <profile> add github:aureth-labs/dsh-aurabot-qq
```

更新不动你的数据目录，人格、记忆、配置、模块都在
`%USERPROFILE%\.dsh\plugins-data\aurabot\`。保险起见先走面板「系统 → 备份」打一个 zip。

## 卸载

```bash
dsh plugin --profile <profile> remove aurabot
```

`remove` 只摘插件，**不删数据目录**。想彻底清干净，自己删
`%USERPROFILE%\.dsh\plugins-data\aurabot\`。

## 下一步

- 让机器人号上线：[接入 QQ](/guide/connect-qq)
- 认路面板：[认识面板](/guide/configure)
- 加功能：[功能总览](/features/)
