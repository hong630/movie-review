<template>
  <button
      type="button"
      class="back-button"
      @click="handleClick"
      aria-label="뒤로가기"
  >
    <BackIcon class="back-button__icon" />
  </button>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-facing-decorator';
import {router} from '@/router';
import BackIcon from '@/assets/icons/icon_back.svg';

@Component({
  name: 'BackButton',
  components: {
    BackIcon,
  },
})
export default class BackButton extends Vue {
  @Prop({default: false})
  readonly history!: boolean;

  @Emit('click')
  emitClick(): void {}

  handleClick(): void {
    if (this.history) {
      router.go(-1);
      return;
    }

    this.emitClick();
  }
}
</script>

<style scoped>
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.back-button__icon {
  display: block;
  width: 24px;
  height: 24px;
}

.back-button:disabled {
  cursor: default;
  opacity: 0.5;
}
</style>