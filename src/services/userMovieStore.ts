import {toRaw} from 'vue';
import localforage from 'localforage';
import type {UserMovie, UserMovieStatus, UserMovieToggleResult} from '@/types/user-movie';
import {checkAndUnlockBadges} from '@/services/badgeStore';

const STORE_NAME = 'movie_review_app';
const KEY = 'user_movies_v1';
const POINT_KEY = 'movie_review_points_v1';

localforage.config({
    name: STORE_NAME,
});

function nowIso() {
    return new Date().toISOString();
}

async function getPoints(): Promise<number> {
    const raw = await localforage.getItem<any>(POINT_KEY);
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
}

async function addPoint(n: number): Promise<number> {
    const cur = await getPoints();
    const next = cur + n;
    await localforage.setItem(POINT_KEY, next);
    return next;
}

function toPlain<T>(value: T): T {
    const raw = toRaw(value as any);
    // 최신 브라우저면 structuredClone이 제일 안전
    if (typeof structuredClone === 'function') {
        return structuredClone(raw);
    }
    // fallback: JSON clone (우리 데이터는 숫자/문자/배열이라 문제 없음)
    return JSON.parse(JSON.stringify(raw));
}

function sanitizeUserMovie(input: UserMovie): UserMovie {
    const m = toPlain(input) as any;
    return {
        movieId: Number(m.movieId),
        title: String(m.title ?? ''),
        posterPath: m.posterPath ?? null,
        releaseDate: m.releaseDate ?? null,
        genres: Array.isArray(m.genres) ? m.genres.map((x: any) => Number(x)) : [],

        status: m.status,
        addedAt: String(m.addedAt ?? ''),
        watchedAt: m.watchedAt ?? null,

        rating: m.rating ?? null,
        review: String(m.review ?? ''),
        tags: Array.isArray(m.tags) ? m.tags.map((x: any) => String(x)) : [],
        rewatchCount: Number(m.rewatchCount ?? 0),
    } as UserMovie;
}

export async function getAllUserMovies(): Promise<UserMovie[]> {
    const list = (await localforage.getItem<UserMovie[]>(KEY)) ?? [];
    return Array.isArray(list) ? list.map(sanitizeUserMovie) : [];
}

export async function hasUserMovie(movieId: number): Promise<boolean> {
    const list = await getAllUserMovies();
    return list.some((x) => x.movieId === movieId);
}

export async function getUserMovieIdSet(): Promise<Set<number>> {
    const list = await getAllUserMovies();
    return new Set(list.map((x) => x.movieId));
}

export async function getUserMovieIdSetByStatus(status: UserMovieStatus): Promise<Set<number>> {
    const list = await getAllUserMovies();
    return new Set(
        list
            .filter((x) => x.status === status)
            .map((x) => x.movieId)
    );
}

export async function getUserMovieIdSets(): Promise<{
    watchlist: Set<number>;
    watched: Set<number>;
}> {
    const list = await getAllUserMovies();
    const watchlist = new Set<number>();
    const watched = new Set<number>();

    for (const m of list) {
        if (m.status === 'WATCHLIST') watchlist.add(m.movieId);
        if (m.status === 'WATCHED') watched.add(m.movieId);
    }

    return {watchlist, watched};
}

export async function setAllUserMovies(list: UserMovie[]): Promise<void> {
    const safe = Array.isArray(list) ? list.map(sanitizeUserMovie) : [];
    await localforage.setItem(KEY, safe);
}

export async function upsertUserMovie(next: UserMovie) {
    const list = await getAllUserMovies();
    const idx = list.findIndex((x) => x.movieId === next.movieId);
    const safeNext = sanitizeUserMovie(next);

    if (idx >= 0) {
        list[idx] = sanitizeUserMovie({...list[idx], ...safeNext});
    } else {
        list.push(safeNext);
    }

    await setAllUserMovies(list);
    return next;
}

export async function removeUserMovie(movieId: number) {
    const list = await getAllUserMovies();
    const next = list.filter((x) => x.movieId !== movieId);
    await setAllUserMovies(next);
}

