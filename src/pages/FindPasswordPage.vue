<template>
  <div class="page-find-password">
    <div class="find-password-header">
      <BackButton @click="onClickBackButton"/>
    </div>
    <section class="find-password-wrap">
      <div class="find-password-card">
        <div class="find-password-step">
          STEP {{ step }} / 4
        </div>

        <!-- STEP 1: 이메일 -->
        <template v-if="step === 1">
          <h2 class="find-password-title">이메일을 입력해주세요</h2>
          <p class="find-password-subtitle">
            가입할 때 사용한 이메일 주소를 입력해주세요.
          </p>

          <div class="find-password-form">
            <label class="find-password-label" for="findPasswordEmail">이메일</label>
            <input
                id="findPasswordEmail"
                class="find-password-input"
                type="email"
                :value="email"
                autocomplete="email"
                placeholder="example@email.com"
                @input="onInputEmail"
                @keydown.enter="goToVerifyStep"
            />

            <p v-if="email && !isEmailValid" class="find-password-error">
              올바른 이메일 형식으로 입력해주세요.
            </p>

            <div class="find-password-actions">
              <button
                  type="button"
                  class="find-password-button"
                  :disabled="!isEmailValid"
                  @click="goToVerifyStep"
              >
                다음
              </button>
            </div>
          </div>
        </template>

        <!-- STEP 2: 이메일 인증 -->
        <template v-else-if="step === 2">
          <h2 class="find-password-title">이메일을 확인해주세요</h2>
          <p class="find-password-subtitle">
            아래 이메일로 인증코드를 발송해주세요. <br/>
            인증 완료 후 비밀번호를 재설정할 수 있습니다.
          </p>

          <div class="find-password-email-box">
            {{ email }}
          </div>

          <div class="find-password-form">
            <div class="find-password-actions find-password-actions--two">
              <button
                  type="button"
                  class="find-password-button find-password-button--secondary"
                  @click="goToPrevStep"
              >
                이전
              </button>
              <button
                  type="button"
                  class="find-password-button"
                  :disabled="isSendingCode || !canSendCode"
                  @click="sendVerificationCode"
              >
                {{ isSendingCode ? '전송 중...' : '인증코드 보내기' }}
              </button>
            </div>

            <div v-if="verificationSent" class="find-password-verify-box">
              <label class="find-password-label" for="verificationCode">인증코드</label>
              <input
                  id="verificationCode"
                  class="find-password-input"
                  type="text"
                  :value="verificationCode"
                  inputmode="text"
                  maxlength="6"
                  placeholder="인증코드를 입력해주세요"
                  @input="onInputVerificationCode"
                  @keydown.enter="verifyCode"
              />

              <div class="find-password-timer-row">
                <span class="find-password-timer">코드 유효시간 {{ formattedRemainSeconds }}</span>
                <span class="find-password-resend">
                  {{
                    remainResendSeconds > 0
                        ? `재전송 가능까지 ${remainResendSeconds}초`
                        : '재전송 가능합니다'
                  }}
                </span>
              </div>

              <p v-if="verificationMessage && !verificationVerified" class="find-password-info">
                {{ verificationMessage }}
              </p>

              <p v-if="verificationVerified" class="find-password-success">
                이메일 인증이 완료되었습니다.
              </p>

              <div class="find-password-actions find-password-actions--two">
                <button
                    type="button"
                    class="find-password-button find-password-button--secondary"
                    :disabled="remainResendSeconds > 0 || isSendingCode"
                    @click="resendVerificationCode"
                >
                  다시 이메일 보내기
                </button>
                <button
                    type="button"
                    class="find-password-button"
                    :disabled="!canVerifyCode"
                    @click="verifyCode"
                >
                  인증번호 확인
                </button>
              </div>
            </div>

            <div class="find-password-actions">
              <button
                  type="button"
                  class="find-password-button"
                  :disabled="!verificationVerified"
                  @click="goToResetPasswordStep"
              >
                다음
              </button>
            </div>
          </div>
        </template>

        <!-- STEP 3: 새 비밀번호 -->
        <template v-else-if="step === 3">
          <h2 class="find-password-title">새 비밀번호를 입력해주세요</h2>
          <p class="find-password-subtitle">
            영문, 숫자, 특수문자를 포함하여 8자 이상 20자 이하로 입력해주세요.
          </p>

          <div class="find-password-form">
            <label class="find-password-label" for="resetPassword">새 비밀번호</label>
            <input
                id="resetPassword"
                class="find-password-input"
                type="password"
                :value="password"
                autocomplete="new-password"
                placeholder="새 비밀번호를 입력해주세요"
                @input="onInputPassword"
                @keydown.enter="completeResetPassword"
            />
            <p v-if="passwordTouched && !isPasswordRuleValid" class="find-password-error">
              비밀번호 규칙을 다시 확인해주세요.
            </p>

            <ul class="find-password-rule-list">
              <li class="find-password-rule-item" :class="{ valid: hasPasswordMinLength }">
                <CheckedIcon v-if="hasPasswordMinLength" class="find-password-rule-icon"/>
                <UnCheckedIcon v-else class="find-password-rule-icon"/>
                <span>8자 이상 20자 이하</span>
              </li>
              <li class="find-password-rule-item" :class="{ valid: hasPasswordLetter }">
                <CheckedIcon v-if="hasPasswordLetter" class="find-password-rule-icon"/>
                <UnCheckedIcon v-else class="find-password-rule-icon"/>
                <span>영문 1자 이상 포함</span>
              </li>
              <li class="find-password-rule-item" :class="{ valid: hasPasswordNumber }">
                <CheckedIcon v-if="hasPasswordNumber" class="find-password-rule-icon"/>
                <UnCheckedIcon v-else class="find-password-rule-icon"/>
                <span>숫자 1자 이상 포함</span>
              </li>
              <li class="find-password-rule-item" :class="{ valid: hasPasswordSpecial }">
                <CheckedIcon v-if="hasPasswordSpecial" class="find-password-rule-icon"/>
                <UnCheckedIcon v-else class="find-password-rule-icon"/>
                <span>특수문자 1자 이상 포함</span>
              </li>
            </ul>

            <label class="find-password-label" for="resetPasswordConfirm">새 비밀번호 확인</label>
            <input
                id="resetPasswordConfirm"
                class="find-password-input"
                type="password"
                :value="passwordConfirm"
                autocomplete="new-password"
                placeholder="새 비밀번호를 다시 입력해주세요"
                @input="onInputPasswordConfirm"
                @keydown.enter="completeResetPassword"
            />

            <ul class="find-password-rule-list find-password-rule-list--confirm">
              <li class="find-password-rule-item" :class="{ valid: isPasswordConfirmMatched }">
                <CheckedIcon v-if="isPasswordConfirmMatched" class="find-password-rule-icon"/>
                <UnCheckedIcon v-else class="find-password-rule-icon"/>
                <span>비밀번호 확인 일치</span>
              </li>
            </ul>

            <p
                v-if="passwordConfirmTouched && !isPasswordConfirmMatched"
                class="find-password-error"
            >
              비밀번호가 일치하지 않습니다.
            </p>

            <div class="find-password-actions find-password-actions--two">
              <button
                  type="button"
                  class="find-password-button find-password-button--secondary"
                  @click="goToPrevStep"
              >
                이전
              </button>
              <button
                  type="button"
                  class="find-password-button"
                  :disabled="!canCompleteResetPassword"
                  @click="completeResetPassword"
              >
                비밀번호 재설정
              </button>
            </div>
          </div>
        </template>

        <!-- STEP 4: 완료 -->
        <template v-else>
          <h2 class="find-password-title">비밀번호가 재설정되었습니다</h2>
          <p class="find-password-subtitle">
            새 비밀번호로 다시 로그인해주세요.
          </p>

          <div class="find-password-complete-mark">
            <HappyIcon/>
          </div>

          <div class="find-password-actions">
            <button
                type="button"
                class="find-password-button"
                @click="goToLogin"
            >
              로그인으로 이동
            </button>
          </div>
        </template>
      </div>
    </section>

    <div v-if="toastOpen" class="simple-toast" :class="toastTypeClass">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {router} from '@/router';
