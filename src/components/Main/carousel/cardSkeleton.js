"use client"



const MovieCardSkeleton = ({ size = "medium", showOverlay = true }) => {
  // Size configurations
  const sizeConfig = {
    small: {
      container: "h-80",
      poster: "h-48",
      title: "h-4",
      text: "h-3",
      padding: "p-3",
    },
    medium: {
      container: "h-96",
      poster: "h-60",
      title: "h-5",
      text: "h-3",
      padding: "p-4",
    },
    large: {
      container: "h-[28rem]",
      poster: "h-72",
      title: "h-6",
      text: "h-4",
      padding: "p-4",
    },
  }

  const config = sizeConfig[size]

  return (
    <div
      className={`${config.container} bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 animate-pulse`}
    >
      {/* Poster Image Skeleton */}
      <div className={`relative ${config.poster} bg-gray-700`}>
        {/* Poster placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600" />

        {/* Rating Badge Skeleton */}
        <div className="absolute top-3 right-3 bg-gray-600 rounded-full px-3 py-2 flex items-center gap-1">
          <div className="w-3 h-3 bg-black rounded-full" />
          <div className="w-6 h-3 bg-black rounded" />
        </div>

        {/* Media Type Badge Skeleton */}
        <div className="absolute top-2 left-2 bg-gray-600 rounded-full px-3 py-2 flex items-center gap-1">
          <div className="w-3 h-3 bg-black rounded" />
          <div className="w-12 h-3 bg-black rounded" />
        </div>

        {/* Adult Content Indicator Skeleton (sometimes visible) */}
        {Math.random() > 0.7 && (
          <div className="absolute bottom-3 right-3 bg-gray-600 rounded px-2 py-1">
            <div className="w-6 h-3 bg-black rounded" />
          </div>
        )}
      </div>

      {/* Movie/TV Show Info Skeleton */}
      <div className={`${config.padding} space-y-3 flex-1`}>
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className={`${config.title} bg-gray-700 rounded w-3/4`} />

          {/* Release Year and Country Skeleton */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-600 rounded" />
              <div className="w-8 h-3 bg-gray-600 rounded" />
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
            <div className="w-6 h-3 bg-gray-600 rounded" />
          </div>
        </div>

        {/* Genres Skeleton */}
        <div className="flex flex-wrap gap-1">
          <div className="h-5 w-16 bg-gray-700 rounded-full" />
          <div className="h-5 w-12 bg-gray-700 rounded-full" />
          {Math.random() > 0.5 && <div className="h-5 w-8 bg-gray-700 rounded-full" />}
        </div>

        {/* Overview Skeleton */}
        <div className="space-y-2">
          <div className={`${config.text} bg-gray-700 rounded w-full`} />
          <div className={`${config.text} bg-gray-700 rounded w-4/5`} />
          <div className={`${config.text} bg-gray-700 rounded w-2/3`} />
        </div>

        {/* Additional Info Skeleton */}
        <div className="flex items-center justify-between pt-1">
          <div className="w-16 h-3 bg-gray-700 rounded" />
          <div className="w-12 h-3 bg-gray-700 rounded" />
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  )
}

export default MovieCardSkeleton
