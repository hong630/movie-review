<template>
  <nav class="tabbar">
    <RouterLink to="/search" class="tab" active-class="active" exact-active-class="active">
      탐색
    </RouterLink>

    <RouterLink to="/watchlist" class="tab" active-class="active" exact-active-class="active">
      볼 영화
    </RouterLink>

    <RouterLink to="/watched" class="tab" active-class="active" exact-active-class="active">
      본 영화
    </RouterLink>

    <RouterLink to="/stats" class="tab" active-class="active" exact-active-class="active">
      통계
    </RouterLink>
  </nav>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';

@Component({ name: 'BottomTabBar' })
class BottomTabBar extends Vue {}
export default BottomTabBar;
</script>

<style scoped>
.tabbar{
  position: fixed;
  left: 0; right: 0; bottom: 0;
  height: 64px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #fff;
  border-top: 1px solid #e5e5e5;
}

.tab{
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #666;
  font-weight: 600;
}

.tab.active{
  color: #111;
}
</style>
