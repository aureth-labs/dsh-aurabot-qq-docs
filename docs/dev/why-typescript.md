# 为什么用 TypeScript

AuraBot 插件最终运行的是 JavaScript。TypeScript 的作用是在开发阶段检查接口、参数和数据结构，不改变运行时的模块格式。

## 开发体验

| 项目 | JavaScript | TypeScript |
| --- | --- | --- |
| 运行方式 | 直接加载 | 编译为 JavaScript 后加载 |
| 字段和参数错误 | 通常在运行时发现 | 可在编辑器或构建阶段发现 |
| 接口提示 | 依赖 JSDoc 或手工查阅 | 由类型声明提供 |
| 重构 | 手动检查引用 | 编译器可协助检查 |

模板仓库已经提供 `tsconfig.json`、构建脚本和类型检查命令，不需要单独搭建工具链。

## 常用命令

具体包管理器以插件仓库为准。使用 npm 的模板通常提供：

```bash
npm run check
npm run build
```

`check` 只检查类型，`build` 生成后台和面板的 JavaScript 产物。

类型检查只能发现类型层面的问题，不能替代运行测试。网络请求、文件处理和平台发送仍需实际验证。

## 何时直接使用 JavaScript

本地一次性脚本或很小的功能可以直接写 `index.mjs`。需要长期维护、公开发布或接入 CI 时，建议使用 TypeScript 模板。

插件结构见[插件结构](/dev/anatomy)，发布流程见[构建与发布](/dev/build-release)。
