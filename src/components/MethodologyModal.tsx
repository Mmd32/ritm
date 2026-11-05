'use client';

import React from 'react';
import { Language, NumeralSystem } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { X, BookOpen } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  numeralSystem: NumeralSystem;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];
  const isRtl = language === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 relative shadow-2xl"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl text-[var(--ink-muted)] hover:text-[var(--ink)] bg-[var(--card)] hover:bg-[var(--card-hover)] border border-[var(--border)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
            {t.methodologyModal.title}
          </h3>
        </div>

        <p className="text-xs text-[var(--ink-muted)] mb-6 leading-relaxed">
          {language === 'fa'
            ? 'فرمول‌های کلاسیک جک دانیلز و جیمی گیلبرت (Daniels & Gilbert, 1979) برای تعیین ظرفیت مؤثر هوازی و پیش‌بینی توان دویدن.'
            : 'Classical exercise physiology equations formulated by Dr. Jack Daniels & Jimmy Gilbert (1979).'}
        </p>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h5 className="font-bold text-[var(--ink)] mb-1.5">{t.methodologyModal.step1Title}</h5>
            <p className="text-[var(--ink-muted)] text-xs mb-2 leading-relaxed">{t.methodologyModal.step1Desc}</p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] font-mono text-[var(--accent)] text-xs text-center border border-[var(--border)]" dir="ltr">
              v = distance (meters) / time (minutes)
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h5 className="font-bold text-[var(--ink)] mb-1.5">{t.methodologyModal.step2Title}</h5>
            <p className="text-[var(--ink-muted)] text-xs mb-2 leading-relaxed">{t.methodologyModal.step2Desc}</p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] font-mono text-sky-400 text-xs text-center border border-[var(--border)]" dir="ltr">
              VO₂ = -4.60 + 0.182258 × v + 0.000104 × v²
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h5 className="font-bold text-[var(--ink)] mb-1.5">{t.methodologyModal.step3Title}</h5>
            <p className="text-[var(--ink-muted)] text-xs mb-2 leading-relaxed">{t.methodologyModal.step3Desc}</p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] font-mono text-amber-400 text-[11px] sm:text-xs text-center border border-[var(--border)] leading-relaxed" dir="ltr">
              f(t) = 0.8 + 0.1894393 × e^(-0.012778 × t) + 0.2989558 × e^(-0.1932605 × t)
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h5 className="font-bold text-[var(--ink)] mb-1.5">{t.methodologyModal.step4Title}</h5>
            <p className="text-[var(--ink-muted)] text-xs mb-2 leading-relaxed">{t.methodologyModal.step4Desc}</p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] font-mono text-emerald-400 text-xs text-center border border-[var(--border)]" dir="ltr">
              VDOT = VO₂ / f(t)
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-opacity cursor-pointer"
          >
            {t.methodologyModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
