"use client"
import GradientText from "@/components/effects/gradientText";
import RotatingText from "@/components/effects/RotateText";
import MovieCardSkeleton from "@/components/Main/carousel/cardSkeleton";
import CardSkeleton from "@/components/Main/carousel/cardSkeleton";
import MovieCarousel from "@/components/Main/carousel/Carousel";
import TrendingCarousel from "@/components/Main/trending/Carousel";
import { fetchTopRatedAnimations } from "@/redux/topAnimationsReducer";
import { fetchTopRatedMovies } from "@/redux/topRatedSlice";
import { fetchTopRatedTvShows } from "@/redux/topTvSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const {movies } = useSelector(state => state.topmovies)
  const {tvShows } = useSelector(state => state.toptvshows)
  const {animationMovies } = useSelector(state => state.topAnimations)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopRatedMovies())
    dispatch(fetchTopRatedTvShows())
    dispatch(fetchTopRatedAnimations())

  }, [dispatch])

  return (
    <div className="max-md:pb-16">
      <div>
      <TrendingCarousel />
        <div className="p-4">
         
        <MovieCarousel items={movies} title="Top rated movies"/>
        {/* <script async="async" data-cfasync="false" src="//pl27003266.profitableratecpm.com/3212e516f6d6fe8f8af9c77aeb4506d0/invoke.js"></script>
<div id="container-3212e516f6d6fe8f8af9c77aeb4506d0"></div> */}
        <MovieCarousel items={tvShows} title="Top rated tv shows"  tv={true}/>
        <MovieCarousel items={animationMovies} title="Top rated animation movies" />
       
        </div>
      </div>
    </div>
  );
};

export default Page;
