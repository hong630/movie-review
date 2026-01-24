<template>
  <div class="page-search">
    볼 작품
  </div>
</template>

<script lang="ts">
import {Component, toNative, Vue} from 'vue-facing-decorator';

@Component
class WatchlistPage extends Vue {}
export default toNative(WatchlistPage);
</script>

<style scoped>
.page-search {
  padding: 16px;
  font-size: 20px;
  font-weight: 600;
}
</style>
