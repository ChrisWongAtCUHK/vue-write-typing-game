<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Header from './Header.vue'
import Bottom from './Bottom.vue'
import type ActiveWord from '@/types/activeWord.ts'
import type Particle from '@/types/particle.ts'
import type FloatingText from '@/types/floatingText.ts'
import type WaveBanner from '@/types/waveBanner.ts'
import Word from './Word.vue'
import Settings from './Settings.vue'

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
  wave: number
  combo: number
  multiplier: number
  wpm: number
  accuracy: number
  score: number
  health: number
  onRestart: () => void
  slowActive: boolean
  freezeActive: boolean
  paused: boolean
}>()

const matched =
  computed(() => props.activeWords.find((w) => w.id === props.matchedWordId) || null)

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
    </div>
    <Header
        :wave="wave"
        :combo="combo"
        :multiplier="multiplier"
        :wpm="wpm"
        :accuracy="accuracy"
        :score="score"
      />
      <div style="flex: 1"></div>
      <Bottom
        :currentWord="matched ? matched.text : ``""
        :typingWord="typingWord"
        :health="health"
        :hurting="hurting"
        :on-restart="onRestart"
      />
      <div v-if="slowActive" class="slow-overlay">
        <div class="effect-label" :style="`color: #93c5fd; background: rgba(8, 18, 40, 0.6); border: 1px solid rgba(147, 197, 253, 0.6); text-shadow: 0 0 18px rgba(96, 165, 250, 0.8); box-shadow: 0 0 30px rgba(96, 165, 250, 0.4);`">SLOW MO</div>
      </div>
      <div v-if="freezeActive" class="freeze-overlay">
        <div v-for="(_, i) in Array.from({ length: 10 })" :key="i" class="snow-flake" :style="`left: ${5 + Math.random() * 90}%; top: ${Math.random() * 100}%; --delay: ${Math.random() * 2}s; --size: ${3 + Math.random() * 4}px; --drift: ${(Math.random() - 0.5) * 30}px`"></div>
        <div class="frost-corner" :style="`background: radial-gradient(circle at 0% 0%, rgba(207, 250, 254, 0.25), rgba(103, 232, 249, 0.05) 50%, transparent 75%); top: 0; left: 0;`"></div>
        <div class="frost-corner" :style="`background: radial-gradient(circle at 100% 100%, rgba(207, 250, 254, 0.25), rgba(103, 232, 249, 0.05) 50%, transparent 75%); bottom: 0; right: 0;`"></div>
        <div class="effect-label" :style="`color: #cffafe; background: rgba(8, 30, 36, 0.6); border: 1px solid rgba(207, 250, 254, 0.7); text-shadow: 0 0 18px rgba(103, 232, 249, 0.9); box-shadow: 0 0 30px rgba(103, 232, 249, 0.5);`">FROZEN</div>
      </div>
      <div v-if="paused" class="pause-overlay">
        <div class="pause-title">PAUSED</div>
        <div class="pause-hint">press <kbd>Tab</kbd> or <kbd>Esc</kbd> to resume</div>
      </div>
      <div v-if="bombing" class="bomb-overlay">
        <div class="shockwave"></div>
        <div class="shockwave" style="animation-delay: 0.08s;"></div>
        <div class="bomb-flash"></div>
      </div>
      <div :class="shaking ? `error-flash active` : `error-flash`"></div>
      <div :class="hurting ? `hurt-flash active` : `hurt-flash`"></div>
      <Settings v-if="settingsOpen" :on-close="() => settingsOpen = false"/>
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

div.slow-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 7;
  background: radial-gradient(ellipse at center, transparent 35%, rgba(96, 165, 250, 0.18) 100%);
  animation: overlayIn 0.2s ease-out, slowPulse 1.6s ease-in-out infinite;
  border: 2px solid rgba(96, 165, 250, 0.4);
}

div.effect-label {
  position: absolute;
  top: 14%;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 12px;
  text-transform: uppercase;
  padding: 12px 28px;
  border-radius: 12px;
  animation: labelPulse 1.2s ease-in-out infinite;
}

div.freeze-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 7;
  background: radial-gradient(ellipse at center, transparent 45%, rgba(103, 232, 249, 0.1) 100%);
  animation: overlayIn 0.3s ease-out, freezeBreathe 2.4s ease-in-out infinite;
  border: 1px solid rgba(103, 232, 249, 0.25);
}

div.snow-flake {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: rgba(207, 250, 254, 0.7);
  border-radius: 50%;
  filter: blur(1px);
  animation: fall 4s linear infinite;
  animation-delay: var(--delay);
  box-shadow: 0 0 4px rgba(207, 250, 254, 0.6);
}

div.frost-corner {
  position: absolute;
  width: 320px;
  height: 320px;
  pointer-events: none;
  opacity: 0.5;
}

div.pause-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: rgba(6, 7, 10, 0.78);
  backdrop-filter: blur(8px);
  animation: overlayIn 0.2s ease-out;
}

div.pause-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 64px;
  font-weight: 800;
  letter-spacing: 12px;
  color: var(--accent);
  text-shadow: 0 0 30px var(--accent-glow);
}

div.pause-hint {
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;

  kbd {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 8px;
    margin: 0 4px;
    color: var(--accent);
    font-family: inherit;
  }
}

div.bomb-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 8;
  display: flex;
  align-items: center;
  justify-content: center;
}

div.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 12px solid #fbbf24;
  box-shadow:
    0 0 60px rgba(251, 191, 36, 0.85),
    inset 0 0 40px rgba(251, 191, 36, 0.6);
  animation: shockwaveExpand 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

div.bomb-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 220, 130, 0.55) 0%, rgba(251, 146, 60, 0.3) 30%, transparent 65%);
  animation: bombFlashAnim 0.6s ease-out forwards;
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

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slowPulse {
  0%, 100% { box-shadow: inset 0 0 80px rgba(96, 165, 250, 0.45); }
  50%      { box-shadow: inset 0 0 140px rgba(96, 165, 250, 0.7); }
}

@keyframes labelPulse {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.9; }
  50%      { transform: translateX(-50%) scale(1.06); opacity: 1; }
}

@keyframes freezeBreathe {
  0%, 100% { box-shadow: inset 0 0 100px rgba(103, 232, 249, 0.18); }
  50%      { box-shadow: inset 0 0 140px rgba(103, 232, 249, 0.28); }
}

@keyframes fall {
  0%   { transform: translate(0, -10px); opacity: 0; }
  15%  { opacity: 0.6; }
  85%  { opacity: 0.5; }
  100% { transform: translate(var(--drift), 60px); opacity: 0; }
}

@keyframes shockwaveExpand {
  0%   { width: 50px; height: 50px; opacity: 1; border-width: 12px; }
  100% { width: 180vmax; height: 180vmax; opacity: 0; border-width: 1px; }
}

@keyframes bombFlashAnim {
  0%   { opacity: 0; }
  10%  { opacity: 1; }
  100% { opacity: 0; }
}
</style>
