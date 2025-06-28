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
import CarouselCardSkeleton from "./CarouselSkeleton";
export default function TrendingCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
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
  const fetchLogo = async (media_type ,id) => {
    try {
      const imagesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${media_type}/${id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API}&include_image_language=en,null`
      );
      const logo = imagesResponse.data.logos.filter(
        (el) => el.iso_639_1 === "en"
      )[0]?.file_path;
      return logo ? `${process.env.NEXT_PUBLIC_BACKDROP_URL}${logo}` : null;
    } catch (error) {
      console.error(`Error fetching logo for movie ${id}:`, error);
      return null;
    }
  };

  // Fetch logos when trending movies are loaded
  // Fetch logos when trending movies are loaded
React.useEffect(() => {
  if (status === "succeeded" && trending.length > 0) {
    const loadLogos = async () => {
      const logoPromises = trending.map(async (movie) => {
        const mediaType = movie.media_type || "movie";
        return {
          id: movie.id,
          media_type: mediaType,
          logo: await fetchLogo(mediaType, movie.id),
        };
      });
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


  if (!trending.length) {
    return <CarouselCardSkeleton />;
  }

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
