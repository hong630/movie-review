// 뱃지 타입 모음

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type BadgeDef = {
    id: string;
    name: string;
    desc: string;
    emoji: string;
    threshold: number; // WATCHED 누적 편수 기준
    tier: BadgeTier;
};

export type BadgeUnlockedRecord = {
    unlockedAt: string; // YYYY-MM-DD
};

export type BadgeUnlockedMap = Record<string, BadgeUnlockedRecord>;

export type UnlockedBadge = {
    id: string;
    name: string;
    desc: string;
    emoji: string;
    threshold: number;
    unlockedAt: string; // YYYY-MM-DD
};
