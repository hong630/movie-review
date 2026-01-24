<template>
  <div class="app-shell">
    <main class="app-main">
      <RouterView />
    </main>

    <BottomTabBar />
  </div>
</template>

<script setup lang="ts">
import BottomTabBar from '@/components/layout/BottomTabBar.vue';
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  background-color: #E8E2D8;
}

.app-main {
  padding-bottom: 64px; /* 탭바 높이 */
}
</style>
