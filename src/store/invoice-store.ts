import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  invoice_id?: string;
};

export type Invoice = {
  id: string;
  client: string;
  date: string;
  dueDate: string;
  rawAmount: number;
  amount: string;
  status: 'brouillon' | 'envoyee' | 'payee' | 'en retard';
  lines: InvoiceLine[];
};

interface InvoiceStore {
  invoices: Invoice[];
  isLoading: boolean;
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  fetchInvoices: () => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  isLoading: false,
  fetchInvoices: async () => {
    set({ isLoading: true });
    // Fetch invoices with their lines
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        lines:invoice_lines(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Erreur lors du chargement des factures');
    } else if (data) {
      const formattedInvoices: Invoice[] = data.map((inv: any) => ({
        id: inv.id,
        client: inv.client_name,
        date: inv.date,
        dueDate: inv.due_date,
        rawAmount: inv.raw_amount,
        amount: inv.amount,
        status: inv.status,
        lines: inv.lines.map((l: any) => ({
          id: l.id,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unit_price,
        }))
      }));
      set({ invoices: formattedInvoices });
    }
    set({ isLoading: false });
  },
  addInvoice: async (invoice) => {
    // 1. Insert invoice
    const invoiceData = {
      id: invoice.id,
      client_name: invoice.client,
      date: invoice.date,
      due_date: invoice.dueDate,
      raw_amount: invoice.rawAmount,
      amount: invoice.amount,
      status: invoice.status,
    };
    
    const { error: invoiceError } = await supabase.from('invoices').insert([invoiceData]);
    
    if (invoiceError) {
      console.error('Error adding invoice:', invoiceError);
      toast.error('Erreur lors de la création de la facture');
      return;
    }

    // 2. Insert lines
    if (invoice.lines && invoice.lines.length > 0) {
      const linesData = invoice.lines.map(line => ({
        invoice_id: invoice.id,
        description: line.description,
        quantity: line.quantity,
        unit_price: line.unitPrice,
      }));
      
      const { error: linesError } = await supabase.from('invoice_lines').insert(linesData);
      if (linesError) {
        console.error('Error adding invoice lines:', linesError);
        toast.error('Erreur lors de l\'ajout des lignes de facture');
      }
    }

    set((state) => ({ invoices: [invoice, ...state.invoices] }));
    toast.success('Facture créée avec succès');
  },
  updateInvoice: async (id, updatedFields) => {
    // We only update status in this app for now via actions
    const dbUpdate: any = {};
    if (updatedFields.status) dbUpdate.status = updatedFields.status;
    
    if (Object.keys(dbUpdate).length > 0) {
      const { error } = await supabase.from('invoices').update(dbUpdate).eq('id', id);
      if (error) {
        console.error('Error updating invoice:', error);
        toast.error('Erreur lors de la modification de la facture');
        return;
      }
    }

    set((state) => ({
      invoices: state.invoices.map(inv => inv.id === id ? { ...inv, ...updatedFields } : inv)
    }));
    toast.success('Facture mise à jour');
  },
  deleteInvoice: async (id) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression de la facture');
    } else {
      set((state) => ({
        invoices: state.invoices.filter(inv => inv.id !== id)
      }));
      toast.success('Facture supprimée');
    }
  },
}));
