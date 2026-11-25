import { defineConfig } from 'vitepress'

// 站点本身挂在 https://aureth-labs.github.io/dsh-aurabot-qq-market-dev/ 下，
// 而 llms.txt 是 public/ 里的静态文件，VitePress 不会给它补 base 前缀，
// 所以这类「非页面」链接一律写绝对地址，不用相对路径。
const SITE = 'https://aureth-labs.github.io/dsh-aurabot-qq-market-dev'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AuraBot 插件市场',
  description: '插件索引、构建约定与作者接入指南',
  base: '/dsh-aurabot-qq-market-dev/',
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: '上手', link: '/guide/what-is-this' },
      { text: '开发', link: '/dev/why-typescript' },
      { text: '规范', link: '/ARCHITECTURE' },
      {
        text: '链接',
        items: [
          {
            text: '插件市场镜像（market.json）',
            link: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json',
          },
          { text: '模板仓库', link: 'https://github.com/shangxueink/dsh-aurabot-qq-plugins-template' },
          { text: '示例插件', link: 'https://github.com/shangxueink/dsh-aurabot-qq-market-dev-plugins' },
          { text: '宿主 AuraBot', link: 'https://github.com/aureth-labs/dsh-aurabot-qq' },
          { text: 'llms.txt（给 AI 看）', link: `${SITE}/llms.txt` },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '上手',
          items: [
            { text: '这是什么', link: '/guide/what-is-this' },
            { text: '装 DeepSeek Harness', link: '/guide/install' },
            { text: '配置模型', link: '/guide/models' },
            { text: '接入 QQ', link: '/guide/connect-qq' },
            { text: '安装插件', link: '/guide/install-plugin' },
            { text: '配置 AuraBot', link: '/guide/configure' },
            { text: '写第一个插件', link: '/guide/first-plugin' },
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
      '/dev/': [
        {
          text: '开发',
          items: [
            { text: '为什么用 TypeScript', link: '/dev/why-typescript' },
            { text: '插件结构', link: '/dev/anatomy' },
            { text: '构建与发布', link: '/dev/build-release' },
            { text: '面板：client → dist', link: '/dev/panel' },
            { text: '文档写作规范', link: '/dev/docs-style' },
            { text: '贡献指南', link: '/dev/contributing' },
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
      '/': [
        {
          text: '上手',
          items: [
            { text: '这是什么', link: '/guide/what-is-this' },
            { text: '装 DeepSeek Harness', link: '/guide/install' },
            { text: '配置模型', link: '/guide/models' },
            { text: '接入 QQ', link: '/guide/connect-qq' },
            { text: '安装插件', link: '/guide/install-plugin' },
            { text: '配置 AuraBot', link: '/guide/configure' },
            { text: '写第一个插件', link: '/guide/first-plugin' },
          ],
        },
        {
          text: '开发',
          items: [
            { text: '为什么用 TypeScript', link: '/dev/why-typescript' },
            { text: '插件结构', link: '/dev/anatomy' },
            { text: '构建与发布', link: '/dev/build-release' },
            { text: '面板：client → dist', link: '/dev/panel' },
            { text: '文档写作规范', link: '/dev/docs-style' },
            { text: '贡献指南', link: '/dev/contributing' },
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
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev' }],

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/edit/docs/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    footer: {
      message: '插件代码在作者自己的仓库里，市场只维护索引。',
      copyright: 'AuraBot · 文档有问题直接提 Issue 或改 `docs` 分支',
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
  },
})
