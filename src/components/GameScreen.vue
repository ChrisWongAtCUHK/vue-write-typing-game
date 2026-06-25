<script setup lang="ts">
import { ref, watch } from 'vue'
import type ActiveWord from '@/types/activeWord.ts'
import type Particle from '@/types/particle.ts'
import Word from './Word.vue'

const props = defineProps<{
  activeWords: Array<ActiveWord>
  typingWord: string
  matchedWordId: number | null
  errorPulse: number
  healthFlash: number
  bombPulse: number
  particles: Array<Particle>
}>()

const matched =
  props.activeWords.find((w) => w.id === props.matchedWordId) || null

const shaking = ref(false)
const hurting = ref(false)
const bombing = ref(false)
const settingsOpen = ref(false)

watch(
  () => props.errorPulse,
  (ep) => {
    if (!ep) {
      return
    }

    shaking.value = true
    setTimeout(() => {
      shaking.value = false
    }, 280)
  },
)

watch(
  () => props.healthFlash,
  (hf) => {
    if (!hf) {
      return
    }

    hurting.value = true
    setTimeout(() => {
      hurting.value = false
    }, 380)
  },
)

watch(
  () => props.bombPulse,
  (bp) => {
    if (!bp) {
      return
    }

    bombing.value = true
    setTimeout(() => {
      bombing.value = false
    }, 700)
  },
)

const classes = ['game']
if (shaking) {
  classes.push('shake')
}

if (bombing) {
  classes.push('bomb-kick')
}
</script>

<template>
  <div :class="classes.join(' ')">
    <div class="content">
      <Word
        v-for="w in activeWords"
        :word="w.text"
        :kind="w.kind"
        :x="w.x"
        :y="w.y"
        :is-matched="w.id === matchedWordId"
        :typing-word="w.id === matchedWordId ? typingWord : ``"
      ></Word>
    </div>
  </div>
</template>

<style scoped></style>
