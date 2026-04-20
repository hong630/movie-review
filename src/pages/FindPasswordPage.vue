<template>
  <div class="simple-page">
    <div class="simple-card">
      <div class="simple-title">비밀번호 찾기</div>
      <p class="simple-desc">
        이 페이지는 업데이트 예정입니다.
      </p>

      <button type="button" class="simple-button" @click="goToLogin">
        로그인으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {router} from '@/router';

@Component({
  name: 'FindPasswordPage',
})
class FindPasswordPage extends Vue {
  goToLogin() {
    router.push('/login');
  }
}

export default FindPasswordPage;
</script>

<style scoped>
.simple-page {
  min-height: 100vh;
  background: #d7d0c6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  box-sizing: border-box;
}

.simple-card {
  width: 100%;
  max-width: 420px;
  background: #e8e2d8;
  border: 2px solid rgba(75, 44, 44, 0.28);
  box-shadow: 0 12px 24px rgba(55, 33, 24, 0.1);
  padding: 28px 18px 20px;
  box-sizing: border-box;
  text-align: center;
}

.simple-title {
  font-size: 24px;
  font-weight: 1000;
  color: #2f1d1e;
}

.simple-desc {
  margin: 12px 0 20px;
  color: rgba(47, 29, 30, 0.72);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.6;
}

.simple-button {
  width: 100%;
  height: 48px;
  border: none;
  background: #4b2c2c;
  color: #f8f2e8;
  font-size: 15px;
  font-weight: 1000;
  cursor: pointer;
}
</style>