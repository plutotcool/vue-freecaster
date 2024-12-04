import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
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
    dts({
      tsconfigPath: './tsconfig.app.json',
      copyDtsFiles: true,
      entryRoot: 'src',
      exclude: [
        'playground'
      ],
      beforeWriteFile: (filePath: string, content: string) => {
        const match = /\/(components|composables)\/([^\/]+?)(?:\.vue)?\.d\.ts$/.exec(filePath)

        switch (match?.[1]) {
          case 'components':
            content = (
              '/**\n' +
              ` * @module <${match[2]}/>\n` +
              ' */\n\n' +
              content
            )
            break

          case 'composables':
            content = (
              '/**\n' +
              ` * @module use${match[2][0].toUpperCase() + match[2].slice(1)}\n` +
              ' */\n\n' +
              content
            )
            break
        }

        return {
          filePath,
          content
        }
      }
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
