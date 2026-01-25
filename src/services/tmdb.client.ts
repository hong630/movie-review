// src/services/tmdb.client.ts

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

type TmdbClientOptions = {
    language?: string;
};

function getAuthHeaders(): Record<string, string> {
    const token = String(import.meta.env.VITE_TMDB_TOKEN || '').trim();
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        };
    }

    const key = String(import.meta.env.VITE_TMDB_API_KEY || '').trim();
    if (key) {
        // api_key 방식은 쿼리로 넣을 거라 헤더엔 Accept만
        return { Accept: 'application/json' };
    }

    throw new Error('VITE_TMDB_TOKEN 또는 VITE_TMDB_API_KEY 둘 중 하나는 있어야 해!');
}

function getApiKeyMaybe(): string {
    return String(import.meta.env.VITE_TMDB_API_KEY || '').trim();
}

function toQueryString(params: Record<string, any>): string {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return;
        sp.set(k, String(v));
    });
    const qs = sp.toString();
    return qs ? `?${qs}` : '';
}

async function readErrorBody(res: Response): Promise<string> {
    try {
        const text = await res.text();
        return text || `${res.status} ${res.statusText}`;
    } catch {
        return `${res.status} ${res.statusText}`;
    }
}

export async function tmdbGet<T>(
    path: string,
    params: Record<string, any> = {},
    opts: TmdbClientOptions = {}
): Promise<T> {
    const headers = getAuthHeaders();
    const language = opts.language || 'ko-KR';

    const apiKey = getApiKeyMaybe();
    const url =
        `${TMDB_BASE_URL}${path}` +
        toQueryString({
            language,
            ...params,
            ...(apiKey ? { api_key: apiKey } : {}), // 토큰 있으면 없어도 됨
        });

    const res = await fetch(url, {
        method: 'GET',
        headers,
    });

    if (!res.ok) {
        const body = await readErrorBody(res);
        throw new Error(`TMDB 요청 실패: ${res.status} ${res.statusText} - ${body}`);
    }

    return (await res.json()) as T;
}
