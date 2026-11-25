<script setup lang="ts">
import { withBase } from 'vitepress'

type Link = { text: string; href: string; internal?: boolean }

const columns: { title: string; links: Link[] }[] = [
  {
    title: '框架',
    links: [
      { text: 'V2 主框架', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-v2' },
      { text: 'V1 宿主', href: 'https://github.com/aureth-labs/dsh-aurabot-qq' },
      { text: '插件模板', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template' },
    ],
  },
  {
    title: '生态',
    links: [
      { text: '社区模块', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-mods' },
      { text: '市场索引', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/tree/market' },
      { text: 'llms.txt', href: 'https://aureth-labs.github.io/dsh-aurabot-qq-docs/llms.txt' },
    ],
  },
  {
    title: '文档',
    links: [
      { text: '文档仓库', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-docs' },
      { text: '提 Issue', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues' },
      { text: '写作规范', href: '/dev/docs-style', internal: true },
      { text: '第三方与致谢', href: '/reference/third-party', internal: true },
    ],
  },
  {
    title: '上游',
    links: [
      { text: 'DeepSeek Harness', href: 'https://github.com/deepseek-ai/deepseek-harness' },
      { text: 'Magpie 网关', href: 'https://github.com/yetone/magpie' },
      { text: 'Magpie 文档', href: 'https://usemagpie.ai/zh' },
    ],
  },
]

function resolve(link: Link) {
  return link.internal ? withBase(link.href) : link.href
}
</script>

<template>
  <footer class="ab-footer">
    <div class="ab-footer__inner">
      <div class="ab-footer__brand">
        <p class="ab-footer__name">AuraBot</p>
        <p class="ab-footer__tagline">
          住在平台里的 AI，不是关键词回复机。<br />
          V2 · 基于 DeepSeek Harness 的社区框架
        </p>
      </div>

      <nav class="ab-footer__cols">
        <div v-for="col in columns" :key="col.title" class="ab-footer__col">
          <p class="ab-footer__title">{{ col.title }}</p>
          <ul>
            <li v-for="link in col.links" :key="link.text">
              <a
                :href="resolve(link)"
                :target="link.internal ? undefined : '_blank'"
                :rel="link.internal ? undefined : 'noreferrer'"
              >
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="ab-footer__legal">
      <span>代码 MIT · 文档 CC BY-SA 4.0</span>
      <span>
        文档有问题？
        <a href="https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues" target="_blank" rel="noreferrer">
          直接提 Issue
        </a>
      </span>
    </div>
  </footer>
</template>
