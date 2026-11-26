# 第一个 TypeScript 插件

在插件模板仓库打开 `modules/hello/src/index.ts`。插件导出名字、配置和启动函数。下面的指令收到 `/hello 小雪` 时，在原会话发送「你好，小雪」。

```ts
import { Schema, type Ctx } from '@aurabot/plugin-api'

export const name = 'hello'
export const config = Schema.object({ greeting: Schema.string().default('你好') })

export function apply(ctx: Ctx, config: { greeting: string }) {
  ctx.command('hello <text:string>').action(async ({ session }, text) => {
    await session.send(`${config.greeting}，${text}`)
  })
}
```

在模板根目录运行 `npm --prefix modules/hello install`，再运行 `npm --prefix modules/hello run build`。SDK 随模板提供。复制插件目录至宿主数据目录的 `modules/hello/`，在模块列表查看启动状态，然后从在线适配器的会话发送指令。

保存 greeting 后要让闭包取得新的配置快照，可沿用模板清单中的 `aurabot.reloadOnConfig: true`。需要即时读取当前设置的处理函数也可以访问 `ctx.config`。

[本地开发与打包](./module-quickstart) · [插件接口](../reference/plugin-api)
