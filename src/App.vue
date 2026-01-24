<template>
  <div class="app-shell">
    <main class="app-main">
      <RouterView />
    </main>

    <BottomTabBar />
  </div>
</template>

<script lang="ts">
import { Component, toNative } from 'vue-facing-decorator';
import BottomTabBar from '@/components/layout/BottomTabBar.vue';

@Component({
  name: 'App',
  components: { BottomTabBar },
})
class App {}

export default toNative(App);
</script>

<style scoped>
.app-shell{
  min-height: 100vh;
}

.app-main{
  padding-bottom: 64px; /* 탭바 높이 */
}
</style>
