<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  const styles = ref<string>()

  let mutationObserver: MutationObserver | undefined

  onMounted(() => {
    if (update()) {
      return
    }

    mutationObserver = new MutationObserver(() => {
      update() && disconnect()
    })

    mutationObserver.observe(document.head, {
      childList: true
    })
  })

  onUnmounted(() => {
    disconnect()
  })

  function disconnect(): void {
    mutationObserver?.disconnect()
    mutationObserver = undefined
  }

  function update(): boolean {
    return !!(styles.value ||= Array
      .from(document.querySelectorAll<HTMLLinkElement>(
        'link[rel="stylesheet"][href^="https://player.freecaster.com/"]'
      ))
      .map(link => `@import ${JSON.stringify(link.href)};`)
      .join('\n')
    )
  }
</script>

<template>
  <component v-if="styles" is="style">
    {{ styles }}
  </component>
</template>
