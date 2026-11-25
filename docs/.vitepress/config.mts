import { defineConfig } from 'vitepress'

// 站点本身挂在 https://aureth-labs.github.io/dsh-aurabot-qq-docs/ 下，
// 而 llms.txt 是 public/ 里的静态文件，VitePress 不会给它补 base 前缀，
// 所以这类「非页面」链接一律写绝对地址，不用相对路径。
const SITE = 'https://aureth-labs.github.io/dsh-aurabot-qq-docs'

const guide = [
  { text: '这是什么', link: '/guide/what-is-this' },
  { text: '装 DeepSeek Harness', link: '/guide/install' },
  { text: '配置模型', link: '/guide/models' },
  { text: '安装 AuraBot', link: '/guide/install-aurabot' },
  { text: '接入 QQ', link: '/guide/connect-qq' },
  { text: '认识面板', link: '/guide/configure' },
  { text: 'QQ 命令与白名单', link: '/guide/commands' },
  { text: '装社区模块', link: '/guide/install-plugin' },
  { text: '常见问题', link: '/guide/faq' },
]

const features = [
  { text: '功能总览', link: '/features/' },
  {
    text: '聊天',
    items: [
      { text: '人格、心情与群聊', link: '/features/chat' },
      { text: '记忆', link: '/features/memory' },
      { text: '表情包', link: '/features/sticker' },
    ],
  },
  {
    text: '说和唱',
    items: [
      { text: '语音', link: '/features/voice' },
      { text: 'TTS：换一个嗓子', link: '/features/tts' },
      { text: '翻唱', link: '/features/cover' },
    ],
  },
  {
    text: '其它本事',
    items: [
      { text: '画图', link: '/features/image' },
      { text: '点歌', link: '/features/music' },
      { text: 'QQ 空间', link: '/features/qzone' },
      { text: '刷 B 站', link: '/features/bilibili' },
      { text: '桌宠', link: '/features/pet' },
      { text: '主动搭话', link: '/features/speakup' },
    ],
  },
]

const dev = [
  { text: '为什么用 TypeScript', link: '/dev/why-typescript' },
  { text: '插件结构', link: '/dev/anatomy' },
  { text: '写第一个插件', link: '/dev/first-plugin' },
  { text: '十五分钟写一个模块', link: '/dev/module-quickstart' },
  { text: '构建与发布', link: '/dev/build-release' },
  { text: '面板：client → dist', link: '/dev/panel' },
  { text: '如何开发我们的框架', link: '/dev/develop-framework' },
  { text: '文档写作规范', link: '/dev/docs-style' },
  { text: '贡献指南', link: '/dev/contributing' },
]

const reference = [
  { text: '模块 API 速查', link: '/reference/module-api' },
  { text: '插件接口 v2', link: '/reference/plugin-api' },
  { text: '设计要点', link: '/reference/design' },
  { text: '架构与决策', link: '/reference/architecture' },
  { text: '主框架改造清单', link: '/reference/host-changes' },
  { text: '第三方与致谢', link: '/reference/third-party' },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'AuraBot 文档',
  description: '住在 QQ 里的 AI 伙伴——安装、接入、画图语音翻唱，到写自己的模块',
  base: '/dsh-aurabot-qq-docs/',
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,

  themeConfig: {
    nav: [
      { text: '入门', link: '/guide/what-is-this' },
      { text: '功能', link: '/features/' },
      { text: '开发', link: '/dev/why-typescript' },
      { text: '参考', link: '/reference/module-api' },
      {
        text: '链接',
        items: [
          { text: '主仓库（宿主）', link: 'https://github.com/aureth-labs/dsh-aurabot-qq' },
          { text: '社区模块仓库', link: 'https://github.com/aureth-labs/dsh-aurabot-qq-mods' },
          { text: '模板仓库', link: 'https://github.com/aureth-labs/dsh-aurabot-qq-plugins-template' },
          {
            text: '市场镜像（market.json）',
            link: 'https://github.com/aureth-labs/dsh-aurabot-qq-market-dev/blob/market/market.json',
          },
          { text: 'llms.txt（给 AI 看）', link: `${SITE}/llms.txt` },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        { text: '入门', items: guide },
        { text: '功能', items: features },
      ],
      '/features/': [
        { text: '功能', items: features },
        { text: '入门', items: guide },
      ],
      '/dev/': [
        { text: '开发', items: dev },
        { text: '参考', items: reference },
      ],
      '/reference/': [
        { text: '参考', items: reference },
        { text: '开发', items: dev },
      ],
      '/': [
        { text: '入门', items: guide },
        { text: '功能', items: features },
        { text: '开发', items: dev },
        { text: '参考', items: reference },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/aureth-labs/dsh-aurabot-qq-docs' }],

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/aureth-labs/dsh-aurabot-qq-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    footer: {
      message: '文档开源在 GitHub，插件与模块的代码各在各的作者仓库里。',
      copyright: 'AuraBot · MIT · 文档有问题直接提 Issue',
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
  },
})