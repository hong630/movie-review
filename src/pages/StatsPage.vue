<template>
  <div class="page-stats">
    <!-- 상단 타이틀 -->
    <header class="stats-header">
      <h1 class="stats-title">통계</h1>
    </header>

    <section class="stats-top">
      <h2 class="stats-subtitle">나의 관람 통계</h2>

      <div class="stats-row">
        <span class="stats-label">기간:</span>
        <select class="stats-select">
          <option>최근 30일</option>
          <option>최근 3개월</option>
          <option>최근 6개월</option>
          <option>전체</option>
        </select>
      </div>
    </section>

    <!-- 월별 관람 수 -->
    <section class="stats-section">
      <h3 class="stats-section-title">월별 관람 수</h3>
      <div class="chart-box" id="monthlyChart" ref="monthlyChart"></div>
    </section>

    <!-- 장르 분포 -->
    <section class="stats-section">
      <h3 class="stats-section-title">장르 분포</h3>
      <div class="chart-box chart-box--pie" id="genreChart" ref="genreChart"></div>

      <ul class="genre-legend">
        <li class="genre-item"><span class="dot"></span> 액션</li>
        <li class="genre-item"><span class="dot"></span> 드라마</li>
        <li class="genre-item"><span class="dot"></span> 코미디</li>
        <li class="genre-item"><span class="dot"></span> 기타</li>
      </ul>
    </section>

    <!-- 평균 평점 -->
    <section class="stats-footer">
      <p class="avg-rating">
        평균 평점 <span class="star">★</span> <strong>4.2</strong>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';

@Component
class StatsPage extends Vue {}

export default toNative(StatsPage);
</script>
