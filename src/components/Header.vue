<script setup lang="ts">
const LOGO = 'writé'
</script>

<template>
  <div class="header">
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
</style>
