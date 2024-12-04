import {
  onMounted,
  onUnmounted,
  watch,
  shallowRef,
  toRef,
  isRef,
  type Ref,
  type MaybeRefOrGetter,
  type MaybeRef,
  type HTMLAttributes
} from 'vue'

import type { Player, PlayerOptions, PlayerEvents } from '../types/Player'

type PlayerAttributes = HTMLAttributes & Record<string, string>

export interface UsePlayerParameters {
  /**
   * Freecaster player options
   * @default undefined
   */
  options?: MaybeRef<PlayerOptions | undefined>

  /**
   * Wether the player is enabled
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean | undefined>

  /**
   * Optional paused model that reads and controls the player state
   * @default undefined
   */
  paused?: Ref<boolean>

  /**
   * Optional muted model that reads and controls the player state
   * @default undefined
   */
  muted?: Ref<boolean>

  /**
   * Optional volume model that reads and controls the player state
   * @default undefined
   */
  volume?: Ref<number>

  /**
   * Optional currentTime model that reads and controls the player state
   * @default undefined
   */
  currentTime?: Ref<number>

  /**
   * Optional fullscreen model that reads and controls the player state
   * @default undefined
   */
  fullscreen?: Ref<boolean>

  /**
   * Optional readyState model that only reads the player state
   * @default undefined
   */
  readyState?: Ref<number>

  /**
   * Optional player model returned by the composable, fallbacks to an empty ref
   * @default undefined
   */
  player?: MaybeRef<Player | undefined>

  /**
   * Optional container element ref returned by the composables, fallbacks to an
   * empty ref
   * @default undefined
   */
  element?: MaybeRef<HTMLElement | undefined>

  /**
   * Default event listener, called for all events
   * @default undefined
   */
  emit?: <Type extends keyof PlayerEvents = keyof PlayerEvents>(
    type: Type,
    ...args: PlayerEvents[Type]
  ) => void

  /**
   * Event listeners
   * @default undefined
   */
  listeners?: {
    [Name in `on${Capitalize<keyof PlayerEvents>}`]?: (...args: PlayerEvents[
      Name extends `on${infer Event}` ? Uncapitalize<Event> : never
    ]) => void
  }
}

interface UsePlayerContext extends UsePlayerParameters {
  listeners: Required<UsePlayerParameters>['listeners']
  options: Ref<PlayerOptions | undefined>
  enabled: Ref<boolean | undefined>
  player: Ref<Player | undefined>
  element: Ref<HTMLElement | undefined>
  attributes: Ref<PlayerAttributes>
  key: Ref<number>
}

export function usePlayer(parameters: UsePlayerParameters = {}): UsePlayerContext {
  const {
    element,
    options,
    enabled,
    player,
    listeners = {}
  } = parameters

  const context: UsePlayerContext = {
    ...parameters,
    listeners,
    key: shallowRef(0),
    attributes: shallowRef<PlayerAttributes>({}),
    element: toRef(element),
    options: toRef(options),
    enabled: toRef(enabled),
    player: isRef(player) ? player : shallowRef(player)
  }

  useChaptersListPatch(context)
  useVolume(context)
  usePaused(context)
  useCurrentTime(context)
  useFullscreen(context)
  useReadyState(context)
  useListeners(context)
  useAttributes(context)
  useKey(context)
  useLifecycle(context)

  return context
}

const DEFAULT_ATTRIBUTES: PlayerAttributes = {
  class: 'freecaster-player',
  'data-playsinline': 'true'
}

const DATA_ATTRIBUTE_NAMES: Partial<Record<keyof PlayerOptions, string>> = {
  videoId: 'video-id',
  watermarkEnabled: 'watermark.enabled',
  thumbnailsSrc: 'thumbnails.src',
  subtitlesDefaultLang: 'subtitles.default_lang',
  subtitlesLang: 'subtitles.lang',
  subtitlesNative: 'subtitles.native',
  floatOnScroll: 'float_on_scroll',
  chaptersEnabled: 'chapters.enabled',
  chaptersStyle: 'chapters.style',
  chaptersList: 'chapters.list',
  audioOnly: 'audio_only',
  trackersGaEnabled: 'trackers.ga.enabled',
  trackersGaTagIds: 'trackers.ga.tag_ids string',
  speedOptions: 'speed.options',
  speedLabels: 'speed.labels'
}

