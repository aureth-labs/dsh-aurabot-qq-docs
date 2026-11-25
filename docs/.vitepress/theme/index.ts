import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import './custom.css'
import SiteFooter from './components/SiteFooter.vue'
import Diagram from './components/Diagram.vue'
import ArchStack from './components/ArchStack.vue'
import MessageFlow from './components/MessageFlow.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(SiteFooter),
    })
  },
  enhanceApp({ app }) {
    app.component('Diagram', Diagram)
    app.component('ArchStack', ArchStack)
    app.component('MessageFlow', MessageFlow)
  },
} satisfies Theme
