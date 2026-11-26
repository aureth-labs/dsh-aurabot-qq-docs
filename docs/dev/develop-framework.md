# 开发 AuraBot 主框架

使用满足主仓 package.json 中 engines 要求的 Node.js 和已安装的 DeepSeek Harness。在主仓执行以下命令，先把 AuraBot 注册到 DSH 的 Web 配置档案。已经关联到这个工作目录的开发环境可以直接运行最后一行。

```sh
npm install
npm run build
dsh plugin --profile web add .
npm run dev
```

开发服务默认监听 8787。可以用 `DSH_PORT` 改端口，用 `DSH_BIN` 指定 DSH 的 Node CLI 入口文件。浏览器使用终端打印的登录地址。用 `DSH_HOME` 选择独立的宿主配置，用 `AURABOT_DATA_DIR` 选择独立的机器人数据目录。

## 保存后端源码

开发命令设置 `AURABOT_DEV=1`。DSH 加载本仓的 `dev.mjs`，沿静态导入执行 `packages/app/index.ts`。修改内核或内置插件的 TypeScript 文件后，DSH 释放旧插件，再载入新的实现。前端由 esbuild 单独监听。改完一组功能，可以用 `npm run check` 检查前后端类型和资源释放约定。

开发命令为当前进程叠加 HMR 配置。直接运行 DSH 时，也可以在 Web 档案补丁里配置监听目录。将下例的 file URL 替换为本机仓库位置，保留目录末尾的斜杠。

```yaml
- id: hmr
  disabled: false
  config:
    base: 'file:///D:/work/aurabot/'
    root: ['src', 'packages', 'dev.mjs']
```

在 Windows 上，DSH 将 `base` 作为 URL 解析。使用含盘符的 file URL 可以让 HMR 正确启动。启动后可在面板模块列表中观察内置插件的名称或说明变化。

## 开发社区插件

宿主单独监听 AuraBot 数据目录中的 `modules/`。包内 TypeScript 入口和它导入的源文件会一起更新。注册过的命令、监听器和定时器在重载时由插件作用域释放。这条路径也适用于发行态宿主。[本地开发与打包](./module-quickstart)

## 验证发布形态

执行 `npm run build` 生成 `lib/` 和 `dist/`，再执行 `npm run start`。此时服务端使用 `index.mjs` 加载编译后的应用，浏览器加载面板产物。可以用聊天沙盒的本地指令验证一条消息的接收、处理和发送，再测试需要模型的插件。
