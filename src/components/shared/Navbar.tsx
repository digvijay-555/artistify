'use client'

import Link from 'next/link';
import React, { memo, useState } from 'react';
import OriginAuthButton from '@/components/cta/OriginAuthButton';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import GoToPortfolio from '../cta/GoToPortfolio';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full h-16 border-b border-gray-800/50 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-medium text-lg hidden sm:block">Artistify</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/collection" 
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm font-medium"
              >
                Collections
              </Link>
              <Link 
                href="/listen" 
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm font-medium"
              >
                Listen
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search artists, tracks..."
                  className="w-full h-9 pl-10 pr-4 bg-[#131316] border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3 h-3" />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <OriginAuthButton />
              <GoToPortfolio />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-orange-400 transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-[#0a0a0a] sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-10 pr-4 bg-[#131316] border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3 h-3" />
            </div>

            {/* Mobile Navigation */}
            <div className="flex flex-col gap-3">
              <Link 
                href="/collection" 
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm font-medium py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link 
                href="/listen" 
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm font-medium py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Listen
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex flex-col gap-3 pt-2 border-t border-gray-800">
              <OriginAuthButton />
              <GoToPortfolio />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Navbar);