# 这是什么

AuraBot 的插件市场**不托管代码**。它只做三件事：

1. 维护一份收录表：`registry.jsonl`，一行一个作者仓库里 `package.json` 的 GitHub 链接
2. 构建时逐个拉取、按 schema 校验、合成 `market.json`
3. 清单写错的条目跳过并写进 `report.md`（当警告，不阻断流水线）

这样做的好处是：作者改代码不用等任何人审批，市场这边也不会变成「第二个 npm」。

## 数据怎么流动

```
作者仓库 push
   └─ Actions：npm ci → build → 打 zip → 发 Release
        └─ 回写 package.json.aurabot.artifact{url,sha256,size}（bot commit，[skip ci]）

市场仓库
   registry.jsonl（一行一个链接）
   └─ npm run market：拉取 → 校验 → market.json + report.md
        └─ 发布到 market 分支（就是上面那个镜像源）

宿主
   market.json → 选版本 → 下载 zip → 校验 sha256 → 解压 → 读 package.json.aurabot → 加载 main
```

## 收录规则

- 作者只写包名（如 `playmusic`），id 由市场用仓库 owner 拼成 `owner/name`
- 同一 owner 下重名，后来的自动加 `-2`、`-3`
- 只允许 ESM（`"type": "module"`），CJS 直接拒绝
- 自动收录一律 `verified: false`；是否审核看 `verified.json`
- 作者撤回某个版本：自己删 Release、改版本号；市场每次全量重建，下一次构建就看不到了

## 下一步

- 从零装起来：[装 DeepSeek Harness](/guide/install) → [配置模型](/guide/models) → [接入 QQ](/guide/connect-qq)
- 想动手：[写第一个插件](/guide/first-plugin)
- 想看取舍：[架构与决策](/ARCHITECTURE)
- 想改宿主：[主框架改造清单](/HOST-CHANGES)
- 想收录自己的插件：在[市场仓库](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev)的 `registry.jsonl` 里加一行，提 PR
- 文档有错 / 想加内容：直接改 [`docs` 分支](https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/tree/docs) 下对应页面，每页右上角有「在 GitHub 上编辑此页」
