<template>
  <section class="monthly-watched-chart">
    <div v-if="isEmpty" class="empty">
      아직 본 영화가 없어요 😚🎬
    </div>

    <div v-else ref="chartEl" class="chart"/>
  </section>
</template>

<script lang="ts">
import {echarts} from '@/libs/echarts';
import {markRaw} from 'vue';
import {Vue, Component} from 'vue-facing-decorator';
import {Prop, Ref, Watch} from 'vue-facing-decorator';
import {buildMonthlyWatched, buildMonthlyWatchedOption} from '@/utils/charts/monthly-watched';

@Component({})
export default class MonthlyWatchedChart extends Vue {
  @Prop({type: Array, default: () => []}) readonly userMovies!: any[];
  @Prop({type: Number, default: 0}) readonly monthsBack!: number; // 0이면 전체, 12면 최근 12개월
  @Prop({type: Boolean, default: false}) readonly yearMode!: boolean;
  @Prop({type: Number, default: 0}) readonly height!: number;
  @Prop({type: String, default: ''}) readonly renderSig!: string; // 강제 리렌더 트리거용(optional)

  @Ref('chartEl') readonly chartEl!: HTMLDivElement;

  private chart: any | null = null;
  ro: ResizeObserver | null = null;
  private ignoreResizeUntil = 0;

  get isEmpty() {
    const list = Array.isArray(this.userMovies) ? this.userMovies : [];
    return list.filter((x) => x?.status === 'WATCHED' && x?.watchedAt).length === 0;
  }

  mounted() {
    this.initChart();
    this.renderChart();
    this.bindResize();
  }

  @Watch('height')
  onHeightChange() {
    this.applyHeight();
    this.requestResize();
  }

  beforeUnmount() {
    this.unbindResize();
    this.disposeChart();
  }

  @Watch('userMovies', {deep: true})
  onMoviesChange() {
    this.renderChart(true);
  }

  @Watch('monthsBack')
  onMonthsBackChange() {
    this.renderChart(true);
  }

  @Watch('renderSig')
  onRenderSigChange() {
    // option이 안 바뀌는데도 강제로 갱신하고 싶을 때
    this.renderChart(true);
  }

  initChart() {
    if (!this.chartEl) return;
    if (this.chart) return;

    this.applyHeight();
    let chart = echarts.init(this.chartEl);
    this.chart = markRaw(chart);
  }

  applyHeight() {
    if (!this.chartEl) return;
    // height=0 => 부모 높이를 따라가게 함
    if (this.height && this.height > 0) {
      this.chartEl.style.height = `${this.height}px`;
    } else {
      this.chartEl.style.height = '100%';
    }
  }

  requestResize() {
    if (!this.chart) return;
    // setOption 직후 즉시 resize 하면 애니메이션이 스킵되는 케이스가 있어 한 프레임 뒤에
    requestAnimationFrame(() => {
      if (this.chart) this.chart.resize();
    });
  }

  disposeChart() {
    if (!this.chart) return;
    this.chart.dispose();
    this.chart = null;
  }

  bindResize() {
    if (!this.chartEl) return;
    if (typeof ResizeObserver === 'undefined') return;

    this.ro = new ResizeObserver(() => {
      if (Date.now() < this.ignoreResizeUntil) return;
      if (this.chart) this.chart.resize();
    });
    this.ro.observe(this.chartEl);
  }

  unbindResize() {
    if (!this.ro) return;
    this.ro.disconnect();
    this.ro = null;
  }

  async renderChart(forceReinit: boolean = false) {
    if (this.isEmpty) {
      this.disposeChart();
      return;
    }

    if (forceReinit) {
      this.disposeChart();
    }
    this.initChart();
    if (!this.chart) return;

    const {labels, values} = buildMonthlyWatched(this.userMovies, this.yearMode, this.monthsBack);
    const option = buildMonthlyWatchedOption(labels, values);

    console.log('option', option)

    this.ignoreResizeUntil = Date.now() + 300;
    await this.$nextTick();
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    // 사이즈 먼저 확정
    this.chart.resize();

    // "처음 그리기"로 강제
    this.chart.clear();
    this.chart.setOption(option, {notMerge: true, lazyUpdate: false});
  }
}
</script>

<style scoped>
.monthly-watched-chart {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.monthly-watched-chart::before {
 content: '';
 position: absolute;
 inset: 0;
 background-image: url('@/assets/images/cinema.jpg');
 background-size: cover;
 background-position: center;
 opacity: 1;
 filter: blur(3 px);
 transform: scale(1.05);
 pointer-events: none;
 z-index: 0;
}

.chart {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.empty {
  padding: 16px;
  border-radius: 12px;
  opacity: 0.8;
}
</style>