import CheckedIcon from '@/assets/icons/icon_check_active.svg';
import UnCheckedIcon from '@/assets/icons/icon_check_inactive.svg';
import HappyIcon from '@/assets/icons/icon_happy.svg';
import BackButton from '@/components/layout/BackButton.vue';

type FindPasswordStep = 1 | 2 | 3 | 4;
type ToastType = 'success' | 'error' | 'info';

@Component({
  name: 'FindPasswordPage',
  components: {
    CheckedIcon,
    UnCheckedIcon,
    HappyIcon,
    BackButton,
  },
})
class FindPasswordPage extends Vue {
  step: FindPasswordStep = 1;

  email = '';
  verificationCode = '';
  password = '';
  passwordConfirm = '';

  verificationSent = false;
  verificationVerified = false;
  verificationMessage = '';

  remainSeconds = 0;
  remainResendSeconds = 0;

  isSendingCode = false;
  passwordTouched = false;
  passwordConfirmTouched = false;

  toastOpen = false;
  toastMessage = '';
  toastType: ToastType = 'info';

  private verificationExpireTimer: number | null = null;
  private resendCooldownTimer: number | null = null;
  private toastTimer: number | null = null;
  private mockVerifiedCode = 'ABC123';

  get isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
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

  get isPasswordConfirmMatched(): boolean {
    return !!this.passwordConfirm && this.password === this.passwordConfirm;
  }

