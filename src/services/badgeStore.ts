// localforage 기반 뱃지 획득 기록 저장소 + 해금 체크 로직

import localforage from 'localforage';
import { BADGE_DEFS, getBadgeDefById, sortUnlockedBadges } from '@/stores/badges';
import type { BadgeUnlockedMap, UnlockedBadge } from '@/types/badge';

const STORE_NAME = 'movie_review_app';
const BADGE_KEY = 'badges_v1';

localforage.config({
    name: STORE_NAME,
});

function todayYmd(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

async function getUnlockedMap(): Promise<BadgeUnlockedMap> {
    const raw = await localforage.getItem<BadgeUnlockedMap>(BADGE_KEY);
    if (!raw || typeof raw !== 'object') return {};
    return raw;
}

async function setUnlockedMap(map: BadgeUnlockedMap): Promise<void> {
    await localforage.setItem(BADGE_KEY, map);
}

function toUnlockedBadgeList(map: BadgeUnlockedMap): UnlockedBadge[] {
    const list: UnlockedBadge[] = [];

    for (const [id, rec] of Object.entries(map)) {
        const def = getBadgeDefById(id);
        if (!def) continue;

        list.push({
            id: def.id,
            name: def.name,
            desc: def.desc,
            emoji: def.emoji,
            threshold: def.threshold,
            unlockedAt: String(rec?.unlockedAt ?? ''),
        });
    }

    return list.sort(sortUnlockedBadges);
}

/**
 * 획득한 뱃지 목록 로드
 */
export async function loadUnlockedBadges(): Promise<UnlockedBadge[]> {
    const map = await getUnlockedMap();
    return toUnlockedBadgeList(map);
}

/**
 * watchedCount 기준으로 "새로 해금할 뱃지"가 있으면 unlockedAt 기록(영구 유지)
 * - 이미 기록된 뱃지는 다시 계산/삭제/감소와 무관하게 유지
 * - 반환: 최신 획득 뱃지 리스트 + 이번 호출에서 새로 획득한 뱃지들
 */
export async function checkAndUnlockBadges(watchedCount: number): Promise<{
    badges: UnlockedBadge[];
    newlyUnlocked: UnlockedBadge[];
}> {
    const count = Number(watchedCount);
    const safeCount = Number.isFinite(count) ? count : 0;

    const map = await getUnlockedMap();
    const newlyUnlockedIds: string[] = [];
    const today = todayYmd();

    for (const def of BADGE_DEFS) {
        const already = map[def.id]?.unlockedAt;
        if (already) continue; // 이미 획득 기록 있으면 스킵(영구 보유)

        if (safeCount >= def.threshold) {
            map[def.id] = { unlockedAt: today };
            newlyUnlockedIds.push(def.id);
        }
    }

    if (newlyUnlockedIds.length > 0) {
        await setUnlockedMap(map);
    }

    const badges = toUnlockedBadgeList(map);
    const newlyUnlocked = badges.filter((b) => newlyUnlockedIds.includes(b.id));

    return { badges, newlyUnlocked };
}

/**
 * 개발/테스트용: 뱃지 기록 초기화
 */
export async function clearAllBadges(): Promise<void> {
    await localforage.removeItem(BADGE_KEY);
}
