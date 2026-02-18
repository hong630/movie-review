<template>
  <div class="page-watchlist">
    <header class="common-header">
      <h1 class="common-title">
        <BookMarkIcon/>
        <span>볼 영화</span>
      </h1>
    </header>

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

  async mounted() {
    await this.reload();
  }

  async reload() {
    this.items = await getUserMoviesByStatus('WATCHLIST');
  }

  async onMoveToWatched(movieId: number) {
    await moveToWatched(movieId);
    await this.reload();
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
}

export default WatchlistPage;
</script>
<style scoped>
.watchlist-list{
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 🎟️ 티켓 카드 배경 */
.watchlist-card{
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
.ticket-content{
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 20% 1fr; /* 왼쪽 바코드 영역 폭 */
  gap: 10px;
  padding: 12px;
  box-sizing: border-box;
}

/* LEFT: 제목만 깔끔하게 */
.ticket-left{
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding-left: 4px;
  transform: translatey(30px);
}

.ticket-left-title{
  margin: 0;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;       /* 2줄까지만 */
  -webkit-box-orient: vertical;
}

.ticket-left-meta{
  font-size: 11px;
  opacity: .75;
  text-align: center;
}

/* RIGHT: 포스터 + 버튼 */
.ticket-right{
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 14px;
  align-items: center;
  margin-left: 14px;
  width: 80%;
  transform: translatey(14px);
}

/* 포스터 */
.ticket-poster{
  width: 70px;
  height: 100px;
  border-radius: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.06);
}

.movie-thumb-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 버튼 3개 */
.ticket-actions{
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
}

.ticket-actions .btn{
  border-radius: 0;
  padding: 8px 10px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.buttons-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 4px;
  width: 60%;
}

.ticket-actions .btn svg{
  width: 16px;
  height: 16px;
  align-self: center;
}
.ticket-actions .btn span{
  align-self: center;
}
/* 삭제 버튼만 살짝 경고 */
.btn-danger{
  border-color: rgba(160,60,60,0.6);
  color: rgba(160,60,60,0.9);
  background: rgba(255,255,255,0.35);
}

.minus-red{
  fill: rgba(160,60,60,0.9);;
}

@media (min-width: 610px) {
  .watchlist-list{
    flex-direction: row;
    flex-wrap: wrap;
  }
  .watchlist-card{
    width: 272px;
    height: 140px;
  }
  .ticket-actions .btn{
    cursor: pointer;
  }
  .ticket-actions .btn span{
    white-space: nowrap;
  }
  .ticket-actions .btn svg{
    width: 22px;
    height: 22px;
  }
}
</style>