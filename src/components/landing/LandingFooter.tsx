import Link from "next/link";
import { Wallet } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-surface-container-low dark:bg-inverse-surface w-full">
      <div className="w-full px-container-padding py-stack-lg max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-base">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="font-headline-md text-headline-md font-extrabold text-primary dark:text-primary-fixed-dim flex items-center gap-2">
            <Wallet className="h-7 w-7 text-primary" />
            PAYIFY
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant text-sm">
            © {new Date().getFullYear()} PAYIFY. Fait avec fierté en Afrique
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="#fonctionnalites" className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#tarification" className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
            Tarification
          </Link>
          <Link href="#temoignages" className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
            Témoignages
          </Link>
          <Link href="#" className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
            Confidentialité
          </Link>
          <Link href="#" className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
            Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
