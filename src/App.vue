<script setup lang="ts">
import {
  ref,
  watch,
  onWatcherCleanup,
  onMounted,
  onUnmounted,
  computed,
} from 'vue'
import { easyWords, mediumWords, hardWords, expertWords } from './config/words'
import type ActiveWord from '@/types/activeWord.ts'
import type Particle from '@/types/particle.ts'
import LevelScreen from './components/LevelScreen.vue'
import GameOver from './components/GameOver.vue'
import GameScreen from './components/GameScreen.vue'
import type FloatingText from './types/floatingText.ts'
import type WaveBanner from './types/waveBanner.ts'
import type Stats from './types/stats.ts'
import { getLanguage, isLetter, normalizeLetter } from './utils/language.ts'
import { play as playSound, preload as preloadSounds } from './utils/audio'

const POOLS = {
  en: {
    easy: easyWords,
    medium: mediumWords,
    hard: hardWords,
    expert: expertWords,
  },
  tr: {
    easy: easyWords,
    medium: mediumWords,
    hard: hardWords,
    expert: expertWords,
  },
} as const

type PoolName = keyof typeof POOLS

const LEVEL_PARAMS = {
  easy: {
    fallSpeed: 1.4,
    spawnInterval: 2400,
    initialSpawn: 2,
    maxActive: 4,
    damage: 1,
  },
  medium: {
    fallSpeed: 1.8,
    spawnInterval: 2000,
    initialSpawn: 2,
    maxActive: 5,
    damage: 1,
  },
  hard: {
    fallSpeed: 2.0,
    spawnInterval: 1800,
    initialSpawn: 2,
    maxActive: 5,
    damage: 1,
  },
  expert: {
    fallSpeed: 2.4,
    spawnInterval: 1600,
    initialSpawn: 3,
    maxActive: 6,
    damage: 1,
  },
} as const

type LevelName = keyof typeof LEVEL_PARAMS

const getLevelConfig = (level: string, lang: string) => {
  const levelName = level as LevelName
  const params = LEVEL_PARAMS[levelName]
  const poolName = lang as PoolName
  const pool = POOLS[poolName]?.[levelName] || POOLS.en[levelName]
  return { ...params, pool }
}

const TICK_MS = 16
const MAX_HEALTH = 3
const SPAWN_Y = -12
const BOTTOM_LIMIT = 84
const LEFT_MIN = 4
const LEFT_MAX = 55

const WAVE_SIZE = 10
const SPEEDUP_INTERVAL_MS = 20000
const SPEEDUP_FACTOR = 1.04
const SPAWN_SPEEDUP_FACTOR = 0.96
const SPEED_CAP = 1.8
const SPAWN_FLOOR = 0.6

const POWERUP_CHANCE = 0.18
const DANGER_CHANCE = 0.08
const POWERUP_KINDS = ['slow', 'freeze', 'heart', 'bombclear'] as const

const SLOW_DURATION_MS = 5000
const SLOW_FACTOR = 0.4
const FREEZE_DURATION_MS = 2000

const LONG_WORD_THRESHOLD = 8
const LONG_WORD_BONUS = 5
const PERFECT_BONUS = 5
const DANGER_MULTIPLIER = 2

let floatingId = 0
const nextFloatingId = () => ++floatingId

const level = ref<string>('')
const currentState = ref<string>('level')
const activeWords = ref<Array<ActiveWord>>([])

const particles = ref<Array<Particle>>([])

const typingWord = ref<string>('')
const matchedWordId = ref<number | null>(null)
const score = ref<number>(0)
const health = ref<number>(MAX_HEALTH)
const combo = ref<number>(0)
const bestCombo = ref<number>(0)
const wave = ref<number>(1)
const wordsCompletedThisWave = ref<number>(0)
const errorPulse = ref<number>(0)
const healthFlash = ref<number>(0)
const bombPulse = ref<number>(0)

const floatingTexts = ref<Array<FloatingText>>([])
const waveBanner = ref<WaveBanner | null>(null)
const slowActive = ref<boolean>(false)
const freezeActive = ref<boolean>(false)
const paused = ref<boolean>(false)
let pausedRef = paused.value
const lang = ref<string>(getLanguage())
let langRef = lang.value
const hadErrorOnCurrent = ref<boolean>(false)
const stats = ref<Stats>({
  correctChars: 0,
  totalChars: 0,
  wordsCompleted: 0,
  elapsedMs: 0,
})
const newRecord = ref<boolean>(false)

