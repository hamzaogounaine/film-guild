"use client"

import { useState } from "react"
import { Star, Play, Heart, Calendar, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

// Genre mapping
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
}


const MovieCard = ({ movie, size = "medium", showOverlay = true, onClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const backdropUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL || process.env.IMAGE_URL}`
  const posterUrl = backdropUrl + movie.poster_path
  const backdropImageUrl = backdropUrl + movie.backdrop_path

  const title = movie.title || movie.name || "Unknown Title"
  const releaseDate = movie.release_date || movie.first_air_date
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A"

  const formatRuntime = (minutes) => {
    if (!minutes) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handlePlayClick = (e) => {
    e.stopPropagation()
    // Handle play action
    console.log("Play movie:", title)
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(movie)
    }
  }

  // Size configurations
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
  }

  const config = sizeConfig[size]

  return (
    
    <div
    className={`${config.container} bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative border border-gray-700 hover:border-gray-600`}
    onClick={handleCardClick}
    >
    <Link href={`/movie/${movie.id}`} className="" >
      {/* Poster Image */}
      <div className={`relative ${config.poster} overflow-hidden bg-gray-700`}>
        <Image
          height={400}
          width={300}
          src={posterUrl || "/placeholder.svg?height=400&width=300"}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=400&width=300"
            setImageLoaded(true)
          }}
        />

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-semibold text-white">{movie.vote_average?.toFixed(1) || "N/A"}</span>
        </div>

        {/* Media Type Badge */}
        {movie.media_type && (
          <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm rounded-full px-2 py-1 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
            <span className="text-xs font-semibold text-white uppercase">
              {movie.media_type === "tv" ? "TV" : "Movie"}
            </span>
          </div>
        )}

        {/* Hover Overlay with Actions */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center gap-3">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 p-0 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100"
              
            >
              <Link href={`/movie/${movie.id}`} className="flex items-center justify-center w-full h-full">
              <Play className="w-5 h-5 fill-current" />
              </Link>
            </Button>

            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0"
                onClick={handleWishlistToggle}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current text-red-400" : ""}`} />
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

      {/* Movie Info */}
      <div className={`${config.padding} space-y-2`}>
        <div>
          <h3
            className={`${config.title} font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors duration-300`}
          >
            {title}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              <span className={`${config.text}`}>{releaseYear}</span>
            </div>

            {movie.runtime && (
              <>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span className={`${config.text}`}>{formatRuntime(movie.runtime)}</span>
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
            {movie.genre_ids.length > 2 && (
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5">
                +{movie.genre_ids.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Overview */}
        <p className={`${config.text} text-gray-400 line-clamp-2 leading-relaxed`}>
          {movie.overview || "No description available."}
        </p>

        {/* Additional Info */}
        <div className="flex items-center justify-between pt-1">
          {movie.vote_count && <span className="text-xs text-gray-500">{movie.vote_count.toLocaleString()} votes</span>}

          {movie.popularity && <span className="text-xs text-gray-500">Pop: {Math.round(movie.popularity)}</span>}
        </div>
      </div>

      {/* Shine Effect */}
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      </Link>
    </div>
  )
}

// Example usage component


export default MovieCard
