import { defineConfig } from 'vitepress'

const guide = [
  { text: '框架概览', link: '/guide/what-is-this' },
  { text: '安装准备', link: '/guide/prepare' },
  { text: '安装 DeepSeek Harness', link: '/guide/install' },
  { text: '配置模型', link: '/guide/models' },
  { text: '安装 AuraBot', link: '/guide/install-aurabot' },
  {
    text: '平台连接',
    items: [
      { text: '平台总览', link: '/guide/platforms/' },
      { text: '接入 QQ', link: '/guide/platforms/qq' },
    ],
  },
  {
    text: '运行与配置',
    items: [
      { text: '面板配置', link: '/guide/configure' },
      { text: '平台指令', link: '/guide/commands' },
    ],
  },
  { text: '安装社区模块', link: '/guide/install-plugin' },
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
      { text: '语音合成', link: '/features/tts' },
      { text: '翻唱', link: '/features/cover' },
    ],
  },
  {
    text: '其他功能',
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
  {
    text: '主仓库本体开发',
    items: [
      { text: '框架开发环境', link: '/dev/develop-framework' },
    ],
  },
  {
    text: '插件开发',
    items: [
      { text: '为什么用 TypeScript', link: '/dev/why-typescript' },
      { text: '插件结构', link: '/dev/anatomy' },
      { text: '写第一个插件', link: '/dev/first-plugin' },
      { text: '快速试用模块', link: '/dev/module-quickstart' },
      { text: '构建与发布', link: '/dev/build-release' },
      { text: '发布到市场', link: '/dev/market-publish' },
      { text: '编写面板', link: '/dev/panel' },
    ],
  },
  {
    text: '文档开发',
    items: [
      { text: '开始编写文档', link: '/dev/documentation' },
      { text: '写作规范', link: '/dev/docs-style' },
      { text: '术语表', link: '/dev/glossary' },
      { text: '贡献指南', link: '/dev/contributing' },
    ],
  },
]

const reference = [
  { text: 'V1 模块 API', link: '/reference/module-api' },
  { text: 'V2 插件接口设计', link: '/reference/plugin-api' },
  { text: 'V1 实现要点', link: '/reference/design' },
  { text: '插件市场架构', link: '/reference/architecture' },
  { text: '主框架改造清单', link: '/reference/host-changes' },
  { text: '第三方声明与致谢', link: '/reference/third-party' },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'AuraBot 文档',
  description: 'AuraBot 的安装、使用与插件开发文档',
  base: '/dsh-aurabot-qq-docs/',
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,

  themeConfig: {
    // 每个分区只给自己的侧栏，不互相串：
    // 之前「点功能后入门被排到下面」就是因为两条侧栏都把对方塞进了自己里。
    nav: [
      { text: '入门', link: '/guide/what-is-this' },
      { text: '功能', link: '/features/' },
      { text: '开发', link: '/dev/why-typescript' },
      { text: '参考', link: '/reference/module-api' },
      { text: '链接', link: '/links' },
    ],

    sidebar: {
      '/guide/': [{ text: '入门', items: guide }],
      '/features/': [{ text: '功能', items: features }],
      '/dev/': dev,
      '/reference/': [{ text: '参考', items: reference }],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/aureth-labs/dsh-aurabot-qq-docs' }],

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/aureth-labs/dsh-aurabot-qq-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
  },
})
