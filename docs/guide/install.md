# 装 DeepSeek Harness

AuraBot 不是独立程序，它是 **DeepSeek Harness（简称 DSH）** 的插件，所以先把宿主跑起来。
Node.js 还没装的先看[准备](/guide/prepare)。

## 三种方式任选其一

不用三条都走，挑一条适合你的。

::: details 桌面版安装包（Windows，最省事）
从 [DSH Releases](https://github.com/deepseek-ai/deepseek-harness/releases) 下载 Windows 安装包，装完直接打开。

桌面版的命令行藏在：

```text
%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd
```

后面文档里凡是写 `dsh ...` 的地方，桌面版换成这个完整路径。
:::

::: details `npx` 一行启动（任意装了 Node.js 的机器）
```bash
npx @deepseek-ai/dsh web
```

默认在 `http://127.0.0.1:3080` 起服务并自动开浏览器；不想自动开就加 `--no-open`。
通过 SSH 远程跑时只打印地址，端口转发交给你的 SSH 客户端。
:::

::: details 源码（要改 DSH 本身时）
```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

只有调插件加载顺序、或要改 DSH 自身行为时才需要这种方式。
:::

## 确认跑起来了

浏览器能打开 Web UI，左侧出现会话列表，选一个工作区之后输入框可用——到这一步宿主就算好了。

## 第一次打开

**不用急着填 API 密钥**，两条路都行：

- 直接登录 DSH 账号，用官方提供的模型，开箱就能聊
- 接自己的密钥，或者接一个网关把多家模型挂在一起

我们推荐第二种里的**网关方案**：用 [Magpie](https://github.com/yetone/magpie) 把模型都收在一个入口，
DSH 只认它一个地址。Magpie 是独立项目，**不属于 AuraBot，也不由我们维护**，只是我们在用的组合方式。

::: warning 模型路由别塞进 DSH
重试、故障转移、按任务挑模型这类逻辑，交给网关做。DSH 里配得越复杂，出问题时越难定位——
而网关挂了只需要看一个地方。
:::

## 版本提示

DSH 还在 developer preview，菜单名和参数会变。文档里的名字以你装到的那版为准，
对不上就看 [官方文档站](https://deepseek-harness.github.io/deepseek-harness/)。
