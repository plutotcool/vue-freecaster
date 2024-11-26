<script setup lang="ts">
  import {
    useAttrs,
    computed,
    type HTMLAttributes
  } from 'vue'

  import { usePlayer } from '../composables/player'
  import type { Player, PlayerOptions, PlayerEvents } from '../types/Player'

  export interface FreecasterPlayerProps extends PlayerOptions {
    class: HTMLAttributes['class']
    enabled?: boolean
  }

  export interface FreecasterPlayerSlots {
    default(props: {
      player: Player | undefined
      paused: boolean
      currentTime: number
      volume: number
      muted: boolean
      readyState: number
    }): any
  }

  export type FreecasterPlayerEmits = PlayerEvents

  const props = defineProps<FreecasterPlayerProps>()
  const slots = defineSlots<FreecasterPlayerSlots>()
  const emit = defineEmits<FreecasterPlayerEmits>()

  const player = defineModel<Player>()
  const muted = defineModel<boolean>('muted', { default: false })
  const paused = defineModel<boolean>('paused', { default: true })
  const volume = defineModel<number>('volume', { default: 1 })
  const currentTime = defineModel<number>('currentTime', { default: 0 })
  const readyState = defineModel<number>('readyState', { default: 0 })

  defineExpose({
    player,
    muted,
    paused,
    volume,
    currentTime,
    readyState
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
    muted,
    paused,
    volume,
    currentTime,
    readyState,
    emit
  })
</script>

<template>
  <div
    ref="element"
    :key="key"
    :class="props.class"
    v-bind="{
      ...attrs,
      ...attributes
    }"
  />
  <slot
    name="default"
    v-bind="{
      player,
      paused,
      muted,
      volume,
      currentTime,
      readyState
    }"
  />
</template>
