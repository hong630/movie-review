<template>
  <div class="page-stats">
    <!-- 상단 타이틀 -->
    <header class="stats-header">
      <h1 class="stats-title">통계</h1>
    </header>

    <section class="stats-top">
      <h2 class="stats-subtitle">나의 관람 통계</h2>

      <div class="stats-row">
        <span class="stats-label">기간:</span>
        <select class="stats-select"
                v-model="period"
        >
          <option value="30d">최근 30일</option>
          <option value="3m">최근 3개월</option>
          <option value="6m">최근 6개월</option>
          <option value="all">전체</option>
        </select>
      </div>
    </section>

    <!-- 월별 관람 수 -->
    <section class="stats-section">
      <h3 class="stats-section-title">월별 관람 수</h3>
      <div class="chart-box" id="monthlyChart" ref="monthlyChart"></div>
    </section>

    <!-- 장르 분포 -->
    <section class="stats-section">
      <h3 class="stats-section-title">장르 분포</h3>
      <div class="chart-box chart-box--pie" id="genreChart" ref="genreChart"></div>

      <ul class="genre-legend">
        <li class="genre-item"><span class="dot"></span> 액션</li>
        <li class="genre-item"><span class="dot"></span> 드라마</li>
        <li class="genre-item"><span class="dot"></span> 코미디</li>
        <li class="genre-item"><span class="dot"></span> 기타</li>
      </ul>
    </section>

    <!-- 평점 분포 -->
    <section class="stats-section">
      <h3 class="stats-section-title">평점 분포</h3>
      <ul class="rating-dist">
        <li v-for="row in ratingDist" :key="row.star" class="rating-row">
          <span class="rating-star">★ {{ row.star }}</span>
          <span class="rating-bar">
            <span class="rating-bar-fill" :style="{ width: row.percent + '%' }"></span>
          </span>
          <span class="rating-count">{{ row.count }}</span>
        </li>
      </ul>
    </section>

    <!-- 최다 관람 장르 TOP3 -->
    <section class="stats-section">
      <h3 class="stats-section-title">최다 관람 장르 TOP3</h3>
      <ol class="top3">
        <li v-for="g in topGenres" :key="g.name" class="top3-item">
          <span class="top3-name">{{ g.name }}</span>
          <span class="top3-count">{{ g.count }}편</span>
        </li>
      </ol>
    </section>

    <!-- 최고/최저 평점 영화 -->
    <section class="stats-section">
      <h3 class="stats-section-title">최고 평점 영화</h3>
      <ul class="movie-mini-list">
        <li v-for="m in topRatedMovies" :key="m.movieId" class="movie-mini-item">
          <span class="movie-mini-title">{{ m.title }}</span>
          <span class="movie-mini-rating">★ {{ formatRating(m.rating) }}</span>
        </li>
        <li v-if="topRatedMovies.length === 0" class="movie-mini-empty">아직 평점 데이터가 없어요</li>
      </ul>
    </section>

    <section class="stats-section">
      <h3 class="stats-section-title">최저 평점 영화</h3>
      <ul class="movie-mini-list">
        <li v-for="m in lowRatedMovies" :key="m.movieId" class="movie-mini-item">
          <span class="movie-mini-title">{{ m.title }}</span>
          <span class="movie-mini-rating">★ {{ formatRating(m.rating) }}</span>
        </li>
        <li v-if="lowRatedMovies.length === 0" class="movie-mini-empty">아직 평점 데이터가 없어요</li>
      </ul>
    </section>

    <!-- 평균 평점 -->
    <section class="stats-footer">
      <p class="avg-rating">
        평균 평점 <span class="star">★</span> <strong>{{ avgRatingText }}</strong>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import type {UserMovie} from "@/types/user-movie.ts";
import {getUserMoviesByStatus} from "@/services/userMovieStore.ts";
import {getGenreMap, genreNameById} from '@/stores/genre-cache';

type PeriodKey = '30d' | '3m' | '6m' | 'all';

