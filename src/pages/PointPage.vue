<template>
  <div class="page-point">
    <header class="common-header">
      <h1 class="common-title">
        <PointIcon/>
        <span>포인트</span>
      </h1>
    </header>

    <section class="point-body">
      <div class="point-card">
        <div class="point-label">내 포인트</div>
        <div class="point-value">
          <strong>{{ points }}</strong>
          <span class="pt">P</span>
        </div>
        <button type="button" class="point-refresh" @click="refresh">
          새로고침
        </button>
      </div>

      <p class="point-hint">본 영화 등록 1회당 +1P 🎬</p>
    </section>

    <!-- 뱃지 -->
    <section class="badge-section">
      <div class="badge-head">
        <h2 class="badge-title">🏅 내 뱃지</h2>
      </div>

      <div v-if="badges.length === 0" class="badge-empty">
        아직 획득한 뱃지가 없어요
      </div>

      <div v-else class="badge-grid">
        <article
            v-for="b in badges"
            :key="b.id"
            class="badge-card sparkle"
        >
          <div class="badge-icon">{{ b.emoji }}</div>
          <div class="badge-meta">
            <div class="badge-name">{{ b.name }}</div>
            <div class="badge-desc">{{ b.desc }}</div>
            <div class="badge-date">획득: {{ b.unlockedAt }}</div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {loadUnlockedBadges} from '@/services/badgeStore';
import type {UnlockedBadge} from '@/types/badge';
import localforage from 'localforage';
import PointIcon from "@/assets/icons/icon_point.svg"


@Component(
    {name: 'PointPage',
      components: {PointIcon},
    }
)
class PointPage extends Vue {
  points = 0;
  private storageKey = 'movie_review_points_v1';
  badges: UnlockedBadge[] = [];

  mounted() {
    this.refresh();
    this.loadBadges();
  }

  async refresh() {
    const raw = await localforage.getItem<any>(this.storageKey);
    const n = Number(raw);
    this.points = Number.isFinite(n) ? n : 0;
  }

  async loadBadges() {
    this.badges = await loadUnlockedBadges();
  }
}

export default PointPage;
</script>

<style scoped>
.point-header {
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

.point-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.82);
}

.coin {
  font-size: 18px;
  transform: translateY(-1px);
}

.point-body {
  padding: 56px 12px 16px;
}

.point-card {
  border-radius: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.10);
}

.point-label {
  font-weight: 800;
  opacity: 0.75;
}

.point-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 10px;
}

.point-value strong {
  font-size: 34px;
  letter-spacing: -0.5px;
}

.pt {
  font-weight: 900;
  opacity: 0.7;
}

.point-refresh {
  margin-top: 12px;
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 800;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.point-refresh:active {
  transform: scale(0.98);
}

.point-hint {
  margin-top: 10px;
  font-weight: 800;
  opacity: 0.7;
}

.badge-section {
  margin-top: 18px;
}

.badge-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.badge-title {
  font-weight: 900;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.82);
}

.badge-empty {
  padding: 14px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px dashed rgba(0, 0, 0, 0.10);
  font-weight: 800;
  opacity: 0.75;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.badge-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.10);
}

.badge-icon {
  font-size: 22px;
  line-height: 1;
  margin-bottom: 8px;
}

.badge-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge-name {
  font-weight: 900;
  letter-spacing: -0.2px;
}

.badge-desc {
  font-weight: 800;
  font-size: 12px;
  opacity: 0.75;
}

.badge-date {
  margin-top: 2px;
  font-weight: 900;
  font-size: 12px;
  opacity: 0.6;
}

/* 반짝반짝 ✨ */
.sparkle::after {
  content: '';
  position: absolute;
  top: -40%;
  left: -60%;
  width: 60%;
  height: 180%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 100%);
  transform: rotate(18deg);
  animation: badgeSparkle 2.6s ease-in-out infinite;
  opacity: 0.55;
}

@keyframes badgeSparkle {
  0% {
    transform: translateX(-30%) rotate(18deg);
    opacity: 0;
  }
  20% {
    opacity: 0.55;
  }
  50% {
    transform: translateX(220%) rotate(18deg);
    opacity: 0.55;
  }
  70% {
    opacity: 0.0;
  }
  100% {
    transform: translateX(220%) rotate(18deg);
    opacity: 0.0;
  }
}

@media (min-width: 610px) {
  .badge-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>