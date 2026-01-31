import {echarts} from '@/libs/echarts';

export type MonthlySeries = {
    labels: string[];
    values: number[];
};

export function pad2(n: number) {
    return String(n).padStart(2, '0');
}

export function toYm(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function ymToMonthLabel(ym: string) {
    const [y, m] = ym.split('-');
    if (!y || !m) return ym;
    return `${Number(m)}월`;
}

export function monthAdd(ym: string, delta: number) {
    const [ys, ms] = ym.split('-');
    const y = Number(ys);
    const m = Number(ms);
    const d = new Date(y, m - 1 + delta, 1);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function buildMonthlyWatched(userMovies: any[], yearMode: boolean = false, monthsBack: number = 12): MonthlySeries {
    const watched = (Array.isArray(userMovies) ? userMovies : []).filter(
        (x) => x?.status === 'WATCHED' && x?.watchedAt
    );

    if (watched.length === 0) return {labels: [], values: []};

    const map: Record<string, number> = {};

    for (const m of watched) {
        const ym = toYm(String(m.watchedAt));
        map[ym] = (map[ym] || 0) + 1;
    }

    const labels: string[] = [];
    const values: number[] = [];

    const today = new Date();

    if (yearMode) {
        // ✅ 올해 기준: YYYY-01 ~ YYYY-12 고정
        const y = today.getFullYear();
        for (let m = 1; m <= 12; m++) {
            const ym = `${y}-${pad2(m)}`;
            labels.push(ymToMonthLabel(ym));
            values.push(map[ym] || 0);
        }
        return {labels, values};
    }

    // ✅ 최근 N개월 (기본 12)
    const n = typeof monthsBack === 'number' && monthsBack > 0 ? monthsBack : 12;
    const endYm = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}`;
    const startYm = monthAdd(endYm, -(n - 1));

    let cur = startYm;
    while (cur <= endYm) {
        labels.push(ymToMonthLabel(cur));
        values.push(map[cur] || 0);
        cur = monthAdd(cur, 1);
    }

    return {labels, values};
}

export function buildMonthlyWatchedOption(labels: string[], values: number[]) {
    return {
        tooltip: {trigger: 'axis'},
        grid: {left: 10, right: 10, top: 14, bottom: 14, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel'},
        xAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                interval: 0,
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 500,
                fontSize: 12,
            },
            axisLine: {lineStyle: {color: 'rgba(255,255,255,0.35)'}},
            axisTick: {lineStyle: {color: 'rgba(255,255,255,0.25)'}},
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 500,
                fontSize: 12,
            },
            splitLine: {lineStyle: {color: 'rgba(255,255,255,0.12)'}},
            axisLine: {lineStyle: {color: 'rgba(255,255,255,0.25)'}},
            axisTick: {lineStyle: {color: 'rgba(255,255,255,0.2)'}},
        },
        animation: true,
        animationDuration: 600,
        animationEasing: 'cubicOut',
        animationDelay: function (idx: number) {
            return idx * 25;
        },
        animationDurationUpdate: 400,
        animationEasingUpdate: 'cubicOut',
        animationDelayUpdate: function (idx: number) {
            return idx * 25;
        },
        series: [{
            type: 'bar',
            data: values,
            barWidth: 14,
            itemStyle: {
                // 위쪽만 둥글게
                borderRadius: [8, 8, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: 'rgba(255,255,255,0.95)'},
                    {offset: 0.55, color: 'rgba(255,255,255,0.55)'},
                    {offset: 1, color: 'rgba(255,255,255,0.25)'},
                ]),
                // 배경 이미지랑 잘 섞이게 살짝 그림자
                shadowBlur: 12,
                shadowOffsetY: 2,
                shadowColor: 'rgba(0,0,0,0.22)',
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 16,
                    shadowOffsetY: 3,
                    shadowColor: 'rgba(0,0,0,0.24)',
                },
            },
            animationDuration: 600,
            animationEasing: 'cubicOut',
            animationDelay: function (idx: number) {
                return idx * 25;
            },
            animationDurationUpdate: 400,
            animationEasingUpdate: 'cubicOut',
            animationDelayUpdate: function (idx: number) {
                return idx * 25;
            },
        }],
    };
}
