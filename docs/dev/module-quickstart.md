# 十五分钟写一个模块

这是**最短的一条路**：直接在面板里新建，写 `index.mjs`，几秒生效，不用构建、不用发布，先跑通再考虑上市场。

例子是「今日运势」：有人说「运势」，她回一句。

## 1. 在面板里新建

面板「已安装」页 → 最下面「写模块的工具」→ 新建模块：

```text
id       fortune
名字     今日运势
```

插件会在数据目录建好 `modules/fortune/index.mjs`，改完保存，几秒内自动生效，不用重启。

## 2. 写入口

```js
const WORDS = ['大吉', '中吉', '小吉', '末吉']

export default {
  id: 'fortune',
  name: '今日运势',
  version: '1.0.0',
  api: 1,
  description: '发「运势」抽一签',
  setup(api) {
    api.on('message', async (msg) => {
      if (msg.text.trim() !== '运势') return
      await api.reply(msg, WORDS[Math.floor(Math.random() * WORDS.length)])
      return true // 这条消息接管了，不再交给她
    })
  },
}
```

三件事值得记住：

| 返回什么 | 意思 |
| --- | --- |
| `true` | 这条我处理了，她不再回 |
| `false` / 不返回 | 我不管，交给下一个模块和她 |
| `null`（只在 `reply` 类事件里） | 这次别发 |

其它能用的接口见[模块 API 速查](/reference/module-api)。

## 3. 先测再上线

「已安装」页有「模拟测试」：假装发一句话、调一个工具，看模块怎么反应。**发出去的东西只显示在面板上，不会真到 QQ**。

上线前建议：

1. 模拟测试走一遍
2. 打开试运行，用主号说一句真的
3. 看「日志」页有没有红字
4. 再关试运行

## 4. 想上市场就换成 TypeScript

面板里直接写的 `index.mjs` 只适合自己用。要发到模块市场、让 `npm run check` 和 CI 帮你把关，换成模板仓库那套：

| 面板内联 | 模板仓库 |
| --- | --- |
| 手写 `index.mjs` | `src/*.ts` 编译到 `lib/` |
| `module.json` 手写 | `package.json` 是唯一来源，构建时生成 `module.json` |
| 无类型检查 | `npm run check` |
| 无发布 | Actions 打 zip 发 Release |

转过去就照[写第一个插件](/dev/first-plugin)走。**两种写法的模块接口是同一套**，`api: 1` 通用。

## 5. 提交到模块仓库

1. Fork [模块仓库](https://github.com/aureth-labs/dsh-aurabot-qq-mods)，克隆到本地
2. 把模块文件夹放进 `modules/<你的模块>/`
3. 至少四个文件：

```text
modules/fortune/
├── module.json
├── index.mjs
├── README.md
└── LICENSE
```

4. 仓库根目录跑：

```bash
npm run catalog
npm run check
npm run pack
```

| 命令 | 作用 |
| --- | --- |
| `catalog` | 把模块加进模块目录 |
| `check` | 检查格式与能力声明，看到 `✗` 照提示改 |
| `pack` | 试打包，并真的加载一次入口 |

5. 提 PR，目标分支 `main`，**一个 PR 只放一个模块**

## 6. 维护者会看什么

- 代码读得懂，没有混淆，运行时不下载并执行代码
- `capabilities` 和实际行为一致
- 用户的 Cookie、消息不发到无关地址
- 不做未经同意的群发、加好友、发帖
- 不绕过验证码，不刷量

模块和插件在同一个进程里跑，能接触账号配置，所以**每个版本都要审**。改完记得把 `module.json` 和 `index.mjs` 里的 `version` 一起升上去，已发布的版本不能改。

## 红线：子智能体委派

用了 `api.core.hub.runSubagentTurn`（声明了 `plugin-internals`）的模块必读。

`runSubagentTurn` 会 spawn 一个带**本机 shell 与文件工具**的子智能体，所以：

::: danger 任务书只能来自主人
任务书的内容只能来自**主人的意图**——主人在私聊里说的话、主人在自己配置里写的内容。

**绝不能拼接外部内容**：群友消息、网页抓取结果、别的模块转发的文本。把外部内容拼进任务书，等于把本机命令与文件能力交给不可信文本。
:::

「是不是主人开口」由宿主按「最近 5 分钟主人私聊活动」判定，模块既不能自报，也不能把外部内容伪装成主人输入来绕过。调用方传的 `moduleId` / `source` 一律不认。

完整接口见[模块 API 速查](/reference/module-api)，TypeScript 路线见[写第一个插件](/dev/first-plugin)，
热重载怎么工作见[如何开发我们的框架](/dev/develop-framework)。
