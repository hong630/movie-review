<template>
  <div class="page-search">
    <!-- 상단 타이틀 -->
    <header class="search-header">
      <h1 class="search-title">탐색</h1>
    </header>

    <!-- 검색바 -->
    <section class="search-bar">
      <div class="search-input-wrap">
        <span class="search-icon">🔎</span>
        <input class="search-input" type="text" placeholder="영화 검색..." />
      </div>
    </section>

    <!-- 필터 탭 -->
    <section class="search-filter">
      <div class="segmented">
        <button class="seg-item is-active" type="button">연기</button>
        <button class="seg-item" type="button">장르</button>
      </div>
    </section>

    <!-- 검색 결과 리스트 -->
    <section class="search-results">
      <!-- 카드 1 -->
      <article class="movie-card">
        <div class="movie-thumb" aria-hidden="true"></div>

        <div class="movie-body">
          <h2 class="movie-title">영화 제목</h2>
          <p class="movie-meta">연도 | ★★★★☆</p>
          <p class="movie-desc">간단한 줄거리...</p>

          <div class="movie-actions">
            <button class="btn btn-outline" type="button">+ 볼 영화</button>
            <button class="btn btn-outline" type="button">+ 본 영화</button>
            <button class="btn btn-solid" type="button">리뷰</button>
          </div>
        </div>
      </article>

      <!-- 카드 2 -->
      <article class="movie-card">
        <div class="movie-thumb" aria-hidden="true"></div>

        <div class="movie-body">
          <h2 class="movie-title">영화 제목</h2>
          <p class="movie-meta">연도 | ★★★★☆</p>
          <p class="movie-desc">간단한 줄거리...</p>

          <div class="movie-actions">
            <button class="btn btn-outline" type="button">+ 볼 영화</button>
            <button class="btn btn-outline" type="button">+ 본 영화</button>
            <button class="btn btn-solid" type="button">리뷰</button>
          </div>
        </div>
      </article>

      <!-- 카드 3 -->
      <article class="movie-card">
        <div class="movie-thumb" aria-hidden="true"></div>

        <div class="movie-body">
          <h2 class="movie-title">영화 제목</h2>
          <p class="movie-meta">연도 | ★★★★☆</p>
          <p class="movie-desc">간단한 줄거리...</p>

          <div class="movie-actions">
            <button class="btn btn-outline" type="button">+ 볼 영화</button>
            <button class="btn btn-outline" type="button">+ 본 영화</button>
            <button class="btn btn-solid" type="button">리뷰</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';

@Component
class SearchPage extends Vue {}

export default toNative(SearchPage);
</script>
