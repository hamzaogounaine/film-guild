"use client"

import { useState, useEffect } from "react"
import {
  Clapperboard,
  HomeIcon,
  Search,
  Tv2Icon,
  MonitorPlayIcon as TvMinimalPlay,
  User,
  LogIn,
  UserPlus,
} from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/authContext"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import AuthModal from "./auth-modal"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const { user, loading } = useAuth()
  const path = usePathname()
  const router = useRouter()

  const handleSignout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error.message)
        return
      }
      router.push("/")
    } catch (error) {
      console.error("Unexpected error during sign-out:", error)
    }
  }

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  useEffect(() => {
    if (user) {
      setShowAuthModal(false)
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    // { name: "Home", href: "/", icon: <HomeIcon size={20} /> },
    // { name: "Movies", href: "/movie", icon: <Clapperboard size={20} /> },
    // { name: "TV Shows", href: "/tv", icon: <Tv2Icon size={20} /> },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-primary/20 shadow-sm ${
          isScrolled ? "bg-background/80" : "bg-background/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href={"/"}
                className={`logo text-3xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-foreground" : "text-foreground"
                }`}
              >
                Film <span className="text-red-500">Guild</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-primary 
                      text-foreground rounded-lg ${item.href === path ? "bg-foreground/10 text-primary" : ""}`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop CTA Button */}
            <div className="md:flex gap-3 justify-center">
              <Button className={"cursor-pointer max-md:hidden"} variant={"outline"}>
                <Link href={"/search"}>
                  <Search />
                </Link>
              </Button>

              <Link href={"/watchlist"}>
                <Button
                  variant={"outline"}
                  className={`transition-all duration-300 max-md:hidden
                    border-foreground text-foreground hover:bg-foreground hover:text-primary cursor-pointer`}
                >
                  <TvMinimalPlay />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                {user ? (
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSignout()}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                ) : (
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => openAuthModal("login")}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openAuthModal("register")}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
