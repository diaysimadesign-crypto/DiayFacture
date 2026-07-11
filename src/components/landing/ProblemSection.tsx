"use client";

import { motion } from "framer-motion";
import { FileWarning, Calculator, Banknote } from "lucide-react";

export default function ProblemSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-section-gap bg-surface-container-low px-container-padding relative">
      <div className="max-w-[1280px] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">Fini les maux de tête</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Gérer son entreprise ne devrait pas être un parcours du combattant.</p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
        >
          {/* Card 1 */}
          <motion.div variants={item} className="glass-card rounded-[24px] p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mb-6">
              <FileWarning size={24} />
            </div>
            <h3 className="font-headline-md text-headline-md text-lg mb-2">Factures non professionnelles</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Des documents bricolés qui nuisent à votre image de marque auprès des clients.</p>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div variants={item} className="glass-card rounded-[24px] p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mb-6">
              <Calculator size={24} />
            </div>
            <h3 className="font-headline-md text-headline-md text-lg mb-2">Calculs manuels de TVA (18%)</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Perte de temps et risque d&apos;erreurs sur chaque devis et facture émis.</p>
          </motion.div>
          
          {/* Card 3 */}
          <motion.div variants={item} className="glass-card rounded-[24px] p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mb-6">
              <Banknote size={24} />
            </div>
            <h3 className="font-headline-md text-headline-md text-lg mb-2">Suivi des impayés impossible</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Oublier de relancer, c&apos;est de l&apos;argent perdu. Reprenez le contrôle de votre trésorerie.</p>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
