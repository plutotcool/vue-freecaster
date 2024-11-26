# vue-freecaster

Freecaster video player integration for vue.

- [See demo](https://plutotcool.github.io/vue-freecaster)
- [Freecaster player documentation](https://docs.freecaster.com/player/index.html)

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

- [Plugin options](src/plugin.ts#L7-L21)

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

- [Composable parameters](src/composables/player.ts#L18-L98)
- [Player options](src/types/Player.ts#L164-L368)
- [Player instance](src/types/Player.ts#L1-L78)

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
      fullscreen
    }"
  >
    <!-- ... !-->
  </FreecasterPlayer>
</template>
```

- [Component props](src/components/FreecasterPlayer.vue#L11-L13)
- [Component events](src/types/PlayerEvents.vue#L80-L162)
