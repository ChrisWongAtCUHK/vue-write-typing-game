const SOUND_FILES = {
  type: 'type.wav',
  wrong: 'wrong.wav',
  complete: 'complete.wav',
  slow: 'slow.wav',
  freeze: 'freeze.wav',
  heart: 'heart.wav',
  bomb: 'bomb.wav',
  danger: 'danger.wav',
  wave: 'wave.wav',
  gameover: 'gameover.wav',
} as const // 'as const' makes the keys literal types

// 1. Define a type for valid sound names
type SoundName = keyof typeof SOUND_FILES

const POOL_SIZE = 4
const STORAGE_KEY = 'writé:audio'

const defaultPrefs = { enabled: true, volume: 0.6 }

let prefs = defaultPrefs
try {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) prefs = { ...defaultPrefs, ...JSON.parse(raw) }
} catch (e) {}

// 2. Explicitly type the pools and cursors objects
const pools: Partial<Record<SoundName, HTMLAudioElement[]>> = {}
let cursors: Partial<Record<SoundName, number>> = {}
let initialized = false

const init = () => {
  if (initialized) return
  initialized = true
  Object.entries(SOUND_FILES).forEach(([name, file]) => {
    // Cast 'name' to SoundName since Object.entries returns string
    const soundName = name as SoundName
    pools[soundName] = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio(`/sounds/${file}`)
      a.preload = 'auto'
      return a
    })
  })
}

export const play = (name: SoundName) => {
  // 3. Type the parameter
  if (!prefs.enabled) return

  if (!pools[name]) {
    init()
    if (!pools[name]) return
  }

  const pool = pools[name]! // Use '!' because we checked above
  const currentCursor = cursors[name] || 0
  const idx = currentCursor % pool.length

  cursors[name] = currentCursor + 1

  const audio = pool[idx]!
  audio.volume = prefs.volume
  audio.currentTime = 0
  audio.play().catch(() => {})
}

export const setEnabled = (enabled: boolean) => {
  prefs = { ...prefs, enabled }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (e) {}
}

export const setVolume = (volume: number) => {
  prefs = { ...prefs, volume: Math.max(0, Math.min(1, volume)) }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (e) {}
}

export const getPrefs = () => ({ ...prefs })

export const preload = () => init()
