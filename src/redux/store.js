import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import trendingReducer from "./trendingSlice";
import DetailsReducer from './DetailsSlice'
import SearchReduer from './searchSlice'
export const store = configureStore({
    reducer : {
        theme : themeReducer,
        trending : trendingReducer,
        details : DetailsReducer,
        search : SearchReduer,
    }
})