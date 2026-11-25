# 面板：client → dist

面板是插件在 DSH Web UI 里的那一页。它和后台逻辑**分开编译、分开加载**。

```
client/panel.ts  ──tsc──▶  dist/panel.js  ──宿主 new Function()──▶  面板
src/index.ts     ──tsc──▶  lib/index.js    ──宿主 import──▶        后台
```

## 为什么不能直接写模块

宿主不 `import` 面板，而是把文件内容当函数体执行。所以 `dist/panel.js` 必须是：

```js
return function Panel(props) { /* ... */ }
```

模板的 `build.mjs` 会把 `export default function` 自动替换成 `return function`，
你只管在 `client/panel.ts` 里写标准写法：

```ts
declare const React: any
declare const h: any
declare const ui: any
declare const call: (path: string, body?: any) => Promise<any>

export default function Panel(props: { toast(msg: string, kind?: string): void }) {
  // ...
}
```

`React`、`h`、`ui`、`call` 都是宿主注入的全局，不要 import，也不要在 `tsconfig.client.json` 里
开 `types`。

## 可用的东西

| 名字 | 是什么 |
| --- | --- |
| `React` | React 本体 |
| `h` | `React.createElement` 的简写 |
| `ui` | 宿主提供的组件：`ui.Btn`、`ui.Card`、`ui.Row`、`ui.Empty` 等 |
| `call(path, body?)` | 调**你自己模块**的路由，不经过网络，天然带鉴权 |

注意 `call()` 只能调本模块 `api.route()` 注册的路径。想访问外部接口，
在后台用 `fetch` 拿到数据再暴露一个路由给面板，别在面板里直接发请求。

## 一个最小可用的面板

```ts
declare const React: any
declare const h: any
declare const ui: any
declare const call: (path: string, body?: any) => Promise<any>

export default function Panel(props: { toast(msg: string, kind?: string): void }) {
  const [result, setResult] = React.useState<any>(null)

  function probe() {
    call('/ping')
      .then((r) => setResult(r))
      .catch((e) => props.toast(e.message, 'err'))
  }

  return h('div', { className: 'ab-grid' },
    h(ui.Card, { title: '探活', extra: h(ui.Btn, { onClick: probe }, '测一下') },
      result ? h(ui.Row, { label: '服务器时间' }, h('code', null, result.at)) : h(ui.Empty, { text: '点一下试试' })))
}
```

## 常见坑

| 现象 | 原因 |
| --- | --- |
| 面板空白，控制台报 `React is not defined` | 在 `client/` 里 `import React` 了，删掉 |
| 面板报语法错误 | `dist/panel.js` 还是模块语法，检查 `build.mjs` 有没有替换成功 |
| `call()` 404 | 后台没注册这个 `api.route()`，或者路径写错 |
| 改动不生效 | 面板是构建产物，改完要重新 `npm run build` 并重启 |
| 样式很丑 | 用 `ui.*` 组件，别自己造轮子；容器类名用宿主约定的 `ab-grid` 这类 |
