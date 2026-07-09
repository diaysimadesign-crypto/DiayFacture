"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye } from 'lucide-react';
import { useInvoiceStore } from '@/store/invoice-store';

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'payee':
      return <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Payée</span>;
    case 'envoyee':
      return <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">Envoyée</span>;
    case 'en retard':
      return <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">En retard</span>;
    case 'brouillon':
      return <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">Brouillon</span>;
    default:
      return null;
  }
};

export default function InvoicesPage() {
  const { invoices } = useInvoiceStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'tous' || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Factures</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez toutes vos factures ici.</p>
        </div>
        <Link 
          href="/invoices/new" 
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-background p-4 rounded-xl border border-border shadow-sm">
        <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['tous', 'brouillon', 'envoyee', 'payee', 'en retard'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                filter === status 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un client ou n°..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Numéro</th>
                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Client</th>
                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Date d&apos;émission</th>
                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Échéance</th>
                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground text-right">Montant</th>
                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Statut</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                      <Link href={`/invoices/${encodeURIComponent(invoice.id)}`} className="hover:text-primary transition-colors">
                        {invoice.id}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-foreground">{invoice.client}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-foreground font-semibold text-right">{invoice.amount}</td>
                    <td className="whitespace-nowrap px-6 py-4">{getStatusBadge(invoice.status)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/invoices/${encodeURIComponent(invoice.id)}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune facture trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
