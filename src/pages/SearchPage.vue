<template>
  <div class="page-search">
    탐색
  </div>
</template>

<script lang="ts">
import {Component, toNative, Vue} from 'vue-facing-decorator';

@Component
class SearchPage extends Vue {}
export default toNative(SearchPage);

</script>

<style scoped>
.page-search {
  padding: 16px;
  font-size: 20px;
  font-weight: 600;
}
</style>
