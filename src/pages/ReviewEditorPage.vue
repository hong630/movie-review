<template>
  <div class="page-review-editor">
    <!-- 상단 바 -->
    <header class="review-topbar">
      <button class="icon-btn" type="button" aria-label="뒤로">
        ←
      </button>

      <h1 class="review-topbar-title">영화 타이틀</h1>

      <button class="topbar-save" type="button">저장</button>
    </header>

    <!-- 영화 정보 -->
    <section class="review-movie">
      <div class="review-poster" aria-hidden="true"></div>

      <div class="review-movie-body">
        <h2 class="review-movie-title">영화 타이틀</h2>
        <p class="review-movie-sub">메모...</p>

        <div class="review-stars" aria-label="별점">
          <button class="star is-on" type="button">★</button>
          <button class="star is-on" type="button">★</button>
          <button class="star is-on" type="button">★</button>
          <button class="star" type="button">★</button>
          <button class="star" type="button">★</button>
        </div>
      </div>
    </section>

    <!-- 리뷰 입력 -->
    <section class="review-section">
      <h3 class="review-section-title">별점</h3>
      <div class="review-textbox">
        <textarea class="review-textarea" placeholder="리뷰를 작성하세요..." rows="5"></textarea>
      </div>
    </section>

    <!-- 태그 추가 -->
    <section class="review-section">
      <h3 class="review-section-title">태그 추가</h3>

      <div class="tag-add-row">
        <button class="btn btn-outline" type="button">+ 태그 추가</button>
        <button class="btn btn-outline" type="button">+ 태그 추가</button>
        <button class="btn btn-outline" type="button">+ 태그 추가</button>
      </div>

      <div class="tag-chips">
        <span class="chip">장르</span>
        <span class="chip">재관람</span>
        <span class="chip">상영일 <span class="chip-sub">📅 2024-04-24</span></span>
      </div>
    </section>

    <!-- 하단 버튼 -->
    <footer class="review-footer">
      <button class="btn btn-outline footer-btn" type="button">취소</button>
      <button class="btn btn-solid footer-btn footer-btn--primary" type="button">저장</button>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';

@Component
class ReviewEditorPage extends Vue {}

export default toNative(ReviewEditorPage);
</script>
