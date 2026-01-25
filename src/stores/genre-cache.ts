// src/stores/genre-cache.ts
import localforage from 'localforage';
import { tmdbGet } from '@/services/tmdb.client';

const STORE_NAME = 'movie_review_app';
const KEY = 'tmdb_genre_map_ko_v1';

localforage.config({
    name: STORE_NAME,
});

type TmdbGenre = {
    id: number;
    name: string;
};

type GenreMap = Record<number, string>;

function normalizeGenreMap(list: TmdbGenre[]): GenreMap {
    const map: GenreMap = {};
    list.forEach((g) => {
        map[g.id] = g.name;
    });
    return map;
}

/**
 * localforage에 장르맵이 있으면 그대로 반환
 * 없으면 TMDB에서 받아서 저장 후 반환
 */
export async function getGenreMap(): Promise<GenreMap> {
    const cached = await localforage.getItem<GenreMap>(KEY);
    if (cached && Object.keys(cached).length > 0) {
        return cached;
    }

    const res = await tmdbGet<{ genres: TmdbGenre[] }>(
        '/genre/movie/list',
        {},
        { language: 'ko-KR' }
    );

    const map = normalizeGenreMap(res.genres || []);
    await localforage.setItem(KEY, map);
    return map;
}

/**
 * 강제로 다시 받아오고 싶을 때
 */
export async function refreshGenreMap(): Promise<GenreMap> {
    await localforage.removeItem(KEY);
    return getGenreMap();
}

/**
 * id → name 헬퍼
 */
export function genreNameById(map: GenreMap, id: number): string {
    return map[id] || '기타';
}
