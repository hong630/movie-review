<template>
  <div class="page-shop">
    <header class="shop-header">
      <h1 class="shop-title">
        <span class="bag">🛍️</span>
        <span>스킨 상점</span>
      </h1>
    </header>

    <section class="shop-body">
      <!-- 내 포인트 -->
      <div class="shop-card">
        <div class="shop-label">내 포인트</div>
        <div class="shop-value">
          <strong>{{ points }}</strong>
          <span class="pt">P</span>
        </div>

        <div class="shop-actions">
          <button type="button" class="btn" @click="refreshAll">
            새로고침
          </button>

          <button
              type="button"
              class="btn ghost"
              :disabled="!activeSkinId"
              @click="resetSkin"
          >
            기본으로
          </button>
        </div>

        <p class="shop-hint">본 영화 등록 1회당 +1P 🎬</p>
      </div>

      <!-- 스킨 목록 -->
      <section class="skin-section">
        <div class="skin-head">
          <h2 class="skin-title">✨ 스킨</h2>
          <div class="skin-sub">
            적용중: <strong>{{ activeSkinName }}</strong>
          </div>
        </div>

        <div v-if="skins.length === 0" class="skin-empty">
          스킨이 아직 없어요 (카탈로그 확인해봐 🐹)
        </div>

        <div v-else class="skin-grid">
          <article
              v-for="s in skins"
              :key="s.id"
              class="skin-card"
              :class="{
              owned: isOwned(s.id),
              active: isActive(s.id),
              sparkle: isActive(s.id),
            }"
          >
            <div class="skin-top">
              <div class="skin-emoji">{{ s.emoji }}</div>
              <div class="skin-tier" :data-tier="s.tier">{{ s.tier }}</div>
            </div>

            <div class="skin-name">{{ s.name }}</div>
            <div v-if="s.desc" class="skin-desc">{{ s.desc }}</div>

            <div class="skin-meta">
              <div class="skin-price">
                <span class="tag">가격</span>
                <strong>{{ s.price }}</strong><span class="pt">P</span>
              </div>

              <div class="skin-target">
                <span class="tag">대상</span>
                <strong>{{ s.target }}</strong>
              </div>
            </div>

            <div class="skin-btns">
              <!-- 구매 -->
              <button
                  v-if="!isOwned(s.id)"
                  type="button"
                  class="btn buy"
                  :disabled="points < s.price || buyingId === s.id"
                  @click="buySkin(s.id)"
              >
                <span v-if="points < s.price">포인트 부족 😵</span>
                <span v-else-if="buyingId === s.id">구매중…</span>
                <span v-else>구매하기</span>
              </button>

              <!-- 적용 -->
              <button
                  v-else
                  type="button"
                  class="btn apply"
                  :disabled="isActive(s.id) || applyingId === s.id"
                  @click="applySkin(s.id)"
              >
                <span v-if="isActive(s.id)">적용중 ✅</span>
                <span v-else-if="applyingId === s.id">적용중…</span>
                <span v-else>적용하기</span>
              </button>
            </div>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import localforage from 'localforage';

import type { SkinDef } from '@/types/skin';
import {SKIN_DEFS} from "@/stores/skins.ts";

@Component({ name: 'ShopPage' })
class ShopPage extends Vue {
  points = 0;

  skins: SkinDef[] = [];

  ownedIds = new Set<string>();
  activeSkinId: string | null = null;

  buyingId: string | null = null;
  applyingId: string | null = null;

  // localforage keys (기억해둔 규칙)
  private pointsKey = 'movie_review_points_v1';
  private ownedKey = 'movie_review_skins_v1';
  private activeKey = 'movie_review_active_skin_v1';

  mounted() {
    this.skins = SKIN_DEFS.slice();
    this.refreshAll();
  }

  get activeSkinName() {
    if (!this.activeSkinId) return '기본';
    const s = this.skins.find(v => v.id === this.activeSkinId);
    return s ? s.name : '기본';
  }

  isOwned(id: string) {
    return this.ownedIds.has(id);
  }

  isActive(id: string) {
    return this.activeSkinId === id;
  }

  async refreshAll() {
    await Promise.all([this.refreshPoints(), this.refreshSkins()]);
  }

  async refreshPoints() {
    const raw = await localforage.getItem<any>(this.pointsKey);
    const n = Number(raw);
    this.points = Number.isFinite(n) ? n : 0;
  }

