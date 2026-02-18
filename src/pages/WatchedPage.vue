<template>
  <div class="page-watched">
    <header class="common-header">
      <h1 class="common-title">
        <WatchedIcon/>
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
              <ReviewIcon/>
              <span>리뷰</span>
            </button>
            <button class="btn btn-outline" type="button" @click="onRemove(x.movieId)">
              <EraseIcon/>
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
import WatchedIcon from "@/assets/icons/icon_watched.svg"
import ReviewIcon from "@/assets/icons/icon_review.svg"
import EraseIcon from "@/assets/icons/icon_erase.svg"


@Component({
  name: 'WatchedPage',
  components: {
    WatchedIcon,
    ReviewIcon,
    EraseIcon,
  }
})
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