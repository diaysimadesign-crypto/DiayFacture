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

export type InvoiceStatus = 'brouillon' | 'envoyee' | 'payee' | 'en retard';

export type Invoice = {
  id: string;
  client: string;
  clientPhone?: string;
  date: string;
  dueDate: string;
  rawAmount: number;
  amount: string;
  status: InvoiceStatus;
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
      const formattedInvoices: Invoice[] = data.map((inv: Record<string, unknown>) => ({
        id: inv.id as string,
        client: inv.client_name as string,
        date: inv.date as string,
        dueDate: inv.due_date as string,
        rawAmount: inv.raw_amount as number,
        amount: inv.amount as string,
        status: inv.status as 'brouillon' | 'envoyee' | 'payee' | 'en retard',
        lines: (inv.lines as Record<string, unknown>[]).map((l: Record<string, unknown>) => ({
          id: l.id as string,
          description: l.description as string,
          quantity: l.quantity as number,
          unitPrice: l.unit_price as number,
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
    const dbUpdate: Record<string, unknown> = {};
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
