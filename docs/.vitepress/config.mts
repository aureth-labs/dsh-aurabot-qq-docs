import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AuraBot 插件市场',
  description: '插件索引、构建约定与作者接入指南',
  base: '/dsh-aurabot-qq-market-dev/',
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/what-is-this' },
      { text: '规范', link: '/ARCHITECTURE' },
      { text: '主框架改造', link: '/HOST-CHANGES' },
      {
        text: '链接',
        items: [
          {
            text: '插件市场镜像（market.json）',
            link: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json',
          },
          { text: '模板仓库', link: 'https://github.com/shangxueink/dsh-aurabot-qq-plugins-template' },
          { text: '示例插件', link: 'https://github.com/shangxueink/dsh-aurabot-qq-market-dev-plugins' },
          { text: 'llms.txt', link: '/llms.txt' },
        ],
      },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '这是什么', link: '/guide/what-is-this' },
          { text: '写第一个插件', link: '/guide/first-plugin' },
        ],
      },
      {
        text: '规范',
        items: [
          { text: '架构与决策', link: '/ARCHITECTURE' },
          { text: '主框架改造清单', link: '/HOST-CHANGES' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev' }],

    editLink: {
      pattern: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/edit/docs/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    footer: {
      message: '插件代码在作者自己的仓库里，市场只维护索引。',
      copyright: 'AuraBot',
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
  },
})
