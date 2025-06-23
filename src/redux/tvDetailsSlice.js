import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchDetailsTv = createAsyncThunk('fetch/detailsTv', async (movieId) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tv/${movieId}?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_API}`);
    return response.data;
})

const TvDetailsSlice = createSlice({
    name : 'moviedetails',
    initialState : {
        tvDetails : null,
        statusTv : 'idle',
        error : null
    },
    reducers: {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchDetailsTv.pending , (state) => {
            state.statusTv = 'pending';
        })
        .addCase(fetchDetailsTv.fulfilled , (state , action) => {
            state.tvDetails = action.payload
            state.statusTv = 'succeeded'
        })
        .addCase(fetchDetailsTv.rejected, (state, action) => {
            state.statusTv = 'failed';
            state.error = action.error.message;
        })

    }
})

export default TvDetailsSlice.reducer