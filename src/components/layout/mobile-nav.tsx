"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground lg:hidden transition-colors" 
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Off-canvas menu for mobile */}
      {isOpen && (
        <div className="relative z-50 lg:hidden" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />

          <div className="fixed inset-0 flex">
            {/* Sidebar panel */}
            <div className="relative mr-16 flex w-full max-w-xs flex-1 transform transition-transform duration-300 ease-in-out">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button 
                  type="button" 
                  className="-m-2.5 p-2.5 rounded-md hover:bg-white/10 transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-foreground" aria-hidden="true" />
                </button>
              </div>
              
              {/* Render the Sidebar component directly */}
              <div className="flex h-full w-full bg-sidebar shadow-xl">
                 <Sidebar onLinkClick={() => setIsOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
