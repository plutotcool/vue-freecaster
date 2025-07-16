import type FreecasterPlayer from '../components/FreecasterPlayer.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FreecasterPlayer: typeof FreecasterPlayer
  }
}
