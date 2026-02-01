<!-- ToastMessageComponent.vue -->
<template>
  <teleport to="body">
    <div v-if="modelValue" class="toast-wrapper">
      <!-- backdrop: 바깥 클릭 = 닫기 -->
      <div class="toast-backdrop" @click="onClose"></div>

      <!-- toast -->
      <aside class="toast" :style="{ background: resolveToastBg(type) }" @click.stop>
        <span class="toast-progress" :style="{ width: progress + '%' }"></span>
        <span class="toast-progress--length"></span>

        <span class="toast-message">{{ message }}</span>

        <button class="toast-close" type="button" aria-label="닫기" @click="onClose">
          ✕
        </button>
      </aside>
    </div>
  </teleport>
</template>

<script lang="ts">
import {Vue, Prop, Emit, Watch, Component} from 'vue-facing-decorator';

export type ToastType = 'success' | 'error';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function resolveToastBg(type: ToastType) {
  if (type === 'success') return '#09637E';
  return '#9E3B3B';
}
@Component(
    {
      name: 'ToastMessageComponent',
      components: {},
    }
)
class ToastMessageComponent extends Vue {
  @Prop({ type: Boolean, default: false }) readonly modelValue!: boolean;
  @Prop({ type: String, default: '' }) readonly message!: string;
  @Prop({ type: String, default: 'success' }) readonly type!: ToastType;

  // 총 노출 시간(ms). 기본: 1500ms (기존 15ms*100)
  @Prop({ type: Number, default: 1500 }) readonly durationMs!: number;

  progress = 0;
  timer: number | null = null;

  resolveToastBg(type: ToastType) {
    return resolveToastBg(type);
  }

  onBeforeUnmount() {
    this.stopTimer();
  }

  @Watch('modelValue')
  onOpenChange(v: boolean) {
    if (v) this.start();
    else this.stopTimer();
  }

  @Watch('message')
  onMessageChange() {
    // 메시지가 바뀌면(열려있다면) 다시 시작
    if (this.modelValue) this.start();
  }

  start() {
    if (this.durationMs <= 0) return;
    this.stopTimer();
    this.progress = 0;

    const stepMs = Math.max(5, Math.floor(this.durationMs / 100));

    this.timer = window.setInterval(() => {
      this.progress = clamp(this.progress + 1, 0, 100);
      if (this.progress >= 100) this.onClose();
    }, stepMs);
  }

  stopTimer() {
    if (!this.timer) return;
    window.clearInterval(this.timer);
    this.timer = null;
  }

  @Emit('update:modelValue')
  emitModelValue(_v: boolean) {
    return _v;
  }

  onClose() {
    this.stopTimer();
    this.emitModelValue(false);
  }
}
export default ToastMessageComponent;
</script>

<style scoped>
.toast-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.toast-backdrop {
  position: absolute;
  inset: 0;
  background: transparent; /* 바깥 클릭만 잡고 싶으면 투명 */
}

.toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 7rem));
  max-width: min(420px, calc(100vw - 2 * 24px));
  width: 100%;
  max-height: 56px;
  height: 100%;
  border: 1px solid #333;
  border-radius: 2px;
  color: #fff;
  padding: 24px 48px 24px 24px;
  display: flex;
  align-items: center;
  transition: all .35s cubic-bezier(.25, .75, .6, .98);
  box-sizing: border-box;
}

.toast-progress {
  height: 4px;
  width: 0%;
  background: rgba(255, 255, 255, .6);
  border-radius: 2px;
  position: absolute;
  top: 1px;
  left: 0;
  z-index: 2;
}

.toast-progress--length {
  height: 5px;
  width: 100%;
  background: rgba(0,0,0,.2);
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.toast-message {
  font-size: 1.05rem;
  letter-spacing: -.4px;
  font-weight: 400;
}

.toast-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(0,0,0,.18);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.toast-close:hover {
  background: rgba(0,0,0,.28);
}

.toast-close:focus-visible {
  outline: 2px solid rgba(255,255,255,.55);
  outline-offset: 2px;
}
</style>
