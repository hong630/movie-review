<template>
  <div class="page-search">
    <header class="common-header">
      <h1 class="common-title">
        <MovieIcon/>
        <span>탐색</span>
      </h1>
    </header>
    <!-- 검색바 -->
    <section class="search-bar">
      <img class="search-image" src="@/assets/images/header.jpg" alt="search img">
      <div class="search-input-wrap">
        <span class="search-icon">
          <SearchIcon/>
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
          <LoadingIcon/>
        </div>
      </div>
      <div v-else-if="!movies.length" class="search-empty">
        <span>결과가 없어요</span>
        <NothingIcon/>
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
              <MinusIcon v-if="isInWatchlist(m)"/>
              <PlusIcon v-else/>
              <span>볼 영화</span>
            </button>
            <button
                :class="{'saved' : isWatched(m)}"
                class="btn btn-outline"
                type="button"
                @click="onAddWatched(m)">
              <MinusIcon v-if="isWatched(m)"/>
              <PlusIcon v-else/>
              <span>본 영화</span>
            </button>
            <button class="btn btn-solid" type="button" @click="onGoReview(m)">
              <PlusIcon/>
              <span>리뷰</span>
            </button>
          </div>
        </div>
      </article>
    </section>
  </div>
  <ToastMessageComponent
      v-model="toastOpen"
      :type="toastType"
      :message="toastMessage"
      :duration-ms="1800"
  />
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {trendingMovies, searchMovies} from '@/services/tmdb.ts';
import {toggleWatchlist, toggleWatched, getUserMovieIdSets} from "@/services/userMovieStore.ts";
import {router} from "@/router";
import type {UserMovieToggleResult} from '@/types/user-movie';
import ToastMessageComponent from "@/components/layout/ToastMessageComponent.vue";
import type { ToastType } from "@/components/layout/ToastMessageComponent.vue";
import MovieIcon from "@/assets/icons/icon_movie.svg"
import SearchIcon from "@/assets/icons/icon_search.svg"
import LoadingIcon from "@/assets/icons/icon_loading.svg"
import NothingIcon from "@/assets/icons/icon_nothing.svg"
import MinusIcon from "@/assets/icons/icon_minus.svg"
import PlusIcon from "@/assets/icons/icon_plus.svg"


type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
  genre_ids?: number[];
};

@Component({
  name: 'SearchPage',
  components: {
    ToastMessageComponent,
    MovieIcon,
    SearchIcon,
    LoadingIcon,
    NothingIcon,
    MinusIcon,
    PlusIcon,
  }
})
class SearchPage extends Vue {
  query = '';
  movies: TmdbMovie[] = [];
  loading = false;
  watchlistIdSet = new Set<number>();
  watchedIdSet = new Set<number>();
  private busy = false;

  toastOpen = false;
  toastType: ToastType = 'success';
  toastMessage = '';

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

  private openToast(type: ToastType, message: string) {
    this.toastOpen = false;
    this.toastType = type;
    this.toastMessage = message;
    this.$nextTick(() => {
      this.toastOpen = true;
    });
  }

  private toastByAction(res: UserMovieToggleResult) {
    switch (res.action) {
      case 'ADDED_TO_WATCHLIST':
        this.openToast('success', '볼 영화에 추가했어요 🎬');
        return;
      case 'REMOVED_FROM_WATCHLIST':
        this.openToast('success', '볼 영화에서 삭제했어요 🎬');
        return;
      case 'MOVED_TO_WATCHLIST':
        this.openToast('success', '볼 영화로 옮겼어요 🎬');
        return;
      case 'ADDED_TO_WATCHED':
        this.openToast('success', '본 영화에 추가했어요 🎬');
        return;
      case 'REMOVED_FROM_WATCHED':
        this.openToast('success', '본 영화에서 삭제했어요 🎬');
        return;
      case 'MOVED_TO_WATCHED':
        this.openToast('success', '본 영화로 옮겼어요 🎬');
        return;
    }
  }

  async onAddWatchlist(m: TmdbMovie) {
    if (this.busy) return;
    this.busy = true;
    try {
      const res = await toggleWatchlist({
        movieId: m.id,
        title: m.title,
        posterPath: m.poster_path || null,
        releaseDate: m.release_date || null,
        genres: m.genre_ids || [],
      });
      await this.refreshSaved();
      this.toastByAction(res);
    } catch (e) {
      this.openToast('error', '처리를 실패했어요. 다시 시도해주세요!');
    } finally {
      this.busy = false;
    }
  }

  async onAddWatched(m: TmdbMovie) {
    if (this.busy) return;
    this.busy = true;
    try {
      const res = await toggleWatched({
        movieId: m.id,
        title: m.title,
        posterPath: m.poster_path || null,
        releaseDate: m.release_date || null,
        genres: m.genre_ids || [],
      });
      await this.refreshSaved();
      this.toastByAction(res);
    } catch (e) {
      this.openToast('error', '처리를 실패했어요. 다시 시도해주세요!');
    } finally {
      this.busy = false;
    }
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
  margin-top: 40px;
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

@media (min-width: 610px) {
  .search-input{
    font-size: 14px;
  }
}


</style>