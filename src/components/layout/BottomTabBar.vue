<template>
  <nav class="tabbar">
    <RouterLink to="/search" class="tab" active-class="active" exact-active-class="active">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M512 128C514 128 515.9 128.1 517.8 128.3L422.1 224L490 224L562 152C570.8 163 576 176.9 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192C64 156.7 92.7 128 128 128L198.1 128L102.1 224L170 224L265 129L266 128L358.1 128L262.1 224L330 224L425 129L426 128L512.1 128z"/></svg>
      탐색
    </RouterLink>

    <RouterLink to="/watchlist" class="tab" active-class="active" exact-active-class="active">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/></svg>
      볼 영화
    </RouterLink>

    <RouterLink to="/watched" class="tab" active-class="active" exact-active-class="active">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M273 151.1L288 171.8L303 151.1C328 116.5 368.2 96 410.9 96C484.4 96 544 155.6 544 229.1L544 231.7C544 249.3 540.6 267.3 534.5 285.4C512.7 276.8 488.9 272 464 272C358 272 272 358 272 464C272 492.5 278.2 519.6 289.4 544C288.9 544 288.5 544 288 544C272.5 544 257.2 539.4 244.9 529.9C171.9 474.2 32 343.9 32 231.7L32 229.1C32 155.6 91.6 96 165.1 96C207.8 96 248 116.5 273 151.1zM320 464C320 384.5 384.5 320 464 320C543.5 320 608 384.5 608 464C608 543.5 543.5 608 464 608C384.5 608 320 543.5 320 464zM521.4 403.1C514.3 397.9 504.2 399.5 499 406.6L446 479.5L419.2 452.7C413 446.5 402.8 446.5 396.6 452.7C390.4 458.9 390.4 469.1 396.6 475.3L436.6 515.3C439.9 518.6 444.5 520.3 449.2 519.9C453.9 519.5 458.1 517.1 460.9 513.4L524.9 425.4C530.1 418.3 528.5 408.2 521.4 403.1z"/></svg>
      본 영화
    </RouterLink>

    <RouterLink to="/stats" class="tab" active-class="active" exact-active-class="active">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM168 280L168 344C168 357.3 178.7 368 192 368C205.3 368 216 357.3 216 344L216 280C216 266.7 205.3 256 192 256C178.7 256 168 266.7 168 280zM248 184L248 344C248 357.3 258.7 368 272 368C285.3 368 296 357.3 296 344L296 184C296 170.7 285.3 160 272 160C258.7 160 248 170.7 248 184zM328 248L328 344C328 357.3 338.7 368 352 368C365.3 368 376 357.3 376 344L376 248C376 234.7 365.3 224 352 224C338.7 224 328 234.7 328 248z"/></svg>
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
  background-color: #452829;
  z-index: 9999;
}

.tabbar svg{
  width: 20px;
  height: 20px;
  margin-right: 2px;
}
.tab.active svg path{
  fill: #e5e5e5;
}

.tab svg path{
  fill: #A18D6D;
}

.tab{
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #A18D6D;
  font-weight: 600;
}

.tab.active{
  color: #e5e5e5;
}

@media (min-width: 610px) {
  .tabbar{
    width: 100px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
  }
}
</style>
