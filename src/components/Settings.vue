<script setup lang="ts">
import { ref } from 'vue'
import { getPrefs, setEnabled, play, setVolume } from '../utils/audio'
import { getLanguage } from '../utils/language'

const props = defineProps<{
  onClose: () => void
}>()

const initial = getPrefs()
const enabled = ref<boolean>(initial.enabled)
const volume = ref<number>(initial.volume)
const lang = ref<string>(getLanguage())

const getToggleStyle = (on: boolean) => {
  let style = ''
  style += `border: 1px solid ${on ? 'var(--accent)' : 'var(--border)'};`
  style += `background: ${on ? 'rgba(94, 234, 212, 0.15)' : 'var(--panel-2)'};`
  style += `color: ${on ? 'var(--accent)' : 'var(--text-dim)'};`

  if (on) {
    style += 'box-shadow: 0 0 12px var(--accent-glow);'
  }

  return style
}

const toggleSound = () => {
  const next = !enabled.value
  enabled.value = next
  setEnabled(next)
  if (next) play('complete')
}

const changeVolume = (e: any) => {
  const v = parseFloat((e.target as HTMLInputElement).value)
  volume.value = v
  setVolume(v)
}
</script>
<template>
  <div @click="() => onClose()" class="backdrop">
    <div @click="(e) => e.stopPropagation()" class="panel">
      <div class="title">SETTINGS</div>
      <div class="row">
        <div class="label">SOUND</div>
        <button
          class="toggle"
          :style="getToggleStyle(enabled)"
          @click="() => toggleSound()"
        >
          <span>{{ enabled ? `ON` : `OFF` }}</span>
        </button>
      </div>
      <div class="row">
        <div class="label">VOLUME</div>
        <div class="slider">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="volume"
            @change="changeVolume"
            :disabled="!enabled"
          />
          <div class="slider-value">{{ Math.round(volume * 100) }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
div.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 7, 10, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.18s ease-out;
}

div.panel {
  background: var(--panel);
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  animation: popIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

div.title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  letter-spacing: 6px;
  color: var(--text-dim);
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 4px;
}

div.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 10px;
}

div.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--text-dim);
  text-transform: uppercase;
}

button.toggle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

div.slider {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;

  input[type='range'] {
    flex: 1;
    max-width: 160px;
    accent-color: var(--accent);
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

div.slider-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  min-width: 42px;
  text-align: right;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
