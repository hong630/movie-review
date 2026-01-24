<template>
  <div class="page-watched">
    <!-- 상단 타이틀 -->
    <header class="watched-header">
      <h1 class="watched-title">본 영화</h1>
    </header>

    <!-- 서브 타이틀 + 필터 -->
    <section class="watched-top">
      <h2 class="watched-subtitle">나의 본 영화</h2>

      <div class="watched-filter">
        <span class="watched-filter-label">장르:</span>
        <div class="watched-filter-chips">
          <button class="chip is-active" type="button">수거운</button>
          <button class="chip" type="button">찡찡신</button>
          <button class="chip" type="button">개봉일</button>
        </div>
      </div>
    </section>

    <!-- 리스트 -->
    <section class="watched-list">
      <article class="watched-card">
        <div class="watched-thumb" aria-hidden="true"></div>

        <div class="watched-body">
          <h3 class="watched-movie-title">영화 제목</h3>
          <p class="watched-movie-meta">개봉 연도</p>

          <div class="watched-actions">
            <button class="btn btn-solid" type="button">봤어요</button>
            <button class="btn btn-outline" type="button">메모</button>
          </div>
        </div>
      </article>

      <article class="watched-card">
        <div class="watched-thumb" aria-hidden="true"></div>

        <div class="watched-body">
          <h3 class="watched-movie-title">영화 제목</h3>
          <p class="watched-movie-meta">개봉 연도</p>

          <div class="watched-actions">
            <button class="btn btn-solid" type="button">봤어요</button>
            <button class="btn btn-outline" type="button">메모</button>
          </div>
        </div>
      </article>

      <article class="watched-card">
        <div class="watched-thumb" aria-hidden="true"></div>

        <div class="watched-body">
          <h3 class="watched-movie-title">영화 제목</h3>
          <p class="watched-movie-meta">개봉 연도</p>

          <div class="watched-actions">
            <button class="btn btn-solid" type="button">봤어요</button>
            <button class="btn btn-outline" type="button">메모</button>
          </div>
        </div>
      </article>

      <article class="watched-card">
        <div class="watched-thumb" aria-hidden="true"></div>

        <div class="watched-body">
          <h3 class="watched-movie-title">영화 제목</h3>
          <p class="watched-movie-meta">개봉 연도</p>

          <div class="watched-actions">
            <button class="btn btn-solid" type="button">봤어요</button>
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
class WatchedPage extends Vue {}

export default toNative(WatchedPage);
</script>
