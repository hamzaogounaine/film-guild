"use client"
import { Loading } from "@/components/ui/loading"
import { fetchDetailsTv } from "@/redux/tvDetailsSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Star, Play, Heart, Share2, Calendar, Clock, Tv, Globe, Building, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString()
}

const getAirYear = (dateString) => {
  if (!dateString) return "N/A"
  return new Date(dateString).getFullYear()
}

const formatEpisodeRuntime = (runtimes) => {
  if (!runtimes || runtimes.length === 0) return "N/A"
  const avgRuntime = runtimes.reduce((a, b) => a + b, 0) / runtimes.length
  return `~${Math.round(avgRuntime)}m`
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "returning series":
    case "in production":
      return "text-green-400"
    case "ended":
    case "canceled":
      return "text-red-400"
    case "pilot":
      return "text-yellow-400"
    default:
      return "text-gray-400"
  }
}

const Page = () => {
  const { statusTv, tvDetails } = useSelector((state) => state.tvdetails)
  const dispatch = useDispatch()
  const { id } = useParams()
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    dispatch(fetchDetailsTv(id))
  }, [dispatch, id])

  if (statusTv === "pending") {
    return <Loading />
  }

  if (!tvDetails) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <p className="text-center">TV Show not found</p>
      </div>
    )
  }

  const backdropUrl = `${process.env.NEXT_PUBLIC_BACKDROP_URL}${tvDetails.backdrop_path}`
  const posterUrl = `${process.env.NEXT_PUBLIC_BACKDROP_URL}${tvDetails.poster_path}`
  const firstAirYear = getAirYear(tvDetails.first_air_date)
  const lastAirYear = getAirYear(tvDetails.last_air_date)
  const episodeRuntime = formatEpisodeRuntime(tvDetails.episode_run_time)

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Hero Section */}
      <div className="relative h-[80vh] sm:h-[80vh] lg:h-[70vh] overflow-hidden">
        <Image
          width={1920}
          height={1080}
          src={backdropUrl || "/placeholder.svg"}
          alt={tvDetails.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* TV Show Poster */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start">
              <Image
                src={posterUrl || "/placeholder.svg"}
                alt={tvDetails.name}
                width={256}
                height={384}
                className="w-40 h-60 sm:w-48 sm:h-72 lg:w-64 lg:h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>

            {/* TV Show Info */}
            <div className="flex-1 space-y-2 sm:space-y-3 lg:space-y-4 text-center lg:text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-1 sm:mb-2 leading-tight">
                  {tvDetails.name}
                </h1>
                {tvDetails.tagline && (
                  <p className="text-sm sm:text-lg lg:text-xl text-gray-300 italic mb-2 sm:mb-4">
                    &quot;{tvDetails.tagline}&quot;
                  </p>
                )}
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm lg:text-base text-gray-300 flex-wrap">
                  <span>
                    {firstAirYear}
                    {lastAirYear && lastAirYear !== firstAirYear ? ` - ${lastAirYear}` : ""}
                  </span>
                  <span>•</span>
                  <span className={getStatusColor(tvDetails.status)}>{tvDetails.status}</span>
                  <span>•</span>
                  <span>{episodeRuntime} per episode</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    {tvDetails.number_of_seasons} Season{tvDetails.number_of_seasons !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Genres */}
              {tvDetails.genres && (
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center lg:justify-start">
                  {tvDetails.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary" className="bg-gray-700 text-white text-xs sm:text-sm">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Ratings */}
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="text-lg sm:text-xl font-semibold">
                    {tvDetails.vote_average?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-gray-400 text-sm">/10</span>
                  {tvDetails.vote_count && (
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      ({tvDetails.vote_count.toLocaleString()} votes)
                    </span>
                  )}
                </div>
                {tvDetails.popularity && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">📊</span>
                    </div>
                    <span className="text-lg sm:text-xl font-semibold">{Math.round(tvDetails.popularity)}</span>
                    <span className="text-gray-400 text-sm hidden sm:inline">Popularity</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-white">
                  <Link href={`/watch/tv/${id}`} className="flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Watch
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                  className={`border-gray-600 w-full sm:w-auto ${
                    isWatchlisted ? "bg-red-600 text-white" : "text-white hover:bg-gray-800"
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isWatchlisted ? "fill-current" : ""}`} />
                  {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 sm:gap-8 border-b border-gray-700 mb-6 sm:mb-8 overflow-x-auto">
          {["overview", "seasons", "networks", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 capitalize font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {tvDetails.overview || "No overview available."}
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Show Stats</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-400" />
                      <div className="text-lg sm:text-2xl font-bold">{firstAirYear}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">First Aired</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Tv className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-400" />
                      <div className="text-lg sm:text-2xl font-bold">{tvDetails.number_of_seasons}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Seasons</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-400" />
                      <div className="text-lg sm:text-2xl font-bold">{tvDetails.number_of_episodes}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Episodes</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-400" />
                      <div className="text-sm sm:text-lg font-bold">{episodeRuntime}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Runtime</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">Show Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-400">Status:</span>
                    <span className={getStatusColor(tvDetails.status)}>{tvDetails.status || "Unknown"}</span>
                  </div>
                  {tvDetails.first_air_date && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">First Air Date:</span>
                      <span>{formatDate(tvDetails.first_air_date)}</span>
                    </div>
                  )}
                  {tvDetails.last_air_date && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Last Air Date:</span>
                      <span>{formatDate(tvDetails.last_air_date)}</span>
                    </div>
                  )}
                  {tvDetails.original_language && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Original Language:</span>
                      <span>{tvDetails.original_language.toUpperCase()}</span>
                    </div>
                  )}
                  {tvDetails.type && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Type:</span>
                      <span>{tvDetails.type}</span>
                    </div>
                  )}
                </div>
              </div>

              {tvDetails.spoken_languages && tvDetails.spoken_languages.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {tvDetails.spoken_languages.map((lang) => (
                      <Badge key={lang.iso_639_1} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        {lang.english_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {tvDetails.origin_country && tvDetails.origin_country.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4">Origin Countries</h3>
                  <div className="flex flex-wrap gap-2">
                    {tvDetails.origin_country.map((country) => (
                      <Badge key={country} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        <Globe className="w-3 h-3 mr-1" />
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {tvDetails.homepage && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4">Official Website</h3>
                  <a
                    href={tvDetails.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline text-sm sm:text-base break-all"
                  >
                    Visit Official Site
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "seasons" && tvDetails.seasons && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Seasons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tvDetails.seasons.map((season) => (
                <Card key={season.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-4">
                      <Image
                        width={80}
                        height={120}
                        src={
                          season.poster_path
                            ? `${process.env.NEXT_PUBLIC_BACKDROP_URL}${season.poster_path}`
                            : "/placeholder.svg"
                        }
                        alt={season.name}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base mb-1">{season.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2">{season.episode_count} episodes</p>
                        {season.air_date && (
                          <p className="text-gray-400 text-xs">Aired: {formatDate(season.air_date)}</p>
                        )}
                        {season.overview && (
                          <p className="text-gray-300 text-xs mt-2 line-clamp-3">{season.overview}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "networks" && tvDetails.networks && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Networks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tvDetails.networks.map((network) => (
                <Card key={network.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-4">
                      {network.logo_path ? (
                        <Image
                          width={60}
                          height={60}
                          src={`${process.env.NEXT_PUBLIC_BACKDROP_URL}${network.logo_path}`}
                          alt={network.name}
                          className="w-12 h-12 object-contain bg-white rounded p-1"
                        />
                      ) : (
                        <Building className="w-12 h-12 text-gray-400" />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base">{network.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{network.origin_country || "Unknown"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {tvDetails.production_companies && tvDetails.production_companies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Production Companies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tvDetails.production_companies.map((company) => (
                    <Card key={company.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          {company.logo_path ? (
                            <Image
                              width={40}
                              height={40}
                              src={`${process.env.NEXT_PUBLIC_BACKDROP_URL}${company.logo_path}`}
                              alt={company.name}
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <Building className="w-10 h-10 text-gray-400" />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">{company.name}</h4>
                            <p className="text-gray-400 text-xs">{company.origin_country || "Unknown"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Technical Details</h2>
              <div className="space-y-4">
                {tvDetails.id && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-gray-400">TMDB ID</span>
                    <span>{tvDetails.id}</span>
                  </div>
                )}
                {tvDetails.original_name && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-gray-400">Original Name</span>
                    <span className="text-right ml-4 break-words">{tvDetails.original_name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                  <span className="text-gray-400">Adult Content</span>
                  <span>{tvDetails.adult ? "Yes" : "No"}</span>
                </div>
                {tvDetails.popularity && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-gray-400">Popularity Score</span>
                    <span>{tvDetails.popularity.toFixed(1)}</span>
                  </div>
                )}
                {tvDetails.vote_count && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-gray-400">Vote Count</span>
                    <span>{tvDetails.vote_count.toLocaleString()}</span>
                  </div>
                )}
                {tvDetails.in_production !== undefined && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-gray-400">In Production</span>
                    <span>{tvDetails.in_production ? "Yes" : "No"}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Show Statistics</h2>
              <div className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Tv className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-400" />
                      <div className="text-lg sm:text-2xl font-bold text-blue-400">{tvDetails.number_of_seasons}</div>
                      <div className="text-gray-400 text-sm">Total Seasons</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-400" />
                      <div className="text-lg sm:text-2xl font-bold text-green-400">{tvDetails.number_of_episodes}</div>
                      <div className="text-gray-400 text-sm">Total Episodes</div>
                    </div>
                  </CardContent>
                </Card>
                {tvDetails.episode_run_time && tvDetails.episode_run_time.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-400" />
                        <div className="text-lg sm:text-2xl font-bold text-purple-400">{episodeRuntime}</div>
                        <div className="text-gray-400 text-sm">Average Episode Length</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