let startTimeRef = 0
let pausedAtRef = 0
let pausedTotalRef = 0
let correctCharsRef = 0
let totalCharsRef = 0
let wordsCompletedRef = 0
let particleIdRef = 0
let speedFactorRef = 1
let spawnFactorRef = 1
let slowUntilRef = 0
let freezeUntilRef = 0
let wavePausedRef = false

let errorTimeoutRef = null
let idRef = 0
let levelRef = level.value
let hadErrorRef = hadErrorOnCurrent.value
let comboRef = combo.value

const minutes = computed(() => stats.value.elapsedMs / 60000)
const wpm = computed(() =>
  minutes.value > 0
    ? Math.round(stats.value.correctChars / 5 / minutes.value)
    : 0,
)
const accuracy = computed(() =>
  stats.value.totalChars > 0
    ? Math.round((stats.value.correctChars / stats.value.totalChars) * 100)
    : 100,
)

const resetRunState = () => {
  activeWords.value = []
  typingWord.value = ''
  matchedWordId.value = null
  score.value = 0
  health.value = MAX_HEALTH
  combo.value = 0
  bestCombo.value = 0
  wave.value = 1
  wordsCompletedThisWave.value = 0
  waveBanner.value = null
  floatingTexts.value = []
  particles.value = []
  healthFlash.value = 0
  slowActive.value = false
  freezeActive.value = false
  bombPulse.value = 0
  paused.value = false
  hadErrorOnCurrent.value = false
  stats.value = {
    correctChars: 0,
    totalChars: 0,
    wordsCompleted: 0,
    elapsedMs: 0,
  }
  newRecord.value = false

  startTimeRef = performance.now()
  pausedAtRef = 0
  pausedTotalRef = 0
  correctCharsRef = 0
  totalCharsRef = 0
  wordsCompletedRef = 0
  speedFactorRef = 1
  spawnFactorRef = 1
  slowUntilRef = 0
  freezeUntilRef = 0
  wavePausedRef = false
}

const startGame = (chosenLevel: string) => {
  resetRunState()
  level.value = chosenLevel
  currentState.value = 'game'
}

const backToLevel = () => {
  level.value = ''
  resetRunState()
  currentState.value = 'level'
}

const addFloating = (text: string, x: number, y: number, variant: string) => {
  const id = nextFloatingId()
  floatingTexts.value = [...floatingTexts.value, { id, text, x, y, variant }]
  setTimeout(() => {
    floatingTexts.value = floatingTexts.value.filter((f) => f.id !== id)
  }, 900)
}

const burstParticles = (x: number, y: number, color: string) => {
  const id = particleIdRef++
  const pieces = Array.from({ length: 14 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4
    const dist = 40 + Math.random() * 60
    return {
      id: `${id}-${i}`,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      rot: Math.random() * 360,
    }
  })
  const burst = { id, x, y, color, pieces }
  particles.value = [...particles.value, burst]
  setTimeout(() => {
    particles.value = particles.value.filter((p) => p.id !== id)
  }, 700)
}

const flashHealth = () => {
  healthFlash.value = healthFlash.value + 1
}

const pickWord = (
  pool: string[],
  active: ActiveWord[],
): string | undefined | null => {
  const taken = new Set(active.map((w) => w.text))
  const usableFirstLetters = new Set(active.map((w) => w.text[0]))
  const available = pool.filter(
    (w) => !taken.has(w) && !usableFirstLetters.has(w[0]),
  )
  const fromList =
    available.length > 0 ? available : pool.filter((w) => !taken.has(w))
  if (fromList.length === 0) return null
  return fromList[Math.floor(Math.random() * fromList.length)]
}

const rollWordKind = (): ActiveWord['kind'] => {
  const r = Math.random()
  if (r < DANGER_CHANCE) return 'danger'
  if (r < DANGER_CHANCE + POWERUP_CHANCE) {
    return POWERUP_KINDS[
      Math.floor(Math.random() * POWERUP_KINDS.length)
    ] as ActiveWord['kind']
  }
  return 'normal'
}

const comboMultiplier = (combo: number): number => {
  if (combo >= 20) return 4
  if (combo >= 10) return 3
  if (combo >= 5) return 2
  return 1
}

const randomLeft = (active: ActiveWord[]): number => {
  for (let attempt = 0; attempt < 6; attempt++) {
    const x = LEFT_MIN + Math.random() * (LEFT_MAX - LEFT_MIN)
    const tooClose = active.some((w) => w.y < 15 && Math.abs(w.x - x) < 18)
    if (!tooClose) return x
  }
  return LEFT_MIN + Math.random() * (LEFT_MAX - LEFT_MIN)
}

