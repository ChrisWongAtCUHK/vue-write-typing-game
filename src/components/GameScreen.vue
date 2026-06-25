<script setup lang="ts">
import { ref, watch } from 'vue'
import Header from './Header.vue'
import Bottom from './Bottom.vue'
import type ActiveWord from '@/types/activeWord.ts'
import type Particle from '@/types/particle.ts'
import type FloatingText from '@/types/floatingText.ts'
import type WaveBanner from '@/types/waveBanner.ts'
import Word from './Word.vue'

const props = defineProps<{
  activeWords: Array<ActiveWord>
  typingWord: string
  matchedWordId: number | null
  errorPulse: number
  healthFlash: number
  bombPulse: number
  particles: Array<Particle>
  floatingTexts: Array<FloatingText>
  waveBanner: WaveBanner | null
  health: number
  onRestart: () => void
  slowActive: boolean
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

const getFloatingTextStyle = (x: number, y: number, variant: string) => {
  let style = `left: ${x}%; top: ${y}%`

  if (variant === 'score') {
    style += 'color: var(--accent); font-size: 22px;'
  } else if (variant === 'bonus') {
    style += 'color: var(--warn); font-size; 13px; letter-spacing: 2px;'
  } else if (variant === 'powerup') {
    style += 'color: #a78bfa; font-size; 16px; letter-spacing: 3px;'
  }

  return style
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
      <div
        v-for="p in particles"
        :key="p.id"
        :style="{ left: `${p.x}%`, top: `${p.y}%` }"
        class="particle-burst"
      >
        <div
          v-for="pc in p.pieces"
          :key="pc.id"
          :style="`background: ${p.color}; --dx: ${pc.dx}px; --dy: ${pc.dy}px; --rot: ${pc.rot}deg`"
          class="particle-piece"
        ></div>
      </div>
      <div
        v-for="f in floatingTexts"
        :key="f.id"
        class="floating-text"
        :style="getFloatingTextStyle(f.x, f.y, f.variant)"
      >
        {{ f.text }}
      </div>
      <div v-if="waveBanner" class="wave-banner" :key="waveBanner.id">
        <div class="label">incoming</div>
        <div class="text">{{ waveBanner.text }}</div>
      </div>
      <Header
        :wave="1"
        :combo="1"
        :multiplier="2"
        :wpm="10"
        :accuracy="80"
        :score="200"
      />
      <div style="flex: 1"></div>
      <Bottom
        :currentWord="matched ? matched.text : ``""
        :typingWord="typingWord"
        :health="health"
        :hurting="hurting"
        :on-restart="onRestart"
      />
    </div>
  </div>
</template>

<style scoped>
div.particle-burst {
  position: absolute;
  pointer-events: none;
  z-index: 4;
}

div.particle-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  left: 0;
  top: 0;
  animation: particleFly 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  box-shadow: 0 0 8px currentColor;
}

div.floating-text {
  position: absolute;
  pointer-events: none;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  letter-spacing: 1px;
  white-space: nowrap;
  z-index: 5;
  animation: floatUp 0.9s ease-out forwards;
  text-shadow: 0 0 12px currentColor;
}

div.wave-banner {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 6;
  animation: bannerIn 1.8s ease-in-out forwards;

  .label {
    color: var(--text-dim);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .text {
    color: var(--accent);
    font-family: 'JetBrains Mono', monospace;
    font-size: 72px;
    font-weight: 800;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow:
      0 0 30px var(--accent-glow),
      0 0 60px var(--accent-glow);
  }
}

@keyframes particleFly {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translate(var(--dx), var(--dy))
      rotate(var(--rot)) scale(0.3);
  }
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -10px) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -60px) scale(0.9);
  }
}

@keyframes bannerIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }
}
</style>
