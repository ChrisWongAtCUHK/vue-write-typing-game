<script setup lang="ts">
import Header from './components/Header.vue'
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
</template>

<style scoped></style>
