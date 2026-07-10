"use client";

import { useState } from 'react';
import { ArrowUpRight, MoreHorizontal, FileText, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoice-store';
import { useSettingsStore } from '@/store/settings-store';

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'payée':
    case 'payee':
      return <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Payée</span>;
    case 'envoyée':
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

export default function DashboardPage() {
  const { invoices } = useInvoiceStore();
  const { company } = useSettingsStore();
  const [timeframe, setTimeframe] = useState('mois');

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' ' + (company?.currency || 'FCFA');
  };

  const totalInvoices = invoices.length;
  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.rawAmount || 0), 0);
  const totalPaid = invoices.filter(inv => inv.status.toLowerCase() === 'payée' || inv.status.toLowerCase() === 'payee').reduce((acc, inv) => acc + (inv.rawAmount || 0), 0);
  const totalPending = invoices.filter(inv => inv.status.toLowerCase() !== 'payée' && inv.status.toLowerCase() !== 'payee' && inv.status.toLowerCase() !== 'brouillon').reduce((acc, inv) => acc + (inv.rawAmount || 0), 0);

  const stats = [
    { name: 'Total factures', value: totalInvoices.toString(), change: '', changeType: 'neutral', icon: FileText },
    { name: 'Montant facturé', value: formatCurrency(totalBilled), change: '', changeType: 'neutral', icon: ArrowUpRight },
    { name: 'Montant payé', value: formatCurrency(totalPaid), change: '', changeType: 'neutral', icon: CheckCircle2 },
    { name: 'Montant en attente', value: formatCurrency(totalPending), change: '', changeType: 'neutral', icon: Clock },
  ];

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  // Fake dynamic chart data based on timeframe
  const chartDataLength = timeframe === 'jour' ? 24 : timeframe === 'semaine' ? 7 : 12;
  const chartData = Array.from({ length: chartDataLength }, () => {
    // Generate pseudo-random data based on invoices length to make it look active
    return Math.max(10, Math.floor(Math.random() * 80) + (invoices.length * 2));
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Suivez vos revenus et gérez vos factures récentes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
          >
            <dt>
              <div className="absolute rounded-lg bg-primary/10 p-2.5">
                <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <p className="ml-12 truncate text-sm font-medium text-muted-foreground">{stat.name}</p>
            </dt>
            <dd className="ml-12 flex flex-wrap items-baseline gap-x-2 gap-y-1 pb-1 sm:pb-2">
              <p className="text-base lg:text-lg font-bold text-foreground">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-background p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Revenus</h2>
            <select 
              className="text-sm border-border rounded-md bg-transparent text-muted-foreground focus:ring-primary cursor-pointer ml-2"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="jour">Par jour</option>
              <option value="semaine">Par semaine</option>
              <option value="mois">Par mois</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] flex items-end justify-between gap-1 sm:gap-2 pt-4">
             {chartData.map((height, i) => {
               const colors = [
                 "bg-primary/40 hover:bg-primary/80",
                 "bg-indigo-400/40 hover:bg-indigo-400/80",
                 "bg-emerald-400/40 hover:bg-emerald-400/80",
                 "bg-amber-400/40 hover:bg-amber-400/80"
               ];
               const colorClass = colors[i % 4];
               return (
                 <div key={i} className={`w-full ${colorClass} rounded-t-sm transition-colors cursor-pointer relative group`} style={{ height: `${Math.min(height, 100)}%` }}>
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity z-10 pointer-events-none">
                      {formatCurrency(height * 15000)}
                   </div>
                 </div>
               );
             })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground border-t border-border pt-3">
             {timeframe === 'jour' && (
                <><span>00:00</span><span>12:00</span><span>23:59</span></>
             )}
             {timeframe === 'semaine' && (
                <><span>Lundi</span><span>Jeudi</span><span>Dimanche</span></>
             )}
             {timeframe === 'mois' && (
                <><span>Jan</span><span>Juin</span><span>Déc</span></>
             )}
          </div>
        </div>

        {/* Recent Activity/Feed */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-foreground mb-4">Activité Récente</h2>
          <div className="flex-1 space-y-6 overflow-y-auto">
             {recentInvoices.slice(0, 4).map((invoice) => (
                <div key={invoice.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:-translate-x-1/2 before:w-px before:bg-border last:before:hidden">
                  <div className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 ${
                    invoice.status.toLowerCase().includes('pay') ? 'bg-emerald-100 border-emerald-500' :
                    invoice.status.toLowerCase().includes('envoy') ? 'bg-orange-100 border-orange-500' :
                    invoice.status.toLowerCase().includes('retard') ? 'bg-red-100 border-red-500' :
                    'bg-slate-100 border-slate-500'
                  }`}></div>
                  <p className="text-sm text-foreground">Facture <strong>{invoice.id}</strong> ({invoice.status})</p>
                  <p className="text-xs text-muted-foreground">{invoice.date}</p>
                </div>
             ))}
             {recentInvoices.length === 0 && (
               <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
             )}
          </div>
          <Link href="/invoices" className="w-full mt-4 text-sm text-primary font-medium hover:underline block text-center">Voir toutes les factures</Link>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Dernières Factures</h2>
          <Link href="/invoices" className="text-sm font-medium text-primary hover:text-primary-dark">
            Voir tout
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left text-xs sm:text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">Numéro</th>
                <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th scope="col" className="px-4 py-3 font-medium text-muted-foreground text-right">Montant</th>
                <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {recentInvoices.length > 0 ? recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{invoice.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{invoice.client}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{invoice.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground font-semibold text-right">{formatCurrency(invoice.rawAmount || 0)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{getStatusBadge(invoice.status)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link href={`/invoices/${encodeURIComponent(invoice.id)}`} className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
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