// --- Parameterless Spawn logic that mutates array directly ---
const spawnOne = (): void => {
  if (!level.value) return
  const cfg = getLevelConfig(level.value, lang.value)
  if (activeWords.value.length >= cfg.maxActive) return

  const text = pickWord(cfg.pool, activeWords.value)
  if (!text) return

  idRef += 1
  activeWords.value.push({
    id: idRef,
    text,
    kind: rollWordKind(),
    x: randomLeft(activeWords.value),
    y: SPAWN_Y,
  })
}

// --- Fixed Game Engine Setup Hook ---
watch(
  currentState,
  (newState) => {
    // Only initialize the engine loops when explicitly transitioning into the game screen
    if (newState !== 'game' || !level.value) return

    const cfg = getLevelConfig(level.value, lang.value)
    let lastFrozen = false
    let lastSlow = false

    // 1. The Gravity Ticker (Runs independently without tearing down)
    const tick = setInterval(() => {
      if (wavePausedRef || paused.value) return

      const now = performance.now()
      const isFrozen = now < freezeUntilRef
      if (isFrozen !== lastFrozen) {
        lastFrozen = isFrozen
        freezeActive.value = isFrozen
      }
      if (isFrozen) return

      const isSlow = now < slowUntilRef
      if (isSlow !== lastSlow) {
        lastSlow = isSlow
        slowActive.value = isSlow
      }
      const slowMul = isSlow ? SLOW_FACTOR : 1

      let damageTaken = 0
      let comboBroken = false

      // Create a shallow copy array container to bypass layout dependency loops
      const updatedList = [...activeWords.value]

      for (let i = updatedList.length - 1; i >= 0; i--) {
        const w = updatedList[i] as ActiveWord
        const speed = cfg.fallSpeed * speedFactorRef * slowMul
        const ny = w.y + speed * (TICK_MS / 100)

        if (ny >= BOTTOM_LIMIT) {
          if (w.kind === 'danger') damageTaken += cfg.damage * 2
          else if (w.kind === 'normal') damageTaken += cfg.damage
          comboBroken = true
          updatedList.splice(i, 1)
          continue
        }

        updatedList[i] = { ...w, y: ny }
      }

      // Explicitly assign back the modified references to fire the template re-rendering cycle safely
      activeWords.value = updatedList

      if (damageTaken > 0) {
        health.value = Math.max(0, health.value - damageTaken)
        flashHealth()
      }
      if (comboBroken) {
        combo.value = 0
      }
      if (
        matchedWordId.value != null &&
        !activeWords.value.some((w) => w.id === matchedWordId.value)
      ) {
        matchedWordId.value = null
        typingWord.value = ''
        hadErrorOnCurrent.value = false
      }
    }, TICK_MS)

    // Stage initial parameters sequentially on launch
    for (let i = 0; i < cfg.initialSpawn; i++) {
      spawnOne()
      const last = activeWords.value[activeWords.value.length - 1]
      if (last) last.y = SPAWN_Y - i * 14
    }

    // 2. The Spawner Loop
    let spawner: number
    const scheduleSpawner = () => {
      const interval = Math.max(
        SPAWN_FLOOR * cfg.spawnInterval,
        cfg.spawnInterval * spawnFactorRef,
      )
      spawner = setInterval(() => {
        if (wavePausedRef || paused.value) return
        spawnOne()
      }, interval)
    }
    scheduleSpawner()

    // 3. Game Progression Escalation Ticker
    const speedup = setInterval(() => {
      if (wavePausedRef || paused.value) return
      speedFactorRef = Math.min(SPEED_CAP, speedFactorRef * SPEEDUP_FACTOR)
      spawnFactorRef = Math.max(
        SPAWN_FLOOR,
        spawnFactorRef * SPAWN_SPEEDUP_FACTOR,
      )
      clearInterval(spawner)
      scheduleSpawner()
    }, SPEEDUP_INTERVAL_MS)

    // 4. Game Stats Run Elapsed Metric Ticker
    const statsTick = setInterval(() => {
      if (paused.value) return
      const elapsedMs = performance.now() - startTimeRef - pausedTotalRef
      stats.value = {
        correctChars: correctCharsRef,
        totalChars: totalCharsRef,
        wordsCompleted: wordsCompletedRef,
        elapsedMs,
      }
    }, 250)

    // Cleanup triggers explicitly only when transitioning away from 'game' state screen
    onWatcherCleanup(() => {
      clearInterval(tick)
      clearInterval(spawner)
      clearInterval(speedup)
      clearInterval(statsTick)
    })
  },
  { immediate: true },
)

