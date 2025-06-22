"use client";

import { useState, useEffect } from "react";
import {
  Clapperboard,
  HomeIcon,
  MagnetIcon,
  Menu,
  Moon,
  MoveIcon,
  Search,
  Sun,
  Tv2Icon,
  TvIcon,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import FuzzyText from "../effects/fuzzyText";
import Link from "next/link";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: <HomeIcon size={20} /> },
    { name: "Movies", href: "#about", icon: <Clapperboard size={20} /> },
    { name: "TV Shows", href: "#services", icon: <Tv2Icon size={20} /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0  right-0 z-50 transition-all duration-300  backdrop-blur-md border-b border-primary/20 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              className={`logo text-2xl transition-colors duration-300 ${
                isScrolled ? "text-foreground" : "text-foreground"
              }`}
            >
              <FuzzyText
                baseIntensity={0.05}
                hoverIntensity={0.2}
                enableHover={true}
              >
                Film Guild
              </FuzzyText>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-primary ${
                    isScrolled
                      ? "text-foreground hover:text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex gap-3 justify-center">
            <Button
              variant={"outline"}
              className={`transition-all duration-300 
                  border-foreground text-foreground hover:bg-foreground hover:text-primary cursor-pointer
              `}
            >
              Watch List
            </Button>
            <Button className={'cursor-pointer'} variant={"outline"}>
              <Link href={"/search"}>
                <Search />
              </Link>
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-3">
            {/* <Button variant={isScrolled ? "default" : "outline"}  className={`transition-all duration-300 ${
                isScrolled
                  ? "bg-foreground hover:bg-foreground/90 text-background"
                  : "border-foreground text-foreground hover:bg-foreground hover:text-primary"
              }`}>
                <Search />
              </Button> */}
            {/* <Button onClick={() => dispatch(toggleTheme())}>
                {theme === "light" ? <Moon /> : <Sun />}
              </Button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
