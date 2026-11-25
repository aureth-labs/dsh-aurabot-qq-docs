# 安装 DeepSeek Harness

先安装并启动 DSH，再安装 AuraBot。Node.js 是否需要安装取决于所选发行版，详见[安装准备](prepare.md)。

## 选择安装方式

::: details 桌面版

从 [DeepSeek Harness 官方页面](https://www.deepseek.com/harness/)下载桌面端并完成安装。该方式适合希望直接使用图形界面的用户。

桌面版的命令行入口位置随发行版而异。需要执行本文命令时，请使用该发行版提供的入口，或在其设置中查看运行时目录。
:::

::: details npx

使用该方式前需要安装 Node.js 22 或更高版本。Node.js 不是 DSH 运行的必要条件，桌面发行版用户通常可以跳过。

```bash
npx @deepseek-ai/dsh web
```

默认地址为 `http://127.0.0.1:3080`。添加 `--no-open` 可禁止自动打开浏览器。Node.js 安装入口见 [Node.js 官方下载页](https://nodejs.org/zh-cn/download)。
:::

::: details 交给 AI 安装

如果由具备终端权限的 AI 助手部署，可以直接向它发送以下说明文件：

```text
https://raw.githubusercontent.com/aureth-labs/dsh-aurabot-qq-docs/main/docs/public/deepseekharness.txt
```

该说明包含环境检查、独立目录安装、Windows 启停脚本、验收和回滚要求。它要求 Node.js 24.9.0 或更高版本，适用于需要自行部署运行环境的场景；已经使用桌面版的用户不需要按该说明重复安装。

执行前应先阅读全文。安装 Node.js、批准安装脚本、停止进程或修改现有目录时，应先确认影响。
:::

## 检查运行状态

打开 DeepSeek Harness 桌面端或 Web UI，选择一个工作区，确认能够新建会话并输入消息。

首次使用可以登录 DSH 账号，也可以配置自己的模型服务。模型配置见[配置模型](models.md)。

DSH 仍处于开发阶段，菜单名称和启动参数可能随版本变化。以 [DeepSeek Harness 官方页面](https://www.deepseek.com/harness/)和当前安装版本为准。