export async function getUserMoviesByStatus(status: UserMovieStatus) {
    const list = await getAllUserMovies();
    return list
        .filter((x) => x.status === status)
        .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

export async function getUserMovie(movieId: number): Promise<UserMovie | null> {
    const list = await getAllUserMovies();
    return list.find((x) => x.movieId === movieId) ?? null;
}

export async function saveReview(input: {
    movieId: number;
    rating: number | null;
    review: string;
    tags?: string[];
    title?: string;
    posterPath?: string | null;
    releaseDate?: string | null;
    genres?: number[];
}) {
    const existing = await getUserMovie(input.movieId);
    // 볼 영화면 본 영화로 스왑(삭제+WATCHED 업서트)까지 처리
    if (existing?.status === 'WATCHLIST') {
        await removeUserMovie(input.movieId);
        const swapped = await markWatched({
            movieId: input.movieId,
            title: input.title ?? existing.title ?? '',
            posterPath: input.posterPath ?? existing.posterPath ?? null,
            releaseDate: input.releaseDate ?? existing.releaseDate ?? null,
            genres: Array.isArray(input.genres)
                ? [...input.genres]
                : (Array.isArray(existing.genres) ? [...existing.genres] : []),
        });
        const nextSwapped: UserMovie = {
            ...(swapped as UserMovie),
            rating: input.rating,
            review: input.review,
            tags: Array.isArray(input.tags) ? [...input.tags] : existing.tags,
        };
        return upsertUserMovie(nextSwapped);
    }
    if (!existing) {
        const created = await markWatched({
            movieId: input.movieId,
            title: input.title ?? '',
            posterPath: input.posterPath ?? null,
            releaseDate: input.releaseDate ?? null,
            genres: Array.isArray(input.genres) ? [...input.genres] : [],
        });

        // markWatched가 생성/업서트 해줬으니, 그 위에 리뷰/별점/태그를 한 번 더 업서트
        const nextCreated: UserMovie = {
            ...(created as UserMovie),
            rating: input.rating,
            review: input.review,
            tags: Array.isArray(input.tags) ? [...input.tags] : [],
        };
        return upsertUserMovie(nextCreated);
    }

    const next: UserMovie = {
        ...existing,
        rating: input.rating,
        review: input.review,
        tags: Array.isArray(input.tags) ? [...input.tags] : existing.tags,
    };
    return upsertUserMovie(next);
}


export async function addToWatchlist(input: {
    movieId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    genres?: number[];
}) {
    const now = nowIso();

    const next: UserMovie = {
        movieId: input.movieId,
        title: input.title,
        posterPath: input.posterPath,
        releaseDate: input.releaseDate,
        genres: Array.isArray(input.genres) ? [...input.genres] : [],

        status: 'WATCHLIST',
        addedAt: now,
        watchedAt: null,

        rating: null,
        review: '',
        tags: [],
        rewatchCount: 0,
    };

    return upsertUserMovie(next);
}

export async function markWatched(input: {
    movieId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    genres?: number[];
}) {
    const now = nowIso();

    const list = await getAllUserMovies();
    const existing = list.find((x) => x.movieId === input.movieId);
    const wasWatched = existing?.status === 'WATCHED';
    const prevWatchedCount = list.filter((m) => m.status === 'WATCHED').length;
    const nextWatchedCount = wasWatched ? prevWatchedCount : prevWatchedCount + 1;

    const next: UserMovie = {
        movieId: input.movieId,
        title: input.title,
        posterPath: input.posterPath,
        releaseDate: input.releaseDate,
        genres: Array.isArray(input.genres)
            ? [...input.genres]
            : (Array.isArray(existing?.genres) ? [...existing!.genres] : []),

        status: 'WATCHED',
        addedAt: existing?.addedAt || now,
        watchedAt: now,

        rating: existing?.rating ?? null,
        review: existing?.review ?? '',
        tags: Array.isArray(existing?.tags) ? [...existing!.tags] : [],
        rewatchCount: existing?.rewatchCount ?? 0,
    };

    const saved = await upsertUserMovie(next);
    // "처음" 본 영화로 등록되는 순간만 +50P
    if (!wasWatched) {
        await addPoint(50);
        await checkAndUnlockBadges(nextWatchedCount);
    }
    return saved;
}

export async function toggleWatchlist(input: {
    movieId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    genres?: number[];
}): Promise<UserMovieToggleResult> {
    const list = await getAllUserMovies();
    const existing = list.find((x) => x.movieId === input.movieId);

    // 이미 볼 영화면 -> 삭제
    if (existing?.status === 'WATCHLIST') {
        await removeUserMovie(input.movieId);
        return {action: 'REMOVED_FROM_WATCHLIST', movie: null};
    }

    // 본 영화였든/없었든 -> 볼 영화로 upsert(스왑 포함)
    const upserted = await addToWatchlist({
        movieId: input.movieId,
        title: input.title,
        posterPath: input.posterPath,
        releaseDate: input.releaseDate,
        genres: input.genres || [],
    });

    if (existing?.status === 'WATCHED') {
        return {action: 'MOVED_TO_WATCHLIST', movie: upserted};
    }
    return {action: 'ADDED_TO_WATCHLIST', movie: upserted};
}

export async function toggleWatched(input: {
    movieId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    genres?: number[];
}): Promise<UserMovieToggleResult> {
    const list = await getAllUserMovies();
    const existing = list.find((x) => x.movieId === input.movieId);

    // 이미 본 영화면 -> 삭제
    if (existing?.status === 'WATCHED') {
        await removeUserMovie(input.movieId);
        return {action: 'REMOVED_FROM_WATCHED', movie: null};
    }

    // 볼 영화였든/없었든 -> 본 영화로 upsert(스왑 포함)
    const upserted = await markWatched({
        movieId: input.movieId,
        title: input.title,
        posterPath: input.posterPath,
        releaseDate: input.releaseDate,
        genres: input.genres || [],
    });

    if (existing?.status === 'WATCHLIST') {
        return {action: 'MOVED_TO_WATCHED', movie: upserted};
    }
    return {action: 'ADDED_TO_WATCHED', movie: upserted};
}

export async function updateMemo(movieId: number, review: string): Promise<void> {
    const list = await getAllUserMovies();
    const idx = list.findIndex((x) => x.movieId === movieId);
    if (idx < 0) return;

    const target = list[idx];
    if (!target) return;

    list[idx] = {
        ...target,
        review,
    };

    await setAllUserMovies(list);
}


export async function moveToWatched(movieId: number): Promise<void> {
    const list = await getAllUserMovies();
    const idx = list.findIndex((x) => x.movieId === movieId);
    if (idx < 0) return;

    const target = list[idx];
    if (!target) return;
    const wasWatched = target.status === 'WATCHED';
    const now = nowIso();

    list[idx] = {
        ...target,
        status: 'WATCHED',
        watchedAt: now,
    };

    await setAllUserMovies(list);

    // 이 경로로 WATCHED가 되는 경우도 포인트/뱃지 반영(처음만)
    if (!wasWatched) {
        await addPoint(50);
        const watchedCount = list.filter((m) => m.status === 'WATCHED').length;
        await checkAndUnlockBadges(watchedCount);
    }
}
