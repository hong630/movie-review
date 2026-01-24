<template>
  <div class="page-watchlist">
    <header class="watchlist-header">
      <h1 class="watchlist-title">볼 영화</h1>
    </header>

    <section class="watchlist-list">
      <p v-if="!items.length" class="list-empty">아직 담은 영화가 없어 🥹</p>

      <article v-for="x in items" :key="x.movieId" class="watchlist-card">
        <div class="watchlist-thumb" aria-hidden="true">
          <img v-if="posterUrl(x.posterPath)" class="movie-thumb-img" :src="posterUrl(x.posterPath)" :alt="x.title" />
        </div>

        <div class="watchlist-body">
          <div class="watchlist-text">
            <h3 class="watchlist-movie-title">{{ x.title }}</h3>
            <p class="watchlist-movie-meta">{{ yearOf(x.releaseDate) }}</p>
          </div>

          <div class="watchlist-actions">
            <button class="btn btn-solid" type="button" @click="onMoveToWatched(x.movieId)">봤어요</button>
            <button class="btn btn-outline" type="button" @click="onRemove(x.movieId)">삭제</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import type { UserMovie } from '@/types/user-movie';
import { getUserMoviesByStatus, moveToWatched, removeUserMovie } from '@/services/userMovieStore';

@Component
class WatchlistPage extends Vue {
  items: UserMovie[] = [];

  async mounted() {
    await this.reload();
  }

  async reload() {
    this.items = await getUserMoviesByStatus('WATCHLIST');
  }

  async onMoveToWatched(movieId: number) {
    await moveToWatched(movieId);
    await this.reload();
    alert('본 영화로 이동! 🐹');
  }

  async onRemove(movieId: number) {
    await removeUserMovie(movieId);
    await this.reload();
  }

  posterUrl(path: string | null) {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  yearOf(dateStr: string | null) {
    if (!dateStr) return '-';
    return dateStr.slice(0, 4);
  }
}
export default WatchlistPage;
</script>
