"use client"

import { useState, useEffect } from "react"
import { Search, X, Star, Calendar, Loader2, Tv, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import { fetchSearch } from "@/redux/searchSlice"
import Link from "next/link"
import Image from "next/image"

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

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
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]); // Initialize as empty array
  const [popularSearches] = useState(['Avengers', 'Spider-Man', 'John Wick', 'Fast & Furious', 'Mission Impossible']);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const backdropUrl = useState(`${process.env.NEXT_PUBLIC_IMAGE_URL}`);

  const { results, status, error } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  // Load recent searches from sessionStorage on client-side mount
  useEffect(() => {
    const storedSearches = sessionStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []); // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(fetchSearch(debouncedSearchQuery));

      // Add to recent searches
      if (!recentSearches.includes(debouncedSearchQuery)) {
        setRecentSearches((prevSearches) => {
          const updatedSearches = [debouncedSearchQuery, ...prevSearches.slice(0, 4)];
          sessionStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
          return updatedSearches;
        });
      }
    }
  }, [debouncedSearchQuery, dispatch, recentSearches]);

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handleRecentSearch = (query) => {
    setSearchQuery(query)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).getFullYear()
  }

  const getTitle = (item) => {
    return item.title || item.name || "Unknown Title"
  }

  const getReleaseDate = (item) => {
    return item.release_date || item.first_air_date
  }

  const getMediaTypeIcon = (mediaType) => {
    return mediaType === "tv" ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />
  }

  const getMediaTypeLabel = (mediaType) => {
    return mediaType === "tv" ? "TV Show" : "Movie"
  }

  const isLoading = status === "pending"
  const searchResults = results || []
  const totalResults = searchResults.length

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Search Movies & TV Shows</h1>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for movies, TV shows, actors, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 text-base sm:text-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
              </div>
            )}
          </div>

          {/* Search Stats */}
          {searchQuery && !isLoading && (
            <div className="mt-4 text-sm text-gray-400">
              {totalResults > 0 ? (
                <span>
                  Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                </span>
              ) : (
                <span>No results found for &quot;{searchQuery}&quot;</span>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">Error: {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Show suggestions when no search query */}
        {!searchQuery && !isLoading && (
          <div className="space-y-8">
            {/* Recent Searches */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecentSearch(search)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecentSearch(search)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && searchQuery && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-400">Searching for movies and TV shows...</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !isLoading && (
          <div className="space-y-6">
            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {searchResults.map((item) => (
                <Card
                  key={`${item.id}-${item.media_type}`}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group p-1"
                >
                    <Link href={`/${item.media_type}/${item.id}`} className="block h-full">
                  <CardContent className="p-0">
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                      <Image
                        width={300}
                        height={450}
                        src={process.env.NEXT_PUBLIC_IMAGE_URL + item.poster_path || "/placeholder.svg?height=450&width=300"}
                        alt={getTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=450&width=300"
                        }}
                      />

                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold">{item.vote_average?.toFixed(1) || "N/A"}</span>
                      </div>

                      {/* Media Type Badge */}
                      <div className="absolute top-2 left-2 bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
                        {getMediaTypeIcon(item.media_type)}
                        <span className="text-xs font-semibold">{getMediaTypeLabel(item.media_type)}</span>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {getTitle(item)}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(getReleaseDate(item))}</span>
                        {item.origin_country && item.origin_country.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{item.origin_country[0]}</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 mb-3">
                        {item.overview || "No overview available."}
                      </p>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1">
                        {item.genre_ids?.slice(0, 2).map((genreId) => (
                          <Badge
                            key={genreId}
                            variant="secondary"
                            className="bg-gray-700 text-gray-300 text-xs px-2 py-1"
                          >
                            {genreMap[genreId] || "Unknown"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && !isLoading && searchResults.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p>Try searching with different keywords or check your spelling.</p>
            </div>

            {/* Search Suggestions */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecentSearch(suggestion)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