const EVENTS: (keyof PlayerEvents)[] = [
  // Standard video events
  'abort',
  'canplay',
  'canplaythrough',
  'durationchange',
  'emptied',
  'encrypted',
  'ended',
  'error',
  'load',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'timeupdate',
  'volumechange',
  'waiting',
  'waitingforkey',
  'enterpictureinpicture',
  'leavepictureinpicture',
  'resize',

  // Freecaster player events
  'fullscreenenter',
  'fullscreenexit',
  'viewenter',
  'viewleave',
  'fcplayerDestroy',
  'fcplayerSrcChanged',
  'fcplayerCountdownTick',
  'fcplayerCountdownEnabled',
  'fcplayerCountdownDisabled',
  'fcplayerCountdownZero'
]

function create(
  context: Pick<UsePlayerContext, 'listeners' | 'player' | 'element'>,
  value: Player
): void {
  remove(context)
  context.player.value = value
  bind(context)
}

function remove(
  context: Pick<UsePlayerContext, 'listeners' | 'player' | 'element'>
): void {
  const currentElement = context.element.value
  const parent = currentElement?.parentNode
  const children = parent && Array.from(parent.childNodes)
  const index = currentElement && children?.indexOf(currentElement)
  const sibling = index !== undefined && children?.[index + 1]

  unbind(context)
  context.player.value?.destroy()
  context.player.value = undefined

  if (!currentElement || !parent || currentElement.parentNode) {
    return
  }

  sibling
    ? parent.insertBefore(currentElement, sibling)
    : parent.appendChild(currentElement)
}

function bind({
  listeners,
  player
}: Pick<UsePlayerContext, 'listeners' | 'player'>): void {
  if (!player.value) {
    return
  }

  for (const event of EVENTS) {
    const listener = listeners?.[listenerName(event)]
    listener && player.value.addEventListener(event, <any>listener)
  }
}

function unbind({
  listeners,
  player
}: Pick<UsePlayerContext, 'listeners' | 'player'>): void {
  if (!player.value) {
    return
  }

  for (const event of EVENTS) {
    const listener = listeners?.[listenerName(event)]
    listener && player.value.removeEventListener(event, <any>listener)
  }
}

function useLifecycle({
  enabled,
  options,
  ...context
}: UsePlayerContext): void {
  const initialize = (value: Player) => {
    if (enabled.value && context.element.value?.id === value.id) {
      create(context, value)
    }
  }

  watch([enabled, () => options.value?.videoId], ([enabled, videoId]) => {
    if (!videoId) {
      remove(context)
    } else if (enabled) {
      context.player.value?.loadVideo(videoId)
    }
  })

  watch([enabled, context.element], ([enabled, element]) => {
    if (!enabled || !element) {
      remove(context)
    }
  })

  onMounted(() => {
    (window._fcpr ||= []).push(initialize)
  })

  onUnmounted(() => {
    const index = (window._fcpr ||= []).indexOf(initialize)
    index === -1 || _fcpr.splice(index, 1)
    remove(context)
  })
}

function useListeners({
  listeners,
  emit
}: Pick<UsePlayerContext, 'listeners' | 'emit'>): void {
  if (!emit) {
    return
  }

  const defaultListener = ((event: Event) => emit(<any>event.type, event))

  for (const event of EVENTS) {
    const name = listenerName(event)
    const listener = listeners[name]

    listeners[name] = !listener ? defaultListener : (event: Event) => {
      listener(<any>event)
      defaultListener(event)
    }
  }
}

function usePaused({
  listeners,
  player,
  options,
  paused
}: UsePlayerContext): void {
  if (!paused) {
    return
  }

  const { onPlay, onPause } = listeners
  let freeze = false

  const update = () => {
    const value = player.value ? player.value.paused : true
    freeze = paused.value !== value
    paused.value = value
  }

  listeners.onPlay = !onPlay ? update : (event: Event) => {
    update()
    onPlay(event)
  }

  listeners.onPause = !onPause ? update : (event: Event) => {
    update()
    onPause(event)
  }

  watch([player, () => options.value?.videoId], (_, [oldPlayer,]) => {
    oldPlayer || update()
  })

  watch([paused, player], ([paused, player]) => {
    if (freeze) {
      freeze = false
      return
    }

    paused ? player?.pause() : player?.play()
  })
}

