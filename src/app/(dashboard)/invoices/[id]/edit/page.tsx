"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useInvoiceStore, InvoiceLine } from '@/store/invoice-store';
import { useClientStore } from '@/store/client-store';
import { useProductStore } from '@/store/product-store';

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);
  
  const { invoices, updateInvoice } = useInvoiceStore();
  const { clients } = useClientStore();
  const { products } = useProductStore();
  
  const invoiceToEdit = invoices.find(inv => inv.id === id);

  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [lines, setLines] = useState<InvoiceLine[]>([]);

  useEffect(() => {
    if (invoiceToEdit) {
      // Map client name back to ID dynamically
      const matchedClient = clients.find(c => c.name === invoiceToEdit.client);
      setClientId(matchedClient ? matchedClient.id : '');

      setIssueDate(invoiceToEdit.date);
      setDueDate(invoiceToEdit.dueDate);
      setLines(invoiceToEdit.lines);
    }
  }, [invoiceToEdit, clients]);

  if (!invoiceToEdit) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Facture introuvable</h2>
        <Link href="/invoices" className="text-primary hover:underline">
          Retour à la liste des factures
        </Link>
      </div>
    );
  }

  const addLine = () => {
    setLines([...lines, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLine = (lineId: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== lineId));
    }
  };

  const updateLine = (lineId: string, field: keyof InvoiceLine, value: string | number) => {
    setLines(lines.map(line => 
      line.id === lineId ? { ...line, [field]: value } : line
    ));
  };

  const formatFCFA = (amount: number) => {
    return Math.round(amount).toLocaleString('fr-FR') + ' FCFA';
  };

  const subtotal = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSave = async () => {
    if (!clientId) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    const selectedClient = clients.find(c => c.id === clientId);

    await updateInvoice(id, {
      client: selectedClient ? selectedClient.name : 'Client Inconnu',
      date: issueDate,
      dueDate: dueDate || issueDate,
      rawAmount: total,
      amount: formatFCFA(total),
      lines: lines
    });

    router.push(`/invoices/${encodeURIComponent(id)}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/invoices/${encodeURIComponent(id)}`} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Modifier la facture {id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-foreground mb-1">
                Client Facturé
              </label>
              <select
                id="client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>Sélectionner un client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-foreground mb-1">
                  Date d&apos;émission
                </label>
                <input
                  type="date"
                  id="issueDate"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-1">
                  Date d&apos;échéance
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Lines Card */}
          <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Lignes de la facture</h2>
            
            <div className="hidden sm:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qté</div>
              <div className="col-span-2 text-right">Prix Unitaire</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-4">
              {lines.map((line) => (
                <div key={line.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center group relative">
                  <div className="sm:col-span-6 flex flex-col xl:flex-row gap-2">
                    <select
                      className="w-full xl:w-1/3 rounded-lg border border-border bg-transparent px-2 py-2 text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      onChange={(e) => {
                         const product = products.find(p => p.id === e.target.value);
                         if (product) {
                           updateLine(line.id, 'description', product.name);
                           updateLine(line.id, 'unitPrice', product.price);
                         }
                         e.target.value = "";
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Catalogue...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="Description du produit ou service"
                      value={line.description}
                      onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                      className="w-full xl:w-2/3 rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.id, 'quantity', Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="0"
                      value={line.unitPrice}
                      onChange={(e) => updateLine(line.id, 'unitPrice', Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-right focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2 text-right font-medium text-foreground flex items-center justify-end gap-2">
                    <span className="flex-1">{formatFCFA(line.quantity * line.unitPrice)}</span>
                    <button
                      onClick={() => removeLine(line.id)}
                      disabled={lines.length === 1}
                      className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      title="Supprimer la ligne"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={addLine}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                <Plus className="h-4 w-4" />
                Ajouter une ligne
              </button>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
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
