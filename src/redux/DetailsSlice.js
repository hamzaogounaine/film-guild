import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchDetails = createAsyncThunk('fetch/detailsMovie', async (movieId) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/movie/${movieId}?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_API}`);
    return response.data;
})

const DetailsSlice = createSlice({
    name : 'moviedetails',
    initialState : {
        movieDetails : null,
        statusMovie : 'idle',
        error : null
    },
    reducers: {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchDetails.pending , (state) => {
            state.statusMovie = 'pending';
        })
        .addCase(fetchDetails.fulfilled , (state , action) => {
            state.movieDetails = action.payload
            state.statusMovie = 'succeeded'
        })
        .addCase(fetchDetails.rejected, (state, action) => {
            state.statusMovie = 'failed';
            state.error = action.error.message;
        })

    }
})

export default DetailsSlice.reducer