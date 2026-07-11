"use client";

import Link from "next/link";
import { PlayCircle, Zap, Calculator, PieChart, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-section-gap px-container-padding overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-fixed rounded-full blur-[100px] opacity-40 -z-10 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-secondary-fixed rounded-full blur-[80px] opacity-40 -z-10 pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center relative">
        
        {/* Floating Icons Background */}
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-10 left-10 md:left-20 text-primary opacity-30 z-0 hidden md:block"
        >
          <FileText size={48} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 left-1/3 text-accent opacity-30 z-0 hidden lg:block"
        >
          <PieChart size={64} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-primary mb-6">
            <Zap className="h-4 w-4" />
            <span className="font-label-bold text-label-bold text-sm">Facturation ultra-rapide</span>
          </div>
          
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-6">
            Dites adieu au chaos de la facturation sur <span className="gradient-text">Word et Excel.</span>
          </h1>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
            PAYIFY aide les entrepreneurs africains à créer des factures professionnelles, suivre leurs paiements et gérer leurs clients en un clin d&apos;œil.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex w-full sm:w-auto items-center justify-center bg-primary text-on-primary font-label-bold text-label-bold px-8 py-4 rounded-[12px] shadow-lg shadow-primary/20"
              >
                Commencer gratuitement
              </motion.button>
            </Link>
            
            <Link href="#fonctionnalites" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex w-full sm:w-auto items-center justify-center bg-surface-container-low text-primary font-label-bold text-label-bold px-8 py-4 rounded-[12px] hover:bg-secondary-container transition-colors duration-200"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Voir les détails
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] perspective-1000 z-10"
        >
          {/* Main Mockup Image */}
          <motion.img
            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
            className="w-full h-full object-contain filter drop-shadow-2xl rounded-2xl transform rotate-y-[-10deg] rotate-x-[5deg] transition-all duration-700 ease-out"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqG4XrvA8Fmd3x0gtJatm78TKNISlIoSf6UML1EQjnBfmJt8re_ePtHcsSM4a98Sm_t-iKIUxUAb_9ygYD6syssz0axt91bG4LMNvFzCxLUguFoWIFPCYQIViXe1BF84oVcq52QN_5SIwdm_ZdzM0lzlteXmwJWvsoydtfbn-8jF0TGy-D_b4VdxxWxf6V2mZ98ru6zWy95LF1zjLcj4SFXIisvCLPjAdFXSgTjtB2RuL8pkwGTe4RYeD1FeVIdrUYKLgWZrayZeY"
            alt="Interface PAYIFY"
          />
          
          {/* Floating Element 1 */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-1/4 -left-6 md:-left-12 bg-surface glass-card p-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
              <Calculator size={24} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-bold">TVA 18%</p>
              <p className="text-sm font-bold text-on-background">Automatique</p>
            </div>
          </motion.div>
          
          {/* Floating Element 2 */}
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-4 md:-right-8 bg-surface glass-card p-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <div className="bg-primary-container/20 p-2 rounded-full text-primary">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-bold">Facture #001</p>
              <p className="text-sm font-bold text-emerald-600">Payée</p>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
