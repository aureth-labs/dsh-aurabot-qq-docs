# 发布到市场

写完模块，怎么让别人在面板里搜到它。

## 两种发布形态

| 形态 | 怎么发 | 装的时候 |
| --- | --- | --- |
| 独立模块 | GitHub 仓库 + Release 里放 zip，写进市场索引 | 面板「模块市场」一键装，不用重启 |
| DSH 组合包 | 当普通 DSH 插件发布 | `dsh plugin add`，装完要重启 |

下面讲的是第一种，也是社区模块的默认形态。

## 市场只存索引

代码始终在作者自己的仓库和 Release 里，市场仓库只放一行链接：

```text
作者仓库 push
   └─ Actions：装依赖 → 构建 → 打 zip → 发 Release
        └─ 回写 package.json.aurabot.artifact{url,sha256,size}

市场仓库
   registry.jsonl（一行一个 package.json 的 GitHub 链接）
   └─ 构建：拉取 → 校验 → market.json + report.md
        └─ 发布到 market 分支
```

所以作者改代码不用等谁审批，用户装的时候还能核对 `sha256`。

## 收录规则

- 包里只写**包名**（如 `playmusic`），id 由市场用仓库 owner 拼成 `owner/name`
- 同一 owner 下重名，后来的自动加 `-2`、`-3`
- 只允许 ESM（`"type": "module"`），CJS 直接拒绝
- 自动收录一律 `verified: false`，是否人工审核看 `verified.json`
- 撤回某个版本：自己删 Release、改版本号，下次重建就看不到了

## 提交前自查

- [ ] `npm run check` 通过，本地真装过一次
- [ ] `category` 选好了，跑过目录生成脚本
- [ ] `capabilities` 如实声明（`network` / `filesystem` / `process` / `plugin-internals` 等）
- [ ] 会访问的域名写清楚了
- [ ] 改已有模块时升了 `version`，入口文件和 `module.json` 一致
- [ ] 代码没有混淆，产物由 CI 从源码构建
- [ ] 许可证允许分发，第三方代码已署名

字段含义见[模块 API 速查](/reference/module-api)，能力声明的实际含义见[装社区模块](/guide/install-plugin#权限与安全)。
