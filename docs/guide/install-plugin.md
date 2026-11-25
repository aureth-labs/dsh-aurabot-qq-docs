# 安装社区模块

V1 的功能扩展称为模块。模块通过 AuraBot 面板安装，通常不需要修改 DSH 配置或重启 DSH。

## 从市场安装

1. 打开 AuraBot 面板的「模块市场」。
2. 查找模块并选择版本。
3. 安装后在「已安装」中启用。
4. 按模块说明完成配置。

市场索引位于：

```text
https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json
```

## 索引与代码

模块代码保存在作者仓库和 Release 中，市场仓库只维护收录清单并生成索引。

```text
作者仓库：构建源码 → 发布 Release → 提供下载地址与 sha256
市场仓库：读取收录清单 → 校验清单 → 生成 market.json
AuraBot：读取索引 → 下载并校验产物 → 加载入口
```

这种结构使作者可以独立发布版本，同时让客户端在加载前校验构建产物。发布方法见[发布到市场](../dev/market-publish.md)。

## 本地模块

Windows 默认位置：

```text
%USERPROFILE%\.dsh\plugins-data\aurabot\modules\<模块 ID>\
```

本地模块由 AuraBot 自动重载。修改 TypeScript 源码后仍需先构建，因为运行时读取的是 `package.json` 的 `main` 所指定的 JavaScript 文件。

## 能力声明

| 声明 | 含义 |
| --- | --- |
| `network` | 发起网络请求 |
| `filesystem` | 读写本地文件 |
| `process` 或 `exec` | 启动外部进程 |
| `plugin-config` | 读写模块配置 |
| `plugin-internals` | 使用 AuraBot 内部接口 |

能力声明只是安装信息，不限制模块实际行为。安装前应检查来源、README 和代码。

## 更新与卸载

在「模块市场 → 已安装」中更新或卸载。卸载不一定删除模块写入数据目录的内容，需要清理时按模块说明处理。

## 修改未生效

| 情况 | 处理方法 |
| --- | --- |
| 只修改了 `src/*.ts` | 执行构建，生成新的 JavaScript 产物 |
| 修改后仍未重载 | 检查实际加载目录和面板日志 |
| 安装的是 DSH 组合包 | 按 DSH 插件要求重启宿主 |
