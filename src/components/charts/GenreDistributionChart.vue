<template>
  <div v-if="isEmpty">
    아직 본 영화가 없어요
  </div>
  <section v-else class="genre-chart">
    <div ref="chartEl" class="chart"></div>
  </section>
</template>

<script lang="ts">
import {echarts} from '@/libs/echarts';
import {markRaw} from 'vue';
import {Vue, Component} from 'vue-facing-decorator';
import {Prop, Ref, Watch} from 'vue-facing-decorator';
import {buildGenreDistribution, buildGenrePieOption} from '@/utils/charts/genre-distribution';

@Component({})
class GenreDistributionChart extends Vue {
  @Prop({type: Array, default: () => []}) readonly userMovies!: any[];
  @Prop({type: Function, required: true}) readonly resolveGenreName!: (id: number) => string;

  @Prop({type: Number, default: 5}) readonly topN!: number;
  @Prop({type: Number, default: 0}) readonly height!: number; // 0 => 부모 높이
  @Prop({type: String, default: ''}) readonly renderSig!: string;

  @Ref('chartEl') readonly chartEl!: HTMLDivElement;

  private chart: any | null = null;
  ro: ResizeObserver | null = null;

  get isEmpty() {
    const list = Array.isArray(this.userMovies) ? this.userMovies : [];
    return list.filter((x) => x?.status === 'WATCHED').length === 0;
  }

  mounted() {
    this.initChart();
    this.renderChart();
    this.bindResize();
  }

  beforeUnmount() {
    this.unbindResize();
    this.disposeChart();
  }

  @Watch('userMovies', {deep: true})
  onMoviesChange() {
    this.renderChart(true);
  }

  @Watch('topN')
  onTopNChange() {
    this.renderChart(true);
  }

  @Watch('height')
  onHeightChange() {
    this.applyHeight();
    this.requestResize();
  }

  @Watch('renderSig')
  onRenderSigChange() {
    this.renderChart(true);
  }

  initChart() {
    if (!this.chartEl) return;
    if (this.chart) return;

    this.applyHeight();
    const c = echarts.init(this.chartEl);
    this.chart = markRaw(c);
  }

  applyHeight() {
    if (!this.chartEl) return;
    if (this.height && this.height > 0) this.chartEl.style.height = `${this.height}px`;
    else this.chartEl.style.height = '100%';
  }

  requestResize() {
    if (!this.chart) return;
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

    if (forceReinit) this.disposeChart();
    this.initChart();
    if (!this.chart) return;

    const watched = (Array.isArray(this.userMovies) ? this.userMovies : []).filter((m) => m?.status === 'WATCHED');
    const {data, total} = buildGenreDistribution(this.userMovies, this.resolveGenreName, this.topN);
    const option = buildGenrePieOption(data, total);

    console.groupCollapsed('[GenreDistributionChart]');
    console.log('topN:', this.topN);
    console.log(watched, 'watched')
    console.log('watched count:', watched.length);
    console.log('watched sample:', watched.slice(0, 3));
    console.log('pie data (top + etc):', data);
    console.log('total:', total);
    console.log('option:', option);
    console.groupEnd();

    await this.$nextTick();
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    this.chart.resize();
    this.chart.clear();
    this.chart.setOption(option, {notMerge: true, lazyUpdate: false});
  }
}
export default GenreDistributionChart;
</script>

<style scoped>
.genre-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.genre-chart::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('@/assets/images/movies.PNG');
  background-size: cover;
  background-position: center;
  opacity: 0.7; /* 흐릿하게 */
  filter: blur(2px);
  transform: scale(1.03);
  pointer-events: none;
  z-index: 0;
}

.genre-chart::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  pointer-events: none;
  z-index: 1;
}

.chart {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.empty {
  padding: 16px;
  border-radius: 12px;
  opacity: 0.8;
  position: relative;
  z-index: 2;
}
</style>
