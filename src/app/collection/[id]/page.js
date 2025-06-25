"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Star, Calendar, Film, ArrowLeft, Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"

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





export default function CollectionPage() {
  const params = useParams()
  const id = params.id 

  const [collection, setCollection] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/collection/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`,
        )
        setCollection(response.data)
      } catch (error) {
        console.error("Error fetching collection:", error)
        setError("Failed to load collection")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollection()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getGenreNames = (genreIds) => {
    return genreIds.map((id) => genreMap[id] || "Unknown").join(", ")
  }

  if (isLoading) {
    return <CollectionPageSkeleton />
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Collection Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The requested collection could not be found."}</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Sort movies by release date
  const sortedMovies = [...collection.parts].sort(
    (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop Image */}
        {collection.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${collection.backdrop_path}`}
              alt={collection.name}
              width={1920}
              height={800}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-gray-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-gray-900/40" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 px-4 md:px-8 lg:px-16 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Collection Poster */}
              <div className="flex-shrink-0">
                <div className="w-80 max-w-full">
                  {collection.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
                      alt={collection.name}
                      width={500}
                      height={750}
                      className="w-full rounded-xl shadow-2xl"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-700 rounded-xl flex items-center justify-center">
                      <Film className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Collection Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {collection.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-6 flex-wrap">
                    <Badge className="bg-red-600 text-white">
                      <Film className="w-3 h-3 mr-1" />
                      Collection
                    </Badge>
                    <span className="text-gray-300">
                      {collection.parts.length} {collection.parts.length === 1 ? "Movie" : "Movies"}
                    </span>
                  </div>
                </div>

                {/* Overview */}
                {collection.overview && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Overview</h2>
                    <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">{collection.overview}</p>
                  </div>
                )}

                {/* Collection Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-400">{collection.parts.length}</div>
                    <div className="text-sm text-gray-400">Movies</div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {(
                        collection.parts.reduce((sum, movie) => sum + movie.vote_average, 0) / collection.parts.length
                      ).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400">Avg Rating</div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">
                      {sortedMovies[0]?.release_date ? new Date(sortedMovies[0].release_date).getFullYear() : "N/A"}
                    </div>
                    <div className="text-sm text-gray-400">First Movie</div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">
                      {sortedMovies[sortedMovies.length - 1]?.release_date
                        ? new Date(sortedMovies[sortedMovies.length - 1].release_date).getFullYear()
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-400">Latest Movie</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Film className="w-8 h-8 text-red-400" />
            Movies in Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMovies.map((movie, index) => (
              <Card
                key={movie.id}
                className="bg-black border-gray-700 hover:border-gray-600 transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Movie Poster */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                      {movie.backdrop_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                          alt={movie.title}
                          width={500}
                          height={281}
                          className="w-full h-full object-cover group-hover:scale-115 group-hover:blur-md transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Film className="w-12 h-12 text-gray-500" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Action Buttons */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`/watch/movie/${movie.id}`}>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Play className="w-4 h-4 mr-1" />
                            Watch
                          </Button>
                        </Link>
                        <Link href={`/movie/${movie.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                          >
                            <Info className="w-4 h-4 mr-1" />
                            Info
                          </Button>
                        </Link>
                      </div>

                      {/* Movie Number Badge */}
                      <div className="absolute top-3 left-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                          {movie.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(movie.release_date)}</span>
                        </div>
                      </div>

                      {/* Genres */}
                      {movie.genre_ids && movie.genre_ids.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {movie.genre_ids.slice(0, 3).map((genreId) => (
                            <Badge key={genreId} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                              {genreMap[genreId] || "Unknown"}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Overview */}
                      <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                        {movie.overview || "No description available."}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <span className="text-xs text-gray-500">{movie.vote_count.toLocaleString()} votes</span>
                        <span className="text-xs text-gray-500">{movie.original_language.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton Component
function CollectionPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-white animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 bg-gray-800" />

        <div className="relative z-10 px-4 md:px-8 lg:px-16 py-8">
          <div className="mb-8">
            <div className="h-10 w-20 bg-gray-700 rounded" />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Poster Skeleton */}
              <div className="w-80 max-w-full">
                <div className="w-full aspect-[2/3] bg-gray-700 rounded-xl" />
              </div>

              {/* Info Skeleton */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="h-16 w-3/4 bg-gray-700 rounded mb-4" />
                  <div className="flex gap-4 mb-6">
                    <div className="h-6 w-20 bg-gray-700 rounded" />
                    <div className="h-6 w-16 bg-gray-700 rounded" />
                  </div>
                </div>

                <div>
                  <div className="h-6 w-24 bg-gray-700 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-700 rounded" />
                    <div className="h-4 w-5/6 bg-gray-700 rounded" />
                    <div className="h-4 w-4/6 bg-gray-700 rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-4">
                      <div className="h-8 w-12 bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-16 bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section Skeleton */}
      <div className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-gray-700 rounded mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-[16/9] bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-6 w-3/4 bg-gray-700 rounded" />
                  <div className="h-4 w-1/2 bg-gray-700 rounded" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-gray-700 rounded" />
                    <div className="h-5 w-12 bg-gray-700 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-700 rounded" />
                    <div className="h-3 w-5/6 bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
