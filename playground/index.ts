import './index.css'
import { createApp, defineCustomElement } from 'vue'
import { FreecasterPlugin } from '../src'
import App from './App.vue'

console.log(import.meta.env.VITE_CUSTOM_ELEMENT === 'true')

if (import.meta.env.VITE_CUSTOM_ELEMENT === 'true') {
  customElements.define('vue-freecaster', defineCustomElement(App, {
    configureApp(app) {
      app.use(FreecasterPlugin)
    }
  }))
} else {
  createApp(App)
    .use(FreecasterPlugin)
    .mount('vue-freecaster')
}
