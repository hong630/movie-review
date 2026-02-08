<template>
  <div class="page-watched">
    <header class="watched-header">
      <h1 class="watched-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M273 151.1L288 171.8L303 151.1C328 116.5 368.2 96 410.9 96C484.4 96 544 155.6 544 229.1L544 231.7C544 249.3 540.6 267.3 534.5 285.4C512.7 276.8 488.9 272 464 272C358 272 272 358 272 464C272 492.5 278.2 519.6 289.4 544C288.9 544 288.5 544 288 544C272.5 544 257.2 539.4 244.9 529.9C171.9 474.2 32 343.9 32 231.7L32 229.1C32 155.6 91.6 96 165.1 96C207.8 96 248 116.5 273 151.1zM320 464C320 384.5 384.5 320 464 320C543.5 320 608 384.5 608 464C608 543.5 543.5 608 464 608C384.5 608 320 543.5 320 464zM521.4 403.1C514.3 397.9 504.2 399.5 499 406.6L446 479.5L419.2 452.7C413 446.5 402.8 446.5 396.6 452.7C390.4 458.9 390.4 469.1 396.6 475.3L436.6 515.3C439.9 518.6 444.5 520.3 449.2 519.9C453.9 519.5 458.1 517.1 460.9 513.4L524.9 425.4C530.1 418.3 528.5 408.2 521.4 403.1z"/></svg>
        <span>본 영화</span>
      </h1>
    </header>

    <section class="watched-list">
      <div v-if="!items.length" class="list-empty">
        <img src="@/assets/images/nothing.gif" alt="본 영화 없음">
        <p>본 영화가 없어요</p>
      </div>

      <article v-for="x in items" :key="x.movieId" class="watched-card" v-else>
        <div class="watched-frame">
          <div class="watched-thumb" aria-hidden="true">
            <img v-if="posterUrl(x.posterPath)" class="movie-thumb-img" :src="posterUrl(x.posterPath)" :alt="x.title"/>
          </div>
          <div
              class="watched-tape"
              aria-hidden="true"
              :style="{ backgroundImage: `url(${tapeUrlByMovieId(x.movieId)})` }"
          ></div>
        </div>

        <div class="watched-body">
          <div class="watched-text">
            <h3 class="watched-movie-title">{{ x.title }}</h3>
            <p class="watched-movie-meta">
              <span>개봉일 : {{ formatDate(x.releaseDate) }}</span>
              <span>감상일 : {{ formatDate(x.watchedAt) }}</span>
            </p>
            <div class="watched-sub">
              <div class="watched-rating" v-if="x.rating">
                <span class="rating-stars" aria-hidden="true">{{ starsText(x.rating) }}</span>
                <span class="rating-num">{{ x.rating }}/5</span>
              </div>
              <p class="watched-review" v-if="x.review">{{ x.review }}</p>
              <p class="watched-review watched-review--empty" v-else>리뷰 없음</p>
            </div>
          </div>

          <div class="watched-actions">
            <button class="btn btn-solid" type="button" @click="onGoReview(x.movieId)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
              <span>리뷰</span>
            </button>
            <button class="btn btn-outline" type="button" @click="onRemove(x.movieId)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M210.5 480L333.5 480L398.8 414.7L225.3 241.2L98.6 367.9L210.6 479.9zM256 544L210.5 544C193.5 544 177.2 537.3 165.2 525.3L49 409C38.1 398.1 32 383.4 32 368C32 352.6 38.1 337.9 49 327L295 81C305.9 70.1 320.6 64 336 64C351.4 64 366.1 70.1 377 81L559 263C569.9 273.9 576 288.6 576 304C576 319.4 569.9 334.1 559 345L424 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L256 544z"/></svg>
              <span>삭제</span>
            </button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import type {UserMovie} from '@/types/user-movie';
import {getUserMoviesByStatus, removeUserMovie} from '@/services/userMovieStore';
import {router} from "@/router";
import tape1 from '@/assets/images/tape1.png';
import tape2 from '@/assets/images/tape2.png';
import tape3 from '@/assets/images/tape3.png';
import tape4 from '@/assets/images/tape4.png';

@Component
class WatchedPage extends Vue {
  items: UserMovie[] = [];
  private tapes = [tape1, tape2, tape3, tape4];

  async mounted() {
    await this.reload();
  }

  async reload() {
    this.items = await getUserMoviesByStatus('WATCHED');
  }

  async onRemove(movieId: number) {
    await removeUserMovie(movieId);
    await this.reload();
  }

  posterUrl(path: string | null) {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  onGoReview(movieId: number) {
    router.push(`/movie/${movieId}/review`);
  }

  yearOf(dateStr: string | null) {
    if (!dateStr) return '-';
    return dateStr.slice(0, 4);
  }

  formatDate(iso: string | null) {
    if (!iso) return '-';
    return iso.slice(0, 10);
  }

  tapeUrlByMovieId(movieId: number) {
    const idx = Math.abs(movieId) % this.tapes.length;
    return this.tapes[idx];
  }

  starsText(rating: number | null) {
    const r = Math.max(0, Math.min(5, Number(rating || 0)));
    const on = '★'.repeat(r);
    const off = '☆'.repeat(5 - r);
    return on + off;
  }
}

export default WatchedPage;
</script>
<style scoped>
@media (min-width: 610px) {
  .watched-card{
    width: calc(33% - 2px);
  }
}
</style>