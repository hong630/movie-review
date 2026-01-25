<template>
  <div class="page-search">
    <header class="search-header">
      <h1 class="search-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
          <path
              d="M512 128C514 128 515.9 128.1 517.8 128.3L422.1 224L490 224L562 152C570.8 163 576 176.9 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192C64 156.7 92.7 128 128 128L198.1 128L102.1 224L170 224L265 129L266 128L358.1 128L262.1 224L330 224L425 129L426 128L512.1 128z"/>
        </svg>
        <span>탐색</span>
      </h1>
    </header>
    <!-- 검색바 -->
    <section class="search-bar">
      <img class="search-image" src="@/assets/images/header.jpg" alt="search img">
      <div class="search-input-wrap">
        <span class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
              d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>
        </span>
        <input
            class="search-input"
            type="text"
            placeholder="영화 검색..."
            :value="query"
            @input="onInput"
        />
      </div>
    </section>

    <section class="search-results">
      <div v-if="loading" class="search-loading">
        <p>불러오는 중...</p>
        <div class="loader loader--style5" title="4">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               x="0px" y="0px"
               width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;"
               xml:space="preserve">
    <rect x="0" y="0" width="4" height="10" fill="#333">
      <animateTransform attributeType="xml"
                        attributeName="transform" type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0" dur="0.6s" repeatCount="indefinite"/>
    </rect>
            <rect x="10" y="0" width="4" height="10" fill="#333">
      <animateTransform attributeType="xml"
                        attributeName="transform" type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
    </rect>
            <rect x="20" y="0" width="4" height="10" fill="#333">
      <animateTransform attributeType="xml"
                        attributeName="transform" type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
    </rect>
  </svg>
        </div>
      </div>
      <div v-else-if="!movies.length" class="search-empty">
        <span>결과가 없어요</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
          <path
              d="M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM198.1 217.9L224 243.8L249.9 217.9C257.7 210.1 270.4 210.1 278.2 217.9C286 225.7 286 238.4 278.2 246.2L252.3 272.1L278.2 298C286 305.8 286 318.5 278.2 326.3C270.4 334.1 257.7 334.1 249.9 326.3L224 300.4L198.1 326.3C190.3 334.1 177.6 334.1 169.8 326.3C162 318.5 162 305.8 169.8 298L195.7 272.1L169.8 246.2C162 238.4 162 225.7 169.8 217.9C177.6 210.1 190.3 210.1 198.1 217.9zM390.1 217.9L416 243.8L441.9 217.9C449.7 210.1 462.4 210.1 470.2 217.9C478 225.7 478 238.4 470.2 246.2L444.3 272.1L470.2 298C478 305.8 478 318.5 470.2 326.3C462.4 334.1 449.7 334.1 441.9 326.3L416 300.4L390.1 326.3C382.3 334.1 369.6 334.1 361.8 326.3C354 318.5 354 305.8 361.8 298L387.7 272.1L361.8 246.2C354 238.4 354 225.7 361.8 217.9C369.6 210.1 382.3 210.1 390.1 217.9zM320 352C355.3 352 384 380.7 384 416C384 451.3 355.3 480 320 480C284.7 480 256 451.3 256 416C256 380.7 284.7 352 320 352z"/>
        </svg>
      </div>
      <article v-for="m in movies" :key="m.id" class="movie-card">
        <div class="movie-thumb" aria-hidden="true">
          <img v-if="posterUrl(m.poster_path)" class="movie-thumb-img" :src="posterUrl(m.poster_path)" :alt="m.title"/>
        </div>

        <div class="movie-body">
          <h2 class="movie-title">{{ m.title }}</h2>
          <p class="movie-meta">{{ yearOf(m.release_date) }} | ★ {{ formatScore(m.vote_average) }}</p>
          <p class="movie-desc">{{ m.overview || '줄거리 정보가 없음' }}</p>

          <div class="movie-actions">
            <button
                class="btn btn-outline"
                :class="{'saved' : isInWatchlist(m)}"
                type="button"
                @click="onAddWatchlist(m)">
              <svg v-if="isInWatchlist(m)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                <path
                    d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM232 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                <path
                    d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/>
              </svg>
              <span>볼 영화</span>
            </button>
            <button
                :class="{'saved' : isWatched(m)}"
                class="btn btn-outline"
                type="button"
                @click="onAddWatched(m)">
              <svg v-if="isWatched(m)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                <path
                    d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM232 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                <path
                    d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/>
              </svg>
              <span>본 영화</span>
            </button>
            <button class="btn btn-solid" type="button" @click="onGoReview(m)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                <path
                    d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/>
              </svg>
              <span>리뷰</span>
            </button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {trendingMovies, searchMovies} from '@/services/tmdb.ts';
