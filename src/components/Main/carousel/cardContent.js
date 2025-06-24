"use client";

import { useState } from "react";
import { Star, Play, Heart, Calendar, Info, Tv, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  // TV Show specific genres
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

const MovieCard = ({ movie, size = "medium", showOverlay = true, onClick , tv=false}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!movie) return null;

  const backdropUrl = "https://image.tmdb.org/t/p/w500";
  const posterUrl = movie.poster_path ? backdropUrl + movie.poster_path : null;

  const title =
    movie.title ||
    movie.name ||
    movie.original_title ||
    movie.original_name ||
    "Unknown Title";
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const mediaType =
    movie.media_type === "tv" || movie.first_air_date || movie.origin_country
      ? "tv"
      : "movie";

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  // Size configurations
  const getMediaTypeIcon = (mediaType) => {
    return movie === "tv" ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />
  
  }

  const getMediaTypeLabel = (mediaType) => {
    return mediaType === "tv" ? "TV Show" : "Movie"
  }

  const sizeConfig = {
    small: {
      container: "",
      poster: "",
      title: "text-sm",
      text: "text-xs",
      padding: "p-3",
    },
    medium: {
      container: "",
      poster: "",
      title: "text-base",
      text: "text-sm",
      padding: "p-4",
    },
    large: {
      container: "h-32",
      poster: "",
      title: "text-lg",
      text: "text-sm",
      padding: "p-4",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`${config.container} bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative border border-gray-700 hover:border-gray-600`}
      onClick={handleCardClick}
    >
      <Link href={`/${mediaType}/${movie.id}`} className="block h-full">
        {/* Poster Image */}
        <div
          className={`relative ${config.poster} overflow-hidden bg-gray-700`}
        >
          {posterUrl ? (
            <Image
              height={500}
              width={300}
              src={posterUrl || "/placeholder.svg"}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=400&width=300";
                setImageLoaded(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold">{movie.id}</span>
                </div>
                <div className="text-white font-semibold text-sm px-2">
                  {title}
                </div>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {posterUrl && !imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-semibold text-white">
              {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
          </div>

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
                        {getMediaTypeIcon(mediaType)}
                        <span className="text-xs font-semibold">{getMediaTypeLabel(mediaType)}</span>
                      </div>

          {/* Hover Overlay with Actions */}
          {showOverlay && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center gap-3">
              <Link href={`/watch/${mediaType}/${movie.id}`}>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 p-0 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100"
              >
                <Play className="w-5 h-5 fill-current" />
              </Button>
            </Link>
              <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? "fill-current text-red-400" : ""
                    }`}
                  />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Adult Content Indicator */}
          {movie.adult && (
            <div className="absolute bottom-3 right-3 bg-red-600 rounded px-2 py-1">
              <span className="text-xs font-bold text-white">18+</span>
            </div>
          )}
        </div>

        {/* Movie/TV Show Info */}
        <div className={`${config.padding} space-y-2 flex-1`}>
          <div>
            <h3
              className={`${config.title} font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors duration-300`}
            >
              {title}
            </h3>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3 h-3" />
                <span className={`${config.text}`}>{releaseYear}</span>
              </div>

              {/* Origin Country for TV Shows */}
              {movie.origin_country && movie.origin_country.length > 0 && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className={`${config.text} uppercase font-semibold`}>
                      {movie.origin_country[0]}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Genres */}
          {movie.genre_ids && movie.genre_ids.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genre_ids.slice(0, 2).map((genreId) => (
                <Badge
                  key={genreId}
                  variant="secondary"
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 hover:bg-gray-600 transition-colors"
                >
                  {genreMap[genreId] || "Unknown"}
                </Badge>
              ))}
            </div>
          )}

          {/* Overview */}
          <p
            className={`${config.text} text-gray-400 line-clamp-2 leading-relaxed`}
          >
            {movie.overview || "No description available."}
          </p>

        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </Link>
    </div>
  );
};

export default MovieCard;
