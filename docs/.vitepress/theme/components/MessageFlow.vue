<template>
  <svg class="ab-flow" viewBox="0 0 900 470" role="img" aria-label="一条消息在 AuraBot 里的走向">
    <path class="branch" d="M180 235 C 215 235, 215 39, 250 39" />
    <path class="branch" d="M180 235 C 215 235, 215 113, 250 113" />
    <path class="branch" d="M180 235 C 215 235, 215 187, 250 187" />
    <path class="branch" d="M180 235 C 215 235, 215 261, 250 261" />
    <path class="branch" d="M180 235 C 215 235, 215 344, 250 344" />
    <path class="branch" d="M180 235 C 215 235, 215 423, 250 423" />

    <rect class="hub" x="16" y="198" width="164" height="72" rx="18" />
    <text class="hub-t" x="98" y="230" text-anchor="middle">一条消息</text>
    <text class="hub-s" x="98" y="252" text-anchor="middle">从平台进来</text>

    <rect class="node" x="250" y="16" width="176" height="46" rx="12" />
    <text class="t" x="270" y="45">适配器</text>
    <text class="note" x="444" y="44">登录 · 上下线 · 归一化成 session</text>

    <rect class="node" x="250" y="90" width="176" height="46" rx="12" />
    <text class="t" x="270" y="119">过滤器</text>
    <text class="note" x="444" y="118">平台 / 群 / 用户白名单</text>

    <rect class="node" x="250" y="164" width="176" height="46" rx="12" />
    <text class="t" x="270" y="193">指令</text>
    <text class="note" x="444" y="192">命中即执行，不必等模型</text>

    <rect class="node" x="250" y="238" width="176" height="46" rx="12" />
    <text class="t" x="270" y="267">中间件</text>
    <text class="note" x="444" y="266">正则解析、链接还原、拦截</text>

    <rect class="node node--accent" x="250" y="306" width="176" height="76" rx="14" />
    <text class="t" x="270" y="350">LLM 阶段</text>
    <text class="note" x="444" y="324">人格 + 记忆 + 上下文</text>
    <text class="note" x="444" y="346">模型路由（Magpie 或 DSH 直连）</text>
    <text class="note" x="444" y="368">工具调用 ctx.tool</text>

    <rect class="node" x="250" y="400" width="176" height="46" rx="12" />
    <text class="t" x="270" y="429">出站</text>
    <text class="note" x="444" y="428">元素树 → 适配器 → 文本 / 图片 / 语音</text>
  </svg>
</template>
