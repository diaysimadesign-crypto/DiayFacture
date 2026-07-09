import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type?: 'service' | 'produit';
  sku?: string;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } else {
      set({ products: data as Product[] });
    }
    set({ isLoading: false });
  },
  addProduct: async (product) => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    } else {
      set((state) => ({ products: [data as Product, ...state.products] }));
      toast.success('Produit ajouté avec succès');
    }
  },
  updateProduct: async (id, updatedFields) => {
    const { data, error } = await supabase.from('products').update(updatedFields).eq('id', id).select().single();
    if (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la modification du produit');
    } else {
      set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...(data as Product) } : p)
      }));
      toast.success('Produit modifié avec succès');
    }
  },
  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    } else {
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
      toast.success('Produit supprimé avec succès');
    }
  },
}));
