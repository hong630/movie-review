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


        <div class="ach-header">
          <h3 class="stats-section-title">🏆 업적</h3>
          <div class="ach-count">내가 본 영화 <strong>{{ watchedCount }}</strong></div>
        </div>

        <!-- 진행중/완료 탭 (게임 느낌) -->
        <div class="ach-subtabs" role="tablist" aria-label="업적 탭">
          <button
              type="button"
              class="ach-subtab"
              :class="{active: achTab==='progress'}"
              @click="setAchTab('progress')"
          >진행중
          </button>
          <button
              type="button"
              class="ach-subtab"
              :class="{active: achTab==='done'}"
              @click="setAchTab('done')"
          >완료
          </button>
        </div>

        <!-- 리스트 -->
        <div class="ach-list">
          <button
              v-for="a in displayAchievements"
              :key="a.id"
              type="button"
              class="ach-item"
              :class="{ locked: isLocked(a), canOpen: canClaim(a), claimed: isClaimed(a) }"
              @click="onClickAchievement(a)"
          >
            <div class="ach-left">
              <div class="ach-badge">
                <img :src="a.imgUrl" alt="" loading="lazy" :class="{ blurred: !isClaimed(a) }"/>
              </div>
            </div>

            <div class="ach-mid">
              <div class="ach-row1">
                <div class="ach-title">{{ a.title }}</div>
                <div class="ach-tag" v-if="canClaim(a)">열 수 있어요!</div>
                <div class="ach-tag claimed" v-else-if="isClaimed(a)">
                  <UnlockIcon/>
                </div>
                <div class="ach-tag locked" v-else>
                  <LockIcon/>
                </div>
              </div>

              <div class="ach-row2">
                <span class="ach-desc" v-if="isLocked(a)">{{ remainingText(a) }}</span>
                <span class="ach-desc" v-else-if="canClaim(a)">클릭해서 직함 해금하기 ✨</span>
                <span class="ach-desc" v-else-if="isClaimed(a)">{{ a.subTitle }}</span>
              </div>

              <div class="ach-progress">
                <div class="ach-bar">
                  <div class="ach-fill" :style="{ width: progressPct(a) + '%' }"></div>
                </div>
                <div class="ach-num">{{ Math.min(watchedCount, a.threshold) }} / {{ a.threshold }}</div>
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
import localforage from "localforage";
import UnlockIcon from "@/assets/icons/icon_unlock.svg"
import LockIcon from "@/assets/icons/icon_lock.svg"

type PeriodKey = '30d' | '3m' | '6m' | 'all';
type MonthMode = 'year' | 'last12';

type StatsMovie = UserMovie & {
  watchedAt?: string | null;
  rating?: number | null;
  genres?: number[];
  posterUrl?: string | null;
};

type StatsTab = 'stats' | 'titles';
type AchTab = 'progress' | 'done';

