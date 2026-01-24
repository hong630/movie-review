<template>
  <div class="page-search">
    <header class="search-header">
      <h1 class="search-title">탐색</h1>
    </header>

    <!-- 검색바 -->
    <section class="search-bar">
      <div class="search-input-wrap">
        <span class="search-icon">🔎</span>
        <input
            class="search-input"
            type="text"
            placeholder="영화 검색..."
            :value="query"
            @input="onInput"
        />
      </div>
    </section>

    <!-- 필터 탭 (일단 UI만) -->
    <section class="search-filter">
      <div class="segmented">
        <button class="seg-item is-active" type="button">트렌딩</button>
        <button class="seg-item" type="button">장르</button>
      </div>
    </section>

    <!-- 결과 -->
    <section class="search-results">
      <p v-if="loading" class="search-loading">불러오는 중...</p>
      <p v-else-if="!movies.length" class="search-empty">결과가 없어요</p>

      <article v-for="m in movies" :key="m.id" class="movie-card">
        <div class="movie-thumb" aria-hidden="true">
          <img v-if="posterUrl(m.poster_path)" class="movie-thumb-img" :src="posterUrl(m.poster_path)" :alt="m.title"/>
        </div>

        <div class="movie-body">
          <h2 class="movie-title">{{ m.title }}</h2>
          <p class="movie-meta">{{ yearOf(m.release_date) }} | ★ {{ formatScore(m.vote_average) }}</p>
          <p class="movie-desc">{{ m.overview || '줄거리 정보가 없음' }}</p>

          <div class="movie-actions">
            <button class="btn btn-outline" type="button" @click="onAddWatchlist(m)">+ 볼 영화</button>
            <button class="btn btn-outline" type="button" @click="onAddWatched(m)">+ 본 영화</button>
            <button class="btn btn-solid" type="button" @click="onGoReview(m)">리뷰</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {trendingMovies, searchMovies} from '@/services/tmdb.ts';
import {addToWatchlist, markWatched} from "@/services/userMovieStore.ts";
import {router} from "@/router";

type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
};
@Component({name: 'SearchPage'})
class SearchPage extends Vue {
  query = '';
  movies: TmdbMovie[] = [];
  loading = false;

  private debounceTimer: number | null = null;

  async mounted() {
    await this.loadTrending();
  }

  async loadTrending() {
    this.loading = true;
    try {
      const data = await trendingMovies(1);
      this.movies = (data?.results || []) as TmdbMovie[];
    } finally {
      this.loading = false;
    }
  }

  async loadSearch(q: string) {
    this.loading = true;
    try {
      const data = await searchMovies(q, 1);
      this.movies = (data?.results || []) as TmdbMovie[];
    } finally {
      this.loading = false;
    }
  }

  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.query = v;

    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.debounceTimer = window.setTimeout(async () => {
      const q = this.query.trim();
      if (!q) {
        await this.loadTrending();
        return;
      }
      await this.loadSearch(q);
    }, 350);
  }

  posterUrl(path: string | null) {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  yearOf(dateStr: string | null) {
    if (!dateStr) return '-';
    return dateStr.slice(0, 4);
  }

  formatScore(v: number) {
    if (typeof v !== 'number') return '-';
    return v.toFixed(1);
  }

  async onAddWatchlist(m: TmdbMovie & { genre_ids?: number[] }) {
    await addToWatchlist({
      movieId: m.id,
      title: m.title,
      posterPath: m.poster_path || null,
      releaseDate: m.release_date || null,
      genres: m.genre_ids || [],
    });
    alert('볼 영화에 추가했어요!');
  }

  async onAddWatched(m: TmdbMovie & { genre_ids?: number[] }) {
    await markWatched({
      movieId: m.id,
      title: m.title,
      posterPath: m.poster_path || null,
      releaseDate: m.release_date || null,
      genres: m.genre_ids || [],
    });
    alert('본 영화에 추가완료!');
  }

  onGoReview(m: TmdbMovie) {
    router.push(`/movie/${m.id}/review`);
  }
}
export default SearchPage;
</script>
