# 编写面板

本页描述 V1 自定义面板。V2 计划通过 Schema 自动生成常规配置界面，自定义前端入口仍可作为扩展。

## 编译与加载

```text
client/panel.ts → dist/panel.js → 宿主执行函数体
src/index.ts    → lib/index.js  → 宿主 import
```

V1 面板不是由宿主直接 `import` 的 ES 模块。构建脚本需要将：

```js
export default function Panel(props) {}
```

转换为函数体形式：

```js
return function Panel(props) {}
```

## 可用全局对象

| 名称 | 用途 |
| --- | --- |
| `React` | React API |
| `h` | 创建元素的辅助函数 |
| `ui` | 宿主提供的界面组件 |
| `call(path, body?)` | 调用当前模块注册的面板路由 |

这些对象由宿主注入，不在面板源码中重复导入。

## 最小示例

```ts
declare const React: any
declare const h: any
declare const ui: any
declare const call: (path: string, body?: any) => Promise<any>

export default function Panel(props: { toast(message: string, kind?: string): void }) {
  const [result, setResult] = React.useState<any>(null)

  async function probe() {
    try {
      setResult(await call('/status'))
    } catch (error) {
      props.toast(error instanceof Error ? error.message : String(error), 'err')
    }
  }

  return h(ui.Card, { title: '状态' },
    h(ui.Btn, { onClick: probe }, '检查'),
    result ? h('pre', null, JSON.stringify(result, null, 2)) : null)
}
```

`call()` 只能访问当前模块的路由。外部网络请求应在后台完成，再通过路由向面板提供结果。

## 排查

| 现象 | 检查项 |
| --- | --- |
| `React is not defined` | 是否错误打包或导入了 React |
| 面板语法错误 | 构建产物是否仍包含 ESM 导出 |
| 路由返回 `404` | 后台 `api.route()` 和调用路径 |
| 修改未生效 | 是否重新构建并重新加载面板 |
