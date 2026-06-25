<script setup lang="ts">
import Heart from '../assets/images/heart.svg'
import HeartEmpty from '../assets/images/heart-empty.svg'

const props = defineProps<{
  health: number
  hurting: boolean
}>()

const MAX = 3
const safe = Math.max(0, Math.min(MAX, props.health))
</script>
<template>
  <div class="health" :class="{ hurt: hurting }">
    <img v-for="(_, i) in Array.from({ length: MAX})" :key="i" :src="i < safe ? Heart : HeartEmpty" :alt="i < safe ? `hurt-full` : `hurt-empty`"></img>
  </div>
</template>

<style lang="scss" scoped>
div.health {
    display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s ease;

  img {
    width: 22px;
    height: 22px;
    transition: filter 0.2s ease, transform 0.2s ease;
    filter: drop-shadow(0 0 6px var(--danger-glow));
  }

  &.hurt {
    animation: hurtShake 0.35s ease-in-out;
    border-color: var(--danger);
    box-shadow: 0 0 18px var(--danger-glow);
  }
}

@keyframes hurtShake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}
  
</style>
