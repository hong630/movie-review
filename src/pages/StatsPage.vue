<template>
  <div class="page-stats">
    <!-- 상단 타이틀 -->
    <header class="common-header">
      <h1 class="common-title">
        <StatIcon/>
        <span>통계</span>
      </h1>
    </header>

    <section class="stats-top">
      <h2 class="stats-subtitle">나의 관람 통계</h2>
    </section>

    <!-- 탭 -->
    <section class="stats-tabs">
      <div class="pill-toggle" role="tablist" aria-label="통계/직함 탭">
        <button
            type="button"
            class="pill-btn"
            :class="{active: activeTab==='stats'}"
            @click="setActiveTab('stats')"
        >통계
        </button>
        <button
            type="button"
            class="pill-btn"
            :class="{active: activeTab==='titles'}"
            @click="setActiveTab('titles')"
        >직함
        </button>
      </div>
    </section>
    <div v-if="activeTab==='stats'">
      <!-- 월별 관람 수 -->
      <section class="stats-section">
        <div class="stats-row">
          <h3 class="stats-section-title monthly">🎬 월별 관람 수</h3>
          <!-- 월별 관람 수 기준 토글 -->
          <div class="stats-row" v-if="hasMonthlyData">
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
        <div
            class="chart-box"
            :class="{ empty: !hasMonthlyData }"
            id="monthlyChart"
            ref="monthlyChart"
        >
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
        <div
            class="chart-box chart-box--pie"
            :class="{ empty: !hasMonthlyData }"
            id="monthlyChart"
            ref="monthlyChart"
        >
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
      <section class="stats-footer" v-if="hasMonthlyData">
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

    <!-- 직함(업적) 탭 -->
    <div v-else>
      <section class="stats-section">
        <h3 class="stats-section-title">🏆 나의 직함</h3>
        <p class="title-hint">
          본 영화 <strong>{{ watchedCount }}</strong>편 기준으로 열려요 🐹
        </p>

        <div class="ach-grid">
          <button
              v-for="a in achievements"
              :key="a.id"
              type="button"
              class="ach-card"
              :class="{ locked: !isUnlocked(a) }"
              @click="onClickAchievement(a)"
          >
            <img class="ach-img" :src="a.imgUrl" alt="" loading="lazy"/>
            <div class="ach-meta">
              <div class="ach-title">{{ a.title }}</div>
              <div class="ach-sub" v-if="isUnlocked(a)">
                ✨ 열 수 있어요!
              </div>
              <div class="ach-sub" v-else>
                🔒 {{ remainingText(a) }}
              </div>
            </div>
          </button>
        </div>
      </section>

      <!-- 업적 모달 -->
      <div v-if="isAchModalOpen" class="ach-modal-backdrop" @click="closeAchievementModal">
        <div class="ach-modal" :class="{ sparkle: sparkleOn }" role="dialog" aria-modal="true" @click.stop>
          <button type="button" class="ach-close" @click="closeAchievementModal">✕</button>
          <img class="ach-modal-img" :src="selectedAchievement?.imgUrl || ''" alt=""/>
          <div class="ach-modal-title">{{ selectedAchievement?.title }}</div>
          <div class="ach-modal-sub">🏆 {{ selectedAchievement?.threshold }}편 달성</div>
          <div class="sparkles" v-if="sparkleOn" aria-hidden="true">
            <span class="sp s1">✨</span>
            <span class="sp s2">✨</span>
            <span class="sp s3">✨</span>
            <span class="sp s4">✨</span>
            <span class="sp s5">✨</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-facing-decorator';
import type {UserMovie} from "@/types/user-movie.ts";
import {getUserMoviesByStatus} from "@/services/userMovieStore.ts";
import {getGenreMap, genreNameById} from '@/stores/genre-cache';
import MonthlyWatchedChart from "@/components/charts/MonthlyWatchedChart.vue";
import GenreDistributionChart from "@/components/charts/GenreDistributionChart.vue";
import StatIcon from "@/assets/icons/icon_stat.svg"
import type {AchievementDef} from "@/stores/achievements.ts";
import {ACHIEVEMENTS} from "@/stores/achievements.ts";


type PeriodKey = '30d' | '3m' | '6m' | 'all';
type MonthMode = 'year' | 'last12';

type StatsMovie = UserMovie & {
  watchedAt?: string | null;
  rating?: number | null;
  genres?: number[];
  posterUrl?: string | null;
};

type StatsTab = 'stats' | 'titles';

@Component(
    {
      name: 'StatsPage',
      components: {MonthlyWatchedChart, GenreDistributionChart, StatIcon},
    }
)
class StatsPage extends Vue {
  period: PeriodKey = '30d';
  monthMode: MonthMode = 'last12';
  activeTab: StatsTab = 'stats';

  private watchedMoviesCache: StatsMovie[] = [];
  private genreMap: Record<number, string> = {};
  renderSig = '';
  genreRenderSig = '';
  selectedAchievement: AchievementDef | null = null;
  sparkleOn = false;

  async mounted() {
    await this.loadGenreMap();
    await this.loadWatchedMovies();
    this.renderSig = `${Date.now()}`;
    this.genreRenderSig = `${Date.now()}`;
  }

  setActiveTab(tab: StatsTab) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
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

  get watchedCount(): number {
    return Array.isArray(this.watchedMoviesCache) ? this.watchedMoviesCache.length : 0;
  }


