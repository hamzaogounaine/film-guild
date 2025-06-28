"use client"

import React from "react"
import { Clapperboard, HomeIcon, Search, Tv2Icon, MonitorPlayIcon as TvMinimalPlay } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/authContext"

const MobileMenu = () => {
  const navItems = [
    { label: "Home", href: "/", icon: <HomeIcon size={24} /> },
    { label: "Movies", href: "/movie", icon: <Clapperboard size={24} /> },
    { label: "Search", href: "/search", icon: <Search size={24} /> },
    { label: "TV Shows", href: "/tv", icon: <Tv2Icon size={24} /> },
    { label: "Watchlist", href: "/watchlist", icon: <TvMinimalPlay size={24} /> },
  ]

  const path = usePathname()
  const { user, loading } = useAuth()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="w-full p-2 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 shadow-2xl">
        <div className="flex justify-between">
          <div className="flex gap-1 w-full">
            {navItems.map((el, index) => {
              const isActive = el.href === path
              return (
                <Link
                  key={index}
                  href={el.href}
                  className={`flex-1 transition-all duration-300 rounded-lg ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg transform scale-105"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-95"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1 py-2 w-full justify-center">
                    <div className="flex-shrink-0">
                      {React.cloneElement(el.icon, {
                        size: typeof window !== "undefined" && window.innerWidth < 640 ? 18 : 20,
                      })}
                    </div>
                    <span className={`text-xs ${isActive ? "font-bold" : "font-medium"} text-center leading-tight`}>
                      {el.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
