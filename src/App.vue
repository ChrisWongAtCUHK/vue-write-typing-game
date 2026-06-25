<script setup lang="ts">
import type ActiveWord from './models/activeWord.ts'
import Header from './components/Header.vue'
import GameScreen from './components/GameScreen.vue'

const activeWords: ActiveWord[] = [
  { id: 1, text: 'soup', kind: 'bombclear', x: 50.4193662278893, y: 24 },
  { id: 2, text: 'bug', kind: 'normal', x: 14.951919388628298, y: 52 },
]
</script>

<template>
  <Header
    :wave="1"
    :combo="1"
    :multiplier="2"
    :wpm="10"
    :accuracy="80"
    :score="200"
  />
  <GameScreen :activeWords="activeWords" />
</template>

<style scoped></style>
