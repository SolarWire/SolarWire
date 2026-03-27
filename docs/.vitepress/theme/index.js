import DefaultTheme from 'vitepress/theme'
import Playground from './Playground.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Playground', Playground)
  }
}