  get canSendCode(): boolean {
    return this.isEmailValid && !this.verificationVerified;
  }

  get canVerifyCode(): boolean {
    return (
        this.verificationSent &&
        this.verificationCode.length >= 4 &&
        this.remainSeconds > 0 &&
        !this.verificationVerified
    );
  }

  get canCompleteResetPassword(): boolean {
    return (
        this.verificationVerified &&
        this.isPasswordRuleValid &&
        this.isPasswordConfirmMatched
    );
  }

  get formattedRemainSeconds(): string {
    const minutes = Math.floor(this.remainSeconds / 60);
    const seconds = this.remainSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  get toastTypeClass(): string {
    return `simple-toast--${this.toastType}`;
  }

  onInputEmail(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.email = value.trim();
  }

  onInputVerificationCode(e: Event) {
    const value = (e.target as HTMLInputElement).value
        .replace(/[^A-Za-z0-9]/g, '')
        .slice(0, 6);

    this.verificationCode = value.toUpperCase();
  }

  onInputPassword(e: Event) {
    this.passwordTouched = true;
    this.password = (e.target as HTMLInputElement).value;
  }

  onInputPasswordConfirm(e: Event) {
    this.passwordConfirmTouched = true;
    this.passwordConfirm = (e.target as HTMLInputElement).value;
  }

  goToVerifyStep() {
    if (!this.isEmailValid) return;
    this.step = 2;
  }

  goToResetPasswordStep() {
    if (!this.verificationVerified) return;
    this.step = 3;
  }

  onClickBackButton() {
    if (this.step === 1) {
      router.go(-1);
      return;
    }

    this.step = (this.step - 1) as FindPasswordStep;
  }

  goToPrevStep() {
    if (this.step === 2) {
      this.step = 1;
      return;
    }

    if (this.step === 3) {
      this.step = 2;
    }
  }

  async sendVerificationCode() {
    if (this.isSendingCode) return;
    if (!this.canSendCode) return;

    this.isSendingCode = true;
    this.verificationMessage = '';

    try {
      await new Promise(function (resolve) {
        setTimeout(resolve, 700);
      });

      this.verificationSent = true;
      this.verificationVerified = false;
      this.verificationCode = '';
      this.mockVerifiedCode = this.generateMockVerificationCode();

      this.startVerificationExpireTimer(600);
      this.startResendCooldownTimer(30);

      this.verificationMessage = '인증코드를 이메일로 발송했습니다.';
      this.openToast('success', '인증코드를 발송했습니다.', 3000);
    } catch (e) {
      this.verificationMessage = '인증코드 발송에 실패했습니다.';
      this.openToast('error', '인증코드 발송에 실패했습니다.', 3000);
    } finally {
      this.isSendingCode = false;
    }
  }

  async resendVerificationCode() {
    if (this.remainResendSeconds > 0) return;
    await this.sendVerificationCode();
  }

  verifyCode() {
    if (!this.canVerifyCode) return;

    if (this.remainSeconds <= 0) {
      this.verificationVerified = false;
      this.verificationMessage = '인증코드 유효시간이 만료되었습니다.';
      this.openToast('error', '인증코드 유효시간이 만료되었습니다.', 3000);
      return;
    }

    if (this.verificationCode !== this.mockVerifiedCode) {
      this.verificationVerified = false;
      this.verificationMessage = '인증코드가 올바르지 않습니다.';
      this.openToast('error', '인증코드를 다시 확인해주세요.', 3000);
      return;
    }

    this.verificationVerified = true;
    this.verificationMessage = '이메일 인증이 완료되었습니다.';
    this.clearVerificationExpireTimer();
    this.openToast('success', '이메일 인증이 완료되었습니다.', 3000);
  }

  completeResetPassword() {
    if (!this.canCompleteResetPassword) return;

    this.password = '';
    this.passwordConfirm = '';
    this.verificationCode = '';
    this.step = 4;
    this.openToast('success', '비밀번호가 재설정되었습니다.', 3000);
  }

  goToLogin() {
    router.push('/login');
  }

  startVerificationExpireTimer(seconds: number) {
    this.clearVerificationExpireTimer();
    this.remainSeconds = seconds;

    this.verificationExpireTimer = window.setInterval(() => {
      if (this.remainSeconds <= 0) {
        this.clearVerificationExpireTimer();
        this.remainSeconds = 0;
        this.verificationVerified = false;
        this.verificationMessage = '인증코드 유효시간이 만료되었습니다.';
        return;
      }

      this.remainSeconds -= 1;
    }, 1000);
  }

  startResendCooldownTimer(seconds: number) {
    this.clearResendCooldownTimer();
    this.remainResendSeconds = seconds;

    this.resendCooldownTimer = window.setInterval(() => {
      if (this.remainResendSeconds <= 0) {
        this.clearResendCooldownTimer();
        this.remainResendSeconds = 0;
        return;
      }

      this.remainResendSeconds -= 1;
    }, 1000);
  }

  clearVerificationExpireTimer() {
    if (this.verificationExpireTimer !== null) {
      window.clearInterval(this.verificationExpireTimer);
      this.verificationExpireTimer = null;
    }
  }

  clearResendCooldownTimer() {
    if (this.resendCooldownTimer !== null) {
      window.clearInterval(this.resendCooldownTimer);
      this.resendCooldownTimer = null;
    }
  }

  generateMockVerificationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';

    for (let i = 0; i < 6; i += 1) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    console.log('find-password code', result);

    return result;
  }

