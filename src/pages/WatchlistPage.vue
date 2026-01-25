<template>
  <div class="page-watchlist">
    <header class="watchlist-header">
      <h1 class="watchlist-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/></svg>
        <span>볼 영화</span>
      </h1>
    </header>

    <section class="watchlist-list">
      <p v-if="!items.length" class="list-empty">아직 담은 영화가 없어</p>

      <article
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                    <path
                        d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/>
                  </svg>
                  <span>본 영화</span>
                </div>
              </button>
              <button class="btn btn-outline" type="button" @click="onGoReview(x.movieId)">
                <div class="buttons-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                  <span>리뷰</span>
                </div>
              </button>
              <button class="btn btn-outline btn-danger" type="button" @click="onRemove(x.movieId)">
                <div class="buttons-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                    <path
                        d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM232 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296z"/>
                  </svg>
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
import ticketBg from '@/assets/images/ticket.png';

@Component
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

.btn-danger svg path{
  fill: rgba(160,60,60,0.9);;
}
.watchlist-title{
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.watchlist-title svg{
  width: 22px;
  height: 22px;
  align-self: center;
}
.watchlist-title span{
  align-self: center;
}
</style>