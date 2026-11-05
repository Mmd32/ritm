'use client';

import React from 'react';
import { Language, NumeralSystem, TrainingZone } from '@/types';
import { formatPaceRange } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';

interface PaceSpectrumProps {
  zones: TrainingZone[];
  selectedZoneCode: string;
  onSelectZone: (code: 'E' | 'M' | 'T' | 'I' | 'R') => void;
  language: Language;
  numeralSystem: NumeralSystem;
}

export const PaceSpectrum: React.FC<PaceSpectrumProps> = ({
  zones,
  selectedZoneCode,
  onSelectZone,
  language,
  numeralSystem,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 mb-6 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-black text-[var(--ink)]">
            {t.zones.interactiveSpectrumTitle}
          </h3>
          <p className="text-xs text-[var(--ink-muted)]">
            {t.zones.spectrumSubtitle}
          </p>
        </div>
        <div className="text-[11px] font-mono text-[var(--ink-faint)] flex items-center gap-2">
          <span>{language === 'fa' ? 'هوازی پایه' : 'Aerobic Base'}</span>
          <span className="text-[var(--accent)]">→</span>
          <span>{language === 'fa' ? 'عصبی‌عضلانی' : 'Neuromuscular'}</span>
        </div>
      </div>

      {/* Interactive Horizontal Zone Spectrum */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/50">
        {zones.map((zone) => {
          const isSelected = selectedZoneCode === zone.code;
          return (
            <button
              key={zone.code}
              onClick={() => onSelectZone(zone.code)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-lg transition-all duration-150 cursor-pointer text-center ${
                isSelected
                  ? 'bg-[var(--surface)] border-2 shadow-md scale-[1.02]'
                  : 'bg-transparent border border-transparent hover:bg-[var(--surface)]/50 opacity-80 hover:opacity-100'
              }`}
              style={{
                borderColor: isSelected ? zone.color : 'transparent',
              }}
            >
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="font-mono font-black text-xs sm:text-sm" style={{ color: zone.color }}>
                  {zone.code}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[var(--ink)] truncate max-w-full mt-0.5">
                {language === 'fa' ? zone.nameFa.split(' ')[0] : zone.nameEn.split(' ')[0]}
              </span>
              <span className="text-[10px] font-mono text-[var(--ink-muted)] hidden md:inline-block mt-0.5">
                {formatPaceRange(zone.paceSecPerKmMin, zone.paceSecPerKmMax, 'km', numeralSystem)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
