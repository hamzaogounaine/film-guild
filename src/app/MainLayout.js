import React from 'react'
import { motion } from "framer-motion";
import { Navbar } from '@/components/Navbar/navbar';
import { useSelector } from 'react-redux';
import MobileMenu from '@/components/Navbar/MobileMenu';

const MainLayout = ({children}) => {
  const {theme} = useSelector(state => state.theme)
  
  // Define colors based on theme
  const patternColor = theme === 'dark' ? 'white' : 'black';
  
  return (
   
    <div className={`min-h-screen transition-colors ${theme} duration-300 ${theme === 'dark' ? 'bg-background text-white' : 'bg-white text-black'}`}>
    <div className="relative z-10">
      <Navbar />
      <main className=" ">
        {children}
      </main>
    </div>
    <div className='fixed bottom-0 md:hidden z-50'>
      <MobileMenu />
    </div>
    </div>
  )
}

export default MainLayout