watch([health, currentState], ([newHealth, newCurrentState]) => {
  if (newHealth <= 0 && newCurrentState === 'game') {
    const key = `writé:highscore:${levelRef}`
    const prev = parseInt(localStorage.getItem(key) || '0', 10)
    if (score.value > prev) {
      localStorage.setItem(key, String(score.value))
      newRecord.value = true
    } else {
      newRecord.value = false
    }
    playSound('gameover')
    currentState.value = 'gameover'
  }
})

watch(wordsCompletedThisWave, (newCount) => {
  if (newCount < WAVE_SIZE) return
  if (currentState.value !== 'game') return
  const cfg = getLevelConfig(levelRef, langRef)
  if (!cfg || !cfg.pool) return
  const nextWave = wave.value + 1
  wordsCompletedThisWave.value = 0
  wave.value = nextWave
  waveBanner.value = { id: Date.now(), text: `WAVE ${nextWave}` }
  playSound('wave')
  wavePausedRef = true
  activeWords.value = []
  matchedWordId.value = null
  typingWord.value = ''
  hadErrorOnCurrent.value = false
  setTimeout(() => {
    if (currentState.value !== 'game') return
    wavePausedRef = false
    waveBanner.value = null

    // Clean parameterless iteration for wave transitions
    for (let i = 0; i < cfg.initialSpawn; i++) {
      spawnOne()
      const last = activeWords.value[activeWords.value.length - 1]
      if (last) last.y = SPAWN_Y - i * 14
    }
  }, 1800)
})

