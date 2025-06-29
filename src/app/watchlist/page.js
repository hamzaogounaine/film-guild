"use client"
import { useAuth } from "@/lib/authContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Heart,
  Trash2,
  Play,
  Info,
  Star,
  Calendar,
  Film,
  Tv,
  Plus,
  LogOut,
  ArrowLeft,
  Grid3X3,
  List,
  Search,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Watchlist() {
  const { user, loading, watchlist, loadingWatchList, error, addToWatchList, removeFromWatchList } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState("grid") // "grid" or "list"
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isRemoving, setIsRemoving] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  // Filter watchlist based on search query
  const filteredWatchlist =
    watchlist?.filter((item) => item.title?.toLowerCase().includes(searchQuery.toLowerCase())) || []

  const showDeleteConfirm = (item) => {
    setItemToDelete(item)
    setShowDeleteAlert(true)
  }

  const cancelDelete = () => {
    setShowDeleteAlert(false)
    setItemToDelete(null)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    setIsRemoving(true)
    try {
      const success = await removeFromWatchList(String(itemToDelete.media_id), itemToDelete.media_type)
      if (success) {
        setDeleteSuccess(true)
        setTimeout(() => setDeleteSuccess(false), 3000)
      } else {
        console.error("Failed to remove from watchlist")
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error)
    } finally {
      setIsRemoving(false)
      setShowDeleteAlert(false)
      setItemToDelete(null)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).getFullYear()
  }

  const getWatchUrl = (item) => {
    if (item.media_type === "tv") {
      return `/watch/tv/${item.media_id}`
    }
    return `/watch/movie/${item.media_id}`
  }

  const getInfoUrl = (item) => {
    return `/${item.media_type}/${item.media_id}`
  }

  if (loading || loadingWatchList) {
    return <WatchlistSkeleton />
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <LogOut className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Authentication Required
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg">
            Please sign in to view your watchlist
          </p>
          <Link href="/signin">
            <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 h-10 sm:h-12 px-6 sm:px-8 rounded-xl">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      {/* Delete Success Alert */}
      {deleteSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300 w-full max-w-xs sm:max-w-sm">
          <Alert className="bg-green-900/20 border-green-800/50 text-green-300 backdrop-blur-xl">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Successfully removed from watchlist!</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900/95 border-red-800/50 backdrop-blur-xl w-full max-w-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Remove from Watchlist</h3>
                  <p className="text-sm sm:text-base text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              {itemToDelete && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Image
                      width={48}
                      height={72}
                      src={
                        itemToDelete.poster_path
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${itemToDelete.poster_path}`
                          : "/placeholder.svg?height=72&width=48"
                      }
                      alt={itemToDelete.title || "Media"}
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-white">{itemToDelete.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-400">{itemToDelete.media_type === "tv" ? "TV Show" : "Movie"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent h-10 sm:h-12 rounded-xl"
                  disabled={isRemoving}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 h-10 sm:h-12 rounded-xl"
                  disabled={isRemoving}
                >
                  {isRemoving ? "Removing..." : "Remove"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-gray-900/30 backdrop-blur-xl border-b border-gray-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 h-10 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    My Watchlist
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg">
                    {filteredWatchlist.length} {filteredWatchlist.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-64 lg:w-80">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search your watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 w-full h-10 sm:h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 rounded-xl backdrop-blur-sm"
                />
              </div>

              {/* View Mode Toggle */}
              </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error State */}
        {error && (
          <Alert className="mb-6 sm:mb-8 bg-red-900/20 border-red-800/50 text-red-300 backdrop-blur-xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error: {error}</AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {filteredWatchlist.length === 0 && !searchQuery && (
          <div className="text-center py-12 sm:py-20">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your watchlist is empty
            </h3>
            <p className="text-gray-400 mb-8 sm:mb-10 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
              Start building your watchlist by adding movies and TV shows you want to watch later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 h-10 sm:h-12 px-6 sm:px-8 rounded-xl shadow-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Content
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => addToWatchList("550", "movie", "Fight Club", "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg")}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900/50 backdrop-blur-sm h-10 sm:h-12 px-6 sm:px-8 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sample Movie
              </Button>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {filteredWatchlist.length === 0 && searchQuery && (
          <div className="text-center py-12 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-2">No results found</h3>
            <p className="text-gray-400 text-base sm:text-lg">No items in your watchlist match "{searchQuery}"</p>
          </div>
        )}

        {/* Watchlist Grid */}
        {filteredWatchlist.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {filteredWatchlist.map((item) => (
              <Card
                key={`${item.media_id}-${item.media_type}`}
                className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:from-gray-700/50 hover:to-gray-800/50 hover:border-red-600/30 transition-all duration-500 group overflow-hidden backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Poster */}
                    <Link href={`${getInfoUrl(item)}`} className="block">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <Image
                        width={400}
                        height={600}
                        src={
                          item.poster_path
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.poster_path}`
                            : "/placeholder.svg?height=600&width=400"
                        }
                        alt={item.title || "Media"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Action Buttons */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <Link href={getWatchUrl(item)}>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 rounded-full shadow-2xl">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 fill-current" />
                            Watch
                          </Button>
                        </Link>
                        <Link href={getInfoUrl(item)}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                          >
                            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </Link>
                      </div>

                      {/* Media Type Badge */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <Badge
                          className={`${
                            item.media_type === "tv" ? "bg-blue-600/90" : "bg-purple-600/90"
                          } backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm`}
                        >
                          {item.media_type === "tv" ? (
                            <Tv className="w-3 h-3 sm:w-3 sm:h-3 mr-1" />
                          ) : (
                            <Film className="w-3 h-3 sm:w-3 sm:h-3 mr-1" />
                          )}
                          {item.media_type === "tv" ? "TV" : "Movie"}
                        </Badge>
                      </div>

                      {/* Remove Button */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => showDeleteConfirm(item)}
                          className="bg-red-600/90 hover:bg-red-700 backdrop-blur-sm rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Rating */}
                      {item.vote_average && (
                        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                          <span className="text-xs sm:text-sm font-bold">{item.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                      </Link>
                    {/* Content Info */}
                    <div className="p-4 sm:p-6">
                      <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
                        {item.title}
                      </h3>

                      {item.release_date && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">{formatDate(item.release_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Watchlist List */}
        {filteredWatchlist.length > 0 && viewMode === "list" && (
          <div className="space-y-4">
            {filteredWatchlist.map((item) => (
              <Card
                key={`${item.media_id}-${item.media_type}`}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-red-600/30 transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6"
              >
                <Image
                  width={100}
                  height={150}
                  src={
                    item.poster_path
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.poster_path}`
                      : "/placeholder.svg?height=150&width=100"
                  }
                  alt={item.title || "Media"}
                  className="w-24 sm:w-32 h-auto object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base sm:text-lg line-clamp-1 text-white">{item.title}</h3>
                    <Badge
                      className={`${
                        item.media_type === "tv" ? "bg-blue-600/90" : "bg-purple-600/90"
                      } backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm`}
                    >
                      {item.media_type === "tv" ? (
                        <Tv className="w-3 h-3 sm:w-3 sm:h-3 mr-1" />
                      ) : (
                        <Film className="w-3 h-3 sm:w-3 sm:h-3 mr-1" />
                      )}
                      {item.media_type === "tv" ? "TV" : "Movie"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{formatDate(item.release_date)}</span>
                    {item.vote_average && (
                      <div className="flex items-center gap-1 sm:gap-2 ml-4">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm font-bold">{item.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Link href={getWatchUrl(item)}>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 rounded-full">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 fill-current" />
                        Watch
                      </Button>
                    </Link>
                    <Link href={getInfoUrl(item)}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                      >
                        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => showDeleteConfirm(item)}
                      className="bg-red-600/90 hover:bg-red-700 backdrop-blur-sm rounded-full"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Skeleton Component
function WatchlistSkeleton() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gray-900/30 border-b border-gray-800/50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-10 w-20 bg-gray-700 rounded-xl" />
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-700 rounded-2xl" />
              <div>
                <div className="h-6 sm:h-8 w-32 sm:w-40 bg-gray-700 rounded-xl mb-2" />
                <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-700 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="h-10 sm:h-12 w-full sm:w-64 lg:w-80 bg-gray-700 rounded-xl" />
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-700 rounded-xl" />
              <div className="h-10 w-10 bg-gray-700 rounded-xl" />
            </div>
            <div className="h-10 w-24 sm:w-32 bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="aspect-[2/3] bg-gray-700" />
              <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                <div className="h-5 sm:h-6 w-3/4 bg-gray-700 rounded-xl" />
                <div className="h-4 sm:h-4 w-1/2 bg-gray-700 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}