  async refreshSkins() {
    const owned = await localforage.getItem<any>(this.ownedKey);
    const arr: string[] = Array.isArray(owned) ? owned : [];
    this.ownedIds = new Set(arr);

    const active = await localforage.getItem<any>(this.activeKey);
    const id = typeof active === 'string' ? active : null;
    this.activeSkinId = id;

    this.applySkinClassToRoot();
  }

  async buySkin(id: string) {
    const skin = this.skins.find(s => s.id === id);
    if (!skin) return;

    if (this.ownedIds.has(id)) return;
    if (this.points < skin.price) return;

    this.buyingId = id;

    // 포인트 차감
    const nextPoints = Math.max(0, this.points - skin.price);
    this.points = nextPoints;
    await localforage.setItem(this.pointsKey, nextPoints);

    // 보유 스킨 저장
    this.ownedIds.add(id);
    await localforage.setItem(this.ownedKey, Array.from(this.ownedIds));

    this.buyingId = null;
  }

  async applySkin(id: string) {
    const skin = this.skins.find(s => s.id === id);
    if (!skin) return;

    if (!this.ownedIds.has(id)) return;
    if (this.activeSkinId === id) return;

    this.applyingId = id;

    this.activeSkinId = id;
    await localforage.setItem(this.activeKey, id);

    this.applySkinClassToRoot();

    this.applyingId = null;
  }

  async resetSkin() {
    this.activeSkinId = null;
    await localforage.setItem(this.activeKey, null);
    this.applySkinClassToRoot();
  }

  applySkinClassToRoot() {
    const root = document.documentElement; // or document.body
    const prefix = 'skin-';

    // 기존 skin-* class 제거
    const toRemove: string[] = [];
    root.classList.forEach(c => {
      if (c.startsWith(prefix)) toRemove.push(c);
    });
    toRemove.forEach(c => root.classList.remove(c));

    // 새 class 적용
    if (!this.activeSkinId) return;
    const skin = this.skins.find(s => s.id === this.activeSkinId);
    if (!skin) return;

    root.classList.add(skin.className);
  }
}

export default ShopPage;
</script>

<style scoped>
.shop-header {
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

.shop-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.82);
}

.bag {
  font-size: 18px;
  transform: translateY(-1px);
}

.shop-body {
  padding: 56px 12px 16px;
}

.shop-card {
  border-radius: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.10);
}

.shop-label {
  font-weight: 800;
  opacity: 0.75;
}

.shop-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 10px;
}

.shop-value strong {
  font-size: 34px;
  letter-spacing: -0.5px;
}

.pt {
  font-weight: 900;
  opacity: 0.7;
}

.shop-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.shop-hint {
  margin-top: 10px;
  font-weight: 800;
  opacity: 0.7;
}

/* skins */
.skin-section {
  margin-top: 18px;
}

.skin-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;
}

.skin-title {
  font-weight: 900;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.82);
}

.skin-sub {
  font-weight: 900;
  font-size: 12px;
  opacity: 0.65;
  text-align: right;
}

.skin-empty {
  padding: 14px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px dashed rgba(0, 0, 0, 0.10);
  font-weight: 800;
  opacity: 0.75;
}

.skin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.skin-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.10);
}

.skin-card.owned {
  border-color: rgba(0, 0, 0, 0.12);
}

.skin-card.active {
  outline: 2px solid rgba(0, 0, 0, 0.25);
  outline-offset: 2px;
}

.skin-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.skin-emoji {
  font-size: 22px;
  line-height: 1;
}

.skin-tier {
  font-weight: 900;
  font-size: 11px;
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  opacity: 0.85;
}

.skin-name {
  margin-top: 8px;
  font-weight: 900;
  letter-spacing: -0.2px;
}

.skin-desc {
  margin-top: 4px;
  font-weight: 800;
  font-size: 12px;
  opacity: 0.7;
}

.skin-meta {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}

.tag {
  display: inline-block;
  font-weight: 900;
  font-size: 11px;
  opacity: 0.6;
  margin-right: 6px;
}

.skin-price,
.skin-target {
  font-weight: 900;
  font-size: 12px;
  opacity: 0.85;
}

.skin-btns {
  margin-top: 10px;
}

.btn {
  width: 100%;
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.55);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.btn:active {
  transform: scale(0.98);
}

/* 반짝반짝 ✨ (active만) */
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
  .skin-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
