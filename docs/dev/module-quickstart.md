# 快速试用模块

本例使用 V1 面板中的本地模块功能，直接编写 `index.mjs`。适合验证事件和发送流程，不作为市场发布模板。

## 新建模块

在「已安装 → 写模块的工具」中创建：

```text
ID：fortune
名称：今日运势
```

AuraBot 会在数据目录创建 `modules/fortune/index.mjs`。

## 编写入口

```js
const results = ['大吉', '中吉', '小吉', '末吉']

export default {
  id: 'fortune',
  name: '今日运势',
  version: '1.0.0',
  api: 1,
  setup(api) {
    api.on('message', async (message) => {
      if (message.text.trim() !== '运势') return false
      const index = Math.floor(Math.random() * results.length)
      await api.reply(message, results[index])
      return true
    })
  },
}
```

返回 `true` 表示消费该消息；返回 `false` 或不返回表示继续交给其他处理者。`reply` 本身负责发送，不会因为返回 `true` 再自动发送一次。

## 测试

先使用面板中的「模拟测试」，再开启试运行进行真实输入测试。模拟测试中的发送只显示在面板，不会投递到平台。

## 转为发布项目

公开发布时迁移到 TypeScript 模板：

| 本地写法 | 发布模板 |
| --- | --- |
| `index.mjs` | `src/` 中的 TypeScript 源码 |
| 手工维护 `module.json` | 以 `package.json` 为主要清单 |
| 无类型检查 | `npm run check` 或对应包管理器命令 |
| 无自动发布 | CI 构建并发布 Release |

两种方式的 V1 模块接口相同，均使用 `api: 1`。

## 审核要求

提交社区模块时，代码不得混淆，不得在运行时下载并执行未声明的代码，不得将 Cookie 或聊天内容发送到无关服务。修改已发布模块时需要更新版本号。

使用 `api.core.hub.runSubagentTurn` 等内部能力时，还要遵守宿主的任务来源限制。不可将群友消息、网页内容或其他不可信文本直接拼成具有本机工具权限的子智能体任务。
