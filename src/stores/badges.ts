// 영화 리뷰 앱 뱃지 정의(상수) + 정렬 규칙 모음

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type BadgeDef = {
    id: string;
    name: string;
    desc: string;
    emoji: string;
    threshold: number; // WATCHED 누적 편수 기준
    tier: BadgeTier;
};

// 단계형(10/20/50/100) — “본 영화(WATCHED) 누적 편수” 기준
export const BADGE_DEFS: BadgeDef[] = [
    {
        id: 'watched_10',
        name: '영화 관람자',
        desc: '본 영화 10편 달성',
        emoji: '🎟️',
        threshold: 10,
        tier: 'BRONZE',
    },
    {
        id: 'watched_20',
        name: '예비 시네필',
        desc: '본 영화 20편 달성',
        emoji: '🍿',
        threshold: 20,
        tier: 'SILVER',
    },
    {
        id: 'watched_50',
        name: '시네필',
        desc: '본 영화 50편 달성',
        emoji: '🎬',
        threshold: 50,
        tier: 'GOLD',
    },
    {
        id: 'watched_100',
        name: '평론가',
        desc: '본 영화 100편 달성',
        emoji: '📝',
        threshold: 100,
        tier: 'PLATINUM',
    },
];

// 잠김은 UI에서 아예 안 보여줄 거라 “획득한 것” 정렬만 중요!
// 최근 획득순(UNLOCKED_AT desc)
// 동일 날짜면 더 높은 단계 우선(100→50→20→10)
export function sortUnlockedBadges(
    a: { unlockedAt: string; threshold?: number; id?: string },
    b: { unlockedAt: string; threshold?: number; id?: string }
): number {
    const ad = a.unlockedAt || '';
    const bd = b.unlockedAt || '';
    if (ad !== bd) return bd.localeCompare(ad); // YYYY-MM-DD 문자열 비교로 desc 가능

    const at = typeof a.threshold === 'number' ? a.threshold : getThresholdById(a.id);
    const bt = typeof b.threshold === 'number' ? b.threshold : getThresholdById(b.id);
    return bt - at;
}

export function getBadgeDefById(id: string): BadgeDef | undefined {
    return BADGE_DEFS.find((b) => b.id === id);
}

export function getThresholdById(id?: string): number {
    if (!id) return 0;
    const def = getBadgeDefById(id);
    return def?.threshold ?? 0;
}
