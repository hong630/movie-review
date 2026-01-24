const BASE = import.meta.env.VITE_TMDB_BASE as string;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;

function buildUrl(path: string, params: Record<string, string> = {}) {
    const url = new URL(BASE + path);
    url.searchParams.set('language', 'ko-KR'); // 한국어
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
}

export async function tmdbGet(path: string, params: Record<string, string> = {}) {
    const res = await fetch(buildUrl(path, params), {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json;charset=utf-8',
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`TMDB ${res.status}: ${text}`);
    }
    return res.json();
}

export async function searchMovies(query: string, page = 1) {
    return tmdbGet('/search/movie', { query, page: String(page), include_adult: 'false' });
}

export async function trendingMovies(page = 1) {
    return tmdbGet('/trending/movie/week', { page: String(page) });
}
