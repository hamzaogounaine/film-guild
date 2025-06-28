import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching top rated movies
export const fetchTopRatedAnimations = createAsyncThunk(
    'topRated/fetchTopRatedAnimations',
    async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API}&with_genres=16&sort_by=vote_average.desc&vote_count.gte=1000`
        );
        const data = await response.json();
        console.log('first' , data)
        return data;
    }
);

const topRatedAnimationsSlice = createSlice({
    name: 'topRated',
    initialState: {
        animationMovies: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTopRated: (state) => {
            state.animationMovies = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopRatedAnimations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopRatedAnimations.fulfilled, (state, action) => {
                state.loading = false;
                state.animationMovies = action.payload.results;
            })
            .addCase(fetchTopRatedAnimations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearTopRated } = topRatedAnimationsSlice.actions;
export default topRatedAnimationsSlice.reducer;
