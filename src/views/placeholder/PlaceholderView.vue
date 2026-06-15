<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const title = route.query.title || '功能建设中'
</script>

<template>
  <main class="placeholder-page">
    <div class="placeholder-card">
      <div class="icon-area">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0879dc" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <h1>{{ title }}</h1>
      <p>该模块正在建设中，敬请期待</p>
    </div>
  </main>
</template>

<style scoped>
.placeholder-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #eef3f8;
}

.placeholder-card {
  text-align: center;
  padding: 48px 64px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(32, 56, 88, 0.06);
}

.icon-area {
  margin-bottom: 24px;
}

h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 12px;
  color: #172033;
}

p {
  color: #69788b;
  font-size: 15px;
  margin: 0;
}
</style>
