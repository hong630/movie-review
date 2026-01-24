<template>
  <div class="page-search">
    통계
  </div>
</template>

<script lang="ts">
import {Component, toNative, Vue} from 'vue-facing-decorator';

@Component
class StatsPage extends Vue {}
export default toNative(StatsPage);
</script>

<style scoped>
.page-search {
  padding: 16px;
  font-size: 20px;
  font-weight: 600;
}
</style>
