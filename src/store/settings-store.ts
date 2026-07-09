import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  ninea: string;
  currency: string;
}

interface SettingsStore {
  profile: UserProfile;
  company: CompanySettings;
  isLoading: boolean;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateCompany: (company: Partial<CompanySettings>) => Promise<void>;
  fetchSettings: () => Promise<void>;
}

const defaultProfile: UserProfile = { name: '', email: '', phone: '', role: '', avatar: '' };
const defaultCompany = { name: '', address: '', ninea: '', currency: 'XOF' };

export const useSettingsStore = create<SettingsStore>((set) => ({
  profile: defaultProfile,
  company: defaultCompany,
  isLoading: false,
  fetchSettings: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    if (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } else if (data) {
      set({
        profile: {
          name: data.profile_name,
          email: data.profile_email,
          phone: data.profile_phone,
          role: data.profile_role,
          avatar: data.profile_avatar || '',
        },
        company: {
          name: data.company_name,
          address: data.company_address,
          ninea: data.company_ninea || '',
          currency: data.company_currency,
        }
      });
    }
    set({ isLoading: false });
  },
  updateProfile: async (profileUpdate) => {
    set((state) => {
      const newProfile = { ...state.profile, ...profileUpdate };
      supabase.from('settings').update({
        profile_name: newProfile.name,
        profile_email: newProfile.email,
        profile_phone: newProfile.phone,
        profile_role: newProfile.role,
        profile_avatar: newProfile.avatar,
      }).neq('id', '00000000-0000-0000-0000-000000000000').then(({error}) => {
         if(error) toast.error('Erreur lors de la sauvegarde du profil');
         else toast.success('Profil mis à jour');
      });
      return { profile: newProfile };
    });
  },
  updateCompany: async (companyUpdate) => {
    set((state) => {
      const newCompany = { ...state.company, ...companyUpdate };
      supabase.from('settings').update({
        company_name: newCompany.name,
        company_address: newCompany.address,
        company_ninea: newCompany.ninea,
        company_currency: newCompany.currency,
      }).neq('id', '00000000-0000-0000-0000-000000000000').then(({error}) => {
         if(error) toast.error('Erreur lors de la sauvegarde de l\'entreprise');
         else toast.success('Entreprise mise à jour');
      });
      return { company: newCompany };
    });
  },
}));
