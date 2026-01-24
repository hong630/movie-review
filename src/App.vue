<template>
  <div class="app-shell">
    <main class="app-main">
      <RouterView />
    </main>

    <BottomTabBar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BottomTabBar from '@/components/layout/BottomTabBar.vue';

export default defineComponent({
  name: 'App',
  components: {
    BottomTabBar,
  },
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-main {
  padding-bottom: 64px; /* 탭바 높이 */
}
</style>
