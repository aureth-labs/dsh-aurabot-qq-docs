# 装 DeepSeek Harness

AuraBot 不是一个独立程序，它是 **DeepSeek Harness（简称 DSH）** 的插件。所以顺序永远是：
先把 DSH 跑起来，再往里面装 AuraBot。

## 你要准备什么

| 东西 | 说明 |
| --- | --- |
| 一台电脑 | Windows 最省事（QQ 网关和翻唱支持最好），Linux / macOS 也能跑 |
| Node.js | 用 `npx` 启动时需要；桌面安装包自带运行时，不用另装 |
| 一个 QQ 小号 | 给机器人用，别拿主号试 |
| 一个大模型 API 密钥 | DeepSeek 官方或任意 OpenAI 兼容中转站都行，见[配置模型](/guide/models) |

## 三种启动方式

### 1. 桌面版（Windows，最省事）

从 [DeepSeek Harness 仓库](https://github.com/deepseek-ai/deepseek-harness/releases) 下载 Windows 安装包，
装完直接打开。桌面版的命令行藏在：

```text
%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd
```

后面文档里凡是写 `dsh ...` 的地方，桌面版就换成这个完整路径。

### 2. `npx`（任何装了 Node.js 的机器）

```bash
npx @deepseek-ai/dsh web
```

默认在 `http://127.0.0.1:3080` 启动并自动打开浏览器；不想自动打开就加 `--no-open`。
通过 SSH 远程跑时只打印地址，端口转发由你的 SSH 客户端负责。

### 3. 源码

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

改 DSH 本身或要调插件加载顺序时才需要这种方式。

## 第一次打开会看到什么

1. 浏览器打开 Web UI，左侧是会话与自动化任务列表
2. **先点「设置 → 模型」填一个 API 密钥**，不填的话会话发不出话
3. 再选一个工作区（就是让 DSH 读写文件的目录），选中之后输入框才可用

## 下一步

- 配模型：[配置模型](/guide/models)
- 装本体：[安装 AuraBot](/guide/install-aurabot)
- 接 QQ：[接入 QQ](/guide/connect-qq)

::: tip 版本提示
DSH 还在 developer preview，接口会变。文档里的菜单名以你装到的那版为准，
对不上就照官方 [文档站](https://deepseek-harness.github.io/deepseek-harness/) 走。
:::
