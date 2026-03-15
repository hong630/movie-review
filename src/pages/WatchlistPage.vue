<template>
  <div class="page-watchlist">
    <header class="common-header">
      <h1 class="common-title">
        <BookMarkIcon/>
        <span>볼 영화</span>
      </h1>
    </header>

    <section class="watchlist-toolbar">
      <div class="watchlist-point-card">
        <div class="watchlist-point-label">내 포인트</div>
        <div class="watchlist-point-value">
          <strong>{{ points }}</strong>
          <span>P</span>
        </div>
      </div>

      <div class="watchlist-skin-card">
        <div class="watchlist-skin-head">
          <div class="watchlist-skin-title">적용중인 티켓</div>
          <div class="watchlist-skin-name">{{ activeSkinName }}</div>
        </div>

        <div class="watchlist-skin-actions">
          <button type="button" class="btn btn-outline" @click="openSkinPicker">
            티켓 선택
          </button>
          <button
              type="button"
              class="btn btn-outline"
              :disabled="!appliedTicketSkinId"
              @click="resetTicketSkin"
          >
            기본으로
          </button>
        </div>
      </div>
    </section>

    <section class="watchlist-list">
      <div v-if="!items.length" class="list-empty">
        <img src="@/assets/images/nothing.gif" alt="본 영화 없음">
        <p>아직 담은 영화가 없어요</p>
      </div>

      <article
          v-else
          v-for="x in items"
          :key="x.movieId"
          class="watchlist-card"
          :style="{ backgroundImage: `url(${ticketBg})` }"
      >
        <div class="ticket-content">
          <aside class="ticket-left">
            <h3 class="ticket-left-title" :title="x.title">{{ x.title }}</h3>
            <div class="ticket-left-meta">{{ yearOf(x.releaseDate) }}</div>
          </aside>

          <section class="ticket-right">
            <div class="ticket-poster" aria-hidden="true">
              <img
                  v-if="posterUrl(x.posterPath)"
                  class="movie-thumb-img"
                  :src="posterUrl(x.posterPath)"
                  :alt="x.title"
              />
            </div>

            <div class="ticket-actions">
              <button class="btn btn-solid" type="button" @click="onMoveToWatched(x.movieId)">
                <div class="buttons-container">
                  <PlusIcon/>
                  <span>본 영화</span>
                </div>
              </button>
              <button class="btn btn-outline" type="button" @click="onGoReview(x.movieId)">
                <div class="buttons-container">
                  <ReviewIcon/>
                  <span>리뷰</span>
                </div>
              </button>
              <button class="btn btn-outline btn-danger" type="button" @click="onRemove(x.movieId)">
                <div class="buttons-container">
                  <MinusIcon class="minus-red"/>
                  <span>삭제</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </article>
    </section>
    <div v-if="showSkinPicker" class="modal-backdrop" @click.self="closeSkinPicker">
      <div class="modal-card skin-picker-modal">
        <div class="modal-title">보유한 티켓 고르기</div>
        <div class="modal-desc">
          배경으로 쓸 티켓을 선택해보세요 🎟️
        </div>

        <div v-if="ownedTicketSkins.length === 0" class="skin-picker-empty">
          아직 구매한 티켓이 없어요
        </div>

        <div v-else class="skin-picker-grid">
          <button
              v-for="skin in ownedTicketSkins"
              :key="skin.id"
              type="button"
              class="skin-picker-item"
              :class="{ active: skin.id === appliedTicketSkinId }"
              @click="pickSkin(skin.id)"
          >
            <div
                class="skin-picker-preview"
                :style="{ backgroundImage: `url(${skin.imageUrl})` }"
            ></div>
            <div class="skin-picker-meta">
              <div class="skin-picker-name">{{ skin.emoji }} {{ skin.name }}</div>
              <div class="skin-picker-state">
                {{ skin.id === appliedTicketSkinId ? '적용중 ✅' : '선택하기' }}
              </div>
            </div>
          </button>
        </div>

        <div class="modal-actions single">
          <button type="button" class="btn btn-outline" @click="closeSkinPicker">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import type {UserMovie} from '@/types/user-movie';
import {getUserMoviesByStatus, moveToWatched, removeUserMovie} from '@/services/userMovieStore';
import {router} from "@/router";
import ticketBg from '@/assets/images/ticket.webp';
import BookMarkIcon from "@/assets/icons/icon_bookmark.svg"
import PlusIcon from "@/assets/icons/icon_plus.svg"
import ReviewIcon from "@/assets/icons/icon_review.svg"
import MinusIcon from "@/assets/icons/icon_minus.svg"
import type {SkinDef} from "@/types/skin.ts";
import {
  applySkin,
  getAppliedSkinByTarget,
  getOwnedSkinsByTarget,
  getPoints,
  resetAppliedSkin
} from "@/stores/skinStore.ts";


@Component({
  name: 'WatchlistPage',
  components: {
    BookMarkIcon,
    PlusIcon,
    ReviewIcon,
    MinusIcon,
  }
})
class WatchlistPage extends Vue {
  ticketBg = ticketBg;

  items: UserMovie[] = [];

  points = 0;
  ownedTicketSkins: SkinDef[] = [];
  appliedTicketSkinId: string | null = null;
  showSkinPicker = false;

  async mounted() {
    await this.reloadAll();
  }

