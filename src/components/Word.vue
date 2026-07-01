<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  word: string
  kind?: 'slow' | 'freeze' | 'heart' | 'bombclear' | 'danger' | 'normal'
  x: number
  y: number
  isMatched: boolean
  typingWord: string
}>()

const KIND_BADGE = {
  slow: 'SLOW',
  freeze: 'FREEZE',
  heart: 'HEART',
  bombclear: 'BOMB',
  danger: 'DANGER',
}

const clampedY = computed(() => Math.min(Math.max(props.y, -20), 90))

let correctCount = 0
if (props.isMatched) {
  for (let i = 0; i < props.typingWord.length && i < props.word.length; i++) {
    if (props.typingWord[i] === props.word[i]) {
      correctCount++
    } else {
      break
    }
  }
}

const progress = computed(() =>
  props.isMatched ? correctCount / props.word.length : 0,
)
const scale = computed(() =>
  props.isMatched ? 1.1 + progress.value * 0.35 : 1,
)
const glowStrength = computed(() => 12 + progress.value * 38)

const colorFor = (letter: string, i: number) => {
  if (!props.isMatched) return undefined
  const typed = props.typingWord[i]
  if (typed == null) return undefined
  if (typed === letter) return 'var(--accent)'
  return 'var(--danger)'
}

const shadowFor = (letter: string, i: number) => {
  if (!props.isMatched) return undefined
  const typed = props.typingWord[i]
  if (typed == null) return undefined
  if (typed === letter) return '0 0 8px var(--accent-glow)'
  return '0 0 8px var(--danger-glow)'
}

const classNames = ['word-box', `kind-${props.kind}`]
if (props.isMatched) {
  classNames.push('matched')
}

if (progress.value >= 0.99) {
  classNames.push('about-to-pop')
}

const badgeColors = {
  slow: '#60a5fa',
  freeze: '#67e8f9',
  heart: '#f472b6',
  bombclear: '#fbbf24',
  danger: 'var(--danger)',
}
</script>

<template>
  <div
    :class="classNames.join(' ')"
    :style="{
      left: `${x}%`,
      top: `${clampedY}%`,
      scale: String(scale),
      boxShadow: isMatched
        ? `0 0 0 1px var(--accent), 0 0 ${glowStrength}px var(--accent-glow), 0 6px 20px rgba(0,0,0,0.5)`
        : undefined,
    }"
  >
    <div
      v-if="KIND_BADGE[kind as keyof typeof KIND_BADGE]"
      class="kind-badge"
      :style="{
        color:
          badgeColors[kind as keyof typeof KIND_BADGE] || `var(--text-dim)`,
        border:
          `1px solid ` + `${badgeColors[kind as keyof typeof KIND_BADGE]}` ||
          `var(--border)`,
        boxShadow:
          `0 0 10px ` + `${badgeColors[kind as keyof typeof KIND_BADGE]}` ||
          `transparent`,
        animation:
          kind === `danger`
            ? `dangerPulse 1.2s ease-in-out infinite`
            : undefined,
      }"
    >
      {{ KIND_BADGE[kind as keyof typeof KIND_BADGE] }}
    </div>
    <div v-for="(letter, i) in word.split('')" class="letter-box" :key="i">
      <div
        class="letter"
        :style="{
          color: colorFor(letter, i),
          textShadow: shadowFor(letter, i),
        }"
      >
        {{ letter }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.word-box {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  background: linear-gradient(
    180deg,
    rgba(22, 26, 35, 0.95),
    rgba(13, 15, 20, 0.95)
  );
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  width: max-content;
  max-width: 38vw;
  padding: 10px 18px;
  border-radius: 12px;
  text-transform: lowercase;
  color: var(--text-faint);
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 1.5px;
  transition:
    scale 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.18s ease,
    box-shadow 0.12s ease,
    background 0.18s ease,
    filter 0.1s ease;
  will-change: top, left;
  white-space: nowrap;
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);

  &.matched {
    border-color: var(--accent);
    background: linear-gradient(
      180deg,
      rgba(94, 234, 212, 0.12),
      rgba(13, 15, 20, 0.95)
    );
    z-index: 4;
  }

  &.about-to-pop {
    animation: aboutToPop 0.18s ease-in-out infinite;
  }

  &.kind-danger {
    border-color: var(--danger);
    background: linear-gradient(
      180deg,
      rgba(255, 93, 115, 0.18),
      rgba(20, 8, 12, 0.95)
    );
    color: rgba(255, 200, 210, 0.4);
    animation: dangerPulse 1.2s ease-in-out infinite;
  }

  &.kind-slow {
    border-color: #60a5fa;
    background: linear-gradient(
      180deg,
      rgba(96, 165, 250, 0.15),
      rgba(13, 15, 20, 0.95)
    );
    box-shadow:
      0 0 18px rgba(96, 165, 250, 0.35),
      0 6px 20px rgba(0, 0, 0, 0.5);
  }

  &.kind-freeze {
    border-color: #67e8f9;
    background: linear-gradient(
      180deg,
      rgba(103, 232, 249, 0.15),
      rgba(13, 15, 20, 0.95)
    );
    box-shadow:
      0 0 18px rgba(103, 232, 249, 0.35),
      0 6px 20px rgba(0, 0, 0, 0.5);
  }

  &.kind-heart {
    border-color: #f472b6;
    background: linear-gradient(
      180deg,
      rgba(244, 114, 182, 0.15),
      rgba(13, 15, 20, 0.95)
    );
    box-shadow:
      0 0 18px rgba(244, 114, 182, 0.4),
      0 6px 20px rgba(0, 0, 0, 0.5);
  }

  &.kind-bombclear {
    border-color: #fbbf24;
    background: linear-gradient(
      180deg,
      rgba(251, 191, 36, 0.15),
      rgba(13, 15, 20, 0.95)
    );
    box-shadow:
      0 0 18px rgba(251, 191, 36, 0.4),
      0 6px 20px rgba(0, 0, 0, 0.5);
  }

  .letter-box .letter {
    transition:
      color 0.1s linear,
      text-shadow 0.1s linear;
    user-select: none;
  }
}

div.kind-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bg);
}

@keyframes dangerPulse {
  0%,
  100% {
    box-shadow:
      0 0 0 1px var(--danger),
      0 0 18px var(--danger-glow),
      0 6px 20px rgba(0, 0, 0, 0.5);
  }
  50% {
    box-shadow:
      0 0 0 2px var(--danger),
      0 0 30px var(--danger-glow),
      0 6px 20px rgba(0, 0, 0, 0.5);
  }
}

@keyframes aboutToPop {
  0%,
  100% {
    filter: brightness(1.05) saturate(1.2);
    transform: translateX(0);
  }
  25% {
    filter: brightness(1.4) saturate(1.5);
    transform: translateX(-2px);
  }
  75% {
    filter: brightness(1.4) saturate(1.5);
    transform: translateX(2px);
  }
}
</style>