type StatsMovie = UserMovie & {
  // Stats에서 쓰기 편하게 optional 처리(원래 타입이 더 엄격하면 여기서 완화)
  watchedAt?: string | null;
  rating?: number | null;
  genres?: number[];
};

type RatingRow = { star: number; count: number; percent: number };
type GenreRow = { name: string; count: number };

@Component
class StatsPage extends Vue {
  period: PeriodKey = '30d';

  private watchedMoviesCache: StatsMovie[] = [];
  private genreMap: Record<number, string> = {};

  async mounted() {
    await this.loadGenreMap();
    await this.loadWatchedMovies();
  }

  async loadGenreMap() {
    this.genreMap = await getGenreMap();
  }

  async loadWatchedMovies() {
    // WATCHED만 통계에 쓰자 (볼 영화는 제외)
    const list = await getUserMoviesByStatus('WATCHED');
    this.watchedMoviesCache = Array.isArray(list) ? (list as StatsMovie[]) : [];
  }

  get watchedMovies(): StatsMovie[] {
    return this.watchedMoviesCache;
  }

  get filteredWatchedMovies(): StatsMovie[] {
    const list = this.watchedMovies || [];
    if (this.period === 'all') return list;

    const now = new Date();
    const from = new Date(now);
    if (this.period === '30d') from.setDate(from.getDate() - 30);
    if (this.period === '3m') from.setMonth(from.getMonth() - 3);
    if (this.period === '6m') from.setMonth(from.getMonth() - 6);

    return list.filter(m => {
      if (!m.watchedAt) return false;
      const t = new Date(m.watchedAt).getTime();
      return t >= from.getTime() && t <= now.getTime();
    });
  }

  get avgRatingText(): string {
    const list = this.filteredWatchedMovies.filter(m => typeof m.rating === 'number');
    if (list.length === 0) return '-';
    const sum = list.reduce((acc, m) => acc + (m.rating || 0), 0);
    const avg = sum / list.length;
    return avg.toFixed(1);
  }

  get ratingDist(): RatingRow[] {
    const list = this.filteredWatchedMovies.filter(m => typeof m.rating === 'number');
    const total = list.length;
    const counts = new Map<number, number>();
    for (let s = 1; s <= 5; s++) counts.set(s, 0);
    list.forEach(m => {
      const r = Math.round(Number(m.rating));
      const star = Math.min(5, Math.max(1, r));
      counts.set(star, (counts.get(star) || 0) + 1);
    });
    // 5점부터 보여주면 예쁨
    const rows: RatingRow[] = [];
    for (let s = 5; s >= 1; s--) {
      const c = counts.get(s) || 0;
      const p = total === 0 ? 0 : Math.round((c / total) * 100);
      rows.push({star: s, count: c, percent: p});
    }
    return rows;
  }

  get topGenres(): GenreRow[] {
    const list = this.filteredWatchedMovies;
    const counter = new Map<string, number>();
    list.forEach(m => {
      const names = this.getGenreNames(m);
      names.forEach(name => {
        counter.set(name, (counter.get(name) || 0) + 1);
      });
    });
    return Array.from(counter.entries())
        .map(([name, count]) => ({name, count}))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
  }

  get topRatedMovies(): StatsMovie[] {
    return this.filteredWatchedMovies
        .filter(m => typeof m.rating === 'number')
        .slice()
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);
  }

  get lowRatedMovies(): StatsMovie[] {
    return this.filteredWatchedMovies
        .filter(m => typeof m.rating === 'number')
        .slice()
        .sort((a, b) => (a.rating || 0) - (b.rating || 0))
        .slice(0, 5);
  }

  // 숫자 장르ID -> 이름 매핑 (TMDB 장르 테이블로 바꿔치기 가능)
  getGenreNames(m: StatsMovie): string[] {
    const ids = Array.isArray(m.genres) ? m.genres : [];
    if (ids.length === 0) return ['기타'];
    return ids.map(id => this.genreNameById(id));
  }

  genreNameById(id: number): string {
    return genreNameById(this.genreMap, id);
  }

  formatRating(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return '-';
    return n.toFixed(1);
  }
}

export default StatsPage;
</script>