  get achievements(): AchievementDef[] {
    return ACHIEVEMENTS;
  }

  isUnlocked(a: AchievementDef): boolean {
    // "일치하면 열 수 있음"은 보통 누적 달성으로 처리하는 게 UX 좋음(놓치지 않게)
    return this.watchedCount >= a.threshold;
  }

  remainingText(a: AchievementDef): string {
    const remain = Math.max(a.threshold - this.watchedCount, 0);
    return `${remain}편 더 보면 열 수 있어요`;
  }

  onClickAchievement(a: AchievementDef) {
    if (!this.isUnlocked(a)) return;
    this.selectedAchievement = a;
    this.playSparkle();
  }

  closeAchievementModal() {
    this.selectedAchievement = null;
    this.sparkleOn = false;
  }

  get isAchModalOpen(): boolean {
    return !!this.selectedAchievement;
  }

  playSparkle() {
    this.sparkleOn = false;
    // nextTick 느낌으로 한 프레임 쉬고 켜야 애니메이션 확실히 탐
    setTimeout(() => {
      this.sparkleOn = true;
      setTimeout(() => {
        this.sparkleOn = false;
      }, 1200);
    }, 30);
  }

  get hasMonthlyData(): boolean {
    return Array.isArray(this.watchedMoviesCache) && this.watchedMoviesCache.length > 0;
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
      const t = new Date(String(m.watchedAt)).getTime();
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
.stats-tabs {
  display: flex;
  justify-content: flex-start;
  margin: 8px 0 18px;
}


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

.title-hint {
  margin: 6px 0 14px;
  color: rgba(0, 0, 0, 0.62);
  font-weight: 700;
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ach-card {
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: left;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.75);
  cursor: pointer;
}

.ach-card.locked {
  cursor: not-allowed;
}

.ach-img {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
}

.ach-card.locked .ach-img {
  filter: blur(2px) grayscale(0.8);
  opacity: 0.6;
}

.ach-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ach-title {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ach-sub {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.58);
  font-weight: 700;
}

.ach-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 9999;
}

.ach-modal {
  width: min(360px, 100%);
  background: white;
  border-radius: 18px;
  padding: 14px 14px 18px;
  position: relative;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

.ach-modal.sparkle {
  animation: popSparkle 420ms ease-out;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22),
  0 0 0 2px rgba(255, 210, 120, 0.65),
  0 0 18px rgba(255, 210, 120, 0.55);
}

.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sp {
  position: absolute;
  font-size: 20px;
  opacity: 0;
  animation: flySparkle 900ms ease-out forwards;
}

.sp.s1 {
  top: 12%;
  left: 18%;
  animation-delay: 0ms;
}

.sp.s2 {
  top: 18%;
  right: 16%;
  animation-delay: 60ms;
}

.sp.s3 {
  bottom: 18%;
  left: 22%;
  animation-delay: 120ms;
}

.sp.s4 {
  bottom: 14%;
  right: 18%;
  animation-delay: 180ms;
}

.sp.s5 {
  top: 50%;
  left: 8%;
  animation-delay: 240ms;
}

@keyframes popSparkle {
  0% {
    transform: scale(0.98);
  }
  55% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes flySparkle {
  0% {
    transform: translateY(6px) scale(0.9) rotate(0deg);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translateY(-18px) scale(1.15) rotate(12deg);
    opacity: 0;
  }
}

.ach-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}

.ach-modal-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 16px;
}

.ach-modal-title {
  margin-top: 12px;
  font-weight: 1000;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.86);
}

.ach-modal-sub {
  margin-top: 6px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.62);
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

.movie-rate-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 390 / 297;
}

.movie-rate-container.worst {
  aspect-ratio: 390 / 192;
}

.movie-rate-container.worst .movie-mini-item--one {
  top: unset;
  left: unset;
  bottom: 4%;
  right: 8%;
}

.movie-rate-container > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.movie-mini-item--one {
  position: absolute;
  top: 8%;
  left: 4%;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 6px;
  border-radius: 8px;
}

.stats-section-title.monthly {
  margin-bottom: 4px;
}

.stats-top {
  margin-top: 28px;
}

.stats-table > * {
  align-self: center;
}

.stats-title span {
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
.stats-footer {
  padding: 14px 0 8px;
}

.avg-rating {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.78);
}

/* 별 크게 + 반짝 */
.avg-rating .star {
  font-size: 22px; /* 별 크게 */
  line-height: 1;
  display: inline-block;
  transform: translateY(-1px);
  color: #F68537;
  text-shadow: 0 0 6px rgba(255, 230, 120, 0.75),
  0 0 14px rgba(255, 220, 100, 0.55);

  animation: starSparkle 1.6s ease-in-out infinite;
}

/* 숫자 강조 */
.avg-rating strong {
  font-size: 18px;
  padding-left: 0;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  font-style: italic;
  margin-left: -10px;
  line-height: 21px;
}

/* 반짝반짝 */
@keyframes starSparkle {
  0%, 100% {
    transform: translateY(-1px) scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 230, 120, 0));
    opacity: 0.95;
  }
  50% {
    transform: translateY(-2px) scale(1.14);
    filter: drop-shadow(0 0 10px rgba(255, 230, 120, 0.9));
    opacity: 1;
  }
}

@media (min-width: 610px) {
  .movie-mini-poster {
    width: 8rem;
    height: 10rem;
  }
}
</style>
