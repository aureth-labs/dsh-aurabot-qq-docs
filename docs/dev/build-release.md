# 构建与发布

结论：**产物由 CI 构建，作者只推源码。** 本地只跑 `check` 和 `build` 验证，
真正发布走 Actions，客户端拿到的是 zip。

## 本地两个命令

```bash
npm run check     # tsc --noEmit，纯类型检查
npm run build     # src/ → lib/，client/ → dist/
```

`build.mjs` 做四件事：

1. 删掉旧的 `lib/`、`dist/`
2. 用 `tsconfig.json` 编译 `src/` → `lib/`
3. 如果有 `client/panel.ts`，用 `tsconfig.client.json` 编译 `client/` → `dist/`
4. 把 `dist/panel.js` 里的 `export default function` 换成 `return function`

第 4 步不能省：面板是宿主用 `new Function(body)` 跑的，它要的是**函数体**，不是模块。

## 发版流程

```
改代码 + 升 version
   └─ push 到 main
        └─ Actions：npm ci → check → build → 打 zip → 发 Release
             └─ 回写 package.json.aurabot.artifact{url,sha256,size}
                  └─ bot commit（带 [skip ci]）
                       └─ 市场下次构建拉到新 artifact
```

几个要点：

- **谁升版本谁发版**：脚本按目录比 `version`，没变就跳过
- **zip 里只有产物**：`lib/`、`dist/`、`package.json`、`README`、`LICENSE`，不带 `node_modules`
- **sha256 必须回写**：客户端下载后校验，对不上直接拒绝
- **回写提交带 `[skip ci]`**：避免自己触发自己

模板仓库的 `.github/workflows/release.yml` 和 `scripts/release.mjs` 就是这套实现，
照抄改改就能用。

## 市场怎么收录

在市场仓库的 `registry.jsonl` 里加一行，指向你仓库里那个 `package.json`：

```text
https://github.com/<owner>/<repo>/blob/main/modules/playmusic/package.json
```

市场构建时：

1. 把链接换成 `?raw=1` 拉取原始内容（**你的链接保持 `blob` 原样就行**）
2. 按 schema 校验，不通过就跳过并写进 `report.md`
3. 用仓库 owner 拼 id：`owner/name`；重名自动加 `-2`
4. 合成 `market.json`，发到 `market` 分支

## 版本与撤回

- 更新：升 `version`，重跑发版
- 撤回某版本：自己删 Release、改版本号。市场每次全量重建，下一次构建就看不到了
- 改名：等于发布了一个新插件，旧的会从索引里消失

## 不要做的事

| 别做 | 原因 |
| --- | --- |
| 提交 `lib/`、`dist/` | 产物由 CI 生成，提交了会和源码对不上 |
| 在 zip 里带 `node_modules` | 体积爆炸，而且平台差异会导致加载失败 |
| 手动改 `artifact.sha256` | 客户端会校验失败，等于发了个坏包 |
| 用 CJS 写入口 | 只支持 ESM，`"type": "module"` 是硬要求 |
