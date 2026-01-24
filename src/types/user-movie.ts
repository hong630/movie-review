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
