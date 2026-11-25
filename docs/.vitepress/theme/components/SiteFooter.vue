<script setup lang="ts">
import { withBase } from 'vitepress'

type Link = { text: string; href: string; internal?: boolean }

const columns: { title: string; links: Link[] }[] = [
  {
    title: '框架',
    links: [
      { text: 'V1 宿主', href: 'https://github.com/aureth-labs/dsh-aurabot-qq' },
      { text: 'V2 主框架', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-v2' },
    ],
  },
  {
    title: '生态',
    links: [
      { text: '插件市场', href: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/tree/market' },
    ],
  },
  {
    title: '上游',
    links: [
      { text: 'DeepSeek Harness', href: 'https://github.com/deepseek-ai/deepseek-harness' },
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
        <p class="ab-footer__tagline">住在平台里的 AI，不是关键词回复机。</p>
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
      <span>
        代码
        <a href="https://github.com/aureth-labs/dsh-aurabot-qq/blob/main/LICENSE" target="_blank" rel="noreferrer">
          MIT
        </a>
        ·
        文档
        <a
          href="https://github.com/aureth-labs/dsh-aurabot-qq-docs/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
        >
          MIT
        </a>
      </span>
      <span>
        有问题？
        <a href="https://github.com/aureth-labs/dsh-aurabot-qq-docs/issues/new/choose" target="_blank" rel="noreferrer">
          提 Issue
        </a>
      </span>
    </div>
  </footer>
</template>
