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
      return `/watch/tv/${item.media_id}/1/1`
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
    router.push("/signin")
    return null
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      {/* Delete Success Alert */}
      {deleteSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Alert className="bg-green-900/20 border-green-800/50 text-green-300 backdrop-blur-xl">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Successfully removed from watchlist!</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900/95 border-red-800/50 backdrop-blur-xl max-w-md w-full">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Remove from Watchlist</h3>
                  <p className="text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              {itemToDelete && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Image
                      width={60}
                      height={90}
                      src={
                        itemToDelete.poster_path
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${itemToDelete.poster_path}`
                          : "/placeholder.svg?height=90&width=60"
                      }
                      alt={itemToDelete.title || "Media"}
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{itemToDelete.title}</h4>
                      <p className="text-sm text-gray-400">{itemToDelete.media_type === "tv" ? "TV Show" : "Movie"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  disabled={isRemoving}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    My Watchlist
                  </h1>
                  <p className="text-gray-400 text-lg">
                    {filteredWatchlist.length} {filteredWatchlist.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search your watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-80 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 rounded-xl backdrop-blur-sm"
                />
              </div>

              {/* View Mode Toggle */}
             

              
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <Alert className="mb-8 bg-red-900/20 border-red-800/50 text-red-300 backdrop-blur-xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error: {error}</AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {filteredWatchlist.length === 0 && !searchQuery && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Heart className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your watchlist is empty
            </h3>
            <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">
              Start building your watchlist by adding movies and TV shows you want to watch later.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 h-12 px-8 rounded-xl shadow-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Content
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => addToWatchList("550", "movie", "Fight Club", "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg")}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900/50 backdrop-blur-sm h-12 px-8 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sample Movie
              </Button>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {filteredWatchlist.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-gray-400 text-lg">No items in your watchlist match &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {/* Watchlist Grid */}
        {filteredWatchlist.length > 0 && viewMode === "grid" && (
          <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredWatchlist.map((item) => (
              <Card
                key={`${item.media_id}-${item.media_type}`}
                className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:from-gray-700/50 hover:to-gray-800/50 hover:border-red-600/30 transition-all duration-500 group overflow-hidden backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Poster */}
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
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <Link href={getWatchUrl(item)}>
                          <Button size="lg" className="bg-red-600 hover:bg-red-700 rounded-full shadow-2xl">
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            Watch
                          </Button>
                        </Link>
                        <Link href={getInfoUrl(item)}>
                          <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                          >
                            <Info className="w-5 h-5" />
                          </Button>
                        </Link>
                      </div>

                      {/* Media Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={`${
                            item.media_type === "tv" ? "bg-blue-600/90" : "bg-purple-600/90"
                          } backdrop-blur-sm px-3 py-1`}
                        >
                          {item.media_type === "tv" ? (
                            <Tv className="w-3 h-3 mr-1" />
                          ) : (
                            <Film className="w-3 h-3 mr-1" />
                          )}
                          {item.media_type === "tv" ? "TV" : "Movie"}
                        </Badge>
                      </div>

                      {/* Remove Button */}
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => showDeleteConfirm(item)}
                          className="bg-red-600/90 hover:bg-red-700 backdrop-blur-sm rounded-full w-10 h-10 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Rating */}
                      {item.vote_average && (
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold">{item.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
                        {item.title}
                      </h3>

                      {item.release_date && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(item.release_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
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
      <div className="bg-gray-900/30 border-b border-gray-800/50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-10 w-20 bg-gray-700 rounded-xl" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-700 rounded-2xl" />
              <div>
                <div className="h-8 w-40 bg-gray-700 rounded-xl mb-2" />
                <div className="h-5 w-24 bg-gray-700 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-80 bg-gray-700 rounded-xl" />
            <div className="h-12 w-24 bg-gray-700 rounded-xl" />
            <div className="h-12 w-32 bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="aspect-[2/3] bg-gray-700" />
              <div className="p-6 space-y-3">
                <div className="h-6 w-3/4 bg-gray-700 rounded-xl" />
                <div className="h-4 w-1/2 bg-gray-700 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
