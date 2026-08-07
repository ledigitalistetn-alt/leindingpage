"use client";

import { useActionState } from "react";
import Image from "next/image";
import { updateSettings, type SettingsState } from "@/app/admin/(dashboard)/settings/actions";
import { FONT_OPTIONS } from "@/lib/fonts";
import type { SiteSettings } from "@/lib/settings";

const initialState: SettingsState = {};

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h2 className="font-medium text-neutral-900">{title}</h2>
      {description && <p className="text-sm text-neutral-500 mt-0.5 mb-4">{description}</p>}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${description ? "" : "mt-4"}`}>{children}</div>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="block text-neutral-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500";

function ImageField({ name, label, currentUrl }: { name: string; label: string; currentUrl: string }) {
  return (
    <Field label={label} className="sm:col-span-2">
      <div className="flex items-center gap-4">
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt={label}
            width={80}
            height={80}
            className="rounded-lg object-cover border border-neutral-200 h-20 w-20"
            unoptimized
          />
        ) : (
          <div className="h-20 w-20 rounded-lg bg-neutral-100 border border-dashed border-neutral-300" />
        )}
        <input type="file" name={name} accept="image/png,image/jpeg,image/webp,image/gif" className="text-sm" />
      </div>
    </Field>
  );
}

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <Section title="Identité de la marque">
        <Field label="Nom du site">
          <input name="siteName" defaultValue={settings.siteName} className={inputClass} required />
        </Field>
        <Field label="Slogan">
          <input name="tagline" defaultValue={settings.tagline} className={inputClass} />
        </Field>
        <ImageField name="logo" label="Logo" currentUrl={settings.logoUrl} />
      </Section>

      <Section title="Thème & apparence" description="Couleurs et polices utilisées sur tout le site public.">
        <Field label="Couleur principale">
          <input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="h-10 w-full rounded-lg border border-neutral-300" />
        </Field>
        <Field label="Couleur secondaire">
          <input type="color" name="secondaryColor" defaultValue={settings.secondaryColor} className="h-10 w-full rounded-lg border border-neutral-300" />
        </Field>
        <Field label="Couleur d'accent">
          <input type="color" name="accentColor" defaultValue={settings.accentColor} className="h-10 w-full rounded-lg border border-neutral-300" />
        </Field>
        <Field label="Couleur de fond">
          <input type="color" name="backgroundColor" defaultValue={settings.backgroundColor} className="h-10 w-full rounded-lg border border-neutral-300" />
        </Field>
        <Field label="Couleur du texte">
          <input type="color" name="textColor" defaultValue={settings.textColor} className="h-10 w-full rounded-lg border border-neutral-300" />
        </Field>
        <Field label="Devise">
          <input name="currency" defaultValue={settings.currency} className={inputClass} />
        </Field>
        <Field label="Police des titres">
          <select name="headingFont" defaultValue={settings.headingFont} className={inputClass}>
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Police du texte">
          <select name="bodyFont" defaultValue={settings.bodyFont} className={inputClass}>
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Bandeau d'annonce">
        <Field label="Texte du bandeau" className="sm:col-span-2">
          <input name="announcementText" defaultValue={settings.announcementText} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" name="announcementActive" defaultChecked={settings.announcementActive} />
          Afficher le bandeau
        </label>
      </Section>

      <Section title="Section Hero (bannière d'accueil)">
        <Field label="Titre">
          <input name="heroTitle" defaultValue={settings.heroTitle} className={inputClass} />
        </Field>
        <Field label="Texte du bouton">
          <input name="heroCtaLabel" defaultValue={settings.heroCtaLabel} className={inputClass} />
        </Field>
        <Field label="Sous-titre" className="sm:col-span-2">
          <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={2} className={inputClass} />
        </Field>
        <Field label="Lien du bouton">
          <input name="heroCtaLink" defaultValue={settings.heroCtaLink} className={inputClass} />
        </Field>
        <ImageField name="heroImage" label="Image de fond" currentUrl={settings.heroImageUrl} />
      </Section>

      <Section title="Section À propos">
        <Field label="Titre">
          <input name="aboutTitle" defaultValue={settings.aboutTitle} className={inputClass} />
        </Field>
        <Field label="Texte" className="sm:col-span-2">
          <textarea name="aboutText" defaultValue={settings.aboutText} rows={3} className={inputClass} />
        </Field>
        <ImageField name="aboutImage" label="Image" currentUrl={settings.aboutImageUrl} />
      </Section>

      <Section title="Contact & réseaux sociaux">
        <Field label="Email">
          <input name="contactEmail" defaultValue={settings.contactEmail} className={inputClass} />
        </Field>
        <Field label="Téléphone">
          <input name="contactPhone" defaultValue={settings.contactPhone} className={inputClass} />
        </Field>
        <Field label="Adresse" className="sm:col-span-2">
          <input name="address" defaultValue={settings.address} className={inputClass} />
        </Field>
        <Field label="WhatsApp (format international, sans +)">
          <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className={inputClass} />
        </Field>
        <Field label="Instagram">
          <input name="instagramUrl" defaultValue={settings.instagramUrl} className={inputClass} />
        </Field>
        <Field label="Facebook">
          <input name="facebookUrl" defaultValue={settings.facebookUrl} className={inputClass} />
        </Field>
        <Field label="TikTok">
          <input name="tiktokUrl" defaultValue={settings.tiktokUrl} className={inputClass} />
        </Field>
        <Field label="Texte de pied de page" className="sm:col-span-2">
          <input name="footerText" defaultValue={settings.footerText} className={inputClass} />
        </Field>
      </Section>

      <div className="flex items-center gap-3 sticky bottom-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-neutral-900 text-white px-5 py-2.5 font-medium hover:bg-neutral-800 transition disabled:opacity-60"
        >
          {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
        {state.success && <span className="text-sm text-green-600">Enregistré avec succès.</span>}
        {state.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
