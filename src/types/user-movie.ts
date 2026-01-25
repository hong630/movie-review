export type UserMovieStatus = 'WATCHLIST' | 'WATCHED';

export type UserMovie = {
    movieId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    genres?: number[];

    status: UserMovieStatus;

    addedAt: string;
    watchedAt: string | null;

    rating: number | null;
    review: string;
    tags: string[];
    rewatchCount: number;
};

// 버튼 클릭 결과(추가/삭제/이동) 구분용
export type UserMovieToggleAction =
    | 'ADDED_TO_WATCHLIST'
    | 'REMOVED_FROM_WATCHLIST'
    | 'MOVED_TO_WATCHED'
    | 'ADDED_TO_WATCHED'
    | 'REMOVED_FROM_WATCHED'
    | 'MOVED_TO_WATCHLIST';

export type UserMovieToggleResult = {
    action: UserMovieToggleAction;
    movie: UserMovie | null; // 삭제면 null
};