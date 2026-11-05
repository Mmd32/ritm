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
    <div className="rounded-3xl border p-5 sm:p-7 mb-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#F8FAFC]">
            {t.zones.interactiveSpectrumTitle}
          </h3>
          <p className="text-xs text-[#94A3B8]">
            {t.zones.spectrumSubtitle}
          </p>
        </div>
        <div className="text-xs font-semibold text-[#94A3B8] flex items-center gap-2">
          <span>{language === 'fa' ? 'آرام‌تر (هوازی)' : 'Slower (Aerobic)'}</span>
          <span className="text-[#C8FF4D]">→</span>
          <span>{language === 'fa' ? 'سریع‌تر (عصبی-عضلانی)' : 'Faster (Neuromuscular)'}</span>
        </div>
      </div>

      {/* Interactive Horizontal Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-1.5 rounded-2xl border" style={{ backgroundColor: 'var(--canvas)', borderColor: 'var(--border)' }}>
        {zones.map((zone) => {
          const isSelected = selectedZoneCode === zone.code;
          return (
            <button
              key={zone.code}
              onClick={() => onSelectZone(zone.code)}
              className={`flex flex-col items-center justify-center py-3 px-1 sm:px-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected ? 'ring-2 ring-offset-2 ring-offset-[#0B0F14] scale-[1.02]' : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: zone.bgColor,
                borderColor: zone.color,
                borderWidth: isSelected ? '2px' : '1px',
              }}
            >
              <div className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="font-black text-sm sm:text-lg" style={{ color: zone.color }}>
                  {zone.code}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#F8FAFC] truncate max-w-full mt-0.5">
                {language === 'fa' ? zone.nameFa.split(' ')[0] : zone.nameEn.split(' ')[0]}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#94A3B8] hidden md:inline-block mt-1">
                {formatPaceRange(zone.paceSecPerKmMin, zone.paceSecPerKmMax, 'km', numeralSystem)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
