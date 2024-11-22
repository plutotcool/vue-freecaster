<script setup lang="ts">
  import { ref } from 'vue'

  const mounted = ref(true)
  const enabled = ref(true)

  const ids = [
    '991850fa-301f-44b2-aa3b-9d69d5a66cc9',
    '991853bc-8a06-41da-ac6d-f4b1d4a71f21'
  ]

  const index = ref(0)
</script>

<template>
  <main>
    <h1>vue-freecaster</h1>
    <div>
      <button @click="mounted = !mounted">
        {{ mounted ? 'unmount' : 'mount' }}
      </button>
      <button @click="enabled = !enabled">
        {{ enabled ? 'disable' : 'enable' }}
      </button>
      <button @click="index = (index + 1) % ids.length">
        {{ index < 0 ? 'load' : 'reload' }}
      </button>
      <button :disabled="index < 0" @click="index = -1">
        unload
      </button>
    </div>
    <div>
      <FreecasterPlayer
        v-if="mounted"
        class="player"
        :video-id="index < 0 ? undefined : ids[index]"
        :enabled="enabled"
        controls
        autoplay
      >
        <template #default="values">
          <pre>{{ values }}</pre>
        </template>
      </FreecasterPlayer>
    </div>
    <div>
      <a
        target="_blank"
        href="https://github.com/plutotcool/vue-freecaster"
      >
        github repository
      </a>
    </div>
  </main>
</template>

<style>
  main {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 40px;
  }

  h1 {
    margin-bottom: 10px;
    font-size: 2em;
  }

  main > div:not(:last-child) {
    margin-bottom: 20px;
  }

  pre, pre::before, button, button::before, .player {
    border-radius: 10px;
  }

  pre, button {
    position: relative;
  }

  pre::before, button::before {
    content: '';
    background-color: #e9e9e9;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: -1;
    transition: opacity .3s, transform .3s;
  }

  button {
    background: transparent;
    appearance: none;
    border: none;
    margin: 10px 10px 0 0;
    font: inherit;
    padding: 15px 20px;
    min-width: 130px;
    outline: none;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
  }

  button:not([disabled]):active::before {
    opacity: 1;
    transform: scale(0.95);
    transition: opacity .2s, transform ease-out .1s;
  }

  button[disabled] {
    pointer-events: none;
  }

  .player {
    position: relative;
    margin: 0;
    display: block;
  }

  pre {
    padding: 25px;
    margin: 20px 0 0 0;
  }

  @media (hover: hover) {
    button:not([disabled]):active::before {
      opacity: 1;
      transform: scale(1.01);
      transition: opacity .2s, transform ease-out .1s;
    }

    button:not([disabled]):not(:active):hover::before {
      opacity: 1;
      transform: scale(1.05);
      transition: opacity .3s, transform ease-out .15s;
    }
  }
</style>
