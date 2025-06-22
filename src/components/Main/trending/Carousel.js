"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CarouselCard from "./CarouselCard";
import { fetchTrending } from "@/redux/trendingSlice";
export default function TrendingCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const dispatch = useDispatch();
  const { trending, status } = useSelector((state) => state.trending);

  // Fetch trending movies on component mount
  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTrending());
    }
  }, [dispatch, status]);
  const [logos, setLogos] = React.useState({});

  // Function to fetch logo for a movie
  const fetchLogo = async (id) => {
    try {
      const imagesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API}&include_image_language=en,null`
      );
      const logo = imagesResponse.data.logos.filter((el) => el.iso_639_1 === "en")[0]?.file_path;
      return logo ? `${process.env.NEXT_PUBLIC_BACKDROP_URL}${logo}` : null;
    } catch (error) {
      console.error(`Error fetching logo for movie ${id}:`, error);
      return null;
    }
  };

  // Fetch logos when trending movies are loaded
  React.useEffect(() => {
    if (status === "succeeded" && trending.length > 0) {
      const loadLogos = async () => {
        const logoPromises = trending.map(async (movie) => ({
          id: movie.id,
          logo: await fetchLogo(movie.id),
        }));
        const logoResults = await Promise.all(logoPromises);
        const logosMap = logoResults.reduce((acc, { id, logo }) => {
          acc[id] = logo;
          return acc;
        }, {});
        setLogos(logosMap);
      };
      loadLogos();
    }
  }, [status, trending]);

  return (
    <Carousel plugins={[plugin.current]} className="w-full">
      <CarouselContent>
        {trending.map((movie) => (
          <CarouselItem key={movie.id}>
            <CarouselCard movie={movie} logoUrl={logos[movie.id]} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}