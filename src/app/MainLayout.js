import React from 'react'
import { motion } from "framer-motion";
import { Navbar } from '@/components/Navbar/navbar';
import { useSelector } from 'react-redux';
import MobileMenu from '@/components/Navbar/MobileMenu';

const MainLayout = ({children}) => {
  
  // Define colors based on theme
  
  return (
   
    <div className={`min-h-screen transition-colors dark duration-300  bg-background text-white`}>
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