  get activeSkinName() {
    if (!this.appliedTicketSkinId) return '기본 티켓';
    const found = this.ownedTicketSkins.find((x) => x.id === this.appliedTicketSkinId);
    return found ? found.name : '기본 티켓';
  }

  async reloadAll() {
    await Promise.all([
      this.reload(),
      this.reloadPoint(),
      this.reloadTicketSkins(),
    ]);
  }

  async reload() {
    this.items = await getUserMoviesByStatus('WATCHLIST');
  }

  async reloadPoint() {
    this.points = await getPoints();
  }

  async reloadTicketSkins() {
    this.ownedTicketSkins = await getOwnedSkinsByTarget('ticket');

    const applied = await getAppliedSkinByTarget('ticket');
    this.appliedTicketSkinId = applied ? applied.id : null;
    this.ticketBg = applied?.imageUrl || ticketBg;
  }

  async onMoveToWatched(movieId: number) {
    await moveToWatched(movieId);
    await this.reloadAll();
  }

  async onRemove(movieId: number) {
    await removeUserMovie(movieId);
    await this.reload();
  }

  onGoReview(movieId: number) {
    router.push(`/movie/${movieId}/review`);
  }

  posterUrl(path: string | null) {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  yearOf(dateStr: string | null) {
    if (!dateStr) return '-';
    return dateStr.slice(0, 4);
  }

  openSkinPicker() {
    this.showSkinPicker = true;
  }

  closeSkinPicker() {
    this.showSkinPicker = false;
  }

  async pickSkin(skinId: string) {
    await applySkin('ticket', skinId);
    await this.reloadTicketSkins();
    this.closeSkinPicker();
  }

  async resetTicketSkin() {
    await resetAppliedSkin('ticket');
    await this.reloadTicketSkins();
  }
}

export default WatchlistPage;
</script>
<style scoped>
.watchlist-toolbar {
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}

.watchlist-point-card,
.watchlist-skin-card {
  border-radius: 14px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.watchlist-point-label,
.watchlist-skin-title {
  font-size: 12px;
  font-weight: 800;
  opacity: .7;
}

.watchlist-point-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 8px;
}

.watchlist-point-value strong {
  font-size: 28px;
  line-height: 1;
}

.watchlist-skin-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.watchlist-skin-name {
  font-size: 13px;
  font-weight: 900;
}

.watchlist-skin-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.watchlist-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 티켓 카드 배경 */
.watchlist-card {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 14px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 0;
  background-color: transparent;
  border: none;
}

/* 티켓 위 컨텐츠 레이어 */
.ticket-content {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 20% 1fr; /* 왼쪽 바코드 영역 폭 */
  gap: 10px;
  padding: 12px;
  box-sizing: border-box;
}

/* LEFT: 제목만 깔끔하게 */
.ticket-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding-left: 4px;
  transform: translatey(30px);
}

.ticket-left-title {
  margin: 0;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 2줄까지만 */
  -webkit-box-orient: vertical;
}

.ticket-left-meta {
  font-size: 11px;
  opacity: .75;
  text-align: center;
}

/* RIGHT: 포스터 + 버튼 */
.ticket-right {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 14px;
  align-items: center;
  margin-left: 14px;
  width: 80%;
  transform: translatey(14px);
}

/* 포스터 */
.ticket-poster {
  width: 70px;
  height: 100px;
  border-radius: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.06);
}

.movie-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 버튼 3개 */
.ticket-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
}

.ticket-actions .btn {
  border-radius: 0;
  padding: 8px 10px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 4px;
  width: 60%;
}

.ticket-actions .btn svg {
  width: 16px;
  height: 16px;
  align-self: center;
}

.ticket-actions .btn span {
  align-self: center;
}

.btn-danger {
  border-color: rgba(160, 60, 60, 0.6);
  color: rgba(160, 60, 60, 0.9);
  background: rgba(255, 255, 255, 0.35);
}

.minus-red {
  fill: rgba(160, 60, 60, 0.9);;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.modal-card {
  width: 100%;
  max-width: 520px;
  border-radius: 18px;
  padding: 18px;
  background: #fffdf9;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.18);
}

.modal-title {
  font-size: 18px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.86);
}

.modal-desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.45;
  opacity: .72;
}

.skin-picker-empty {
  margin-top: 14px;
  padding: 14px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  font-weight: 800;
  opacity: .7;
}

.skin-picker-grid {
  display: grid;
  gap: 10px;
  margin-top: 14px;
  max-height: 52vh;
  overflow-y: auto;
}

.skin-picker-item {
  appearance: none;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  text-align: left;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.skin-picker-item.active {
  outline: 2px solid rgba(0, 0, 0, 0.2);
  outline-offset: 2px;
}

.skin-picker-preview {
  width: 100%;
  height: 96px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.skin-picker-meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.skin-picker-name {
  font-size: 13px;
  font-weight: 900;
}

.skin-picker-state {
  font-size: 12px;
  font-weight: 800;
  opacity: .7;
}

.modal-actions {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.modal-actions.single {
  grid-template-columns: 1fr;
}

@media (min-width: 610px) {
  .watchlist-toolbar {
    grid-template-columns: 180px 1fr;
    align-items: stretch;
  }

  .watchlist-list {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .watchlist-card {
    width: 272px;
    height: 140px;
  }

  .ticket-actions .btn {
    cursor: pointer;
  }

  .skin-picker-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ticket-actions .btn span {
    white-space: nowrap;
  }

  .ticket-actions .btn svg {
    width: 22px;
    height: 22px;
  }
}
</style>