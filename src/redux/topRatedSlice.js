import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching top rated movies
export const fetchTopRatedMovies = createAsyncThunk(
    'topRated/fetchTopRatedMovies',
    async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`
        );
        const data = await response.json();
        return data;
    }
);

const topRatedSlice = createSlice({
    name: 'topRated',
    initialState: {
        movies: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTopRated: (state) => {
            state.movies = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopRatedMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload.results;
            })
            .addCase(fetchTopRatedMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearTopRated } = topRatedSlice.actions;
export default topRatedSlice.reducer;
