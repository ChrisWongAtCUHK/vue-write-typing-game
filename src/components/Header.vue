<script setup lang="ts">
const LOGO = 'writé'
defineProps<{
  wave: number
  combo: number
  multiplier: number
}>()
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="chip">
        <span>WAVE</span>
        <strong>{{ wave }}</strong>
      </div>
      <div v-if="combo > 0" class="chip highlight">
        <span>COMBO</span>
        <strong>{{ combo }}</strong>
        <span v-if="multiplier > 1" class="mult">×{{ multiplier }}</span>
      </div>
    </div>
    <div class="logo">
      <div v-for="(letter, i) in LOGO.split('')" :key="i">{{ letter }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.header {
  position: relative;
  height: 72px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 32px;
  background: linear-gradient(
    180deg,
    rgba(6, 7, 10, 0.85) 0%,
    rgba(6, 7, 10, 0.5) 70%,
    transparent 100%
  );
  backdrop-filter: blur(6px);
  z-index: 2;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;

    div {
      color: var(--text);
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 17px;
      font-weight: 700;
      cursor: default;
      transition: all 0.18s ease;
      user-select: none;
      box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);

      &:hover {
        background: var(--panel-2);
        border-color: var(--accent);
        color: var(--accent);
        transform: translateY(-2px);
      }
    }
  }
}

div.left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

div.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);

  strong {
    color: var(--text);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  &.highlight {
    border-color: var(--warn);
    strong {
      color: var(--warn);
      text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
    }
  }
}

span.mult {
  color: var(--warn);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.7);
  margin-left: 2px;
}
</style>
