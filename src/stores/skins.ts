// 스킨 카탈로그(정적 정의)

import type { SkinDef, SkinTarget, SkinTier } from '@/types/skin';

export const SKIN_TARGETS: SkinTarget[] = ['ticket', 'watched'];

export const SKIN_TIER_ORDER: SkinTier[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

export const SKIN_DEFS: SkinDef[] = [
    {
        id: 'ticket_devil',
        target: 'ticket',
        name: '데빌 티켓',
        desc: '장난기 가득한 악마 낙서와 무채색 무드가 섞인 키치한 티켓',
        emoji: '😈',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_devil.png',
    },
    {
        id: 'ticket_flower',
        target: 'ticket',
        name: '블루 플라워 티켓',
        desc: '하늘빛 꽃 패턴이 촘촘히 깔린 시원하고 말랑한 분위기의 티켓',
        emoji: '🌸',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_flower.png',
    },
    {
        id: 'ticket_fish',
        target: 'ticket',
        name: '피쉬 드림 티켓',
        desc: '작은 물고기와 물결 무늬가 흩어진, 가볍고 몽글한 바다 감성 티켓',
        emoji: '🐟',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_fish.png',
    },
    {
        id: 'ticket_valentine',
        target: 'ticket',
        name: '발렌타인 티켓',
        desc: '따뜻한 베이지 톤 위에 하트가 흩뿌려진 사랑스러운 무드의 티켓',
        emoji: '💝',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_valentine.png',
    },
    {
        id: 'ticket_black',
        target: 'ticket',
        name: '블랙 하트 티켓',
        desc: '차분한 그레이 톤에 작은 하트 패턴이 더해진 깔끔하고 시크한 티켓',
        emoji: '🤍',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_black.png',
    },
    {
        id: 'ticket_greenCalm',
        target: 'ticket',
        name: '그린 캄 티켓',
        desc: '연두빛 바탕과 낙서 같은 작은 포인트가 어우러진 편안한 감성 티켓',
        emoji: '🌿',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_greenCalm.png',
    },
    {
        id: 'ticket_happyFish',
        target: 'ticket',
        name: '해피 피쉬 티켓',
        desc: '복실한 도트 감성과 귀여운 물고기 캐릭터가 살아 있는 발랄한 티켓',
        emoji: '🐠',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_happyFish.png',
    },
    {
        id: 'ticket_redLeaf',
        target: 'ticket',
        name: '레드 리프 티켓',
        desc: '붉은 잎사귀 질감이 번진 듯 깔린, 빈티지하고 묵직한 무드의 티켓',
        emoji: '🍁',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_redLeaf.png',
    },
    {
        id: 'ticket_yellow',
        target: 'ticket',
        name: '옐로 드로잉 티켓',
        desc: '노란 종이 위에 손그림 낙서가 얹힌, 장난스럽고 귀여운 티켓',
        emoji: '💛',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_yellow.png',
    },
    {
        id: 'ticket_skyRibbon',
        target: 'ticket',
        name: '스카이 리본 티켓',
        desc: '연하늘 바탕에 리본과 작은 캐릭터 낙서가 들어간 산뜻한 티켓',
        emoji: '🎀',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_skyRibbon.png',
    },
    {
        id: 'ticket_purpleCity',
        target: 'ticket',
        name: '퍼플 시티 티켓',
        desc: '도시의 불빛과 몽환적인 보랏빛 분위기를 담은 감성적인 티켓',
        emoji: '🌆',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_purpleCity.png',
    },
    {
        id: 'ticket_mintBird',
        target: 'ticket',
        name: '민트 버드 티켓',
        desc: '민트 컬러 바탕에 작은 새 드로잉이 들어간 담백하고 포근한 티켓',
        emoji: '🐦',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_mintBird.png',
    },
    {
        id: 'ticket_pinkCake',
        target: 'ticket',
        name: '핑크 케이크 티켓',
        desc: '케이크 일러스트와 하트 패턴이 어우러진 달콤하고 러블리한 티켓',
        emoji: '🍰',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_pinkCake.png',
    },
    {
        id: 'ticket_spring',
        target: 'ticket',
        name: '스프링 블라썸 티켓',
        desc: '핑크 체크 바탕에 작은 꽃무늬가 흩어진, 봄빛처럼 화사하고 달콤한 티켓',
        emoji: '🌸',
        tier: 'COMMON',
        price: 50,
        imageUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/ticket_spring.png',
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
