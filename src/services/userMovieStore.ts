import {toRaw} from 'vue';
import localforage from 'localforage';
import type {UserMovie, UserMovieStatus} from '@/types/user-movie';

const STORE_NAME = 'movie_review_app';
const KEY = 'user_movies_v1';

localforage.config({
    name: STORE_NAME,
});

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
}) {
    const existing = await getUserMovie(input.movieId);
    if (!existing) return null;

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
    const now = new Date().toISOString();

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
    const now = new Date().toISOString();

    const list = await getAllUserMovies();
    const existing = list.find((x) => x.movieId === input.movieId);

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

    return upsertUserMovie(next);
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
    const now = new Date().toISOString();

    list[idx] = {
        ...target,
        status: 'WATCHED',
        watchedAt: now,
    };

    await setAllUserMovies(list);
}
