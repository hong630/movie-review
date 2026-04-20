<template>
  <div class="page-login">
    <div class="login-header">
      <BackButton @click="goToSearch"/>
    </div>
    <section class="login-wrap">
      <div class="login-card">
        <div class="login-title">로그인</div>
        <p class="login-subtitle">
          아이디와 비밀번호를 입력하고<br/>
          영화 기록을 이어가보아요
        </p>

        <div class="login-form">
          <label class="login-label" for="loginId">이메일 아이디</label>
          <input
              id="loginId"
              class="login-input"
              type="text"
              :value="loginId"
              autocomplete="username"
              placeholder="아이디를 입력해주세요."
              @input="onInputId"
              @keydown.enter="onSubmit"
          />

          <p v-if="idErrorMessage" class="login-error">
            {{ idErrorMessage }}
          </p>

          <label class="login-label" for="loginPassword">비밀번호</label>
          <input
              id="loginPassword"
              class="login-input"
              type="password"
              :value="password"
              autocomplete="current-password"
              placeholder="비밀번호를 입력해주세요."
              @input="onInputPassword"
              @keydown.enter="onSubmit"
          />

          <p v-if="passwordErrorMessage" class="login-error">
            {{ passwordErrorMessage }}
          </p>

          <p v-if="submitErrorMessage" class="login-error">
            {{ submitErrorMessage }}
          </p>

          <button
              type="button"
              class="login-button"
              :disabled="isSubmitting"
              @click="onSubmit"
          >
            {{ isSubmitting ? '로그인 중...' : '로그인' }}
          </button>
        </div>

        <div class="login-links">
          <button type="button" class="text-link" @click="goToFindPassword">
            비밀번호 찾기
          </button>
          <span class="divider">|</span>
          <button type="button" class="text-link" @click="goToSignup">
            회원가입
          </button>
        </div>

        <p class="login-note">
          지금은 임시 로그인으로 동작합니다.
        </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {router} from '@/router';
import BackButton from "@/components/layout/BackButton.vue";

@Component({
  name: 'LoginPage',
  components: {BackButton},
})
class LoginPage extends Vue {
  loginId = '';
  password = '';
  isSubmitting = false;

  idErrorMessage = '';
  passwordErrorMessage = '';
  submitErrorMessage = '';

  private readonly TEMP_LOGIN_KEY = 'movie_review_temp_login_v1';

  get isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginId.trim());
  }

  get hasPasswordMinLength(): boolean {
    return this.password.length >= 8 && this.password.length <= 20;
  }

  get hasPasswordLetter(): boolean {
    return /[A-Za-z]/.test(this.password);
  }

  get hasPasswordNumber(): boolean {
    return /\d/.test(this.password);
  }

  get hasPasswordSpecial(): boolean {
    return /[^A-Za-z\d]/.test(this.password);
  }

  get isPasswordRuleValid(): boolean {
    return (
        this.hasPasswordMinLength &&
        this.hasPasswordLetter &&
        this.hasPasswordNumber &&
        this.hasPasswordSpecial
    );
  }

  clearErrorMessages() {
    this.idErrorMessage = '';
    this.passwordErrorMessage = '';
    this.submitErrorMessage = '';
  }

  onInputId(e: Event) {
    this.loginId = (e.target as HTMLInputElement).value;
    this.idErrorMessage = '';
    this.submitErrorMessage = '';
  }

  onInputPassword(e: Event) {
    this.password = (e.target as HTMLInputElement).value;
    this.passwordErrorMessage = '';
    this.submitErrorMessage = '';
  }

  validateForm(): boolean {
    const trimmedId = this.loginId.trim();
    let isValid = true;

    this.clearErrorMessages();

    if (!trimmedId) {
      this.idErrorMessage = '아이디를 입력해주세요.';
      isValid = false;
    } else if (!this.isEmailValid) {
      this.idErrorMessage = '이메일 형식으로 입력해주세요.';
      isValid = false;
    }

    if (!this.password) {
      this.passwordErrorMessage = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (!this.isPasswordRuleValid) {
      this.passwordErrorMessage = '비밀번호 형식을 다시 확인해주세요.';
      isValid = false;
    }

    return isValid;
  }

  saveTempLogin() {
    localStorage.setItem(this.TEMP_LOGIN_KEY, 'true');
  }

  async onSubmit() {
    if (this.isSubmitting) return;
    if (!this.validateForm()) return;

    this.isSubmitting = true;
    this.submitErrorMessage = '';

    try {
      await new Promise(function (resolve) {
        setTimeout(resolve, 400);
      });

      this.saveTempLogin();
      await router.push('/search');
    } catch (e) {
      this.submitErrorMessage = '로그인 처리 중 문제가 생겼어요.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goToFindPassword() {
    router.push('/find-password');
  }

  goToSignup() {
    router.push('/signup');
  }

  goToSearch() {
    router.push('/search');
  }
}

export default LoginPage;
</script>

<style scoped>
.page-login {
  height: 100vh;
  background: #d7d0c6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  box-sizing: border-box;
}

.login-header {
  position: fixed;
  top: 20px;
  left: 4px;
}

.login-wrap {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: #e8e2d8;
  border: 2px solid rgba(75, 44, 44, 0.28);
  box-shadow: 0 12px 24px rgba(55, 33, 24, 0.1);
  padding: 28px 18px 20px;
  box-sizing: border-box;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 1000;
  color: #2f1d1e;
}

.login-subtitle {
  margin: 10px 0 20px;
  text-align: center;
  color: rgba(47, 29, 30, 0.72);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-label {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 900;
  color: #3b2627;
}

.login-input {
  width: 100%;
  height: 46px;
  border: 1px solid rgba(73, 40, 41, 0.28);
  background: rgba(255, 255, 255, 0.72);
  padding: 0 12px;
  box-sizing: border-box;
  font-size: 14px;
  color: #2f1d1e;
  outline: none;
  border-radius: 0;
}

.login-input::placeholder {
  color: rgba(47, 29, 30, 0.38);
}

.login-input:focus {
  border-color: #6b4a4d;
  background: rgba(255, 255, 255, 0.92);
}

.login-input:-webkit-autofill,
.login-input:-webkit-autofill:hover,
.login-input:-webkit-autofill:focus,
.login-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.72) inset;
  -webkit-text-fill-color: #6b4a4d;
  transition: background-color 9999s ease-out 0s;
}

.login-error {
  margin: 4px 0 0;
  color: #9e3d3d;
  font-size: 12px;
  font-weight: 800;
  padding-left: 8px;
}

.login-button {
  margin-top: 10px;
  height: 48px;
  border: none;
  background: #4b2c2c;
  color: #f8f2e8;
  font-size: 15px;
  font-weight: 1000;
  cursor: pointer;
}

.login-button:disabled {
  opacity: 0.65;
  cursor: default;
}

.login-links {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.text-link {
  border: none;
  background: transparent;
  color: rgba(47, 29, 30, 0.74);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  padding: 0;
}

.divider {
  color: rgba(47, 29, 30, 0.28);
  font-size: 12px;
}

.login-note {
  margin-top: 16px;
  text-align: center;
  color: rgba(47, 29, 30, 0.5);
  font-size: 11px;
  font-weight: 700;
}
</style>