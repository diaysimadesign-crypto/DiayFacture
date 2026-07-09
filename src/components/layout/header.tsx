"use client";

import { useState, useRef, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/layout/mobile-nav';
import { useSettingsStore } from '@/store/settings-store';
import { useInvoiceStore } from '@/store/invoice-store';

export default function Header() {
  const { profile } = useSettingsStore();
  const { invoices } = useInvoiceStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 sm:gap-x-6 sm:px-6 lg:px-8 print:hidden">
      {/* Mobile Navigation (Hamburger + Drawer) */}
      <MobileNav />

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1 items-center max-w-md transition-all duration-300 ease-in-out focus-within:max-w-xl" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Rechercher
          </label>
          <div className="relative w-full group">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block w-full rounded-full border border-transparent bg-muted/50 py-2 pl-11 pr-4 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:outline-none"
              placeholder="Rechercher une facture, un client..."
              type="search"
              name="search"
            />
          </div>
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          {/* Notification Button */}
          <div className="relative" ref={notifRef}>
            <button 
              type="button" 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground transition-colors relative"
            >
              <span className="sr-only">Voir les notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
              {recentInvoices.length > 0 && (
                <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              )}
            </button>
            
            {/* Dropdown menu */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-background p-4 shadow-lg z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  <button onClick={() => setIsNotifOpen(false)} className="text-xs text-primary hover:underline">Fermer</button>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {recentInvoices.length > 0 ? (
                    recentInvoices.map((invoice, i) => (
                      <div key={invoice.id} className="flex gap-3 text-sm">
                        <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          invoice.status.toLowerCase().includes('pay') ? 'bg-emerald-500' :
                          invoice.status.toLowerCase().includes('envoy') ? 'bg-orange-500' :
                          invoice.status.toLowerCase().includes('retard') ? 'bg-red-500' :
                          'bg-slate-500'
                        }`} />
                        <div>
                          <p className="text-foreground">
                            Facture <strong>{invoice.id}</strong> ({invoice.status})
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{invoice.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucune notification</p>
                  )}
                </div>
                {recentInvoices.length > 0 && (
                  <Link href="/invoices" onClick={() => setIsNotifOpen(false)} className="block w-full text-center mt-4 pt-3 border-t border-border text-xs text-primary font-medium hover:underline">
                    Voir toutes les factures
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* Profile Dropdown Placeholder */}
          <Link href="/settings" className="flex items-center gap-x-4 hover:opacity-80 transition-opacity">
             <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm ring-2 ring-background overflow-hidden">
               {profile.avatar ? (
                 <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
               ) : (
                 profile.name ? profile.name.slice(0, 2).toUpperCase() : 'U'
               )}
             </div>
             <span className="hidden lg:flex lg:items-center">
               <span className="text-sm font-medium leading-6 text-foreground" aria-hidden="true">
                 {profile.name}
               </span>
             </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
