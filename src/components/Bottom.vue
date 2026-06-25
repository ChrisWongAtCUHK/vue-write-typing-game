<script setup lang="ts">
import Heart from './Heart.vue'

const props = defineProps<{
  currentWord: string
  typingWord: string
  health: number
  hurting: boolean
  onRestart: () => void
}>()
</script>
<template>
  <div class="bottom"><Heart :health="health" :hurting="hurting" /></div>
</template>

<style lang="scss" scoped>
div.bottom {
  position: relative;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 0 32px;
  background: linear-gradient(
    0deg,
    rgba(6, 7, 10, 0.95) 0%,
    rgba(6, 7, 10, 0.6) 70%,
    transparent 100%
  );
  backdrop-filter: blur(6px);
  z-index: 2;
}
</style>
