// 스킨 카탈로그(정적 정의)

import type { SkinDef, SkinTarget, SkinTier } from '@/types/skin';

export const SKIN_TARGETS: SkinTarget[] = ['ticket', 'watched'];

export const SKIN_TIER_ORDER: SkinTier[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

export const SKIN_DEFS: SkinDef[] = [
    // 🎟️ 티켓 테마 스킨
    {
        id: 'ticket_vanilla',
        target: 'ticket',
        name: '바닐라 티켓',
        desc: '깔끔한 기본 티켓 감성',
        emoji: '🎟️',
        tier: 'COMMON',
        price: 5,
        className: 'skin-ticket-vanilla',
    },
    {
        id: 'ticket_cinema_night',
        target: 'ticket',
        name: '시네마 나이트',
        desc: '밤공기처럼 쿨한 극장 무드',
        emoji: '🌙',
        tier: 'RARE',
        price: 12,
        className: 'skin-ticket-cinema-night',
    },
    {
        id: 'ticket_popcorn_party',
        target: 'ticket',
        name: '팝콘 파티',
        desc: '팝콘 튀는 축제 분위기',
        emoji: '🍿',
        tier: 'EPIC',
        price: 22,
        className: 'skin-ticket-popcorn-party',
    },

    // 🎨 본 영화 테마 스킨
    {
        id: 'watched_polaroid',
        target: 'watched',
        name: '폴라로이드',
        desc: '한 장의 기록처럼 남기는 감성',
        emoji: '📸',
        tier: 'COMMON',
        price: 8,
        className: 'skin-watched-polaroid',
    },
    {
        id: 'watched_museum',
        target: 'watched',
        name: '뮤지엄',
        desc: '전시처럼 차분한 레이아웃',
        emoji: '🖼️',
        tier: 'RARE',
        price: 16,
        className: 'skin-watched-museum',
    },
    {
        id: 'watched_neon',
        target: 'watched',
        name: '네온 무드',
        desc: '심야 상영 네온 사인 느낌',
        emoji: '✨',
        tier: 'EPIC',
        price: 28,
        className: 'skin-watched-neon',
    },
];

export function getSkinDefById(id: string): SkinDef | null {
    const found = SKIN_DEFS.find((x) => x.id === id);
    return found ?? null;
}

export function getSkinsByTarget(target: SkinTarget): SkinDef[] {
    return SKIN_DEFS.filter((x) => x.target === target);
}

export function getSkinsByTargetSorted(target: SkinTarget): SkinDef[] {
    const list = getSkinsByTarget(target).slice();
    list.sort((a, b) => {
        const tierA = SKIN_TIER_ORDER.indexOf(a.tier);
        const tierB = SKIN_TIER_ORDER.indexOf(b.tier);
        if (tierA !== tierB) return tierA - tierB; // COMMON -> LEGENDARY
        return a.price - b.price; // 같은 티어면 저렴한 순
    });
    return list;
}

export function isValidSkinTarget(v: any): v is SkinTarget {
    return v === 'ticket' || v === 'watched';
}
