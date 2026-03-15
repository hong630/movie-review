import localforage from 'localforage';
import type { SkinDef, SkinTarget } from '@/types/skin';
import { getSkinDefById, getSkinsByTargetSorted } from '@/stores/skins';

const STORE_NAME = 'movie_review_app';
const POINT_KEY = 'movie_review_points_v1';
const OWNED_SKIN_IDS_KEY = 'movie_review_owned_skin_ids_v1';
const APPLIED_SKIN_BY_TARGET_KEY = 'movie_review_applied_skin_by_target_v1';

type AppliedSkinMap = Partial<Record<SkinTarget, string | null>>;

localforage.config({
    name: STORE_NAME,
});

function toSafeNumber(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function toSafeStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map(function (x) {
            return String(x);
        })
        .filter(function (x) {
            return !!x;
        });
}

function toSafeAppliedSkinMap(value: unknown): AppliedSkinMap {
    if (!value || typeof value !== 'object') {
        return {};
    }

    const raw = value as Record<string, unknown>;
    const next: AppliedSkinMap = {};

    if (typeof raw.ticket === 'string' || raw.ticket === null) {
        next.ticket = raw.ticket;
    }

    if (typeof raw.watched === 'string' || raw.watched === null) {
        next.watched = raw.watched;
    }

    return next;
}

function ensureSkinMatchesTarget(skin: SkinDef | null, target: SkinTarget): SkinDef | null {
    if (!skin) return null;
    if (skin.target !== target) return null;
    return skin;
}

export async function getPoints(): Promise<number> {
    const raw = await localforage.getItem<unknown>(POINT_KEY);
    return toSafeNumber(raw);
}

export async function getOwnedSkinIds(): Promise<string[]> {
    const raw = await localforage.getItem<unknown>(OWNED_SKIN_IDS_KEY);
    return toSafeStringArray(raw);
}

export async function getOwnedSkinIdSet(): Promise<Set<string>> {
    const ids = await getOwnedSkinIds();
    return new Set(ids);
}

export async function isOwnedSkin(id: string): Promise<boolean> {
    const ownedSet = await getOwnedSkinIdSet();
    return ownedSet.has(id);
}

export async function addOwnedSkin(id: string): Promise<string[]> {
    const ownedSet = await getOwnedSkinIdSet();
    ownedSet.add(id);

    const next = Array.from(ownedSet);
    await localforage.setItem(OWNED_SKIN_IDS_KEY, next);
    return next;
}

export async function getAppliedSkinByTargetMap(): Promise<AppliedSkinMap> {
    const raw = await localforage.getItem<unknown>(APPLIED_SKIN_BY_TARGET_KEY);
    return toSafeAppliedSkinMap(raw);
}

export async function setAppliedSkinByTargetMap(nextMap: AppliedSkinMap): Promise<AppliedSkinMap> {
    const safe = toSafeAppliedSkinMap(nextMap);
    await localforage.setItem(APPLIED_SKIN_BY_TARGET_KEY, safe);
    return safe;
}

export async function getAppliedSkinIdByTarget(target: SkinTarget): Promise<string | null> {
    const map = await getAppliedSkinByTargetMap();
    const id = map[target];
    return typeof id === 'string' ? id : null;
}

export async function applySkin(target: SkinTarget, skinId: string | null): Promise<string | null> {
    if (skinId !== null) {
        const skin = ensureSkinMatchesTarget(getSkinDefById(skinId), target);
        if (!skin) {
            throw new Error('존재하지 않거나 target이 맞지 않는 스킨이야.');
        }

        const owned = await isOwnedSkin(skinId);
        if (!owned) {
            throw new Error('보유하지 않은 스킨은 적용할 수 없어.');
        }
    }

    const current = await getAppliedSkinByTargetMap();
    const next: AppliedSkinMap = {
        ...current,
        [target]: skinId,
    };

    await setAppliedSkinByTargetMap(next);
    return skinId;
}

export async function resetAppliedSkin(target: SkinTarget): Promise<void> {
    await applySkin(target, null);
}

export async function getAppliedSkinByTarget(target: SkinTarget): Promise<SkinDef | null> {
    const skinId = await getAppliedSkinIdByTarget(target);
    if (!skinId) return null;

    const skin = getSkinDefById(skinId);
    return ensureSkinMatchesTarget(skin, target);
}

export async function getOwnedSkinsByTarget(target: SkinTarget): Promise<SkinDef[]> {
    const ownedIds = await getOwnedSkinIds();
    const ownedIdSet = new Set(ownedIds);

    return getSkinsByTargetSorted(target).filter(function (skin) {
        return ownedIdSet.has(skin.id);
    });
}

export async function getShopSkinsByTarget(target: SkinTarget): Promise<Array<SkinDef & { owned: boolean }>> {
    const ownedIds = await getOwnedSkinIds();
    const ownedIdSet = new Set(ownedIds);

    return getSkinsByTargetSorted(target).map(function (skin) {
        return {
            ...skin,
            owned: ownedIdSet.has(skin.id),
        };
    });
}

export async function purchaseSkin(skinId: string): Promise<{
    skin: SkinDef;
    points: number;
    ownedSkinIds: string[];
    alreadyOwned: boolean;
}> {
    const skin = getSkinDefById(skinId);

    if (!skin) {
        throw new Error('스킨 정보를 찾을 수 없어.');
    }

    const ownedSet = await getOwnedSkinIdSet();
    if (ownedSet.has(skinId)) {
        return {
            skin,
            points: await getPoints(),
            ownedSkinIds: Array.from(ownedSet),
            alreadyOwned: true,
        };
    }

    const currentPoints = await getPoints();
    if (currentPoints < skin.price) {
        throw new Error('포인트가 부족해.');
    }

    const nextPoints = currentPoints - skin.price;
    ownedSet.add(skinId);

    const ownedSkinIds = Array.from(ownedSet);

    await localforage.setItem(POINT_KEY, nextPoints);
    await localforage.setItem(OWNED_SKIN_IDS_KEY, ownedSkinIds);

    return {
        skin,
        points: nextPoints,
        ownedSkinIds,
        alreadyOwned: false,
    };
}

export async function purchaseAndApplySkin(target: SkinTarget, skinId: string): Promise<{
    skin: SkinDef;
    points: number;
    ownedSkinIds: string[];
}> {
    const result = await purchaseSkin(skinId);
    await applySkin(target, skinId);

    return {
        skin: result.skin,
        points: result.points,
        ownedSkinIds: result.ownedSkinIds,
    };
}

export async function getTicketSkinImageUrl(defaultImageUrl: string): Promise<string> {
    const applied = await getAppliedSkinByTarget('ticket');
    if (!applied) return defaultImageUrl;
    return applied.imageUrl || defaultImageUrl;
}