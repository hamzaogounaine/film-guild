"use client"

import { useEffect, useState } from "react"
import {
  Star,
  Calendar,
  Clock,
  Wifi,
  WifiOff,
  Server,
  Heart,
  Share2,
  Eye,
  Zap,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
} from "lucide-react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

const Page = () => {
  const servers = [
    {
      id: 1,
      name: "Server 1 - Premium",
      quality: "1080p",
      ping: 45,
      status: "online",
      location: "US East",
      flag: "🇺🇸",
      type: "premium",
      speed: "Ultra Fast",
      baseUrl: "https://vidsrc.me/embed/tv",
    },
    {
      id: 2,
      name: "Server 2 - Standard",
      quality: "720p",
      ping: 67,
      status: "online",
      location: "US West",
      flag: "🇺🇸",
      type: "standard",
      speed: "Fast",
      baseUrl: "https://embed.su/embed/tv",
    },
    {
      id: 3,
      name: "Server 3 - Premium",
      quality: "1080p",
      ping: 52,
      status: "online",
      location: "EU Central",
      flag: "🇪🇺",
      type: "premium",
      speed: "Ultra Fast",
      baseUrl: "https://putlocker.vip/embed/tv",
    },
    {
      id: 4,
      name: "Server 4 - Basic",
      quality: "720p",
      ping: 73,
      status: "online",
      location: "Asia",
      flag: "🌏",
      type: "basic",
      speed: "Medium",
      baseUrl: "https://vidsrc.icu/embed/tv",
    },
    {
      id: 5,
      name: "Server 5 - Ultra",
      quality: "4K",
      ping: 38,
      status: "online",
      location: "UK",
      flag: "🇬🇧",
      type: "ultra",
      speed: "Lightning",
      baseUrl: "https://vidlink.pro/tv",
    },
  ]

  const [tvShow, setTvShow] = useState({})
  const [selectedServer, setSelectedServer] = useState(servers[0])
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [episodes, setEpisodes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEpisodesLoading, setIsEpisodesLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isServerSwitching, setIsServerSwitching] = useState(false)
  const [episodeViewMode, setEpisodeViewMode] = useState("list") // "list" or "grid"

  const { id } = useParams()

  useEffect(() => {
    const fetchTVShowData = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`,
        )
        setTvShow(res.data)

        // Set initial season to the first available season (excluding specials)
        const firstRegularSeason = res.data.seasons?.find((season) => season.season_number > 0)
        if (firstRegularSeason) {
          setSelectedSeason(firstRegularSeason.season_number)
        }
      } catch (error) {
        console.error("Error fetching TV show data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTVShowData()
  }, [id])

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!selectedSeason || !id) return

      try {
        setIsEpisodesLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/tv/${id}/season/${selectedSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`,
        )
        setEpisodes(res.data.episodes || [])
        setSelectedEpisode(1) // Reset to first episode when season changes
      } catch (error) {
        console.error("Error fetching episodes:", error)
        setEpisodes([])
      } finally {
        setIsEpisodesLoading(false)
      }
    }
    fetchEpisodes()
  }, [selectedSeason, id])

  const handleServerChange = (server) => {
    if (server.status === "online") {
      setIsServerSwitching(true)
      setTimeout(() => {
        setSelectedServer(server)
        setIsServerSwitching(false)
      }, 1500)
    }
  }

  const handleEpisodeChange = (episodeNumber) => {
    setSelectedEpisode(episodeNumber)
  }

  const handleNextEpisode = () => {
    const currentEpisodeIndex = episodes.findIndex((ep) => ep.episode_number === selectedEpisode)
    if (currentEpisodeIndex < episodes.length - 1) {
      setSelectedEpisode(episodes[currentEpisodeIndex + 1].episode_number)
    } else {
      // Move to next season if available
      const currentSeasonIndex = tvShow.seasons?.findIndex((season) => season.season_number === selectedSeason)
      const nextSeason = tvShow.seasons?.[currentSeasonIndex + 1]
      if (nextSeason && nextSeason.season_number > 0) {
        setSelectedSeason(nextSeason.season_number)
      }
    }
  }

  const handlePreviousEpisode = () => {
    const currentEpisodeIndex = episodes.findIndex((ep) => ep.episode_number === selectedEpisode)
    if (currentEpisodeIndex > 0) {
      setSelectedEpisode(episodes[currentEpisodeIndex - 1].episode_number)
    } else {
      // Move to previous season if available
      const currentSeasonIndex = tvShow.seasons?.findIndex((season) => season.season_number === selectedSeason)
      const prevSeason = tvShow.seasons?.[currentSeasonIndex - 1]
      if (prevSeason && prevSeason.season_number > 0) {
        setSelectedSeason(prevSeason.season_number)
      }
    }
  }

  const getCurrentEpisode = () => {
    return episodes.find((ep) => ep.episode_number === selectedEpisode)
  }

  const getCurrentSeason = () => {
    return tvShow.seasons?.find((season) => season.season_number === selectedSeason)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-black"
    }
  }

  const getPingColor = (ping) => {
    if (ping < 50) return "text-green-400"
    if (ping < 100) return "text-yellow-400"
    return "text-red-400"
  }

  const getServerTypeColor = (type) => {
    switch (type) {
      case "ultra":
        return "bg-purple-600"
      case "premium":
        return "bg-yellow-600"
      case "standard":
        return "bg-blue-600"
      case "basic":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading TV Show...</p>
        </div>
      </div>
    )
  }

  const currentEpisode = getCurrentEpisode()
  const currentSeason = getCurrentSeason()

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black text-white">
      {/* Hero Section with TV Show Backdrop */}
      <div className="relative">
        {tvShow.backdrop_path && (
          <div className="absolute inset-0 opacity-20">
            <Image
              width={1920}
              height={800}
              src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tvShow.backdrop_path}`}
              alt={tvShow.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
        )}

        {/* Video Player Section */}
        <div className="relative z-10 pt-16 px-4 md:px-16">
          <div className="max-w-7xl mx-auto">
            {/* TV Show Title & Episode Info */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-black bg-clip-text text-transparent">
                  {tvShow.name || "Loading..."}
                </h1>
                <Badge className="bg-red-600 text-white">TV Show</Badge>
              </div>

              {/* Current Episode Info */}
              {currentEpisode && (
                <div className="mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mb-2">
                    S{selectedSeason}E{selectedEpisode}: {currentEpisode.name}
                  </h2>
                  <p className="text-black text-sm md:text-base line-clamp-2">
                    {currentEpisode.overview || "No description available."}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-6 text-black mb-4 flex-wrap">
                {tvShow.first_air_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                  </div>
                )}
                {currentEpisode?.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatRuntime(currentEpisode.runtime)}</span>
                  </div>
                )}
                {tvShow.vote_average && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{tvShow.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>
                    {tvShow.number_of_seasons} Seasons • {tvShow.number_of_episodes} Episodes
                  </span>
                </div>
              </div>

              {/* Episode Navigation */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <Button
                  onClick={handlePreviousEpisode}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800"
                  disabled={selectedSeason === 1 && selectedEpisode === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  onClick={handleNextEpisode}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800"
                  disabled={
                    selectedSeason === tvShow.seasons?.[tvShow.seasons.length - 1]?.season_number &&
                    selectedEpisode === episodes[episodes.length - 1]?.episode_number
                  }
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  onClick={() => setIsLiked(!isLiked)}
                  variant="outline"
                  size="sm"
                  className={`border-gray-600 ${isLiked ? "bg-red-600 text-white" : "text-white hover:bg-gray-800"}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative mb-8">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                {isServerSwitching && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-lg">Switching to {selectedServer.name}...</p>
                      <p className="text-sm text-black">
                        {selectedServer.quality} • {selectedServer.location}
                      </p>
                    </div>
                  </div>
                )}

                <iframe
                  src={`${selectedServer.baseUrl}/${id}/${selectedSeason}/${selectedEpisode}`}
                  allowFullScreen
                  scrolling="no"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="TV Show Player"
                  className="w-full h-full"
                />

                {/* Server Info Overlay */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedServer.status)}`} />
                    <span>
                      {selectedServer.flag} {selectedServer.name}
                    </span>
                    <Badge className={`${getServerTypeColor(selectedServer.type)} text-white text-xs`}>
                      {selectedServer.quality}
                    </Badge>
                  </div>
                </div>

                {/* Episode Info Overlay */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="text-sm">
                    <span className="font-semibold">
                      S{selectedSeason}E{selectedEpisode}
                    </span>
                    {currentEpisode && <span className="ml-2 text-black">{currentEpisode.name}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 px-4 md:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Episode Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Season & Episode Selectors */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <List className="w-5 h-5 text-blue-400" />
                      Episodes
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEpisodeViewMode(episodeViewMode === "list" ? "grid" : "list")}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        {episodeViewMode === "list" ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-black mb-2">Season</label>
                      <Select
                        value={selectedSeason.toString()}
                        onValueChange={(value) => setSelectedSeason(Number.parseInt(value))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {tvShow.seasons
                            ?.filter((season) => season.season_number > 0)
                            .map((season) => (
                              <SelectItem
                                key={season.id}
                                value={season.season_number.toString()}
                                className="text-white hover:bg-gray-700"
                              >
                                Season {season.season_number} ({season.episode_count} episodes)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Episodes List/Grid */}
                  {isEpisodesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className={episodeViewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                    {episodes.map((episode) => (
                      <div
                        key={episode.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedEpisode === episode.episode_number
                            ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
                            : "border-gray-600 hover:border-black bg-gray-700/30"
                        }`}
                        onClick={() => handleEpisodeChange(episode.episode_number)}
                      >
                        <div className="flex gap-4">
                          {/* Episode Thumbnail - Always show */}
                          <div className="flex-shrink-0">
                            <Image
                              width={episodeViewMode === "grid" ? 200 : 120}
                              height={episodeViewMode === "grid" ? 113 : 68}
                              src={
                                episode.still_path
                                  ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                                  : "/placeholder.svg?height=113&width=200"
                              }
                              alt={episode.name}
                              className={`${
                                episodeViewMode === "grid" ? "w-32 h-18" : "w-20 h-12"
                              } object-cover rounded flex-shrink-0 bg-gray-700`}
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=113&width=200"
                              }}
                            />
                            {/* Episode Number Overlay */}
                           
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">Episode {episode.episode_number}</span>
                              {episode.vote_average > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-black">{episode.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                              {/* Runtime Badge */}
                              {episode.runtime && (
                                <Badge variant="outline" className="text-xs border-gray-600 text-black">
                                  {formatRuntime(episode.runtime)}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium text-white mb-1 line-clamp-1">{episode.name}</h4>
                            <p className="text-black text-xs line-clamp-2 leading-relaxed">
                              {episode.overview || "No description available."}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-black">
                              {episode.air_date && <span>Aired: {formatDate(episode.air_date)}</span>}
                              {episode.vote_count > 0 && <span>{episode.vote_count} votes</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Server Status */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    Current Server Status
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl mb-1">{selectedServer.flag}</div>
                      <div className="text-sm font-medium">{selectedServer.location}</div>
                      <div className="text-xs text-black">Location</div>
                    </div>

                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{selectedServer.quality}</div>
                      <div className="text-xs text-black">Quality</div>
                    </div>

                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className={`text-lg font-bold ${getPingColor(selectedServer.ping)}`}>
                        {selectedServer.ping}ms
                      </div>
                      <div className="text-xs text-black">Latency</div>
                    </div>

                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">{selectedServer.speed}</span>
                      </div>
                      <div className="text-xs text-black">Speed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Server Selection Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-green-400" />
                    Available Servers
                  </h3>

                  <div className="space-y-3">
                    {servers.map((server) => (
                      <div
                        key={server.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedServer.id === server.id
                            ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
                            : "border-gray-600 hover:border-black bg-gray-700/30"
                        } ${server.status !== "online" ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleServerChange(server)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)} animate-pulse`} />
                            <span className="font-medium">
                              {server.flag} {server.name}
                            </span>
                          </div>
                          <Badge className={`${getServerTypeColor(server.type)} text-white text-xs`}>
                            {server.type}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-black">
                            <span>{server.quality}</span>
                            <span>•</span>
                            <span>{server.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${getPingColor(server.ping)} font-medium`}>{server.ping}ms</span>
                            {server.status === "offline" && <WifiOff className="w-4 h-4 text-red-400" />}
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-black">Speed: {server.speed}</div>
                      </div>
                    ))}
                  </div>

                  {/* Server Statistics */}
                  <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm text-black">
                      <span>Online Servers:</span>
                      <span className="text-green-400 font-medium">
                        {servers.filter((s) => s.status === "online").length}/{servers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-black mt-1">
                      <span>Best Ping:</span>
                      <span className="text-green-400 font-medium">
                        {Math.min(...servers.filter((s) => s.status === "online").map((s) => s.ping))}ms
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Season Info */}
              {currentSeason && (
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Season {selectedSeason} Info</h3>
                    {currentSeason.poster_path && (
                      <Image
                        width={200}
                        height={300}
                        src={`https://image.tmdb.org/t/p/w300${currentSeason.poster_path}`}
                        alt={currentSeason.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black">Episodes:</span>
                        <span>{currentSeason.episode_count}</span>
                      </div>
                      {currentSeason.air_date && (
                        <div className="flex justify-between">
                          <span className="text-black">Air Date:</span>
                          <span>{formatDate(currentSeason.air_date)}</span>
                        </div>
                      )}
                      {currentSeason.vote_average > 0 && (
                        <div className="flex justify-between">
                          <span className="text-black">Rating:</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            {currentSeason.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    {currentSeason.overview && (
                      <p className="text-black text-xs mt-4 leading-relaxed">{currentSeason.overview}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
