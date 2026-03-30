import DefaultTheme from 'vitepress/theme'
import Playground from './Playground.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Playground', Playground)
  }
}
