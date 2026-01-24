import localforage from 'localforage';
import type {UserMovie, UserMovieStatus} from '@/types/user-movie';

const STORE_NAME = 'movie_review_app';
const KEY = 'user_movies_v1';

localforage.config({
    name: STORE_NAME,
});

export async function getAllUserMovies(): Promise<UserMovie[]> {
    const list = (await localforage.getItem<UserMovie[]>(KEY)) ?? [];
    return list;
}


export async function setAllUserMovies(list: UserMovie[]): Promise<void> {
    await localforage.setItem(KEY, list);
}

export async function upsertUserMovie(next: UserMovie) {
    const list = await getAllUserMovies();
    const idx = list.findIndex((x) => x.movieId === next.movieId);

    if (idx >= 0) {
        list[idx] = {...list[idx], ...next};
    } else {
        list.push(next);
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
        genres: input.genres || [],

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
        genres: input.genres || existing?.genres || [],

        status: 'WATCHED',
        addedAt: existing?.addedAt || now,
        watchedAt: now,

        rating: existing?.rating ?? null,
        review: existing?.review ?? '',
        tags: existing?.tags ?? [],
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
