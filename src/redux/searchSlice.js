import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSearch = createAsyncThunk("fetch/search", async (query) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/search/multi?query=${query}&api_key=${process.env.NEXT_PUBLIC_TMDB_API}&sort_by=popularity.desc&include_adult=false&language=en-US&page=1`
  );
  
  // Sort results by popularity in descending order
  const sortedResults = response.data.results.sort((a, b) => b.popularity - a.popularity);
  return sortedResults;
  return response.data.results;
});

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    status: "idle",
    error: null,
  },
  reducers: {
    reset : (state) => {
      state.results = [];
      state.status = 'idle'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default searchSlice.reducer;
export const {reset} = searchSlice.actions
