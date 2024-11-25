import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const environment = process.env.NODE_ENV
const base = process.env.BASE_URL || undefined
const playground = (
  process.env.PLAYGROUND === 'true' ||
  environment === 'development'
)

export default defineConfig({
  root: playground ? 'playground' : '.',
  base,
  build: playground ? undefined : {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    lib: {
      entry: 'src/index.ts',
      name: 'VueFreecaster',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format, name) => `${name}.${extension(format)}`
    }
  },
  plugins: [
    vue(),
    playground ? undefined : dts({
      tsconfigPath: './tsconfig.app.json',
      copyDtsFiles: true,
      entryRoot: 'src',
      exclude: [
        'playground'
      ]
    })
  ]
})

function extension(format: string): string {
  switch (format) {
    case 'es':
      return 'mjs'

    case 'cjs':
      return 'cjs'

    case 'umd':
      return 'js'

    default:
      return `${format}.js`
  }
}
