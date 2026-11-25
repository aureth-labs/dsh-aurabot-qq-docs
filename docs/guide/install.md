# 安装 DeepSeek Harness

先安装并启动 DSH，再安装 AuraBot。Node.js 环境见[安装准备](/guide/prepare)。

## 选择安装方式

::: details 桌面版
从 [DSH Releases](https://github.com/deepseek-ai/deepseek-harness/releases) 下载 Windows 安装包并完成安装。

桌面版的命令行入口通常位于：

```text
%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd
```

使用命令行时，将文档中的 `dsh` 替换为该文件的完整路径。
:::

::: details npx
```bash
npx @deepseek-ai/dsh web
```

默认地址为 `http://127.0.0.1:3080`。添加 `--no-open` 可禁止自动打开浏览器。
:::

::: details 源码
```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

此方式用于修改 DSH 或排查插件加载问题。
:::

## 检查运行状态

打开 Web UI，选择一个工作区，确认能够新建会话并输入消息。

首次使用可以登录 DSH 账号，也可以配置自己的模型服务。模型配置见[配置模型](/guide/models)。

DSH 仍处于开发阶段，菜单名称和启动参数可能随版本变化。以当前安装版本和[官方文档](https://deepseek-harness.github.io/deepseek-harness/)为准。

## 交给 AI 安装

如果由具备终端权限的 AI 助手部署，可以直接发送这份说明：

```text
https://aureth-labs.github.io/dsh-aurabot-qq-docs/deepseekharness.txt
```

它包含环境检查、本地 npm 安装、Windows 启动与停止脚本、验收和回滚要求。该说明采用独立目录安装，默认 Node.js 版本为 24.9.0 或更高，与本页的 `npx` 快速启动方式不同。

使用前应先阅读全文。执行者需要遵守其中的目录保护、进程校验和凭据处理要求；涉及安装 Node.js、批准安装脚本或修改现有目录时，应先获得你的确认。
