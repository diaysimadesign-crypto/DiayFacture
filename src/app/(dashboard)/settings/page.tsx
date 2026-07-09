"use client";

import { useState, useEffect } from 'react';
import { User, Building, Bell, Shield, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsStore } from '@/store/settings-store';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { profile, company, updateProfile, updateCompany } = useSettingsStore();

  // Local state for forms
  const [profileForm, setProfileForm] = useState(profile);
  const [companyForm, setCompanyForm] = useState(company);

  // Sync local state if global store changes
  useEffect(() => {
    setProfileForm(profile);
    setCompanyForm(company);
  }, [profile, company]);

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'company', name: 'Entreprise', icon: Building },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    toast.success('Profil mis à jour avec succès');
  };

  const handleCompanySave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(companyForm);
    toast.success('Informations de l\'entreprise enregistrées');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mot de passe mis à jour avec succès');
  };

  const handleNotificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Préférences de notification enregistrées');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez vos préférences et les informations de votre compte.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Informations personnelles</h2>
                <div className="flex items-center gap-6">
                  <div className="relative group overflow-hidden h-24 w-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold ring-4 ring-background">
                    {profileForm.avatar ? (
                      <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profileForm.name.slice(0, 2).toUpperCase() || 'U'}</span>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/gif" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          if (file.size > 1024 * 1024) {
                            toast.error("L'image est trop volumineuse (max 1MB).");
                            return;
                          }

                          const toastId = toast.loading('Téléversement en cours...');
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${Math.random()}.${fileExt}`;
                          const filePath = `${fileName}`;
                          
                          const { supabase } = await import('@/lib/supabase');
                          const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

                          if (uploadError) {
                            toast.dismiss(toastId);
                            toast.error('Erreur lors du téléversement');
                            return;
                          }

                          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
                          
                          setProfileForm({ ...profileForm, avatar: publicUrl });
                          toast.dismiss(toastId);
                          toast.success('Avatar mis à jour ! N\'oubliez pas de sauvegarder.');
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Avatar de profil</p>
                    <p className="text-xs text-muted-foreground mt-2">Cliquez sur l'image pour changer.<br/>JPG, GIF ou PNG. 1MB max.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Prénom et Nom</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Fonction</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>
              </div>
            </form>
          )}

          {activeTab === 'company' && (
            <form onSubmit={handleCompanySave} className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Détails de l&apos;entreprise</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Ces informations apparaîtront sur vos factures et devis.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Nom de l&apos;entreprise</label>
                    <input
                      type="text"
                      required
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Adresse complète</label>
                    <textarea
                      rows={3}
                      required
                      value={companyForm.address}
                      onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">NINEA / SIRET</label>
                    <input
                      type="text"
                      placeholder="Numéro d'immatriculation"
                      value={companyForm.ninea}
                      onChange={(e) => setCompanyForm({ ...companyForm, ninea: e.target.value })}
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Devise par défaut</label>
                    <select 
                      value={companyForm.currency}
                      onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="XOF">FCFA (XOF)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSave} className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-foreground">Sécurité du compte</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Mot de passe actuel</label>
                  <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                  Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationSave} className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-foreground">Préférences de notifications</h2>
              <div className="space-y-4">
                {[
                  { id: 'notif-payee', title: "Factures payées", desc: "Recevoir un email lorsqu'un client paie une facture.", default: true },
                  { id: 'notif-retard', title: "Rappels de retard", desc: "Être alerté 24h avant l'échéance d'une facture.", default: true },
                  { id: 'notif-clients', title: "Nouveaux clients", desc: "M'avertir lors de l'ajout d'un nouveau client.", default: false },
                  { id: 'notif-produits', title: "Mises à jour produit", desc: "Recevoir les nouveautés de l'application.", default: false },
                ].map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{notif.title}</h3>
                      <p className="text-sm text-muted-foreground">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={notif.default} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t border-border">
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                  Enregistrer les préférences
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
