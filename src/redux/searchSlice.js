import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSearch = createAsyncThunk("fetch/search", async (query) => {
  const response = await axios.get(
    `${process.env.BASE_URL}/search/multi?query=${query}&api_key=${process.env.TMDB_API}&sort_by=popularity.desc&include_adult=false&language=en-US&page=1`
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.status = "loading";
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
