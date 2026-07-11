"use client";

import { motion } from "framer-motion";
import { Zap, Percent, Activity, Users } from "lucide-react";

export default function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-section-gap px-container-padding relative" id="fonctionnalites">
      <div className="max-w-[1280px] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-label-bold text-label-bold tracking-widest uppercase mb-2 block">Fonctionnalités</span>
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">Tout ce dont vous avez besoin</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Une suite d&apos;outils pensée pour la réalité des entrepreneurs africains.</p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-gutter"
        >
          {/* Feature 1 */}
          <motion.div variants={item} className="flex gap-6 p-6 rounded-[24px] bg-surface hover:bg-surface-container-low transition-colors duration-300 border border-transparent hover:border-outline-variant/20 group">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-xl mb-2">Factures professionnelles en 2 clics</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Générez des PDF impeccables à votre image en quelques secondes. Envoyez-les directement depuis l&apos;application.</p>
            </div>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div variants={item} className="flex gap-6 p-6 rounded-[24px] bg-surface hover:bg-surface-container-low transition-colors duration-300 border border-transparent hover:border-outline-variant/20 group">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Percent size={32} />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-xl mb-2">TVA 18% calculée automatiquement</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Conforme aux standards de l&apos;UEMOA/CEMAC. Fini les erreurs de calcul sur les lignes de facturation.</p>
            </div>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div variants={item} className="flex gap-6 p-6 rounded-[24px] bg-surface hover:bg-surface-container-low transition-colors duration-300 border border-transparent hover:border-outline-variant/20 group">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Activity size={32} />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-xl mb-2">Suivi des paiements en temps réel</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Tableau de bord clair de vos revenus. Sachez exactement qui a payé et qui vous doit de l&apos;argent.</p>
            </div>
          </motion.div>
          
          {/* Feature 4 */}
          <motion.div variants={item} className="flex gap-6 p-6 rounded-[24px] bg-surface hover:bg-surface-container-low transition-colors duration-300 border border-transparent hover:border-outline-variant/20 group">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users size={32} />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-xl mb-2">Gestion de clients intégrée</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Un mini-CRM pour garder l&apos;historique de vos relations commerciales, contacts et devis précédents.</p>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
