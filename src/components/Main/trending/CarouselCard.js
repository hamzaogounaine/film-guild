import { Button } from "@/components/ui/button";
import { Info, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CarouselCard = ({ movie, logoUrl }) => {
  return (
    <div
      style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKDROP_URL}${movie.backdrop_path})` }}
      className="bg-cover bg-center max-md:items-end items-center rounded-lg shadow-lg flex text-white h-screen relative max-md:h-[calc(100vh-4rem)]"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg"></div>
      <div className="md:w-1/4 gap-3 flex flex-col max-md:ms-6 ms-32 justify-center relative z-10 max-md:mb-16 max-md:w-full max-md:gap-2">
        {logoUrl ? (
          <Image
            width={200}
            height={100}
            src={logoUrl}
            alt={`${movie.title} logo`}
            className="w-full mb-2  object-contain max-md:w-1/2"
          />
        ) : (
          <p className="text-sm">Logo not available</p>
        )}
        <div>
          <p className="text-sm text-black flex items-center gap-1">
            {new Date(movie.release_date).getFullYear()} | {movie.vote_average.toFixed(1)} <StarIcon className="inline max-md:h-3 h-4 max-md:w-3 text-yellow-400 fill-yellow-400" /> 
          </p>
        </div>
        <p className="max-md:text-sm text-lg">{movie.overview.slice(0, 200)}...</p>
        <div className="flex gap-2">
          <Button size={'lg'}>
            <Link href={`/watch/movie/${movie.id}`} >
            Watch
            </Link>
          </Button>
          <Button variant="outline" className="ms-2 text-foreground" size={'lg'} >
            <Link href={`/movie/${movie.id}`} className="flex gap-1 items-center" >
            More Info <Info />
            </Link>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;