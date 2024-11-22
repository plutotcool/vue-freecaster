<script setup lang="ts">
  import {
    defineProps,
    defineEmits,
    computed,
    watch,
    useAttrs,
    ref,
    type HTMLAttributes
  } from 'vue'

  import { usePlayer } from '../composables/player'
  import type { PlayerOptions, PlayerEvents } from '../types/Player'

  export interface FreecasterPlayerProps extends PlayerOptions {
    class: HTMLAttributes['class']
    enabled?: boolean
    paused?: boolean
    currentTime?: number
    readyState?: number
  }

  export type FreecasterPlayerEmits = PlayerEvents & {
    'update:muted': [boolean]
    'update:paused': [boolean],
    'update:volume': [number],
    'update:currentTime': [number]
    'update:readyState': [number]
  }

  export interface FreecasterPlayerSlots {
    default(props: {
      paused: boolean
      currentTime: number
      volume: number
      muted: boolean
      readyState: number
    }): any
  }

  const props = withDefaults(defineProps<FreecasterPlayerProps>(), {
    muted: false,
    paused: true,
    volume: 1,
    currentTime: 0,
    readyState: 0
  })

  const emit = defineEmits<FreecasterPlayerEmits>()
  const slots = defineSlots<FreecasterPlayerSlots>()

  const muted = ref(props.muted)
  const paused = ref(props.paused)
  const volume = ref(props.volume)
  const currentTime = ref(props.currentTime)
  const readyState = ref(props.readyState)
  const key = ref(0)

  const options = computed(() => {
    const {
      enabled,
      paused,
      currentTime,
      readyState,
      ...options
    } = props

    return options
  })

  const attrs = useAttrs()

  const {
    element,
    attributes,
    player,
  } = usePlayer({
    enabled: () => props.enabled,
    options,
    emit,
    listeners: {
      onPlay: onPausedchange,
      onPause: onPausedchange,
      onTimeupdate,
      onVolumechange,
      onLoadeddata
    }
  })

  defineExpose({
    player
  })

  watch([
    player,
    () => props.videoId
  ], (_, [oldPlayer,]) => {
    if (!oldPlayer) {
      onPausedchange()
      onVolumechange()
    }

    onTimeupdate()
    onLoadeddata()
  })

  watch([
    () => props.videoId,
    () => props.enabled
  ], ([videoId, enabled], [oldVideoId]) => {
    if (!enabled || (!videoId !== !oldVideoId)) {
      key.value++
    }
  })

  watch([player, () => props.paused], updatePaused)
  watch([player, () => props.muted], updateMuted)
  watch([player, () => props.volume], updateVolume)
  watch([player, () => props.currentTime], updateCurrentTime)

  watch(paused, () => {
    paused.value === props.paused ||
    emit('update:paused', paused.value)
  })

  watch(muted, () => {
    muted.value === props.muted ||
    emit('update:muted', muted.value)
  })

  watch(volume, () => {
    volume.value === props.volume ||
    emit('update:volume', volume.value)
  })

  watch(currentTime, () => {
    currentTime.value === props.currentTime ||
    emit('update:currentTime', currentTime.value)
  })

  watch(readyState, () => {
    readyState.value === props.readyState ||
    emit('update:readyState', readyState.value)
  })

  function updatePaused(): void {
    if (player.value && player.value.paused !== paused.value) {
      paused.value ? player.value.pause() : player.value.play()
    }
  }

  function updateMuted(): void {
    if (player.value) {
      player.value.muted = muted.value
    }
  }

  function updateVolume(): void {
    if (player.value) {
      player.value.volume = volume.value
    }
  }

  function updateCurrentTime(): void {
    if (player.value) {
      player.value.currentTime = currentTime.value
    }
  }

  function onPausedchange(): void {
    paused.value = player.value ? player.value.paused : true
  }

  function onVolumechange(): void {
    if (player.value) {
      volume.value = player.value.volume
      muted.value = player.value.muted
    }
  }

  function onTimeupdate(): void {
    currentTime.value = player.value?.currentTime || 0
  }

  function onLoadeddata(): void {
    readyState.value = player.value?.readyState || 0
  }
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
      paused,
      currentTime,
      volume,
      muted,
      readyState
    }"
  />
</template>
