<script setup lang="ts">
  import { ref } from 'vue'
  import { type FreecasterPlayerSlots, FreecasterStyle } from '../src'

  const customElement = import.meta.env.VITE_CUSTOM_ELEMENT

  const ids = [
    '9ab90057-8d0f-409d-b89c-5213581454e3',
    '9d7afc5d-5d03-4230-a69b-6cd3bec61899',
    '991853bc-8a06-41da-ac6d-f4b1d4a71f21',
    '9bee5997-47d7-422f-bfbc-5de00168169a'
  ]

  const mounted = ref(true)
  const index = ref(0)
  const id = ref('')

  const paused = ref(false)
  const muted = ref(true)
  const currentTime = ref(0)
  const preview = ref(false)

  function onSubmit(): void {
    if (!id.value) {
      index.value = (index.value + 1) % ids.length
      return
    }

    const idIndex = ids.indexOf(id.value)
    index.value = idIndex >= 0 ? idIndex : ids.push(id.value) - 1
  }

  function formatObject(
    object: Record<string | number, any>,
    indentation: number = 0
  ): string {
    const array = Array.isArray(object)
    const padding = '  '.repeat(indentation + 1)
    const keys = Object.getOwnPropertyNames(object)
    let formatted = ''

    for (const key in object) {
      let value = object[key]

      formatted += `,\n${padding}${array ? '' : `${key}: `}`

      if (value instanceof TextTrack) {
        value = {
          id: value.id,
          kind: value.kind,
          language: value.language,
          label: value.label,
          mode: value.mode
        }
      }

      if (typeof value === 'string') {
        formatted  += JSON.stringify(value)
      }  else if (Array.isArray(value) || value?.constructor === Object) {
        formatted += formatObject(value, indentation + 1)
      } else {
        formatted += `${value}`
      }
    }

    formatted = `${
      array ? '[' : '{'
    }${
      formatted.slice(1)
    }\n${
      '  '.repeat(indentation)
    }${
      array ? ']' : '}'
    }`

    return formatted
  }
</script>

<template>
  <FreecasterStyle v-if="customElement"/>
  <main>
    <h1>vue-freecaster</h1>
    <div>
      <form @submit.prevent="onSubmit">
        <button type="button" @click="mounted = !mounted">
          {{ mounted ? 'unmount' : 'mount' }}
        </button>
        <button
          type="submit"
          @mouseenter="preview = true"
          @mouseleave="preview = false"
        >
          load
        </button>
        <input
          v-model="id"
          :placeholder="!preview ? 'video id' : ids[(index + 1) % ids.length]"
        />
      </form>
    </div>
    <div>
      <FreecasterPlayer
        v-if="mounted"
        class="player"
        :video-id="ids[index]"
        controls
        autoplay
        subtitles-default-lang="fr"
        #default="state"
        v-model:paused="paused"
        v-model:muted="muted"
        v-model:current-time="currentTime"
      >
        <div class="controls">
          <button @click="paused = !paused">
            {{ paused ? 'play' : 'pause' }}
          </button>
          <button @click="muted = !muted">
            {{ muted ? 'unmute' : 'mute' }}
          </button>
          <button @click="currentTime -= 5">
            backward
          </button>
          <button @click="currentTime += 5">
            forward
          </button>
        </div>
        <pre>{{ formatObject(state) }}</pre>
      </FreecasterPlayer>
    </div>
    <div>
      <a
        target="_blank"
        href="https://github.com/plutotcool/vue-freecaster"
      >
        github
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

  form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    position: relative;
  }

  form button {
    flex-grow: 1;
  }

  form div {
    min-width: 240px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 50%;
  }

  main > div:not(:last-child) {
    margin-bottom: 10px;
  }

  pre, pre::before, button, button::before, input, .player {
    border-radius: 10px;
  }

  pre, button, input {
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

  button, input {
    background: transparent;
    appearance: none;
    border: none;
    font: inherit;
    padding: 15px 20px;
    outline: none;
    user-select: none;
  }

  button {
    min-width: 110px;
    cursor: pointer;
  }

  input {
    background-color: #e9e9e9b3;
    flex-grow: 1;
    flex-shrink: 1;
    color: #0000ff;
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
    display: block !important;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    margin-top: 10px;
    position: relative;

    button {
      flex-grow: 1;
    }
  }

  pre {
    padding: 25px;
    margin: 10px 0 0 0;
    overflow: hidden;
  }

  a {
    color: #0000ff;
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