  openToast(type: ToastType, message: string, durationMs: number | null = 3000) {
    this.toastOpen = false;
    this.toastType = type;
    this.toastMessage = message;

    if (this.toastTimer !== null) {
      window.clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }

    this.$nextTick(() => {
      this.toastOpen = true;

      if (durationMs === null) return;

      this.toastTimer = window.setTimeout(() => {
        this.toastOpen = false;
        this.toastTimer = null;
      }, durationMs);
    });
  }

  beforeUnmount() {
    this.clearVerificationExpireTimer();
    this.clearResendCooldownTimer();

    if (this.toastTimer !== null) {
      window.clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }
}

export default FindPasswordPage;
</script>

<style scoped>
.page-find-password {
  min-height: 100vh;
  background: #d7d0c6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  box-sizing: border-box;
  flex-direction: column;
}

.find-password-wrap {
  width: 100%;
  max-width: 420px;
}

.find-password-card {
  background: #e8e2d8;
  border: 2px solid rgba(75, 44, 44, 0.28);
  box-shadow: 0 12px 24px rgba(55, 33, 24, 0.1);
  padding: 28px 18px 20px;
  box-sizing: border-box;
}

.find-password-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 8px;
  position: fixed;
  top: 20px;
  left: 4px;
}

.find-password-step {
  text-align: center;
  font-size: 12px;
  font-weight: 900;
  color: rgba(47, 29, 30, 0.55);
}

