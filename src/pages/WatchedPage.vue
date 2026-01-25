<template>
  <div class="page-watched">
    <header class="watched-header">
      <h1 class="watched-title">본 영화</h1>
    </header>

    <section class="watched-list">
      <p v-if="!items.length" class="list-empty">아직 본 영화가 없어요 </p>

      <article v-for="x in items" :key="x.movieId" class="watched-card">
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
              {{ yearOf(x.releaseDate) }} · {{ formatDate(x.watchedAt) }}
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
            <button class="btn btn-solid" type="button" @click="onGoReview(x.movieId)">리뷰</button>
            <button class="btn btn-outline" type="button" @click="onRemove(x.movieId)">삭제</button>
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
