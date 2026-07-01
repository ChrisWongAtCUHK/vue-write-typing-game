<script setup lang="ts">
import Header from './Header.vue'
const props = defineProps<{
  score: number
  level: string
  wave: number
  bestCombo: number
  wpm: number
  accuracy: number
  newRecord: boolean
  onRestart: () => void
  onMenu: () => void
}>()

const highScore = parseInt(
  (typeof window !== 'undefined' &&
    localStorage.getItem(`writé:highscore:${props.level}`)) ||
    '0',
  10,
)
</script>
<template>
  <div class="wrapper">
    <Header />
    <div class="gameover-content">
      <div class="title">GAME OVER</div>
      <div v-if="newRecord" class="record-badge">NEW RECORD</div>
      <div class="stats">
        <div class="stat-row">
          <span>SCORE</span>
          <strong>{{ score }}</strong>
        </div>
        <div class="stat-grid">
          <div class="stat-box">
            <span>HIGH</span>
            <strong>{{ highScore }}</strong>
          </div>
          <div class="stat-box">
            <span>BEST COMBO</span>
            <strong>{{ bestCombo ?? 0 }}</strong>
          </div>
          <div class="stat-box">
            <span>WPM</span>
            <strong>{{ wpm ?? 0 }}</strong>
          </div>
          <div class="stat-box">
            <span>ACCURACY</span>
            <strong>{{ accuracy ?? 0 }}%</strong>
          </div>
          <div class="stat-box">
            <span>WAVE</span>
            <strong>{{ wave ?? 1 }}</strong>
          </div>
          <div class="stat-box">
            <span>LEVEL</span>
            <strong>{{ (level || '').toUpperCase() }}</strong>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button @click="() => onRestart()" class="primary-button">RETRY</button>
        <button @click="() => onMenu()" class="primary-button secondary-button">
          MENU
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

div.gameover-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  max-width: 520px;
  padding: 0 24px;
}

div.title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 56px;
  color: var(--danger);
  letter-spacing: 6px;
  font-weight: 800;
  text-transform: uppercase;
  text-shadow: 0 0 30px var(--danger-glow);
  text-align: center;
}

div.record-badge {
  padding: 8px 16px;
  background: var(--panel);
  border: 1px solid var(--warn);
  border-radius: 10px;
  color: var(--warn);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 4px;
  text-transform: uppercase;
  animation: recordPulse 1.4s ease-in-out infinite;
}

div.stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

div.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);

  strong {
    color: var(--accent);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 0 12px var(--accent-glow);
  }

  padding: 22px 26px;
  strong {
    font-size: 32px;
  }
}

div.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

div.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 10px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);

  strong {
    color: var(--text);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
}

div.buttons {
  display: flex;
  gap: 14px;
  margin-top: 8px;
}

button.primary-button {
  border-radius: 12px;
  border: 1px solid var(--accent);
  background: linear-gradient(
    180deg,
    rgba(94, 234, 212, 0.18),
    rgba(94, 234, 212, 0.05)
  );
  color: var(--accent);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 14px 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 16px var(--accent-glow);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--accent-glow);
  }

  &:active {
    transform: translateY(0);
  }
}

button.secondary-button {
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--text-dim);
  box-shadow: none;

  &:hover {
    border-color: var(--text-dim);
    color: var(--text);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  }
}

@keyframes recordPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 14px var(--warn);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 28px var(--warn);
  }
}
</style>
