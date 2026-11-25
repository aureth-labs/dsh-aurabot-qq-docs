<template>
  <svg class="ab-arch" viewBox="0 0 800 470" role="img" aria-label="AuraBot 的分层结构">
    <defs>
      <marker
        id="ab-arch-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path class="arrow-head" d="M0 0 L10 5 L0 10 Z" />
      </marker>
    </defs>

    <line class="arrow" x1="680" y1="424" x2="680" y2="42" marker-end="url(#ab-arch-arrow)" />
    <text class="badge" x="702" y="233" text-anchor="middle" transform="rotate(-90 702 233)">
      消息向下 · 依赖向上
    </text>

    <rect class="layer" x="40" y="20" width="580" height="80" rx="16" />
    <text class="t" x="68" y="54">平台</text>
    <text class="d" x="68" y="80">QQ · Telegram · Discord · QQ 官方</text>
    <text class="tag" x="600" y="64" text-anchor="end">你接入的地方</text>

    <rect class="layer" x="40" y="128" width="580" height="80" rx="16" />
    <text class="t" x="68" y="162">适配器</text>
    <text class="d" x="68" y="188">插件形态，同一平台可多开；负责登录、上下线与消息归一化</text>
    <text class="tag" x="600" y="172" text-anchor="end">社区可自写</text>

    <rect class="layer layer--accent" x="40" y="236" width="580" height="80" rx="16" />
    <text class="t" x="68" y="270">AuraBot 框架</text>
    <text class="d" x="68" y="296">ctx 管线：过滤器 → 指令 → 中间件 → LLM</text>
    <text class="tag" x="600" y="280" text-anchor="end">本仓库 · V2</text>

    <rect class="layer" x="40" y="344" width="580" height="80" rx="16" />
    <text class="t" x="68" y="378">DeepSeek Harness</text>
    <text class="d" x="68" y="404">模型 · 会话 · 工作区 · Web UI · 插件加载</text>
    <text class="tag" x="600" y="388" text-anchor="end">DeepSeek 官方</text>
  </svg>
</template>
