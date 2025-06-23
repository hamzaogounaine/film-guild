import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching top rated tvShows
export const fetchTopRatedTvShows = createAsyncThunk(
    'topRated/fetchTopRatedTvShows',
    async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`
        );
        const data = await response.json();
        return data;
    }
);

const topRatedSliceTvShows = createSlice({
    name: 'topRated',
    initialState: {
        tvShows: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTopRated: (state) => {
            state.tvShows = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopRatedTvShows.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopRatedTvShows.fulfilled, (state, action) => {
                state.loading = false;
                state.tvShows = action.payload.results;
            })
            .addCase(fetchTopRatedTvShows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearTopRated } = topRatedSliceTvShows.actions;
export default topRatedSliceTvShows.reducer;
