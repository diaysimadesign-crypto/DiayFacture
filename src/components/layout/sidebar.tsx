/* eslint-disable @next/next/no-img-element */
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';

const mainNavigation = [
  { name: "Vue d'ensemble", href: '/', icon: LayoutDashboard, current: true },
  { name: 'Factures', href: '/invoices', icon: FileText, current: false },
  { name: 'Clients', href: '/clients', icon: Users, current: false },
  { name: 'Produits', href: '/products', icon: Package, current: false },
];

const otherNavigation = [
  { name: 'Paramètres', href: '/settings', icon: Settings, current: false },
  { name: 'Support', href: '/support', icon: HelpCircle, current: false },
];

export default function Sidebar({ onLinkClick }: { onLinkClick?: () => void } = {}) {
  const pathname = usePathname();
  const { profile } = useSettingsStore();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-white">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
        <span className="text-xl font-bold tracking-wider text-white">DiayFacture</span>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-8">
          
          {/* Main Menu */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Main</h3>
            <ul className="space-y-1">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onLinkClick}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                    {item.name}
                  </Link>
                </li>
              )})}
            </ul>
          </div>

          {/* Other Menu */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Autres</h3>
            <ul className="space-y-1">
              {otherNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onLinkClick}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                    {item.name}
                  </Link>
                </li>
              )})}
            </ul>
          </div>
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <Link href="/settings" onClick={onLinkClick} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-primary/30 flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name ? profile.name.slice(0, 2).toUpperCase() : 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{profile.name}</p>
            <p className="text-xs text-white/50 truncate">{profile.email}</p>
          </div>
        </Link>
        <button 
          onClick={async () => {
            const { useAuthStore } = await import('@/store/auth-store');
            await useAuthStore.getState().signOut();
            window.location.href = '/login';
          }}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
