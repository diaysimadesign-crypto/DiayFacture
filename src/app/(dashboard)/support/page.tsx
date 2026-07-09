/* eslint-disable @next/next/no-img-element */
"use client";

import { useSettingsStore } from '@/store/settings-store';
import { Mail, Phone, ExternalLink } from 'lucide-react';

export default function SupportPage() {
  const { profile, company } = useSettingsStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Support</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vous avez une question ou besoin d&apos;aide ? Contactez l&apos;administrateur de l&apos;application.
        </p>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="h-32 w-32 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-5xl font-bold overflow-hidden ring-4 ring-background shadow-md">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name ? profile.name.slice(0, 2).toUpperCase() : 'U'
            )}
          </div>
          
          <div className="space-y-4 flex-1">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-lg text-muted-foreground">{profile.role} - {company.name}</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border">
              {profile.email && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email de contact</p>
                    <a href={`mailto:${profile.email}`} className="text-sm text-primary hover:underline">{profile.email}</a>
                  </div>
                </div>
              )}
              
              {profile.phone && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Téléphone direct</p>
                    <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="text-sm text-primary hover:underline">{profile.phone}</a>
                  </div>
                </div>
              )}
              
              {company.address && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Adresse</p>
                    <p className="text-sm text-muted-foreground">{company.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center">
          <a href={`mailto:${profile.email}`} className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors">
            Envoyer un message maintenant
          </a>
        </div>
      </div>
    </div>
  );
}
