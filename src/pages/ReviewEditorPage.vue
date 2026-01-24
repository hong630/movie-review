<template>
  <div class="page-review-editor">
    <!-- 상단 바 -->
    <header class="review-topbar">
      <button class="icon-btn" type="button" aria-label="뒤로" @click="onBack">
        ←
      </button>

      <h1 class="review-topbar-title">{{ movie?.title || '리뷰' }}</h1>

      <button class="topbar-save" type="button" @click="onSave">저장</button>
    </header>

    <!-- 영화 정보 -->
    <section class="review-movie">
      <div class="review-poster" aria-hidden="true">
        <img
            v-if="posterUrl(movie?.posterPath)"
            :src="posterUrl(movie?.posterPath || null)"
            :alt="movie?.title || ''"
            class="review-poster-img"
        />
      </div>

      <div class="review-movie-body">
        <h2 class="review-movie-title">{{ movie?.title || '-' }}</h2>
        <p class="review-movie-sub">{{ movie?.releaseDate || '-' }}</p>

        <div class="review-stars" aria-label="별점">
          <button
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ 'is-on': (rating || 0) >= n }"
              type="button"
              @click="setRating(n)"
          >★
          </button>
        </div>
      </div>
    </section>

    <!-- 리뷰 입력 -->
    <section class="review-section">
      <h3 class="review-section-title">별점</h3>
      <div class="review-textbox">
        <textarea
            class="review-textarea"
            placeholder="리뷰를 작성하세요..."
            rows="5"
            v-model="review"
        ></textarea>
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
      <button class="btn btn-outline footer-btn" type="button" @click="onBack">취소</button>
      <button class="btn btn-solid footer-btn footer-btn--primary" type="button" @click="onSave">저장</button>
    </footer>
  </div>
</template>

<script lang="ts">
import {Component, toNative, Vue} from 'vue-facing-decorator';
import {getUserMovie, saveReview} from '@/services/userMovieStore';
import {useRoute, useRouter} from "vue-router";

@Component
export default class ReviewEditorPage extends Vue {
  private router = useRouter();
  private route = useRoute();


  movieId: number = 0;
  movie: any = null;

  rating: number | null = null;
  review: string = '';

  async mounted() {
    const id = Number((this.route.params as any).movieId);
    this.movieId = Number.isFinite(id) ? id : 0;
    await this.load();
  }

  async load() {
    if (!this.movieId) return;
    const m = await getUserMovie(this.movieId);
    this.movie = m;
    this.rating = m?.rating ?? null;
    this.review = m?.review ?? '';
  }

  setRating(n: number) {
    this.rating = n;
  }

  posterUrl(path: string | null) {
    if (!path) return '';
    // 저장된 posterPath가 TMDB file path(/xxx.jpg)라면 그대로
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  async onSave() {
    if (!this.movieId) return;
    await saveReview({
      movieId: this.movieId,
      rating: this.rating,
      review: this.review,
    });
    alert('저장 완료! 🐹');
    this.router.back();
  }

  onBack() {
    this.router.back();
  }
}

</script>
