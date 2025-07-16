import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'playground')

  console.log(env.VITE_CUSTOM_ELEMENT)

  return {
    root: 'playground',
    build: {
      outDir: '../doc/playground',
    },
    base: env.NODE_ENV === 'production' ? '/vue-freecaster/playground' : '/',

    plugins: [
      vue({
        features: {
          customElement: env.VITE_CUSTOM_ELEMENT === 'true',
          optionsAPI: false
        }
      })
    ]
  }
})