const onKey = (e: any) => {
  if (currentState.value !== 'game') return
  if (wavePausedRef) return

  const togglePause = () => {
    const next = !paused.value
    if (next) {
      pausedAtRef = performance.now()
    } else if (pausedAtRef) {
      pausedTotalRef += performance.now() - pausedAtRef
      pausedAtRef = 0
    }
    paused.value = next
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    togglePause()
    return
  }

  if (pausedRef) {
    if (e.key === 'Escape') togglePause()
    return
  }

  if (e.key === 'Escape') {
    if (typingWord.value === '' && matchedWordId.value === null) {
      togglePause()
    } else {
      typingWord.value = ''
      matchedWordId.value = null
      hadErrorOnCurrent.value = false
    }
    return
  }

  if (e.key === 'Backspace') {
    const t = typingWord.value
    if (t.length <= 1) {
      typingWord.value = ''
      matchedWordId.value = null
      hadErrorOnCurrent.value = false
    } else {
      typingWord.value = t.slice(0, -1)
    }
    return
  }

  if (e.key.length !== 1 || !isLetter(e.key)) return
  if (e.ctrlKey || e.altKey || e.metaKey) return

  const ch = normalizeLetter(e.key) as string
  const active = [...activeWords.value]
  let matchedId = matchedWordId.value
  let typed = typingWord.value

  const triggerError = () => {
    errorPulse.value = errorPulse.value + 1
    combo.value = 0
    hadErrorOnCurrent.value = true
    totalCharsRef += 1
    playSound('wrong')
  }

  if (matchedId === null) {
    const candidates = active.filter((w) => w.text.startsWith(ch))
    if (candidates.length === 0) {
      if (active.length > 0) triggerError()
      return
    }
    const lowest = candidates.reduce((a, b) => (a.y > b.y ? a : b))
    matchedId = lowest.id
    typed = ch
    matchedWordId.value = matchedId
    typingWord.value = typed
    hadErrorOnCurrent.value = false
    correctCharsRef += 1
    totalCharsRef += 1
    playSound('type')
  } else {
    const current = active.find((w) => w.id === matchedId)
    if (!current) {
      matchedWordId.value = null
      typingWord.value = ''
      hadErrorOnCurrent.value = false
      return
    }
    if (typed.length >= current.text.length) {
      triggerError()
      return
    }
    const nextTyped = typed + ch
    typed = nextTyped
    typingWord.value = typed
    if (!current.text.startsWith(nextTyped)) {
      triggerError()
      return
    }
    correctCharsRef += 1
    totalCharsRef += 1
    playSound('type')
  }

  const target = active.find((w) => w.id === matchedId)
  if (target && typed === target.text) {
    const hadError = hadErrorRef
    const base = target.text.length
    const mul = comboMultiplier(comboRef + 1)
    let gained = base * mul
    let bonusLabel = ''

    if (target.kind === 'danger') {
      gained *= DANGER_MULTIPLIER
      bonusLabel = 'DANGER x2'
    }
    if (target.text.length >= LONG_WORD_THRESHOLD) {
      gained += LONG_WORD_BONUS
      bonusLabel = bonusLabel ? bonusLabel + ' · LONG' : 'LONG'
    }
    if (!hadError) {
      gained += PERFECT_BONUS
      bonusLabel = bonusLabel ? bonusLabel + ' · PERFECT' : 'PERFECT'
    }

    score.value = score.value + gained
    addFloating(`+${gained}`, target.x, target.y, 'score')
    if (bonusLabel) addFloating(bonusLabel, target.x, target.y - 5, 'bonus')
    const burstColor =
      target.kind === 'danger'
        ? 'var(--danger)'
        : target.kind === 'slow'
          ? '#60a5fa'
          : target.kind === 'freeze'
            ? '#67e8f9'
            : target.kind === 'heart'
              ? '#f472b6'
              : target.kind === 'bombclear'
                ? '#fbbf24'
                : 'var(--accent)'
    burstParticles(target.x, target.y, burstColor)
    wordsCompletedRef += 1

    if (target.kind === 'slow') {
      slowUntilRef = performance.now() + SLOW_DURATION_MS
      addFloating('SLOW', target.x, target.y - 10, 'powerup')
      playSound('slow')
    } else if (target.kind === 'freeze') {
      freezeUntilRef = performance.now() + FREEZE_DURATION_MS
      addFloating('FREEZE', target.x, target.y - 10, 'powerup')
      playSound('freeze')
    } else if (target.kind === 'heart') {
      health.value = Math.min(MAX_HEALTH, health.value + 1)
      addFloating('+HEART', target.x, target.y - 10, 'powerup')
      playSound('heart')
    } else if (target.kind === 'danger') {
      playSound('danger')
    } else if (target.kind === 'normal') {
      playSound('complete')
    } else if (target.kind === 'bombclear') {
      bombPulse.value = bombPulse.value + 1
      playSound('bomb')
      const remaining = activeWords.value.filter((w) => w.id !== matchedId)
      let bombScore = 0
      for (const w of remaining) {
        bombScore += w.text.length
        addFloating(`+${w.text.length}`, w.x, w.y, 'score')
        burstParticles(w.x, w.y, '#fbbf24')
      }
      score.value = score.value + bombScore
      activeWords.value = []
      wordsCompletedThisWave.value =
        wordsCompletedThisWave.value + remaining.length + 1
      wordsCompletedRef += remaining.length
      addFloating('CLEAR', target.x, target.y - 10, 'powerup')

      const nc = combo.value + 1 + remaining.length
      bestCombo.value = Math.max(bestCombo.value, nc)
      combo.value = nc

      typingWord.value = ''
      matchedWordId.value = null
      hadErrorOnCurrent.value = false

      return
    }

    activeWords.value = activeWords.value.filter((w) => w.id !== matchedId)

    const nc = combo.value + 1
    bestCombo.value = Math.max(bestCombo.value, nc)
    combo.value = nc

    wordsCompletedThisWave.value = wordsCompletedThisWave.value + 1
    typingWord.value = ''
    matchedWordId.value = null
    hadErrorOnCurrent.value = false
  }
}

onMounted(() => {
  preloadSounds()
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <LevelScreen
    v-if="currentState === 'level'"
    :level="level"
    :set-level="startGame"
  />
  <GameOver
    v-if="currentState === 'gameover'"
    :score="score"
    :level="level"
    :wave="wave"
    :best-combo="bestCombo"
    :wpm="wpm"
    :accuracy="accuracy"
    :new-record="newRecord"
    :on-restart="() => startGame(level)"
    :on-menu="backToLevel"
  />
  <GameScreen
    v-if="currentState === 'game'"
    :active-words="activeWords"
    :typing-word="typingWord"
    :matched-word-id="matchedWordId"
    :error-pulse="errorPulse"
    :health-flash="healthFlash"
    :bomb-pulse="bombPulse"
    :particles="particles"
    :floating-texts="floatingTexts"
    :wave-banner="waveBanner"
    :wave="wave"
    :combo="combo"
    :multiplier="comboMultiplier(combo)"
    :wpm="wpm"
    :accuracy="accuracy"
    :score="score"
    :health="health"
    :on-restart="backToLevel"
    :slow-active="slowActive"
    :freeze-active="freezeActive"
    :paused="paused"
  />
</template>

<style scoped></style>
