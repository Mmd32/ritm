'use client';

import React from 'react';
import { Language, NumeralSystem } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { X, BookOpen, AlertCircle, Check } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 relative shadow-2xl"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#C8FF4D]" />
          <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
            {t.methodologyModal.title}
          </h3>
        </div>

        <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
          {language === 'fa'
            ? 'فرمول‌های کلاسیک جک دانیلز و جیمی گیلبرت (Daniels & Gilbert, 1979) برای تعیین ظرفیت مؤثر هوازی و پیش‌بینی توان دویدن.'
            : 'Classical exercise physiology equations formulated by Dr. Jack Daniels & Jimmy Gilbert (1979).'}
        </p>

        <div className="space-y-6 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h5 className="font-bold text-[#F8FAFC] mb-1.5">{t.methodologyModal.step1Title}</h5>
            <p className="text-[#94A3B8] text-xs mb-2 leading-relaxed">{t.methodologyModal.step1Desc}</p>
            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[#C8FF4D] text-xs text-center border border-white/5" dir="ltr">
              v = distance (meters) / time (minutes)
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h5 className="font-bold text-[#F8FAFC] mb-1.5">{t.methodologyModal.step2Title}</h5>
            <p className="text-[#94A3B8] text-xs mb-2 leading-relaxed">{t.methodologyModal.step2Desc}</p>
            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[#38BDF8] text-xs text-center border border-white/5" dir="ltr">
              VO₂ = -4.60 + 0.182258 × v + 0.000104 × v²
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h5 className="font-bold text-[#F8FAFC] mb-1.5">{t.methodologyModal.step3Title}</h5>
            <p className="text-[#94A3B8] text-xs mb-2 leading-relaxed">{t.methodologyModal.step3Desc}</p>
            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[#FBBF24] text-[11px] sm:text-xs text-center border border-white/5 leading-relaxed" dir="ltr">
              f(t) = 0.8 + 0.1894393 × e^(-0.012778 × t) + 0.2989558 × e^(-0.1932605 × t)
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h5 className="font-bold text-[#F8FAFC] mb-1.5">{t.methodologyModal.step4Title}</h5>
            <p className="text-[#94A3B8] text-xs mb-2 leading-relaxed">{t.methodologyModal.step4Desc}</p>
            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[#C8FF4D] text-sm text-center border border-white/5 font-black" dir="ltr">
              VDOT = VO₂ / f(t)
            </div>
          </div>

          {/* Training Paces Derivation */}
          <div className="p-4 rounded-2xl border bg-[#C8FF4D]/5 border-[#C8FF4D]/20">
            <h5 className="font-bold text-[#C8FF4D] mb-1.5">{t.methodologyModal.trainingPacesTitle}</h5>
            <p className="text-[#94A3B8] text-xs leading-relaxed">{t.methodologyModal.trainingPacesDesc}</p>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-white/5 text-[11px] text-[#94A3B8]">
            <AlertCircle className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
            <span>{t.methodologyModal.disclaimer}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#0B0F14] bg-[#C8FF4D] hover:bg-[#bbf340] transition-colors"
          >
            {t.methodologyModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
