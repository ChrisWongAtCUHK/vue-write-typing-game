<script setup lang="ts">
import type ActiveWord from '../models/activeWord.ts'
import Word from './Word.vue'

defineProps<{
  activeWords: Array<ActiveWord>
}>()
</script>

<template>
  <Word
    v-for="activeWord in activeWords"
    :word="activeWord.text"
    :kind="activeWord.kind"
    :x="activeWord.x"
    :y="activeWord.y"
    :is-matched="false"
    :typing-word="``"
  ></Word>
</template>

<style scoped></style>
