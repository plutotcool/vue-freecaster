/** @type {Partial<import('typedoc').TypeDocOptions>} */
export default {
  out: 'doc',
  entryPoints: [
    './dist/composables/*.d.ts',
    './dist/components/*.d.ts',
    './dist/types/*.d.ts',
    './dist/plugin.d.ts'
  ],
  tsconfig: 'tsconfig.doc.json',
  cleanOutputDir: true,
  excludeExternals: true,
  categorizeByGroup: true,
  plugin: [
    'typedoc-plugin-vue',
    'typedoc-github-theme'
  ],
  highlightLanguages: [
    'typescript',
    'javascript',
    'shell',
    'vue',
    'css',
    'json'
  ],
  categorizeByGroup: false,
  navigation: {
    includeCategories: true,
    includeGroups: false,
    includeFolders: true
  }
}
