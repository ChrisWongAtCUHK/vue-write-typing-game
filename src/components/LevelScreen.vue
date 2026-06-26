<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header.vue'
import Settings from './Settings.vue'

const LEVELS = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
  { key: 'expert', label: 'Expert' },
]

const props = defineProps<{
  level: string
  setLevel: (l: string) => void
}>()
const settingsOpen = ref(false)
</script>
<template>
  <div class="level">
    <Header />
    <button
      @click="() => (settingsOpen = true)"
      class="gear-button"
      aria-label="settings"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </svg>
    </button>
    <div class="level-content">
      <div class="level-title">select difficulty</div>
      <div class="level-buttons">
        <button
          v-for="l in LEVELS"
          :key="l.key"
          :class="level === l.key ? 'active' : ''"
          @click="() => setLevel(l.key)"
          class="level-button"
        >
          {{ l.label }}
        </button>
      </div>
    </div>
    <Settings v-if="settingsOpen" :on-close="() => (settingsOpen = false)" />
  </div>
</template>
<style lang="scss" scoped>
div.level {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

button.gear-button {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 5;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: rotate(45deg);
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

div.level-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  text-align: center;
}

div.level-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--text-dim);
    vertical-align: middle;
    margin-right: 12px;
  }

  &::after {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--text-dim);
    vertical-align: middle;
    margin-left: 12px;
  }
}

div.level-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

button.level-button {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 18px 32px;
  min-width: 140px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-3px);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.5),
      0 0 24px var(--accent-glow),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: translateY(-1px);
  }
}
</style>
