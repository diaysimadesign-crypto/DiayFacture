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
  settingsId: string | null;
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
  settingsId: null,
  profile: defaultProfile,
  company: defaultCompany,
  isLoading: false,
  fetchSettings: async () => {
    set({ isLoading: true });
    
    // Check if the current user has settings
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    
    if (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erreur lors du chargement des paramètres');
      set({ isLoading: false });
      return;
    } 
    
    if (data) {
      // User has settings
      set({
        settingsId: data.id,
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
        },
        isLoading: false
      });
    } else {
      // New user: Create default settings
      const { data: authData } = await supabase.auth.getUser();
      const userEmail = authData.user?.email || '';
      // Capitalize first letter of email prefix for a nicer default name
      const defaultName = userEmail ? userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1) : 'Profil Utilisateur';

      const defaultSettingsForDb = {
        profile_name: defaultName,
        profile_email: userEmail,
        profile_phone: '',
        profile_role: 'Administrateur',
        company_name: 'Mon Entreprise',
        company_address: '',
        company_currency: 'XOF'
      };

      const { data: newData, error: insertError } = await supabase.from('settings').insert([defaultSettingsForDb]).select().single();
      
      if (insertError || !newData) {
        console.error('Error creating default settings:', insertError);
        toast.error('Erreur lors de l\'initialisation des paramètres');
      } else {
        set({
          settingsId: newData.id,
          profile: {
            name: newData.profile_name,
            email: newData.profile_email,
            phone: newData.profile_phone,
            role: newData.profile_role,
            avatar: '',
          },
          company: {
            name: newData.company_name,
            address: newData.company_address,
            ninea: '',
            currency: newData.company_currency,
          }
        });
      }
      set({ isLoading: false });
    }
  },
  updateProfile: async (profileUpdate) => {
    set((state) => {
      const newProfile = { ...state.profile, ...profileUpdate };
      if (state.settingsId) {
        supabase.from('settings').update({
          profile_name: newProfile.name,
          profile_email: newProfile.email,
          profile_phone: newProfile.phone,
          profile_role: newProfile.role,
          profile_avatar: newProfile.avatar,
        }).eq('id', state.settingsId).then(({error}) => {
           if(error) toast.error('Erreur lors de la sauvegarde du profil');
           else toast.success('Profil mis à jour');
        });
      }
      return { profile: newProfile };
    });
  },
  updateCompany: async (companyUpdate) => {
    set((state) => {
      const newCompany = { ...state.company, ...companyUpdate };
      if (state.settingsId) {
        supabase.from('settings').update({
          company_name: newCompany.name,
          company_address: newCompany.address,
          company_ninea: newCompany.ninea,
          company_currency: newCompany.currency,
        }).eq('id', state.settingsId).then(({error}) => {
           if(error) toast.error('Erreur lors de la sauvegarde de l\'entreprise');
           else toast.success('Entreprise mise à jour');
        });
      }
      return { company: newCompany };
    });
  },
}));
