import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const environment = process.env.NODE_ENV

export default defineConfig({
  root: 'playground',
  build: {
    outDir: '../doc/playground',
  },
  base: environment === 'production' ? '/vue-freecaster/playground' : '/',
  plugins: [
    vue()
  ]
})
