# vue-freecaster

Freecaster video player integration for vue.

- [Demo](https://plutotcool.github.io/vue-freecaster/playground)
- [Documentation](https://plutotcool.github.io/vue-freecaster)
- [Freecaster documentation](https://docs.freecaster.com/player/index.html)

## Installation

```shell
pnpm install @plutotcool/vue-freecaster
```

## Usage

### Plugin

The plugin loads the required freecaster scripts and globally
registers the `FreecasterPlayer` component in your vue app.

```typescript
import Vue from 'vue';
import { FreecasterPlugin } from '@plutotcool/vue-freecaster'

Vue.use(FreecasterPlugin)
```

- [Plugin options](https://plutotcool.github.io/vue-freecaster/interfaces/Plugin.FreecasterPluginOptions.html)

### Player composable

The `usePlayer` composable provide a reactive freecaster player instance
attached to an element ref.

```vue
<script setup lang="ts">
  import { usePlayer } from '@plutotcool/vue-freecaster'

  const { element, attributes, player } = usePlayer({
    options: {
      videoId: '...'
    }
  })
</script>

<template>
  <div ref="element" v-bind="attributes"/>
</template>
```

- [Composable parameters](https://plutotcool.github.io/vue-freecaster/interfaces/usePlayer.UsePlayerParameters.html)
- [Player options](https://plutotcool.github.io/vue-freecaster/interfaces/Player.PlayerOptions.html)
- [Player instance](https://plutotcool.github.io/vue-freecaster/interfaces/Player.Player.html)

### Player component

The `FreecasterPlayer` component is a wrapper around the `usePlayer` composable.
It also provides models and slot props for the player state.

```vue
<script setup lang="ts">
  import { FreecasterPlayer, type Player } from '@plutotcool/vue-freecaster'

  const player = shallowRef<Player>()
  const muted = ref(false)
  const paused = ref(false)
  const volume = ref(1)
  const currentTime = ref(0)
  const readyState = ref(0)
  const fullscreen = ref(false)
  const subtitles = ref<TextTrack[]>([])
  const currentSubtitles = ref<TextTrack>()
</script>

<template>
  <FreecasterPlayer
    video-id="..."
    v-model="player"
    v-model:muted="muted"
    v-model:paused="paused"
    v-model:volume="volume"
    v-model:current-time="currentTime"
    v-model:ready-state="readyState"
    v-model:fullscreen="fullscreen"
    v-model:subtitles="subtitles"
    v-model:current-subtitles="currentSubtitles"
  />
</template>
```

```vue
<script setup lang="ts">
  import { FreecasterPlayer } from '@plutotcool/vue-freecaster'
</script>

<template>
  <FreecasterPlayer
    video-id="..."
    #default="{
      player,
      muted,
      paused,
      volume,
      currentTime,
      readyState,
      fullscreen,
      subtitles,
      currentSubtitles
    }"
  >
    <!-- ... !-->
  </FreecasterPlayer>
</template>
```

- [Component props](https://plutotcool.github.io/vue-freecaster/interfaces/_FreecasterPlayer__.FreecasterPlayerProps.html)
- [Component slots](https://plutotcool.github.io/vue-freecaster/interfaces/_FreecasterPlayer__.FreecasterPlayerSlots.html)
- [Component events](https://plutotcool.github.io/vue-freecaster/types/_FreecasterPlayer__.FreecasterPlayerEmits.html)
