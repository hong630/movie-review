<template>
  <div class="page-stats">
    <!-- 상단 타이틀 -->
    <header class="stats-header">
      <h1 class="stats-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM168 280L168 344C168 357.3 178.7 368 192 368C205.3 368 216 357.3 216 344L216 280C216 266.7 205.3 256 192 256C178.7 256 168 266.7 168 280zM248 184L248 344C248 357.3 258.7 368 272 368C285.3 368 296 357.3 296 344L296 184C296 170.7 285.3 160 272 160C258.7 160 248 170.7 248 184zM328 248L328 344C328 357.3 338.7 368 352 368C365.3 368 376 357.3 376 344L376 248C376 234.7 365.3 224 352 224C338.7 224 328 234.7 328 248z"/></svg>
        <span>통계</span>
      </h1>
    </header>

    <section class="stats-top">
      <h2 class="stats-subtitle">나의 관람 통계</h2>
    </section>

    <!-- 월별 관람 수 -->
    <section class="stats-section">
      <div class="stats-row">
        <h3 class="stats-section-title monthly">🎬 월별 관람 수</h3>
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
      <h3 class="stats-section-title genre-percent">🎬 장르 분포</h3>
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
    <!-- 평균 평점 -->
    <section class="stats-footer">
      <p class="avg-rating">
        평균 평점 <span class="star">★</span> <strong>{{ avgRatingText }}</strong>
      </p>
    </section>
    <!-- 최고/최저 평점 영화 -->
    <section class="stats-section">
      <h3 class="stats-section-title">🎬 최고 평점 영화</h3>
      <div v-if="topRatedMovie" class="movie-rate-container">
        <img src="@/assets/images/best.jpg" alt="최고 평점 영화">
        <div class="movie-mini-item movie-mini-item--one">
          <img
              class="movie-mini-poster"
              :src="topRatedMovie['posterUrl'] || ''"
              alt=""
              loading="lazy"
              @error="onPosterError"
          />
          <div class="movie-mini-meta">
            <div class="movie-mini-title">{{ topRatedMovie.title }}</div>
            <div class="movie-mini-rating">★ {{ formatRating(topRatedMovie.rating) }}</div>
          </div>
        </div>
      </div>
      <div v-else class="movie-mini-empty">아직 평점 데이터가 없어요</div>
    </section>

    <section class="stats-section">
      <h3 class="stats-section-title">🎬 최저 평점 영화</h3>
      <div v-if="lowRatedMovie" class="movie-rate-container worst">
        <img src="@/assets/images/worst.jpg" alt="최저 평점 영화">
        <div class="movie-mini-item movie-mini-item--one">
          <img
              class="movie-mini-poster"
              :src="lowRatedMovie['posterUrl'] || ''"
              alt=""
              loading="lazy"
              @error="onPosterError"
          />
          <div class="movie-mini-meta">
            <div class="movie-mini-title">{{ lowRatedMovie.title }}</div>
            <div class="movie-mini-rating">★ {{ formatRating(lowRatedMovie.rating) }}</div>
          </div>
        </div>
      </div>
      <div v-else class="movie-mini-empty">아직 평점 데이터가 없어요</div>
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
    // WATCHED만 (볼 영화는 제외)
    const list = await getUserMoviesByStatus('WATCHED');
    const raw = Array.isArray(list) ? (list as StatsMovie[]) : [];
    this.watchedMoviesCache = raw.map((m) => ({
      ...m,
      posterUrl: this.resolvePosterUrl(m),
    }));
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

  get topRatedMovie(): StatsMovie | null {
    const item = this.filteredWatchedMovies
        .filter(m => typeof m.rating === 'number')
        .slice()
        .sort((a, b) => {
          const dr = (b.rating || 0) - (a.rating || 0);
          if (dr !== 0) return dr;
          // 동일 평점이면 "등록 최신" 우선
          return this.getRegisteredAtMs(b) - this.getRegisteredAtMs(a);
        })[0];
    return item || null;
  }

  get lowRatedMovie(): StatsMovie | null {
    const item = this.filteredWatchedMovies
        .filter(m => typeof m.rating === 'number')
        .slice()
        .sort((a, b) => {
          const dr = (a.rating || 0) - (b.rating || 0);
          if (dr !== 0) return dr;
          // 동일 평점이면 "등록 최신" 우선
          return this.getRegisteredAtMs(b) - this.getRegisteredAtMs(a);
        })[0];
    return item || null;
  }

  getRegisteredAtMs(m: any): number {
    const raw =
        m?.updatedAt ??
        m?.createdAt ??
        m?.savedAt ??
        m?.watchedAt ??
        null;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  resolvePosterUrl(m: any): string | null {
    // 이미 full url이면 우선 사용
    const url = m?.posterUrl || m?.poster_url || m?.poster;
    if (url) return String(url);

    // TMDB path이면 조합
    const posterPath = m?.posterPath || m?.poster_path;
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w342${posterPath}`;
  }

  onPosterError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.style.display = 'none';
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

.genre-percent {
  margin-bottom: 12px;
}

.movie-mini-item--one {
  display: flex;
  align-items: center;
  gap: 12px;
}

.movie-mini-poster {
  width: 56px;
  height: 84px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.movie-mini-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.movie-rate-container{
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 390 / 297;
}
.movie-rate-container.worst{
  aspect-ratio: 390 / 192;
}
.movie-rate-container.worst .movie-mini-item--one{
  top: unset;
  left: unset;
  bottom: 4%;
  right: 8%;
}
.movie-rate-container>img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
.movie-mini-item--one{
  position: absolute;
  top: 8%;
  left: 4%;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 6px;
  border-radius: 8px;
}
.stats-section-title.monthly{
  margin-bottom: 4px;
}
.stats-top{
  margin-top: 28px;
}
.stats-header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  z-index: 10;
  background-color: #E8E2D8;
  box-sizing: border-box;
}
.stats-title{
  display: flex;
  flex-direction: row;
  gap: 2px;
}
.stats-table > *{
  align-self: center;
}
.stats-title span{
  white-space: nowrap;
  height: 22px;
  line-height: 22px;
}
.stats-title svg {
  width: 22px;
  height: 22px;
  align-self: center;
}
/* 평균 평점 영역 전체 */
.stats-footer{
  padding: 14px 0 8px;
}

.avg-rating{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.78);
}

/* 별 크게 + 반짝 */
.avg-rating .star{
  font-size: 22px;        /* 별 크게 */
  line-height: 1;
  display: inline-block;
  transform: translateY(-1px);
  color: #F68537;
  text-shadow:
      0 0 6px rgba(255, 230, 120, 0.75),
      0 0 14px rgba(255, 220, 100, 0.55);

  animation: starSparkle 1.6s ease-in-out infinite;
}

/* 숫자 강조 */
.avg-rating strong{
  font-size: 18px;
  padding-left: 0;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  font-style: italic;
  margin-left: -10px;
}

/* 반짝반짝 */
@keyframes starSparkle{
  0%, 100%{
    transform: translateY(-1px) scale(1);
    filter: drop-shadow(0 0 0 rgba(255,230,120,0));
    opacity: 0.95;
  }
  50%{
    transform: translateY(-2px) scale(1.14);
    filter: drop-shadow(0 0 10px rgba(255,230,120,0.9));
    opacity: 1;
  }
}

/* 모션 싫어하는 사람 배려(선택) */
@media (prefers-reduced-motion: reduce){
  .avg-rating .star{ animation: none; }
}

@media (min-width: 610px) {
  .movie-mini-poster {
    width: 8rem;
    height: 10rem;
  }
}
</style>
