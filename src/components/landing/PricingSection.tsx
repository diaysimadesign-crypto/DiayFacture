"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-section-gap px-container-padding bg-surface-bright" id="tarification">
      <div className="max-w-[1280px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">Des tarifs simples et transparents</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Choisissez le plan qui correspond à la taille de votre entreprise.</p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        >
          {/* Plan Gratuit */}
          <motion.div variants={item} className="glass-card rounded-[24px] p-8">
            <h3 className="font-headline-md text-headline-md text-xl mb-2">Gratuit</h3>
            <div className="mb-6">
              <span className="font-display-lg-mobile text-display-lg-mobile">0</span>
              <span className="text-on-surface-variant font-body-md">FCFA /mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-body-md text-body-md text-on-surface-variant">5 factures / mois</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-body-md text-body-md text-on-surface-variant">1 utilisateur</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-body-md text-body-md text-on-surface-variant">Modèles standards</span>
              </li>
            </ul>
            <Link href="/register" className="block w-full text-center py-3 rounded-lg bg-surface-container-low text-primary font-label-bold text-label-bold hover:bg-surface-container-high transition-colors">
              Commencer
            </Link>
          </motion.div>
          
          {/* Plan Pro (Mis en avant) */}
          <motion.div variants={item} className="bg-primary text-on-primary rounded-[24px] p-8 premium-shadow transform md:scale-105 relative z-10">
            <div className="absolute top-0 right-0 bg-secondary-fixed text-primary text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-[24px] uppercase tracking-wider">Populaire</div>
            <h3 className="font-headline-md text-headline-md text-xl mb-2">Pro</h3>
            <div className="mb-6">
              <span className="font-display-lg-mobile text-display-lg-mobile">5 000</span>
              <span className="text-on-primary/80 font-body-md">FCFA /mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary-fixed-dim h-5 w-5" />
                <span className="font-body-md text-body-md">Factures illimitées</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary-fixed-dim h-5 w-5" />
                <span className="font-body-md text-body-md">1 utilisateur</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary-fixed-dim h-5 w-5" />
                <span className="font-body-md text-body-md">Personnalisation avancée</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary-fixed-dim h-5 w-5" />
                <span className="font-body-md text-body-md">Relances automatiques</span>
              </li>
            </ul>
            <Link href="/register" passHref>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block w-full text-center py-3 rounded-lg bg-white text-primary font-label-bold text-label-bold hover:bg-surface-container-lowest transition-colors"
              >
                S&apos;abonner au Pro
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Plan Business */}
          <motion.div variants={item} className="glass-card rounded-[24px] p-8">
            <h3 className="font-headline-md text-headline-md text-xl mb-2">Business</h3>
            <div className="mb-6">
              <span className="font-display-lg-mobile text-display-lg-mobile">15 000</span>
              <span className="text-on-surface-variant font-body-md">FCFA /mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-body-md text-body-md text-on-surface-variant">Tout du plan Pro</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-body-md text-body-md text-on-surface-variant">Jusqu&apos;à 5 utilisateurs</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-body-md text-body-md text-on-surface-variant">Rôles et permissions</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-body-md text-body-md text-on-surface-variant">Support prioritaire</span>
              </li>
            </ul>
            <Link href="/register" className="block w-full text-center py-3 rounded-lg bg-surface-container-low text-primary font-label-bold text-label-bold hover:bg-surface-container-high transition-colors">
              S&apos;abonner au Business
            </Link>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
