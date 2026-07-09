import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ClientStore {
  clients: Client[];
  isLoading: boolean;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  fetchClients: () => Promise<void>;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  isLoading: false,
  fetchClients: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching clients:', error);
      toast.error('Erreur lors du chargement des clients');
    } else {
      set({ clients: data as Client[] });
    }
    set({ isLoading: false });
  },
  addClient: async (client) => {
    const { data, error } = await supabase.from('clients').insert([client]).select().single();
    if (error) {
      console.error('Error adding client:', error);
      toast.error('Erreur lors de l\'ajout du client');
    } else {
      set((state) => ({ clients: [data as Client, ...state.clients] }));
      toast.success('Client ajouté avec succès');
    }
  },
  updateClient: async (id, updatedFields) => {
    const { data, error } = await supabase.from('clients').update(updatedFields).eq('id', id).select().single();
    if (error) {
      console.error('Error updating client:', error);
      toast.error('Erreur lors de la modification du client');
    } else {
      set((state) => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...(data as Client) } : c)
      }));
      toast.success('Client modifié avec succès');
    }
  },
  deleteClient: async (id) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression du client');
    } else {
      set((state) => ({
        clients: state.clients.filter(c => c.id !== id)
      }));
      toast.success('Client supprimé avec succès');
    }
  },
}));
