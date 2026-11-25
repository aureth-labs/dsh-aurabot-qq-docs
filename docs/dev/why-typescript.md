# 为什么用 TypeScript

AuraBot 插件最终运行的是 JavaScript。TypeScript 的作用是在开发阶段检查接口、参数和数据结构，不改变运行时的模块格式。

::: warning V1 示例
以下内容属于 V1，仅用于维护现有模块，对当前 V2 开发没有参考价值。V2 插件接口仍在开发中。
:::

## 开发体验

| 项目 | JavaScript | TypeScript |
| --- | --- | --- |
| 运行方式 | 直接加载 | 编译为 JavaScript 后加载 |
| 字段和参数错误 | 通常在运行时发现 | 可在编辑器或构建阶段发现 |
| 接口提示 | 依赖 JSDoc 或手工查阅 | 由类型声明提供 |
| 重构 | 手动检查引用 | 编译器可协助检查 |

模板仓库已经提供 `tsconfig.json`、构建脚本和类型检查命令，不需要单独搭建工具链。我们的插件、框架和文档仓库统一使用 pnpm，与 DSH 的开发环境一致。

## 常用命令

清单通过 `packageManager` 固定 pnpm 版本：

```json
{
  "packageManager": "pnpm@11.1.2"
}
```

版本号应与仓库实际使用的 pnpm 版本一致。首次使用可以执行 `corepack enable`，让 Node.js 按该字段选择包管理器。

安装依赖并执行检查：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

提交锁文件 `pnpm-lock.yaml`。`check` 只检查类型，`build` 生成后台和面板的 JavaScript 产物。

类型检查只能发现类型层面的问题，不能替代运行测试。网络请求、文件处理和平台发送仍需实际验证。

## 何时直接使用 JavaScript

本地一次性脚本或很小的功能可以直接写 `index.mjs`。需要长期维护、公开发布或接入 CI 时，应使用 TypeScript 模板。

插件结构见[插件结构](/dev/anatomy)，发布流程见[构建与发布](/dev/build-release)。