@Component(
    {
      name: 'StatsPage',
      components: {MonthlyWatchedChart, GenreDistributionChart, StatIcon, UnlockIcon, LockIcon},
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
  achTab: AchTab = 'progress';
  private claimedIds: Set<string> = new Set();
  private readonly CLAIMED_KEY = 'movie_review_achievement_claimed_v1';

  async mounted() {
    await this.loadClaimed();
    await this.loadGenreMap();
    await this.loadWatchedMovies();
    this.renderSig = `${Date.now()}`;
    this.genreRenderSig = `${Date.now()}`;
  }

  async loadClaimed() {
    const raw = await localforage.getItem(this.CLAIMED_KEY);
    const arr = Array.isArray(raw) ? raw : [];
    this.claimedIds = new Set(arr.map(v => String(v)));
  }

  async saveClaimed() {
    await localforage.setItem(this.CLAIMED_KEY, Array.from(this.claimedIds));
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

  setAchTab(tab: AchTab) {
    if (this.achTab === tab) return;
    this.achTab = tab;
  }

  get displayAchievements(): AchievementDef[] {
    const list = this.achievements || [];
    if (this.achTab === 'done') {
      return list.filter(a => this.isClaimed(a));
    }
    return list; // 진행중은 전체 보여주되, 열 수 있음/잠김 상태로 표현
  }

  progressPct(a: AchievementDef): number {
    if (!a || !a.threshold) return 0;
    const v = Math.min(this.watchedCount, a.threshold);
    return Math.max(0, Math.min(100, Math.round((v / a.threshold) * 100)));
  }

  isUnlocked(a: AchievementDef): boolean {
    return this.watchedCount >= a.threshold;
  }

  isClaimed(a: AchievementDef): boolean {
    return !!a?.id && this.claimedIds.has(String(a.id));
  }

  canClaim(a: AchievementDef): boolean {
    // 달성했고, 아직 해금 안 한 상태
    return this.isUnlocked(a) && !this.isClaimed(a);
  }

  isLocked(a: AchievementDef): boolean {
    // 달성 전이거나, 달성했어도 해금 전이면(이미지 블러 유지용)
    return !this.isClaimed(a);
  }

  remainingText(a: AchievementDef): string {
    const remain = Math.max(a.threshold - this.watchedCount, 0);
    return `${remain}편 더 보면 열 수 있어요`;
  }

  onClickAchievement(a: AchievementDef) {
    if (!this.isUnlocked(a)) return; // 달성 전 클릭 막기

    // 달성했는데 아직 해금 전 -> 해금 처리 + 반짝
    if (!this.isClaimed(a)) {
      this.claimedIds.add(String(a.id));
      this.saveClaimed();
      this.playSparkle();
    }

    this.selectedAchievement = a;
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

/* 업적 헤더 */
.ach-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.ach-count {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
}

/* 진행중/완료 탭 */
.ach-subtabs {
  display: flex;
  gap: 8px;
  margin: 8px 0 12px;
}

.ach-subtab {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.65);
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}

.ach-subtab.active {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

/* 업적 리스트(게임 느낌) */
.ach-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ach-item {
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  cursor: pointer;
  position: relative;
}

.ach-item.locked {
  opacity: 0.78;
}

.ach-item.locked .ach-badge img {
  filter: blur(2px) grayscale(0.85);
  opacity: 0.6;
}

.ach-item.canOpen {
  border-color: rgba(246, 133, 55, 0.35);
}

.ach-left {
  display: flex;
  align-items: center;
}

.ach-badge {
  width: 80px;
  height: 80px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.ach-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ach-badge img.blurred{
  filter: blur(2px) grayscale(0.85);
  opacity: 0.6;
  transform: scale(1.03);
}

.ach-mid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  justify-content: space-around;
}

.ach-row1 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ach-row2 {
  display: flex;
  flex-direction: row;
  justify-content: left;
}

.ach-title {
  font-weight: 1000;
  color: rgba(0, 0, 0, 0.86);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ach-tag {
  font-size: 11px;
  font-weight: 1000;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(246, 133, 55, 0.14);
  color: rgba(246, 133, 55, 0.92);
  border: 1px solid rgba(246, 133, 55, 0.24);
}

.ach-tag.claimed,
.ach-tag.locked{
  width: 14px;
  height: 14px;
  background: transparent;
  border: none;
  padding: 0;
}

.ach-desc {
  font-size: 12px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.58);
  line-height: 1.5;
  text-align: left;
}

.ach-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ach-bar {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.10);
}

.ach-fill {
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(154, 210, 140, 0.9), rgba(89, 180, 255, 0.9));
}

.ach-num {
  font-size: 11px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.55);
  white-space: nowrap;
}

.ach-reward {
  font-weight: 1000;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.62);
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.ach-stamp {
  font-weight: 1100;
  font-size: 12px;
  color: rgba(85, 150, 95, 0.95);
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(85, 150, 95, 0.12);
  border: 1px solid rgba(85, 150, 95, 0.25);
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
