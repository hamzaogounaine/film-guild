"use client"
import GradientText from "@/components/effects/gradientText";
import RotatingText from "@/components/effects/RotateText";
import EmblaCarousel from "@/components/Main/carousel/EmblaCarousel";
import TrendingCarousel from "@/components/Main/trending/Carousel";
import { fetchTopRatedMovies } from "@/redux/topRatedSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const {movies } = useSelector(state => state.topmovies)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopRatedMovies())
  }, [dispatch])

  return (
    <div>
      <div>
      <TrendingCarousel />
        <div className="p-4 pb-16">
          <div className="flex gap-2 text-[2rem] items-center mt-4 mb-4">
            Top content on
            <RotatingText
              texts={["Netflix", "HBO", "Amazon Prime", "Apple watch"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-red-500 text-white text-md overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            />
          </div>
        </div>
        <EmblaCarousel content={movies} options={{align: 'start'}}/>
      </div>
    </div>
  );
};

export default Page;