function useVolume({
  listeners,
  player,
  volume,
  muted
}: UsePlayerContext): void {
  let freezeMuted = false
  let freezeVolume = false
  let mutedValue = muted?.value
  let volumeValue = volume?.value

  const {
    onVolumechange: listener,
    onFcplayerSrcChanged: resetListener
  } = listeners

  const updateMuted = muted && (() => {
    freezeMuted = mutedValue !== muted.value
    muted.value = !!mutedValue
  })

  const updateVolume = volume && (() => {
    freezeVolume = volumeValue !== volume.value
    volume.value = typeof volumeValue === 'number' ? volumeValue : 1
  })

  const reset = () => {
    if (player.value) {
      player.value.muted = !!mutedValue
      player.value.volume = typeof volumeValue === 'number' ? volumeValue : 1
    }
  }

  const update = () => {
    if (player.value?.readyState || 0 >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      mutedValue = player.value!.muted
      volumeValue = player.value!.volume
      updateMuted?.()
      updateVolume?.()
    }
  }

  listeners.onFcplayerSrcChanged = !resetListener ? reset : (event: Event) => {
    reset()
    resetListener(event)
  }

  listeners.onVolumechange = !listener ? update : (event: Event) => {
    update()
    listener(event)
  }

  muted && watch([muted, player], ([muted, player]) => {
    if (freezeMuted) {
      freezeMuted = false
      return
    }

    if (player) {
      player.muted = muted
    }
  })

  volume && watch([volume, player], ([volume, player]) => {
    if (freezeVolume) {
      freezeVolume = false
      return
    }

    if (player) {
      player.volume = volume
    }
  })
}

function useCurrentTime({
  listeners,
  player,
  options,
  currentTime
}: UsePlayerContext): void {
  if (!currentTime) {
    return
  }

  const { onTimeupdate: listener } = listeners

  let freeze = false

  const update = () => {
    const value = player.value ? player.value.currentTime : 0
    freeze = value !== currentTime.value
    currentTime.value = value
  }

  listeners.onTimeupdate = !listener ? update : (event: Event) => {
    update()
    listener(event)
  }

  watch([player, () => options.value?.videoId], update)

  watch([currentTime, player], ([currentTime, player]) => {
    if (freeze) {
      freeze = false
      return
    }

    if (player) {
      player.currentTime = currentTime
    }
  })
}

function useFullscreen({
  listeners,
  player,
  fullscreen
}: UsePlayerContext): void {
  if (!fullscreen) {
    return
  }

  const {
    onFullscreenenter: enterListener,
    onFullscreenexit: exitListener
  } = listeners

  let freeze = false

  const enter = () => {
    freeze = !fullscreen.value
    fullscreen.value = true
  }

  const exit = () => {
    freeze = !!fullscreen.value
    fullscreen.value = false
  }

  listeners.onFullscreenenter = !enterListener ? enter : (event: Event) => {
    enter()
    enterListener(event)
  }

  listeners.onFullscreenexit = !exitListener ? exit : (event: Event) => {
    exit()
    exitListener(event)
  }

  watch([fullscreen, player], ([fullscreen, player]) => {
    if (freeze) {
      freeze = false
      return
    }

    fullscreen ? player?.requestFullscreen() : document?.exitFullscreen()
  })
}

function useReadyState({
  listeners,
  player,
  options,
  readyState
}: UsePlayerContext): void {
  if (!readyState) {
    return
  }

  const { onLoadeddata: listener } = listeners

  const update = () => {
    readyState.value = player.value ? player.value.readyState : 0
  }

  listeners.onLoadeddata = !listener ? update : (event: Event) => {
    update()
    listener(event)
  }

  watch([player, () => options.value?.videoId], update)
}

function useAttributes({
  enabled,
  options,
  attributes
}: UsePlayerContext): void {
  watch([enabled, options], ([enabled, options]) => {
    attributes.value = enabled ? resolveAttributes(options) : {}
  }, {
    deep: true,
    immediate: true
  })
}

function useKey({
  enabled,
  options,
  key
}: UsePlayerContext): void {
  watch([() => options.value?.videoId, enabled], (
    [videoId, enabled],
    [oldVideoId]
  ) => {
    if (!enabled || (!videoId !== !oldVideoId)) {
      key.value++
    }
  })
}

function useChaptersListPatch({
  listeners,
  player
}: UsePlayerContext): void {
  const update = () => {
    if (player.value && !Array.isArray(player.value.config.chapters.list)) {
      player.value.config.chapters.list = []
    }
  }

  const { onFcplayerSrcChanged: listener } = listeners

  listeners.onFcplayerSrcChanged = !listener ? update : (event: Event) => {
    update()
    listener(event)
  }
}

function resolveAttributes(options: PlayerOptions = {}): PlayerAttributes {
  const attributes = Object
    .entries(options)
    .reduce((attributes, [option, value]) => {
      const attribute = (<any>DATA_ATTRIBUTE_NAMES)[option] || option
      attributes[`data-${attribute}`] = value
      return attributes
    }, <PlayerAttributes>{
      ...DEFAULT_ATTRIBUTES
    })

  return attributes
}

function listenerName<T extends string>(name: T) {
  return `on${name[0].toUpperCase()}${name.slice(1)}` as `on${Capitalize<T>}`
}
