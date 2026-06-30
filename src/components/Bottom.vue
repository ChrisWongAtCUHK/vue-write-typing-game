<script setup lang="ts">
import Heart from './Heart.vue'

const props = defineProps<{
  currentWord: string
  typingWord: string
  health: number
  hurting: boolean
  onRestart: () => void
}>()

const colorFor = (letter: string, i: number) => {
  const typed = props.typingWord[i]
  if (typed == null) return { color: 'var(--text-faint)' }
  if (typed === letter)
    return { color: 'var(--accent)', textShadow: '0 0 10px var(--accent-glow)' }
  return { color: 'var(--danger)', textShadow: '0 0 10px var(--danger-glow)' }
}
</script>
<template>
  <div class="bottom">
    <Heart :health="health" :hurting="hurting" />
    <div class="word">
      <template v-if="currentWord">
        <div
          v-for="(letter, i) in currentWord.split('')"
          :style="colorFor(letter, i)"
          :key="i"
          class="letter"
        >
          {{ letter }}
        </div>
      </template>
      <template v-else v-for="(letter, i) in `type`.split('')" :key="i">{{
        letter
      }}</template>
    </div>
    <div @click="() => onRestart()" class="restart">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.64784 5C2.78886 2.49297 5.31587 0.75 8.24998 0.75C12.254 0.75 15.5 3.99594 15.5 8C15.5 12.0041 12.254 15.25 8.24998 15.25C5.31587 15.25 2.78886 13.507 1.64784 11M6.24998 5.25008L1 5.25005L1.00001 0"
          stroke="#1F1F1F"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  </div>
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

div.word {
  background: var(--panel);
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-faint);
  padding: 14px 24px;
  text-transform: lowercase;
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 2px;
  min-width: 280px;
  height: 56px;
  text-align: center;
  justify-content: center;
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);

  .letter {
    transition:
      color 0.1s linear,
      text-shadow 0.1s linear;
  }
}

div.restart {
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  background: var(--panel);
  border: 1px solid var(--border);
  transition: all 0.2s ease;

  svg path {
    stroke: var(--text-dim);
    transition: stroke 0.2s ease;
  }

  &:hover {
    border-color: var(--accent);
    background: var(--panel-2);
    transform: rotate(-90deg);

    svg path {
      stroke: var(--accent);
    }
  }
}
</style>
