import { configureStore } from "@reduxjs/toolkit";
import trendingReducer from "./trendingSlice";
import DetailsReducer from './DetailsSlice'
import SearchReduer from './searchSlice'
export const store = configureStore({
    reducer : {
        trending : trendingReducer,
        details : DetailsReducer,
        search : SearchReduer,
    }
})