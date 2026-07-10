"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, Edit, Send, CheckCircle2, Download } from 'lucide-react';
import { useInvoiceStore, InvoiceStatus } from '@/store/invoice-store';
import { useClientStore } from '@/store/client-store';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);
  
  const { invoices, deleteInvoice, updateInvoice } = useInvoiceStore();
  const invoice = invoices.find(inv => inv.id === id);
  
  const { clients } = useClientStore();
  const matchedClient = clients.find(c => c.name === invoice?.client);
  const displayPhone = invoice?.clientPhone || matchedClient?.phone || '';

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Facture introuvable</h2>
        <p className="text-muted-foreground">La facture demandée n&apos;existe pas ou a été supprimée.</p>
        <Link href="/invoices" className="text-primary hover:underline">
          Retour à la liste des factures
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    router.push('/invoices');
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    await updateInvoice(invoice.id, { status: newStatus });
  };

  const formatFCFA = (amount: number) => {
    return Math.round(amount).toLocaleString('fr-FR') + ' FCFA';
  };

  const subtotal = invoice.lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/invoices" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Facture {invoice.id}</h1>
          
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
            invoice.status === 'payee' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
            invoice.status === 'envoyee' ? 'bg-orange-50 text-orange-700 ring-orange-600/20' :
            invoice.status === 'en retard' ? 'bg-red-50 text-red-700 ring-red-600/20' :
            'bg-slate-50 text-slate-600 ring-slate-500/20'
          }`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 print:hidden">
          {/* Status Dropdown / Buttons */}
          {invoice.status === 'brouillon' && (
            <button 
              onClick={() => handleStatusChange('envoyee')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Send className="h-4 w-4" /> Marquer comme envoyée
            </button>
          )}
          {invoice.status === 'envoyee' && (
            <button 
              onClick={() => handleStatusChange('payee')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" /> Marquer comme payée
            </button>
          )}

          {/* Action buttons */}
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" /> Télécharger
          </button>
          
          <Link 
            href={`/invoices/${encodeURIComponent(invoice.id)}/edit`}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
          >
            <Edit className="h-4 w-4" /> Modifier
          </Link>
          
          <div className="relative">
            {showDeleteConfirm ? (
              <div className="absolute right-0 top-0 flex items-center gap-2 bg-background border border-red-200 p-1 rounded-lg shadow-lg z-10 whitespace-nowrap">
                <span className="text-sm font-medium text-red-600 px-2">Confirmer ?</span>
                <button onClick={handleDelete} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Oui</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1 text-sm font-medium text-foreground bg-muted rounded-md hover:bg-muted/80">Non</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
              >
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-background border border-border rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-8">
               <div>
                 <p className="text-sm text-muted-foreground mb-1">Facturé à</p>
                 <h2 className="text-xl font-bold text-foreground">{invoice.client}</h2>
                 {displayPhone && <p className="text-sm text-muted-foreground mt-1">{displayPhone}</p>}
               </div>
               <div className="text-right">
                 <h3 className="text-lg font-bold text-foreground">DIAYSIMA DESIGN</h3>
                 <p className="text-sm text-muted-foreground">contact@diaysima.com</p>
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 border-y border-border py-6 mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Numéro de facture</p>
                <p className="font-medium text-foreground">{invoice.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date d&apos;émission</p>
                <p className="font-medium text-foreground">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date d&apos;échéance</p>
                <p className="font-medium text-foreground">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Lines */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground mb-4">Détail des prestations</h3>
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Qté</div>
                    <div className="col-span-2 text-right">Prix Unitaire</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  <div className="space-y-3 mt-3">
                    {invoice.lines.map((line) => (
                      <div key={line.id} className="grid grid-cols-12 gap-4 items-center py-2 text-sm">
                        <div className="col-span-6 font-medium text-foreground">{line.description}</div>
                        <div className="col-span-2 text-center text-muted-foreground">{line.quantity}</div>
                        <div className="col-span-2 text-right text-muted-foreground">{formatFCFA(line.unitPrice)}</div>
                        <div className="col-span-2 text-right font-medium text-foreground">{formatFCFA(line.quantity * line.unitPrice)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-semibold text-foreground mb-4">Récapitulatif</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span className="font-medium text-foreground">{formatFCFA(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>TVA (18%)</span>
                <span className="font-medium text-foreground">{formatFCFA(tax)}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-border flex justify-between items-center">
                <span className="text-base font-semibold text-foreground">Total TTC</span>
                <span className="text-xl font-bold text-primary">{formatFCFA(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
