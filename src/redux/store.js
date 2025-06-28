import { configureStore } from "@reduxjs/toolkit";
import trendingReducer from "./trendingSlice";
import DetailsReducer from './DetailsSlice'
import SearchReduer from './searchSlice'
import topRatedSliceTvShows from './topTvSlice'
import topRatedMoviesReducer from './topRatedSlice'
import TvDetailsReducer from './tvDetailsSlice'
import topRatedAnimationsReducer from './topAnimationsReducer'

export const store = configureStore({
    reducer : {
        trending : trendingReducer,
        details : DetailsReducer,
        tvdetails : TvDetailsReducer,
        search : SearchReduer,
        topmovies : topRatedMoviesReducer,
        toptvshows : topRatedSliceTvShows,
        topAnimations : topRatedAnimationsReducer

    }
})