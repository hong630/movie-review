<template>
  <div class="page-watchlist">
    <!-- 상단 타이틀 -->
    <header class="watchlist-header">
      <h1 class="watchlist-title">볼 영화</h1>
    </header>

    <!-- 서브 타이틀 + 필터 -->
    <section class="watchlist-top">
      <h2 class="watchlist-subtitle">나의 볼 영화</h2>

      <div class="watchlist-filter">
        <span class="watchlist-filter-label">장르:</span>
        <div class="watchlist-filter-chips">
          <button class="chip is-active" type="button">수거운</button>
          <button class="chip" type="button">찡찡신</button>
          <button class="chip" type="button">개봉일</button>
        </div>
      </div>
    </section>

    <!-- 리스트 -->
    <section class="watchlist-list">
      <article class="watchlist-card">
        <div class="watchlist-thumb" aria-hidden="true"></div>

        <div class="watchlist-body">
          <div class="watchlist-text">
            <h3 class="watchlist-movie-title">영화 제목</h3>
            <p class="watchlist-movie-meta">개봉 연도</p>
          </div>

          <div class="watchlist-actions">
            <button class="btn btn-solid" type="button">볼거예요</button>
            <button class="btn btn-outline" type="button">메모</button>
          </div>
        </div>
      </article>

      <article class="watchlist-card">
        <div class="watchlist-thumb" aria-hidden="true"></div>

        <div class="watchlist-body">
          <div class="watchlist-text">
            <h3 class="watchlist-movie-title">영화 제목</h3>
            <p class="watchlist-movie-meta">개봉 연도</p>
          </div>

          <div class="watchlist-actions">
            <button class="btn btn-solid" type="button">볼거예요</button>
            <button class="btn btn-outline" type="button">메모</button>
          </div>
        </div>
      </article>

      <article class="watchlist-card">
        <div class="watchlist-thumb" aria-hidden="true"></div>

        <div class="watchlist-body">
          <div class="watchlist-text">
            <h3 class="watchlist-movie-title">영화 제목</h3>
            <p class="watchlist-movie-meta">개봉 연도</p>
          </div>

          <div class="watchlist-actions">
            <button class="btn btn-solid" type="button">볼거예요</button>
            <button class="btn btn-outline" type="button">메모</button>
          </div>
        </div>
      </article>

      <article class="watchlist-card">
        <div class="watchlist-thumb" aria-hidden="true"></div>

        <div class="watchlist-body">
          <div class="watchlist-text">
            <h3 class="watchlist-movie-title">영화 제목</h3>
            <p class="watchlist-movie-meta">개봉 연도</p>
          </div>

          <div class="watchlist-actions">
            <button class="btn btn-solid" type="button">볼거예요</button>
            <button class="btn btn-outline" type="button">메모</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';

@Component
class WatchlistPage extends Vue {}

export default toNative(WatchlistPage);
</script>
