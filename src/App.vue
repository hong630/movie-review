<template>
  <div class="app-shell">
    <main :class="['app-main', { 'no-padding': !hasBottomPadding }]">
      <RouterView/>
    </main>

    <BottomTabBar/>
  </div>
</template>

<script setup lang="ts">
import BottomTabBar from '@/components/layout/BottomTabBar.vue';
import {useRoute} from 'vue-router';
import {computed} from 'vue';

const route = useRoute();
const HIDE_BOTTOM_TAB_PATHS = [
  '/login',
  '/find-id',
  '/find-password',
  '/signup',
];
const hasBottomPadding = computed(function () {
  return !HIDE_BOTTOM_TAB_PATHS.includes(route.path);
});
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

.app-main.no-padding {
  padding-bottom: 0;
}

@media (min-width: 610px) {
  .app-main {
    width: 580px;
    margin: auto;
  }
}
</style>
