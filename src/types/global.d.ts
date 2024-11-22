declare module globalThis {
  import type { Player } from './Player'
  var fcplayer: ((id: string) => Player | null) | undefined
  var _fcpr: ((player: Player) => void | Promise<void>)[]
}
