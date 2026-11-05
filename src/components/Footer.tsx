'use client';

import React from 'react';
import { Language } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { ShieldCheck, Activity } from 'lucide-react';

interface FooterProps {
  language: Language;
  onOpenMethodology: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenMethodology,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="w-full border-t border-[var(--border)] mt-20 pt-12 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 text-xs bg-[var(--surface)] transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand & Mission */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--card)] border border-[var(--border)]">
              <Activity className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <span className="font-black text-sm text-[var(--ink)]">
              {language === 'fa' ? 'ریتم | RITM' : 'RITM'}
            </span>
          </div>
          <p className="text-[var(--ink-muted)] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Privacy Assurance */}
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
          <div className="flex items-center gap-2 font-bold text-[var(--ink)] mb-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.footer.privacyTitle}</span>
          </div>
          <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
            {t.footer.privacyDesc}
          </p>
        </div>

        {/* Open Science */}
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
          <div className="flex items-center justify-between font-bold text-[var(--ink)] mb-1.5">
            <span>{t.footer.openScienceTitle}</span>
            <button
              onClick={onOpenMethodology}
              className="text-[var(--accent)] text-[11px] hover:underline cursor-pointer"
            >
              {language === 'fa' ? 'مشاهده فرمول‌ها' : 'View Formulas'}
            </button>
          </div>
          <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
            {t.footer.openScienceDesc}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--ink-faint)]">
        <div>
          © {new Date().getFullYear()} RITM — Jack Daniels’ Running Formula. All rights reserved.
        </div>
        <div>
          Persian Sports Science Initiative
        </div>
      </div>
    </footer>
  );
};
