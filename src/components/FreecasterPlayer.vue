<script setup lang="ts">
  import { useAttrs, computed } from 'vue'
  import { usePlayer } from '../composables/player'
  import type { Player, PlayerOptions, PlayerEvents } from '../types/Player'

  export interface FreecasterPlayerProps extends PlayerOptions {
    enabled?: boolean
  }

  export interface FreecasterPlayerSlots {
    default(props: {
      player: Player | undefined
      paused: boolean
      muted: boolean
      fullscreen: boolean
      currentTime: number
      volume: number
      readyState: number
      currentSubtitles: TextTrack | undefined
      subtitles: TextTrack[]
    }): any
  }

  export type FreecasterPlayerEmits = PlayerEvents

  const props = defineProps<FreecasterPlayerProps>()
  const slots = defineSlots<FreecasterPlayerSlots>()
  const emit = defineEmits<FreecasterPlayerEmits>()

  const player = defineModel<Player>()
  const paused = defineModel<boolean>('paused', { default: true })
  const muted = defineModel<boolean>('muted', { default: false })
  const fullscreen = defineModel<boolean>('fullscreen', { default: false })
  const volume = defineModel<number>('volume', { default: 1 })
  const currentTime = defineModel<number>('currentTime', { default: 0 })
  const readyState = defineModel<number>('readyState', { default: 0 })
  const currentSubtitles = defineModel<TextTrack>('currentSubtitles')
  const subtitles = defineModel<TextTrack[]>('subtitles', { default: [] })

  defineExpose({
    player,
    paused,
    muted,
    fullscreen,
    volume,
    currentTime,
    readyState,
    currentSubtitles,
    subtitles
  })

  const enabled = computed(() => props.enabled)
  const options = computed(() => ({
    videoId: props.videoId,
    height: props.height,
    width: props.width,
    preload: props.preload,
    volume: props.volume,
    autoplay: props.autoplay,
    autopause: props.autopause,
    controls: props.controls,
    muted: props.muted,
    loop: props.loop,
    cast: props.cast,
    playsinline: props.playsinline,
    watermarkEnabled: props.watermarkEnabled,
    lang: props.lang,
    stats: props.stats,
    noads: props.noads,
    thumbnailsSrc: props.thumbnailsSrc,
    poster: props.poster,
    stretching: props.stretching,
    subtitlesDefaultLang: props.subtitlesDefaultLang,
    subtitlesLang: props.subtitlesLang,
    subtitlesNative: props.subtitlesNative,
    floatOnScroll: props.floatOnScroll,
    multiplay: props.multiplay,
    chaptersEnabled: props.chaptersEnabled,
    chaptersStyle: props.chaptersStyle,
    chaptersList: props.chaptersList,
    audioOnly: props.audioOnly,
    trackersGaEnabled: props.trackersGaEnabled,
    trackersGaTagIds: props.trackersGaTagIds,
    speedOptions: props.speedOptions,
    speedLabels: props.speedLabels
  }))

  const attrs = useAttrs()

  const { element, key, attributes } = usePlayer({
    enabled,
    options,
    player,
    paused,
    muted,
    fullscreen,
    volume,
    currentTime,
    readyState,
    emit,
    currentSubtitles,
    subtitles,
  })
</script>

<template>
  <div
    ref="element"
    v-bind="{
      ...attrs,
      ...attributes
    }"
    :class="[
      attrs.class,
      attributes.class
    ].filter(Boolean)"
  />
  <slot
    name="default"
    v-bind="{
      player,
      paused,
      muted,
      fullscreen,
      volume,
      currentTime,
      readyState,
      currentSubtitles,
      subtitles
    }"
  />
</template>
