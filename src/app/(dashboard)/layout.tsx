"use client";

import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useClientStore } from '@/store/client-store';
import { useProductStore } from '@/store/product-store';
import { useInvoiceStore } from '@/store/invoice-store';
import { useSettingsStore } from '@/store/settings-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { session, isLoading: isAuthLoading, initializeAuth } = useAuthStore();
  const { fetchClients } = useClientStore();
  const { fetchProducts } = useProductStore();
  const { fetchInvoices } = useInvoiceStore();
  const { fetchSettings } = useSettingsStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push('/login');
    } else if (session) {
      // Fetch data when user is authenticated
      fetchClients();
      fetchProducts();
      fetchInvoices();
      fetchSettings();
    }
  }, [session, isAuthLoading, router, fetchClients, fetchProducts, fetchInvoices, fetchSettings]);

  if (isAuthLoading) {
    return <div className="flex h-screen items-center justify-center bg-muted/30">Chargement...</div>;
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col print:hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64 h-screen overflow-hidden print:lg:pl-0 print:h-auto print:overflow-visible">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 print:p-0 print:overflow-visible">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
