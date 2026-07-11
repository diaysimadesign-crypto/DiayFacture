"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthTabs() {
  const pathname = usePathname();
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';

  return (
    <div className="flex border-b border-outline-variant/30 mb-6">
      <Link 
        href="/login" 
        className={`flex-1 text-center py-3 font-label-bold text-sm transition-colors ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-background'}`}
      >
        Connexion
      </Link>
      <Link 
        href="/register" 
        className={`flex-1 text-center py-3 font-label-bold text-sm transition-colors ${isRegister ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-background'}`}
      >
        Inscription
      </Link>
    </div>
  );
}
