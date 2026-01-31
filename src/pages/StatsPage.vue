<template>
  <div class="page-stats">
    <!-- 상단 타이틀 -->
    <header class="stats-header">
      <h1 class="stats-title">통계</h1>
    </header>

    <section class="stats-top">
      <h2 class="stats-subtitle">나의 관람 통계</h2>
    </section>

    <!-- 월별 관람 수 -->
    <section class="stats-section">
      <div class="stats-row">
        <h3 class="stats-section-title">월별 관람 수</h3>
        <!-- 월별 관람 수 기준 토글 -->
        <div class="stats-row">
          <div class="pill-toggle" role="tablist" aria-label="월별 관람 기준">
            <button
                type="button"
                class="pill-btn"
                :class="{active: monthMode==='year'}"
                @click="setMonthMode('year')"
            >올해 기준
            </button>
            <button
                type="button"
                class="pill-btn"
                :class="{active: monthMode==='last12'}"
                @click="setMonthMode('last12')"
                :aria-selected="monthMode==='last12'"
            >최근 12개월
            </button>
          </div>
        </div>
      </div>
      <div class="chart-box" id="monthlyChart" ref="monthlyChart">
        <MonthlyWatchedChart
            :userMovies="watchedMovies"
            :monthsBack="monthMode==='last12' ? 12 : 0"
            :yearMode="monthMode==='year'"
            :height="0"
            :renderSig="renderSig"
        />
      </div>
    </section>

    <!-- 장르 분포 -->
    <section class="stats-section">
      <h3 class="stats-section-title genre-percent">장르 분포</h3>
      <div class="chart-box chart-box--pie">
        <GenreDistributionChart
            :userMovies="watchedMovies"
            :resolveGenreName="genreNameById"
            :topN="6"
            :height="0"
            :renderSig="genreRenderSig"
        />
      </div>
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
import {Component, Vue, Watch} from 'vue-facing-decorator';
import type {UserMovie} from "@/types/user-movie.ts";
import {getUserMoviesByStatus} from "@/services/userMovieStore.ts";
import {getGenreMap, genreNameById} from '@/stores/genre-cache';
import MonthlyWatchedChart from "@/components/charts/MonthlyWatchedChart.vue";
import GenreDistributionChart from "@/components/charts/GenreDistributionChart.vue";

type PeriodKey = '30d' | '3m' | '6m' | 'all';
type MonthMode = 'year' | 'last12';

type StatsMovie = UserMovie & {
  watchedAt?: string | null;
  rating?: number | null;
  genres?: number[];
};

@Component(
    {
      name: 'StatsPage',
      components: {MonthlyWatchedChart, GenreDistributionChart},
    }
)
class StatsPage extends Vue {
  period: PeriodKey = '30d';
  monthMode: MonthMode = 'last12';

  private watchedMoviesCache: StatsMovie[] = [];
  private genreMap: Record<number, string> = {};
  renderSig = '';
  genreRenderSig = '';

  async mounted() {
    await this.loadGenreMap();
    await this.loadWatchedMovies();
    this.renderSig = `${Date.now()}`;
    this.genreRenderSig = `${Date.now()}`;
  }

  setMonthMode(mode: MonthMode) {
    if (this.monthMode === mode) return;
    this.monthMode = mode;
    this.renderSig = `${Date.now()}`; // 토글 바뀌면 애니메이션 재생
  }

  @Watch('period')
  onPeriodChange() {
    // period 바뀔 때 차트 애니메이션 다시 재생
    this.renderSig = `${Date.now()}`;
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
    const from = new Date(now.getTime());
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

<style scoped>
.pill-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(6px);
}

.pill-btn {
  appearance: none;
  border: 0;
  background: transparent;
  color: #452829;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 999px;
  line-height: 1;
  cursor: pointer;
  transition: background-color .18s ease, color .18s ease, transform .18s ease;
}

.pill-btn.active {
  background: rgba(255, 255, 255, 0.92);
  color: rgba(0, 0, 0, 0.86);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}

.pill-btn:active {
  transform: scale(0.98);
}
.genre-percent{
  margin-bottom: 12px;
}
</style>
