# 本地开发与打包

## 开发目录

AuraBot 从数据目录的 `modules/` 加载插件。面板新建的插件直接生成 TypeScript 入口。已有项目可以把插件放入 `modules/<name>/`，在 package.json 的 main 指定 `src/index.ts`。未生成编译产物时，加载器也会查找 `index.ts` 和 `src/index.ts`。

源码支持 Node 可擦除的 TypeScript 语法。相对导入可以写 NodeNext 的 `.js` 扩展名。保存同包的辅助文件也会触发重载。需要额外编译的语法及第三方依赖由作者在发行阶段处理。

## 构建发行包

在模板根目录执行以下命令。

```sh
npm --prefix modules/hello install
npm --prefix modules/hello run check
npm run dry-run
```

检查 dist 下的 ZIP。包根目录应有 package.json，main 应指向 ZIP 内的 ESM 文件。只有自定义业务页面需要附带面板脚本。普通设置的字段、初值和表单由配置 Schema 生成。

修改插件 version 后，模板工作流可以将该版本发布为 Release。市场按作者清单中的下载地址、字节数和 SHA-256 标识工件。

[第一个 TypeScript 插件](./first-plugin) · [市场发布](./market-publish)
