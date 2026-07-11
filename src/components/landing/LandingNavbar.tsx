"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl w-full top-0 sticky z-50 border-b border-outline-variant/30 dark:border-outline-variant/10 shadow-sm">
      <div className="flex justify-between items-center w-full px-container-padding max-w-[1280px] mx-auto h-20">
        {/* Brand */}
        <Link
          href="/"
          className="font-headline-md text-headline-md font-extrabold text-primary dark:text-primary-fixed-dim tracking-tighter flex items-center gap-2"
        >
          <Wallet className="h-8 w-8 text-primary" />
          PAYIFY
        </Link>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#fonctionnalites"
            className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md"
          >
            Fonctionnalités
          </Link>
          <Link
            href="#tarification"
            className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md"
          >
            Tarification
          </Link>
          <Link
            href="#temoignages"
            className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md"
          >
            Témoignages
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="hidden md:inline-flex items-center justify-center bg-primary text-on-primary font-label-bold text-label-bold px-6 py-3 rounded-[12px] hover:bg-primary-container transition-colors duration-200"
          >
            Commencer gratuitement
          </Link>
          <button
            className="md:hidden text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-surface border-b border-outline-variant/30 overflow-hidden"
          >
            <div className="px-container-padding py-4 flex flex-col gap-4">
              <Link
                href="#fonctionnalites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-on-surface-variant hover:text-primary font-body-md text-body-md py-2"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#tarification"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-on-surface-variant hover:text-primary font-body-md text-body-md py-2"
              >
                Tarification
              </Link>
              <Link
                href="#temoignages"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-on-surface-variant hover:text-primary font-body-md text-body-md py-2"
              >
                Témoignages
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-primary text-on-primary font-label-bold text-label-bold px-6 py-3 rounded-[12px] hover:bg-primary-container transition-colors duration-200 mt-2 text-center"
              >
                Commencer gratuitement
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
