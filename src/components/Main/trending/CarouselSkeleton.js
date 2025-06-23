"use client"



const CarouselCardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`bg-gray-800 max-md:items-end items-center rounded-lg shadow-lg flex text-white h-screen relative max-md:h-[calc(100vh-4rem)] animate-pulse ${className}`}
    >
      {/* Background skeleton with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg" />

      {/* Content skeleton */}
      <div className="md:w-1/4 gap-3 flex flex-col max-md:ms-6 ms-32 justify-center relative z-10 max-md:mb-16 max-md:w-full max-md:gap-2">
        {/* Logo skeleton */}
        <div className="w-full mb-2 max-md:w-1/2">
          <div className="h-12 w-32 bg-gray-600 rounded animate-pulse" />
        </div>

        {/* Rating and year skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-gray-600 rounded animate-pulse" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="h-4 w-8 bg-gray-600 rounded animate-pulse" />
          <div className="w-4 h-4 bg-gray-600 rounded animate-pulse" />
        </div>

        {/* Overview skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-600 rounded animate-pulse max-md:h-3" />
          <div className="h-4 w-11/12 bg-gray-600 rounded animate-pulse max-md:h-3" />
          <div className="h-4 w-4/5 bg-gray-600 rounded animate-pulse max-md:h-3" />
          <div className="h-4 w-3/4 bg-gray-600 rounded animate-pulse max-md:h-3" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-2 mt-4">
          <div className="h-10 w-20 bg-gray-600 rounded-md animate-pulse" />
          <div className="h-10 w-28 bg-gray-600 rounded-md animate-pulse ml-2" />
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  )
}

export default CarouselCardSkeleton
