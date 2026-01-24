<template>
  <div class="page-watched">
    <header class="watched-header">
      <h1 class="watched-title">본 영화</h1>
    </header>

    <section class="watched-list">
      <p v-if="!items.length" class="list-empty">아직 본 영화가 없어 🥹</p>

      <article v-for="x in items" :key="x.movieId" class="watched-card">
        <div class="watched-thumb" aria-hidden="true">
          <img v-if="posterUrl(x.posterPath)" class="movie-thumb-img" :src="posterUrl(x.posterPath)" :alt="x.title"/>
        </div>

        <div class="watched-body">
          <div class="watched-text">
            <h3 class="watched-movie-title">{{ x.title }}</h3>
            <p class="watched-movie-meta">
              {{ yearOf(x.releaseDate) }} · {{ formatDate(x.watchedAt) }}
            </p>
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
import {Component, toNative, Vue} from 'vue-facing-decorator';
import type {UserMovie} from '@/types/user-movie';
import {getUserMoviesByStatus, removeUserMovie} from '@/services/userMovieStore';
import {router} from "@/router";

@Component
export default class WatchedPage extends Vue {
  items: UserMovie[] = [];

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
}
</script>
