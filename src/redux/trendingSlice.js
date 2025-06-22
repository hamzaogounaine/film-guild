import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTrending = createAsyncThunk('trending/fetchTrending', async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`);
    // const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=dd725b5608d426a3acd5a0b97d09f4ba`);
    console.log('ftehced', response.data)
    return response.data.results;
});


const trendingSlice = createSlice({
    name : 'trending',
    initialState: {
        trending: [],
        status : 'idle',
        error: null,
        logos : []
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrending.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTrending.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.trending = action.payload;
            })
            .addCase(fetchTrending.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            
    }
})

export default trendingSlice.reducer;