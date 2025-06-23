"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MovieCard from "./cardContent"
import MovieCardSkeleton from "./cardSkeleton"

const MovieCarousel = ({
title = "Movie Collection",
children,
items = [],
renderItem,
className = "",
showControls = true,
}) => {
const [currentIndex, setCurrentIndex] = useState(0)
const scrollContainerRef = useRef(null)
const [canScrollLeft, setCanScrollLeft] = useState(false)
const [canScrollRight, setCanScrollRight] = useState(true)

// Calculate total items (either from children or items array)
const totalItems = children ? React.Children.count(children) : items.length

// Responsive items per view - 2 on small screens, 6 on large screens
const getItemsPerView = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth >= 1024 ? 5 : 2
  }
  return 6
}

const [itemsPerView, setItemsPerView] = useState(getItemsPerView())

// Update items per view on window resize
useEffect(() => {
  const handleResize = () => {
    const newItemsPerView = getItemsPerView()
    setItemsPerView(newItemsPerView)
    setCurrentIndex(0)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0
    }
  }

  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])

// Calculate item width based on container and items per view
const getItemWidth = () => {
  if (!scrollContainerRef.current) return 0
  const containerWidth = scrollContainerRef.current.offsetWidth
  return containerWidth / itemsPerView
}

// Update scroll button states
const updateScrollButtons = () => {
  if (!scrollContainerRef.current) return

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
  setCanScrollLeft(scrollLeft > 0)
  setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
}

// Handle scroll events
const handleScroll = () => {
  updateScrollButtons()

  if (!scrollContainerRef.current) return
  const itemWidth = getItemWidth()
  const newIndex = Math.round(scrollContainerRef.current.scrollLeft / itemWidth)
  setCurrentIndex(newIndex)
}

// Navigation functions
const goToPrevious = () => {
  if (!scrollContainerRef.current) return
  const itemWidth = getItemWidth()
  const newScrollLeft = Math.max(0, scrollContainerRef.current.scrollLeft - itemWidth)

  scrollContainerRef.current.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  })
}

const goToNext = () => {
  if (!scrollContainerRef.current) return
  const itemWidth = getItemWidth()
  const maxScrollLeft = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
  const newScrollLeft = Math.min(maxScrollLeft, scrollContainerRef.current.scrollLeft + itemWidth)

  scrollContainerRef.current.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  })
}

// Initialize scroll button states
useEffect(() => {
  updateScrollButtons()
}, [totalItems, itemsPerView])

// Handle wheel scrolling
const handleWheel = (e) => {
  if (!scrollContainerRef.current) return

  // Allow horizontal scrolling with wheel
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return // Let native horizontal scroll handle it
  }

  e.preventDefault()
  const itemWidth = getItemWidth()
  const scrollAmount = e.deltaY > 0 ? itemWidth : -itemWidth

  scrollContainerRef.current.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  })
}

return (
  <div className={`w-full ${className}`}>
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-gray-400 text-sm">
          {totalItems} item{totalItems !== 1 ? "s" : ""} • Showing {itemsPerView} per view
        </p>
      </div>
    </div>

    {/* Carousel Container */}
    <div className="relative">
      {/* Navigation Buttons */}
      {showControls && totalItems > itemsPerView && (
        <>
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 border-gray-600 text-white hover:bg-gray-700 backdrop-blur-sm rounded-full w-10 h-10 p-0 shadow-lg transition-opacity"
            disabled={!canScrollLeft}
            style={{ opacity: canScrollLeft ? 1 : 0.5 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            onClick={goToNext}
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 border-gray-600 text-white hover:bg-gray-700 backdrop-blur-sm rounded-full w-10 h-10 p-0 shadow-lg transition-opacity"
            disabled={!canScrollRight}
            style={{ opacity: canScrollRight ? 1 : 0.5 }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Scrollable Container with Native Scrollbar */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
        onScroll={handleScroll}
        onWheel={handleWheel}
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
        }}
      >
        <div
          className="flex gap-4 pb-4"
          style={{
            width: "max-content",
          }}
        >
          {/* Render children or items */}
         
          {children
            ? React.Children.map(children, (child, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{
                    width: `calc((100vw - 2rem) / ${itemsPerView} - 1rem)`,
                    maxWidth: `calc((1280px - 2rem) / ${itemsPerView} - 1rem)`,
                    scrollSnapAlign: "start",
                  }}
                >
                  {child}
                </div>
              ))
            : items.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{
                    width: `calc((100vw - 2rem) / ${itemsPerView} - 1rem)`,
                    maxWidth: `calc((1280px - 2rem) / ${itemsPerView} - 1rem)`,
                    scrollSnapAlign: "start",
                  }}
                >
                  <MovieCard movie={item} />
                </div>
              ))}
        </div>
      </div>

      {/* Empty State */}
      {totalItems === 0 && (
        <div 
        
        
        className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
        >
          {!items.length && !children && (Array.from({ length: 10 }).map((_, index) => (
            <div
            key={index}
            className="flex-shrink-0"
            style={{
              width: `calc((100vw - 2rem) / ${itemsPerView} - 1rem)`,
              maxWidth: `calc((1280px - 2rem) / ${itemsPerView} - 1rem)`,
              scrollSnapAlign: "start",
            }}
          >
            <MovieCardSkeleton />
            </div>
          )))}
         
        </div>
      )}
    </div>

    {/* Carousel Info */}
    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
      <span>
        Viewing items {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, totalItems)} of {totalItems}
      </span>
      <span className="text-gray-600">Scroll horizontally or use arrow buttons to navigate</span>
    </div>
  </div>
)
}


export default MovieCarousel
