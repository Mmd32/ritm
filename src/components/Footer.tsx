'use client';

import React from 'react';
import { Language } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { ShieldCheck, Heart, Activity } from 'lucide-react';

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
    <footer className="w-full border-t mt-20 pt-12 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 text-xs" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand & Mission */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#C8FF4D]/10 border border-[#C8FF4D]/30">
              <Activity className="w-4 h-4 text-[#C8FF4D]" />
            </div>
            <span className="font-black text-sm text-[#F8FAFC]">
              {language === 'fa' ? 'ریتم | RITM' : 'RITM'}
            </span>
          </div>
          <p className="text-[#94A3B8] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Privacy Assurance */}
        <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 font-bold text-[#F8FAFC] mb-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C8FF4D]" />
            <span>{t.footer.privacyTitle}</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
            {t.footer.privacyDesc}
          </p>
        </div>

        {/* Open Science */}
        <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between font-bold text-[#F8FAFC] mb-1.5">
            <span>{t.footer.openScienceTitle}</span>
            <button
              onClick={onOpenMethodology}
              className="text-[#38BDF8] text-[11px] hover:underline"
            >
              {language === 'fa' ? 'مشاهده فرمول‌ها' : 'View Formulas'}
            </button>
          </div>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
            {t.footer.openScienceDesc}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[#94A3B8]" style={{ borderColor: 'var(--border)' }}>
        <div>{t.footer.copyright}</div>
        <div className="flex items-center gap-1 text-[11px]">
          <span>Made for runners with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </footer>
  );
};
