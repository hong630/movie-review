<template>
  <div class="page-watchlist">
    <header class="common-header">
      <button type="button" class="btn-brush" @click="openSkinPicker">
        <BrushIcon/>
        <span>SKIN</span>
      </button>
      <h1 class="common-title">
        <BookMarkIcon/>
        <span>볼 영화</span>
      </h1>
    </header>

    <section class="watchlist-list">
      <div v-if="!items.length" class="list-empty">
        <BlankIcon/>
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
    <div v-if="showSkinPicker" class="ach-modal-backdrop" @click.self="closeSkinPicker">
      <div class="ach-modal" role="dialog" aria-modal="true" @click.stop>
        <button type="button" class="ach-close" @click="closeSkinPicker">✕</button>
        <div class="ach-content-container">
          <div class="modal-title">보유한 티켓 고르기</div>
          <div class="modal-desc">
            배경으로 쓸 티켓을 선택해보세요
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
                  <template v-if="skin.id === appliedTicketSkinId">
                    <CheckedIcon/>
                    <span>적용중</span>
                  </template>
                  <template v-else>
                    <UnCheckedIcon/>
                    <span>선택하기</span>
                  </template>
                </div>
              </div>
            </button>
          </div>
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
  resetAppliedSkin
} from "@/stores/skinStore.ts";
import BrushIcon from "@/assets/icons/icon_brush.svg"
import CheckedIcon from "@/assets/icons/icon_check_active.svg"
import UnCheckedIcon from "@/assets/icons/icon_check_inactive.svg"
import BlankIcon from "@/assets/icons/icon_blank.svg"
const DEFAULT_TICKET_SKIN_ID = 'default-ticket-skin';

@Component({
  name: 'WatchlistPage',
  components: {
    BookMarkIcon,
    PlusIcon,
    ReviewIcon,
    MinusIcon,
    BrushIcon,
    CheckedIcon,
    UnCheckedIcon,
    BlankIcon,
  }
})
class WatchlistPage extends Vue {
  ticketBg = ticketBg;

  items: UserMovie[] = [];

  ownedTicketSkins: SkinDef[] = [];
  appliedTicketSkinId: string | null = null;
  showSkinPicker = false;

  async mounted() {
    await this.reloadAll();
  }

  buildDefaultTicketSkin(): SkinDef {
    return {
      id: DEFAULT_TICKET_SKIN_ID,
      target: 'ticket',
      name: '기본 티켓',
      desc: '기본 티켓',
      emoji: '🎟️',
      tier: 'COMMON',
      price: 0,
      imageUrl: ticketBg,
    };
  }

  async reloadAll() {
    await Promise.all([
      this.reload(),
      this.reloadTicketSkins(),
    ]);
  }

  async reload() {
    this.items = await getUserMoviesByStatus('WATCHLIST');
  }

  async reloadTicketSkins() {
    const ownedSkins = await getOwnedSkinsByTarget('ticket');

    const applied = await getAppliedSkinByTarget('ticket');
    this.appliedTicketSkinId = applied ? applied.id : DEFAULT_TICKET_SKIN_ID;
    this.ticketBg = applied?.imageUrl || ticketBg;

    const allSkins = [this.buildDefaultTicketSkin(), ...ownedSkins];
    this.ownedTicketSkins = allSkins.sort((a, b) => {
      if (a.id === this.appliedTicketSkinId) return -1;
      if (b.id === this.appliedTicketSkinId) return 1;
      return 0;
    });
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
    if (skinId === DEFAULT_TICKET_SKIN_ID) {
      await resetAppliedSkin('ticket');
      await this.reloadTicketSkins();
      this.closeSkinPicker();
      return;
    }

    await applySkin('ticket', skinId);
    await this.reloadTicketSkins();
    this.closeSkinPicker();
  }
}

export default WatchlistPage;
</script>
<style scoped>
.watchlist-toolbar {
  display: flex;
  gap: 10px;
  position: sticky;
  top: 50px;
  width: calc(100% - 8px);
  margin: auto;
  justify-content: flex-end;
  padding: 8px;
  box-sizing: border-box;
  z-index: 1;
  border: 2px solid rgba(143, 73, 94, 0.3);
  background-color: rgba(255, 226, 233, 0.25);
  margin-bottom: 22px;
}

.btn-brush {
  all: unset;
  align-self: center;
  position: absolute;
  left: 10px;
  display: flex;
  flex-direction: row;
  gap: 4px;
  width: auto;
  height: 20px;
  flex-shrink: 0;
  padding-top: 10px;
}

.btn-brush svg {
  width: 20px;
  height: 20px;
}

.btn-brush span{
  align-self: center;
  font-size: 12px;
  font-weight: 600;
}

.watchlist-point-value strong {
  font-size: 28px;
  line-height: 1;
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
  padding: 10px;
  text-align: left;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(143, 73, 94, 0.3);
  background: rgba(255, 226, 233, 0.25);
}

.skin-picker-item.active {
  border: 2px solid rgba(143, 73, 94, 0.3);
  background-color: rgba(143, 73, 94, 0.1);
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
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
}

.skin-picker-state svg {
  width: 16px;
  height: 16px;
  fill: #452829;
}

.skin-picker-state span {
  white-space: nowrap;
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