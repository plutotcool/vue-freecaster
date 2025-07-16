import type { FreecasterPlayer } from '../components/vue-freecaster'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FreecasterPlayer: typeof FreecasterPlayer
  }
}
