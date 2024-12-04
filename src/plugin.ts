/**
 * @module Plugin
 */

import type { Plugin } from 'vue'
import FreecasterPlayer from './components/FreecasterPlayer.vue'

const DEFAULT_SCRIPT = 'https://player.freecaster.com/freecaster/stable/fcplayer.js'
const DEFAULT_COMPONENT = 'FreecasterPlayer'

export interface FreecasterPluginOptions {
  /**
   * Load the freecaster player script if not already loaded. Can be set to
   * true, a custom url, or false to disable loading the script.
   * @default 'https://player.freecaster.com/freecaster/stable/fcplayer.js'
   */
  script?: boolean | string

  /**
   * Register the freecaster player component globally. Can be set to true,
   * a custom component name, or false to disable registering the component.
   * @default 'FreecasterPlayer'
   */
  component?: boolean | string
}

export const FreecasterPlugin = {
  async install(app, options: FreecasterPluginOptions = {}) {
    let {
      script = true,
      component = true
    } = options

    if (script === true) {
      script = DEFAULT_SCRIPT
    }

    if (component === true) {
      component = DEFAULT_COMPONENT
    }

    if (script && typeof window !== 'undefined' && !window.fcplayer) {
      const scriptElement = document.createElement('script')
      scriptElement.async = true
      scriptElement.src = script
      document.head.appendChild(scriptElement)
    }

    if (component) {
      app.component(component, FreecasterPlayer)
    }
  }
} satisfies Plugin<FreecasterPluginOptions>