.find-password-title {
  margin-top: 8px;
  text-align: center;
  font-size: 24px;
  font-weight: 1000;
  color: #2f1d1e;
}

.find-password-subtitle {
  margin: 10px 0 20px;
  text-align: center;
  color: rgba(47, 29, 30, 0.72);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
}

.find-password-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.find-password-label {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 900;
  color: #3b2627;
}

.find-password-input {
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

.find-password-input::placeholder {
  color: rgba(47, 29, 30, 0.38);
}

.find-password-input:focus {
  border-color: #6b4a4d;
  background: rgba(255, 255, 255, 0.92);
}

.find-password-input:-webkit-autofill,
.find-password-input:-webkit-autofill:hover,
.find-password-input:-webkit-autofill:focus,
.find-password-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.72) inset;
  -webkit-text-fill-color: #2f1d1e;
  transition: background-color 9999s ease-out 0s;
}

.find-password-email-box {
  margin-bottom: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(73, 40, 41, 0.18);
  font-size: 14px;
  font-weight: 900;
  color: #2f1d1e;
  word-break: break-all;
}

.find-password-rule-list {
  margin: 6px 0 2px;
  padding-left: 0;
  list-style: none;
  font-size: 12px;
  color: rgba(47, 29, 30, 0.6);
  line-height: 1.6;
}

.find-password-rule-list--confirm {
  margin-top: 2px;
}

.find-password-rule-item {
  display: flex;
  align-items: center;
  gap: 2px;
}

.find-password-rule-item span {
  height: 20px;
  line-height: 20px;
}

.find-password-rule-icon {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
}

.find-password-rule-list li.valid {
  color: #2f6b46;
  font-weight: 800;
}

.find-password-error {
  margin: 0;
  color: #9e3d3d;
  font-size: 12px;
  font-weight: 800;
}

.find-password-info {
  margin: 0;
  color: rgba(47, 29, 30, 0.72);
  font-size: 12px;
  font-weight: 800;
}

.find-password-success {
  margin: 0;
  color: #2f6b46;
  font-size: 12px;
  font-weight: 900;
}

.find-password-verify-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  padding-bottom: 20px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.find-password-timer-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  font-weight: 800;
  color: rgba(47, 29, 30, 0.6);
}

.find-password-actions {
  display: flex;
  margin-top: 10px;
}

.find-password-actions--two {
  gap: 8px;
}

.find-password-button {
  flex: 1;
  height: 48px;
  border: none;
  background: #4b2c2c;
  color: #f8f2e8;
  font-size: 15px;
  font-weight: 1000;
  cursor: pointer;
}

.find-password-button--secondary {
  background: rgba(75, 44, 44, 0.18);
  color: #3b2627;
  border: 1px solid rgba(75, 44, 44, 0.2);
}

.find-password-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.find-password-complete-mark {
  width: 48px;
  height: 48px;
  margin: auto;
  margin-bottom: 18px;
}

.find-password-complete-mark svg {
  fill: #4b2c2c;
}

.simple-toast {
  position: fixed;
  left: 50%;
  top: 24px;
  transform: translateX(-50%);
  min-width: 220px;
  max-width: calc(100% - 24px);
  padding: 12px 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 900;
  color: black;
  z-index: 99999;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.16);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.simple-toast--success {
  background: #4b2c2c;
  color: #fff;
}

.simple-toast--error {
  background: #9e3d3d;
  color: #fff;
}

.simple-toast--info {
  background: #6b5b53;
  color: #fff;
}

@media (min-width: 610px) {
  .page-find-password {
    padding-left: 112px;
  }
}
</style>