export type GenrePieItem = { name: string; value: number };

export function buildGenreDistribution(userMovies: any[], resolveGenreName: (id: number) => string, topN: number = 4) {
    const watched = (Array.isArray(userMovies) ? userMovies : []).filter((m) => m?.status === 'WATCHED');

    const counter = new Map<string, number>();

    for (const m of watched) {
        const ids = Array.isArray(m?.genres) ? m.genres : [];
        if (ids.length === 0) {
            counter.set('기타', (counter.get('기타') || 0) + 1);
            continue;
        }

        for (const id of ids) {
            const name = resolveGenreName(Number(id)) || '기타';
            counter.set(name, (counter.get(name) || 0) + 1);
        }
    }

    // "기타"는 따로 빼두고, TOP 정렬은 '기타' 제외하고 진행
    const rowsAll = Array.from(counter.entries()).map(([name, count]) => ({name, value: count}));
    const existingEtc = rowsAll.find((x) => x.name === '기타')?.value || 0;

    const rows = rowsAll
        .filter((x) => x.name !== '기타')
        .sort((a, b) => b.value - a.value);

    const top = rows.slice(0, topN);
    const rest = rows.slice(topN);

    // 나머지 + 원래 기타를 합쳐서 "기타"로, 그리고 항상 마지막에 붙임
    const restSum = rest.reduce((acc, x) => acc + x.value, 0);
    const etcSum = existingEtc + restSum;
    if (etcSum > 0) top.push({name: '기타', value: etcSum});

    const total = rowsAll.reduce((acc, x) => acc + x.value, 0);
    return {data: top, total};
}

export function buildGenrePieOption(data: GenrePieItem[], total: number) {
    return {
        textStyle: {
            fontFamily: '"JoseonGulim", sans-serif',
            fontWeight: 700,
        },
        tooltip: {show: false},
        legend: {
            bottom: 14,
            textStyle: {
                color: '#F8F5EE',
                fontWeight: 900,
                textShadowColor: 'rgba(0,0,0,0.55)',
                textShadowBlur: 6,
            },
        },
        //가운데 총 편수 텍스트
        graphic: [
            {
                type: 'text',
                left: 'center',
                top: '40%',
                style: {
                    text: '총 관람',
                    fill: 'rgba(255,255,255,0.85)',
                    fontSize: 12,
                    fontFamily: '"JoseonGulim", sans-serif',
                    fontWeight: 700,
                    textShadowColor: 'rgba(0,0,0,0.6)',
                    textShadowBlur: 6,
                },
            },
            {
                type: 'text',
                left: 'center',
                top: '47%',
                style: {
                    text: `${total}편`,
                    fill: '#FFFFFF',
                    fontSize: 18,
                    fontFamily: '"JoseonGulim", sans-serif',
                    fontWeight: 800,
                    textShadowColor: 'rgba(0,0,0,0.7)',
                    textShadowBlur: 8,
                },
            },
        ],
        series: [
            {
                type: 'pie',
                color: ['#5D866C', '#C2A68C', '#E6D8C3', '#A2AADB', '#91C4C3', '#80A1BA', '#F5F5F0'],
                radius: ['45%', '70%'],
                center: ['50%', '43%'],
                label: {
                    show: true,
                    color: '#F8F5EE',
                    fontWeight: 900,
                    position: 'inside',
                    textBorderColor: 'rgba(0,0,0,0.55)',
                    textBorderWidth: 3,
                    formatter: function (p: any) {
                        return `${p.name}(${p.percent}%)`;
                    },
                },
                labelLine: {show: true, lineStyle: {color: 'rgba(255,255,255,0.35)'}},
                itemStyle: {
                    borderRadius: 6,
                    borderColor: 'rgba(0,0,0,0.25)',
                    borderWidth: 1,
                },
                emphasis: {
                    scale: true,
                    scaleSize: 6,
                    label: {
                        fontSize: 13,
                        fontWeight: 900,
                    },
                },
                data,
            },
        ],
    };
}