import {toggleWatchlist, toggleWatched, getUserMovieIdSets} from "@/services/userMovieStore.ts";
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
  watchlistIdSet = new Set<number>();
  watchedIdSet = new Set<number>();

  private debounceTimer: number | null = null;
  private page = 1;
  private hasMore = true;
  private isFetchingMore = false;
  private mode: 'trending' | 'search' = 'trending';
  private scrollHandler: (() => void) | null = null;

  async mounted() {
    await this.refreshSaved();
    await this.loadTrending(1, true);
    this.bindInfiniteScroll();
  }

  async refreshSaved() {
    const sets = await getUserMovieIdSets();
    this.watchlistIdSet = sets.watchlist;
    this.watchedIdSet = sets.watched;
  }

  isInWatchlist(m: TmdbMovie) {
    return this.watchlistIdSet.has(m.id);
  }

  isWatched(m: TmdbMovie) {
    return this.watchedIdSet.has(m.id);
  }

  beforeUnmount() {
    this.unbindInfiniteScroll();
    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  async loadTrending(page = 1, reset = false) {
    if (reset) {
      this.mode = 'trending';
      this.page = 1;
      this.hasMore = true;
      this.movies = [];
    }
    if (!this.hasMore) return;

    if (page === 1) this.loading = true;
    try {
      const data = await trendingMovies(page);
      const next = (data?.results || []) as TmdbMovie[];
      this.movies = reset ? next : [...this.movies, ...next];
      this.page = page;
      this.hasMore = next.length > 0;
    } finally {
      this.loading = false;
    }
  }

  async loadSearch(q: string, page = 1, reset = false) {
    if (reset) {
      this.mode = 'search';
      this.page = 1;
      this.hasMore = true;
      this.movies = [];
    }
    if (!this.hasMore) return;

    if (page === 1) this.loading = true;
    try {
      const data = await searchMovies(q, page);
      const next = (data?.results || []) as TmdbMovie[];
      this.movies = reset ? next : [...this.movies, ...next];
      this.page = page;
      this.hasMore = next.length > 0;
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
        await this.loadTrending(1, true);
        return;
      }
      await this.loadSearch(q, 1, true);
    }, 350);
  }

  private bindInfiniteScroll() {
    this.scrollHandler = () => {
      // 바닥에서 180px 남았을 때 다음 페이지 로드
      const gap = 180;
      const reachedBottom =
          window.innerHeight + window.scrollY >= (document.documentElement.scrollHeight - gap);

      if (!reachedBottom) return;
      if (this.loading) return;
      if (this.isFetchingMore) return;
      if (!this.hasMore) return;

      this.fetchNextPage();
    };
    window.addEventListener('scroll', this.scrollHandler, {passive: true} as any);
  }

  private unbindInfiniteScroll() {
    if (!this.scrollHandler) return;
    window.removeEventListener('scroll', this.scrollHandler as any);
    this.scrollHandler = null;
  }

  private async fetchNextPage() {
    this.isFetchingMore = true;
    try {
      const nextPage = this.page + 1;
      const q = this.query.trim();
      if (this.mode === 'search' && q) {
        await this.loadSearch(q, nextPage, false);
      } else {
        await this.loadTrending(nextPage, false);
      }
    } finally {
      this.isFetchingMore = false;
    }
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
    await toggleWatchlist({
      movieId: m.id,
      title: m.title,
      posterPath: m.poster_path || null,
      releaseDate: m.release_date || null,
      genres: m.genre_ids || [],
    });
    await this.refreshSaved();
    alert('반영했어요!');
  }

  async onAddWatched(m: TmdbMovie & { genre_ids?: number[] }) {
    await toggleWatched({
      movieId: m.id,
      title: m.title,
      posterPath: m.poster_path || null,
      releaseDate: m.release_date || null,
      genres: m.genre_ids || [],
    });
    await this.refreshSaved();
    alert('반영했어요!');
  }

  onGoReview(m: TmdbMovie) {
    router.push(`/movie/${m.id}/review`);
  }
}

export default SearchPage;
</script>
<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  height: 280px;
}

.search-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.search-input-wrap {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translatex(-50%);
  width: calc(100% - 24px);
  box-sizing: border-box;
  border-radius: 0;
  background-color: #E8E2D8;
}

.search-input-wrap input {
  background-color: transparent;
}

.search-icon svg {
  width: 16px;
  height: 16px;
}


</style>