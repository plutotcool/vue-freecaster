import {
  onMounted,
  onUnmounted,
  watch,
  shallowRef,
  toRef,
  unref,
  type Ref,
  type MaybeRefOrGetter,
  type MaybeRef,
  type HTMLAttributes
} from 'vue'

import type { Player, PlayerOptions, PlayerEvents } from '../types/Player'

const DEFAULT_ATTRIBUTES: HTMLAttributes = {
  class: 'freecaster-player'
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
  'fullscreenxit',
  'viewenter',
  'viewleave',
  'fcplayerDestroy',
  'fcplayerSrcChanged',
  'fcplayerCountdownTick',
  'fcplayerCountdownEnabled',
  'fcplayerCountdownDisabled',
  'fcplayerCountdownZero'
]

export type UsePlayerParameters = {
  /**
   * Freecaster player options
   * @default undefined
   */
  options?: MaybeRef<PlayerOptions | undefined>

  /**
   * Player container element
   * @default undefined
   */
  element?: MaybeRef<HTMLElement | undefined>

  /**
   * Wether the player is enabled
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean | undefined>

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

export function usePlayer({
  element,
  options,
  emit,
  listeners,
  enabled = true
}: UsePlayerParameters = {}): {
  element: Ref<HTMLElement | undefined>
  player: Ref<Player | undefined>
  attributes: Ref<HTMLAttributes>
} {
  element = toRef(element)
  options = toRef(options)
  enabled = toRef(enabled)

  const player = shallowRef<Player | undefined>()
  const attributes = shallowRef<Record<string, any>>({})
  const defaultListener = !emit ? undefined : (event: Event) => (
    emit(<any>event.type, event)
  )

  watch([enabled, options], ([enabled, options]) => {
    if (!enabled) {
      attributes.value =  {}
      return
    }

    attributes.value = <HTMLAttributes>Object
      .entries(options || {})
      .reduce((attributes, [option, value]) => {
        const attribute = (<any>DATA_ATTRIBUTE_NAMES)[option] || option
        attributes[`data-${attribute}`] = value
        return attributes
      }, <any>{
        ...DEFAULT_ATTRIBUTES
      })
  }, {
    deep: true,
    immediate: true
  })

  watch([enabled, () => options.value?.videoId], ([enabled, videoId]) => {
    if (!videoId) {
      remove()
    } else if (enabled) {
      player.value?.loadVideo(videoId)
    }
  })

  onMounted(() => {
    (window._fcpr ||= []).push(update)
  })

  onUnmounted(() => {
    const index = (window._fcpr ||= []).indexOf(update)
    index === -1 || _fcpr.splice(index, 1)
    remove()
  })

  watch([enabled, element], ([enabled, element]) => {
    (enabled && element) || remove()
  })

  function update(value: Player): void {
    unref(enabled) && unref(element)?.id === value.id && set(value)
  }

  function set(value?: Player): void {
    remove()
    player.value = value
    player.value && addListeners(player.value)
  }

  function remove(): void {
    const currentElement = unref(element)
    const parent = currentElement?.parentNode
    const children = parent && Array.from(parent.childNodes)
    const index = currentElement && children?.indexOf(currentElement)
    const sibling = index !== undefined && children?.[index + 1]

    player.value && removeListeners(player.value)
    player.value?.destroy()
    player.value = undefined

    if (currentElement && parent && !currentElement.parentNode) {
      sibling
        ? parent.insertBefore(currentElement, sibling)
        : parent.appendChild(currentElement)
    }
  }

  function addListeners(player: Player): void {
    player.addEventListener('fcplayerSrcChanged', onFcplayerSrcChanged)

    for (const event of EVENTS) {
      const listener = <any>listeners?.[listenerName(event)]

      listener && player.addEventListener(event, listener)
      defaultListener && player.addEventListener(event, defaultListener)
      undefined
    }
  }

  function removeListeners(player: Player): void {
    player.removeEventListener('fcplayerSrcChanged', onFcplayerSrcChanged)

    for (const event of EVENTS) {
      const listener = <any>listeners?.[listenerName(event)]

      listener && player.removeEventListener(event, listener)
      defaultListener && player.removeEventListener(event, defaultListener)
    }
  }

  function onFcplayerSrcChanged(): void {
    if (player.value && !Array.isArray(player.value.config.chapters.list)) {
      player.value.config.chapters.list = []
    }
  }

  return {
    element,
    player,
    attributes
  }
}

function listenerName<T extends string>(event: T) {
  return `on${event[0].toUpperCase()}${event.slice(1)}` as `on${Capitalize<T>}`
}
