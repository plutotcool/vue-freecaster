import './index.css'
import { createApp } from 'vue'
import { FreecasterPlugin } from '../src'
import App from './App.vue'

createApp(App)
  .use(FreecasterPlugin)
  .mount('#app')
