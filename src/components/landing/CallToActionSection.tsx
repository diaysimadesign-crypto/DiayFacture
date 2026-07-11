"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CallToActionSection() {
  return (
    <section className="py-section-gap px-container-padding relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-primary opacity-5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-fixed rounded-full blur-[120px] opacity-30 -z-10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-on-background mb-6">
          Rejoignez les entrepreneurs qui facturent comme des <span className="gradient-text">pros.</span>
        </h2>
        
        <Link href="/register" passHref>
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center bg-primary text-on-primary font-label-bold text-label-bold px-6 py-4 rounded-[12px] shadow-xl shadow-primary/30 text-base"
          >
            Commencer gratuitement dès maintenant
          </motion.button>
        </Link>
        <p className="mt-6 text-on-surface-variant font-body-md text-sm">Aucune carte de crédit requise. Essai de 14 jours sur les plans payants.</p>
      </motion.div>
    </section>
  );
}
