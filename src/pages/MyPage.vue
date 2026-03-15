<template>
  <div class="page-my">
    <header class="common-header">
      <h1 class="common-title">
        <UserIcon/>
        <span>내 정보</span>
      </h1>
    </header>

    <section class="my-body">
      <!-- 프로필 카드 영역 -->
      <section class="my-section">
        <div class="shop-hero-card">
          <div class="shop-hero-title">
            "{{ representativeAchievementTitle }}"
          </div>

          <div class="shop-hero-body">
            <div class="shop-hero-mid">
              <div class="shop-hero-image-wrap">
                <img
                    class="shop-hero-image"
                    :src="representativeAchievementImage"
                    :alt="representativeAchievementTitle"
                    loading="lazy"
                />
              </div>
              <div class="shop-hero-detail">
                <div class="shop-hero-row">
                  <span class="shop-hero-label">내 포인트:</span>
                  <strong>{{ points }}P</strong>
                </div>
                <div class="shop-hero-row">
                  <span class="shop-hero-label">대표 업적:</span>
                  <strong>{{ representativeAchievementTitle }}</strong>
                </div>
                <div class="shop-hero-row sub">
                  {{ representativeAchievementSubText }}
                </div>
              </div>
            </div>

            <div class="shop-hero-info">
              <p>내 포인트는 본 영화 등록 1회당 50P씩 쌓여요!</p>
              <button
                  type="button"
                  class="shop-hero-btn"
                  @click="goToShop"
              >
                쇼핑하러 가기 (🖐🏻'-' )
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 바로가기 버튼 영역 -->
      <section class="my-section">
        <div class="section-box">
          바로가기 버튼 들어갈 자리
        </div>
      </section>

      <!-- 내 스킨 영역 -->
      <section class="my-section">
        <div class="section-box">
          내 스킨 정보 들어갈 자리
        </div>
      </section>

      <!-- 업적 요약 영역 -->
      <section class="my-section">
        <div class="section-box">
          업적 요약 들어갈 자리
        </div>
      </section>

      <!-- 기록 요약 영역 -->
      <section class="my-section">
        <div class="section-box">
          기록 요약 들어갈 자리
        </div>
      </section>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import type {AchievementDef} from '@/stores/achievements';
import {ACHIEVEMENTS} from '@/stores/achievements';
import localforage from 'localforage';
import {router} from '@/router';
import {getPoints} from "@/stores/skinStore.ts";
import UserIcon from "@/assets/icons/icon_user.svg"

@Component({
  name: 'MyPage',
  components: {
    UserIcon,
  },
})
class MyPage extends Vue {
  points = 0;
  private claimedIds: Set<string> = new Set();
  private readonly CLAIMED_KEY = 'movie_review_achievement_claimed_v1';
  private readonly EMPTY_ACHIEVEMENT_IMAGE = 'https://placehold.co/180x180/F1E9E9/8B6B6B?text=%EC%97%85%EC%A0%81%EC%9D%B4+%EC%97%86%EC%96%B4%EC%9A%94';

  async mounted() {
    await Promise.all([
      this.loadPoints(),
      this.loadClaimed(),
    ]);
  }

  async loadPoints() {
    this.points = await getPoints();
  }

  async loadClaimed() {
    const raw = await localforage.getItem(this.CLAIMED_KEY);
    const arr = Array.isArray(raw) ? raw : [];
    this.claimedIds = new Set(arr.map(function (v) {
      return String(v);
    }));
  }

  get achievements(): AchievementDef[] {
    return ACHIEVEMENTS;
  }

  get claimedAchievements(): AchievementDef[] {
    return this.achievements.filter((a) => this.isClaimed(a));
  }

  get representativeAchievement(): AchievementDef | null {
    return this.claimedAchievements[0] || null;
  }

  get representativeAchievementTitle(): string {
    return this.representativeAchievement?.title || '대표 업적이 아직 없어요';
  }

  get representativeAchievementImage(): string {
    return this.representativeAchievement?.imgUrl || this.EMPTY_ACHIEVEMENT_IMAGE;
  }

  get representativeAchievementSubText(): string {
    return this.representativeAchievement?.subTitle || '아직 업적이 없어요';
  }

  isClaimed(a: AchievementDef): boolean {
    return !!a?.id && this.claimedIds.has(String(a.id));
  }

  goToShop() {
    router.push('/shop');
  }
}

export default MyPage;
</script>

<style scoped>
.page-my {
  min-height: 100vh;
}

.my-body {
  margin-top: 56px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
}

.my-section {
  width: 100%;
}

.section-box {
  min-height: 120px;
  border-radius: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
  font-weight: 800;
  color: rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
}

.section-box--hero {
  min-height: 180px;
}

.shop-hero-card {
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(153, 104, 120, 0.35);
}


.shop-hero-title {
  margin: 6px 6px 0;
  padding: 10px 12px;
  border: 2px solid rgba(143, 73, 94, 0.3);
  background: rgba(255, 226, 233, 0.25);
  text-align: center;
  font-weight: 1000;
  font-size: 16px;
  color: rgba(62, 27, 37, 0.95);

}

.shop-hero-body {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  margin: 6px;
  padding: 12px;
  border: 2px solid rgba(143, 73, 94, 0.22);
  background: rgba(255, 239, 243, 0.28);
}

.shop-hero-mid {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.shop-hero-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
}

.shop-hero-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: calc(50% - 6px);
}

.shop-hero-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  image-rendering: pixelated;
  border: 2px solid rgba(143, 73, 94, 0.28);
  background: rgba(255, 255, 255, 0.55);
}

.shop-hero-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-width: 0;
}

.shop-hero-info p {
  font-size: 12px;
}

.shop-hero-row {
  font-size: 14px;
  font-weight: 900;
  color: rgba(53, 26, 34, 0.92);
  line-height: 1.45;
  word-break: keep-all;
}

.shop-hero-row.sub {
  font-size: 13px;
  color: rgba(53, 26, 34, 0.72);
}

.shop-hero-label {
  margin-right: 6px;
}

.shop-hero-btn {
  margin-top: 4px;
  appearance: none;
  border: 0;
  background: rgba(255, 255, 255, 0.9);
  color: rgba(45, 24, 30, 0.95);
  font-weight: 1000;
  font-size: 14px;
  padding: 10px 14px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.shop-hero-btn:active {
  transform: scale(0.98);
}

@media (min-width: 610px) {
  .my-body {
    max-width: 720px;
    margin: 56px auto 0;
  }

  .shop-hero-body {
    grid-template-columns: 160px 1fr;
  }
}

@media (max-width: 420px) {
  .shop-hero-body {
    grid-template-columns: 1fr;
  }
}
</style>