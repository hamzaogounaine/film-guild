import React from 'react'
import { Clapperboard, HomeIcon, List, Search, Tv2Icon, TvMinimalPlay } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Item } from '@radix-ui/react-dropdown-menu';

const MobileMenu = () => {
  const navItems = [
    { label: "Home", href: "/", icon: <HomeIcon size={24}/>  },
    { label: "Movies", href: "/movies", icon: <Clapperboard size={24}/>  },
    { label: "Search", href: "/search", icon: <Search size={24}/>  },
    { label: "TV Shows", href: "/services", icon: <Tv2Icon size={24}/>  },
    { label: "Watch List", href: "/watchlist", icon: <TvMinimalPlay size={24}/>  },

  ];

  const path = usePathname()
  const { user, loading } = useAuth();

  return (
    <div className='w-screen p-2 sm:p-4 bg-secondary h-16 border-t border-foreground'>
      <div className='flex justify-between  '>
        <div className='flex gap-1 sm:gap-2 md:gap-3 w-full'>
          {navItems.map((el, index) => {
            const isActive = el.href === path;
            return <Link key={index} href={el.href} className={`flex-1 transition-all duration-300 ${isActive ? 'bg-foreground text-background rounded-lg shadow-lg transform scale-105' : 'hover:scale-95'}`}>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1 sm:py-2 w-full justify-center">
                <div className="flex-shrink-0">
        
                  {React.cloneElement(el.icon, { size: typeof window !== 'undefined' && window.innerWidth < 640 ? 20 : 24 })}
                </div>
                <span className={`text-xs sm:text-sm md:text-base lg:text-lg ${navItems.length > 3 ? 'text-xs sm:text-sm' : ''} ${isActive ? 'font-bold' : ''} text-center leading-tight`}>
                  {el.label}
                </span>
              </div>
            </Link>
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileMenu