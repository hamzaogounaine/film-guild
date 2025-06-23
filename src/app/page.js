"use client"
import GradientText from "@/components/effects/gradientText";
import RotatingText from "@/components/effects/RotateText";
import MovieCardSkeleton from "@/components/Main/carousel/cardSkeleton";
import CardSkeleton from "@/components/Main/carousel/cardSkeleton";
import MovieCarousel from "@/components/Main/carousel/Carousel";
import TrendingCarousel from "@/components/Main/trending/Carousel";
import { fetchTopRatedMovies } from "@/redux/topRatedSlice";
import { fetchTopRatedTvShows } from "@/redux/topTvSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const {movies } = useSelector(state => state.topmovies)
  const {tvShows } = useSelector(state => state.toptvshows)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopRatedMovies())
    dispatch(fetchTopRatedTvShows())
    

  }, [dispatch])

  return (
    <div className="max-md:pb-16">
      <div>
      <TrendingCarousel />
        <div className="p-4">
          {/* <div className="flex gap-2 text-[2rem] items-center mt-4 mb-4">
            Top content on
            <RotatingText
              texts={["Netflix", "HBO", "Amazon Prime", "Apple watch"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-red-500 text-white md:text-md text-sm overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            />
          </div> */}
        <MovieCarousel items={movies} title="Top rated movies"/>
        <MovieCarousel items={tvShows} title="Top rated tv shows"  tv={true}/>
       
        </div>
      </div>
    </div>
  );
};

export default Page;
