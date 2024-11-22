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

The `usePlayer` composable provide a reactive freecaster player instance given
an element ref and player options.

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

- [Composable parameters](src/composables/player.ts#82-L119)
- [Player options](src/types/Player.ts#L164-L356)
- [Player instance](src/types/Player.ts#L1-L78)

### Player component

The `FreecasterPlayer` component is a wrapper around the `usePlayer` composable.
It also provides models and slot props for the player state.

```vue
<script setup lang="ts">
  import { FreecasterPlayer } from '@plutotcool/vue-freecaster'

  const muted = ref<boolean>(false)
  const paused = ref<boolean>(false)
  const volume = ref<boolean>(1)
  const currentTime = ref<boolean>(0)
</script>

<template>
  <FreecasterPlayer
    video-id="..."
    v-model:muted="muted"
    v-model:paused="paused"
    v-model:volume="volume"
    v-model:current-time="currentTime"
  />
</template>
```

```vue
<script setup lang="ts">
  import { FreecasterPlayer } from '@plutotcool/vue-freecaster'
</script>

<template>
  <FreecasterPlayer video-id="...">
    <template #default="{ muted, paused, volume, currentTime }"

    </template>
  </FreecasterPlayer>
</template>
```

- [Component props](src/components/FreecasterPlayer.ts#L6-L10)
- [Component events](src/components/FreecasterPlayer.ts#L13-L19)
