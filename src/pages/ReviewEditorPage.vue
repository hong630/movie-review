<template>
  <div class="page-review-editor">
    <!-- 상단 바 -->
    <header class="review-topbar">
      <button class="icon-btn" type="button" aria-label="뒤로" @click="onBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
          <path
              d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"/>
        </svg>
      </button>
      <!--<button class="topbar-save" type="button" @click="onSave">저장</button>-->
    </header>

    <section class="poster-image">
      <img
          v-if="posterUrl(movie?.posterPath)"
          :src="posterUrl(movie?.posterPath || null)"
          :alt="movie?.title || ''"
          class="review-poster-background"
      />
      <div class="review-poster" aria-hidden="true">
        <img
            v-if="posterUrl(movie?.posterPath)"
            :src="posterUrl(movie?.posterPath || null)"
            :alt="movie?.title || ''"
            class="review-poster-img"
        />
      </div>
    </section>

    <!-- 영화 정보 -->
    <section class="review-movie">
      <div class="review-movie-body">
        <h1 class="review-movie-title">{{ movie?.title || '-' }}</h1>
        <p class="review-movie-sub">{{ movie?.releaseDate || '-' }}</p>
      </div>
    </section>

    <!-- 리뷰 입력 -->
    <section class="review-section">
      <div class="star-container">
        <h3 class="review-section-title">별점</h3>
        <div class="review-stars" aria-label="별점">
          <template v-for="n in stars" :key="n">
            <input
                class="star-input"
                type="radio"
                name="rating"
                :id="`star-${n}`"
                :value="n"
                v-model.number="rating"
            />
            <label class="star-label" :for="`star-${n}`" aria-label="별점">★</label>
          </template>
        </div>
      </div>
      <div class="review-textbox">
        <textarea
            class="review-textarea"
            placeholder="리뷰를 작성하세요..."
            rows="5"
            v-model="review"
        ></textarea>
      </div>
      <footer class="review-footer">
        <button class="btn btn-outline footer-btn" type="button" @click="onBack">취소</button>
        <button class="btn btn-outline footer-btn footer-btn--primary" type="button" @click="onSave">저장</button>
      </footer>
    </section>
    <!-- 하단 버튼 -->
  </div>
  <ToastMessageComponent
      v-model="toastOpen"
      :type="toastType"
      :message="toastMessage"
      :duration-ms="1200"
  />
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {getUserMovie, saveReview} from '@/services/userMovieStore';
import {useRoute, useRouter} from "vue-router";
import ToastMessageComponent from "@/components/layout/ToastMessageComponent.vue";
import type { ToastType } from "@/components/layout/ToastMessageComponent.vue";


@Component({
  name: 'ReviewEditorPage',
  components: {ToastMessageComponent}
})
class ReviewEditorPage extends Vue {
  private router = useRouter();
  private route = useRoute();

  stars = [5, 4, 3, 2, 1];

  toastOpen = false;
  toastType: ToastType = 'success';
  toastMessage = '';


  movieId: number = 0;
  movie: any = null;

  rating: number | null = null;
  review: string = '';

  private openToast(type: ToastType, message: string) {
    this.toastOpen = false;
    this.toastType = type;
    this.toastMessage = message;
    this.$nextTick(() => {
      this.toastOpen = true;
    });
  }

  async mounted() {
    const id = Number((this.route.params as any).movieId);
    this.movieId = Number.isFinite(id) ? id : 0;
    await this.load();
  }

  async load() {
    if (!this.movieId) return;
    // 1) 로컬 저장(별점/리뷰 등) 먼저
    const saved = await getUserMovie(this.movieId);
    this.rating = saved?.rating ?? null;
    this.review = saved?.review ?? '';

    // 2) TMDB에서 영화 상세 불러와서 화면용 movie 구성
    const detail = await this.fetchMovieDetailFromTmdb(this.movieId);
    const genreIds =
        Array.isArray(detail?.genres)
            ? detail.genres.map((g: any) => Number(g?.id)).filter((x: any) => Number.isFinite(x))
            : (Array.isArray(saved?.genres) ? saved!.genres : []);
    this.movie = {
      movieId: this.movieId,
      // 화면에서 쓰는 키로 매핑
      title: detail?.title ?? saved?.title ?? '-',
      releaseDate: detail?.release_date ?? saved?.releaseDate ?? '-',
      posterPath: detail?.poster_path ?? saved?.posterPath ?? null,
      // 필요하면 더 얹어도 됨
      overview: detail?.overview ?? '',
      genres: genreIds,
    };
  }

  async fetchMovieDetailFromTmdb(movieId: number) {
    const token = import.meta.env.VITE_TMDB_TOKEN;
    if (!token) return null;

    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  posterUrl(path: string | null) {
    if (!path) return '';
    // 저장된 posterPath가 TMDB file path(/xxx.jpg)라면 그대로
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  async onSave() {
    if (!this.movieId) return;
    try {
      await saveReview({
        movieId: this.movieId,
        rating: this.rating,
        review: this.review,
        title: this.movie?.title ?? '',
        posterPath: this.movie?.posterPath ?? null,
        releaseDate: this.movie?.releaseDate ?? null,
        genres: Array.isArray(this.movie?.genres) ? this.movie.genres : [],
      });
      this.openToast('success', '저장을 완료했어요 🎬');
      setTimeout(()=>{
        this.router.back();
      },1200)
    } catch (e) {
      this.openToast('error', '저장을 실패했어요.');
    }
  }

  onBack() {
    this.router.back();
  }
}

export default ReviewEditorPage;
</script>
<style>
@media (min-width: 610px) {
  .review-textarea{
    font-size: 14px;
  }
}
</style>