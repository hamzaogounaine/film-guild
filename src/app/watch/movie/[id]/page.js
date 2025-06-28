"use client"

import { useEffect, useState } from "react"
import {
  Play,
  Star,
  Calendar,
  Clock,
  Globe,
  Wifi,
  WifiOff,
  Server,
  Heart,
  Share2,
  Download,
  Eye,
  Zap,
} from "lucide-react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
      baseUrl: "https://vidsrc.me/embed/movie"
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
      baseUrl: "https://embed.su/embed/movie"
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
      baseUrl: "https://putlocker.vip/embed/movie"
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
      baseUrl: "https://vidsrc.icu/embed/movie"
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
      baseUrl: "https://vidlink.pro/movie"
    },
    {
      id: 6,
      name: "Server 6 - Basic",
      quality: "480p",
      ping: 89,
      status: "online",
      location: "Canada",
      flag: "🇨🇦",
      type: "basic",
      speed: "Medium",
      baseUrl: "https://vidsrc.net/embed/movie"
    },
    {
      id: 7,
      name: "Server 7 - Standard",
      quality: "1080p",
      ping: 124,
      status: "online",
      location: "Australia",
      flag: "🇦🇺",
      type: "standard",
      speed: "Fast",
      baseUrl: "https://www.2embed.cc/embed"
    }
  ];

  const [movie, setMovie] = useState({})
  const [selectedServer, setSelectedServer] = useState(servers[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [viewerCount] = useState(Math.floor(Math.random() * 5000) + 1000)
  const [isServerSwitching, setIsServerSwitching] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`,
        )
        console.log(res.data)
        setMovie(res.data)
      } catch (error) {
        console.error("Error fetching movie data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovieData()
  }, [id])

  const handleServerChange = (server) => {
    if (server.status === "online") {
      setIsServerSwitching(true)
      setTimeout(() => {
        setSelectedServer(server)
        setIsServerSwitching(false)
      }, 1500)
    }
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

  const formatReleaseDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).getFullYear()
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
          <p className="text-white text-lg">Loading movie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br bg-black text-white">
      {/* Hero Section with Movie Backdrop */}
      <div className="relative">
        {movie.backdrop_path && (
          <div className="absolute inset-0 opacity-20">
            <Image
              width={1920}
              height={800}
              src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
        )}

        {/* Video Player Section */}
        <div className="relative z-10 pt-20 px-4 md:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Movie Title & Quick Info */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {movie.title || "Loading..."}
                </h1>
                <Badge className="bg-red-600 text-white">Movie</Badge> {/* Added to match TV show */}
              </div>

              <div className="flex items-center gap-6 text-white mb-4">
                {movie.release_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatReleaseDate(movie.release_date)}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                {movie.vote_average && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-6">
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
                <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-1" />
                  Download
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
                      <p className="text-lg text-white">Switching to {selectedServer.name}...</p>
                      <p className="text-sm text-gray-400">
                        {selectedServer.quality} • {selectedServer.location}
                      </p>
                    </div>
                  </div>
                )}

                <iframe
                  src={`${selectedServer.baseUrl}/${id}`}
                  allowFullScreen
                  scrolling="no"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Movie Player"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 px-4 md:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Movie Information */}
            <div className="lg:col-span-2 space-y-6">
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
                      <div className="text-xs text-gray-300">Location</div>
                    </div>

                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{selectedServer.quality}</div>
                      <div className="text-xs text-gray-300">Quality</div>
                    </div>

                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className={`text-lg font-bold ${getPingColor(selectedServer.ping)}`}>
                        {selectedServer.ping}ms
                      </div>
                      <div className="text-xs text-gray-300">Latency</div>
                    </div>

                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">{selectedServer.speed}</span>
                      </div>
                      <div className="text-xs text-gray-300">Speed</div>
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
                          <div className="flex items-center gap-4 text-gray-300">
                            <span>{server.quality}</span>
                            <span>•</span>
                            <span>{server.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${getPingColor(server.ping)} font-medium`}>{server.ping}ms</span>
                            {server.status === "offline" && <WifiOff className="w-4 h-4 text-red-400" />}
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-300">Speed: {server.speed}</div>
                      </div>
                    ))}
                  </div>

                  {/* Server Statistics */}
                  <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Online Servers:</span>
                      <span className="text-green-400 font-medium">
                        {servers.filter((s) => s.status === "online").length}/{servers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
                      <span>Best Ping:</span>
                      <span className="text-green-400 font-medium">
                        {Math.min(...servers.filter((s) => s.status === "online").map((s) => s.ping))}ms
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page