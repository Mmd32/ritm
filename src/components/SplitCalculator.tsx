'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem, TrainingZone } from '@/types';
import { calculateSplitTime } from '@/lib/vdot/daniels';
import { formatDigits, formatDuration, formatPace } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { AlertTriangle, Clock, FastForward } from 'lucide-react';

interface SplitCalculatorProps {
  zones: TrainingZone[];
  language: Language;
  numeralSystem: NumeralSystem;
}

const SPLIT_DISTANCES = [
  { meters: 200, label: '200 m' },
  { meters: 300, label: '300 m' },
  { meters: 400, label: '400 m' },
  { meters: 600, label: '600 m' },
  { meters: 800, label: '800 m' },
  { meters: 1000, label: '1000 m' },
  { meters: 1200, label: '1200 m' },
];

export const SplitCalculator: React.FC<SplitCalculatorProps> = ({
  zones,
  language,
  numeralSystem,
}) => {
  const t = TRANSLATIONS[language];

  const [selectedZoneCode, setSelectedZoneCode] = useState<'E' | 'M' | 'T' | 'I' | 'R'>('I');
  const [selectedMeters, setSelectedMeters] = useState<number>(400);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customDistanceStr, setCustomDistanceStr] = useState<string>('500');

  const activeZone = zones.find((z) => z.code === selectedZoneCode) || zones[3];

  const currentDistanceMeters = isCustom
    ? Math.max(50, Math.min(10000, parseFloat(customDistanceStr) || 400))
    : selectedMeters;

  // Use midpoint pace of zone
  const midPaceSecPerKm = (activeZone.paceSecPerKmMin + activeZone.paceSecPerKmMax) / 2;
  const splitSeconds = calculateSplitTime(currentDistanceMeters, midPaceSecPerKm);

  // Safety checks
  const isDangerZoneR = selectedZoneCode === 'R' && currentDistanceMeters > 600;
  const isDangerZoneI = selectedZoneCode === 'I' && currentDistanceMeters > 2000;

  return (
    <div id="split-calculator-section" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FastForward className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
            {t.splits.title}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
          {t.splits.subtitle}
        </p>
      </div>

      {/* Select Zone Pills */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-2">
          {t.splits.zoneLabel}
        </label>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {zones.map((z) => {
            const isSelected = z.code === selectedZoneCode;
            return (
              <button
                key={z.code}
                type="button"
                onClick={() => setSelectedZoneCode(z.code)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                  isSelected
                    ? 'bg-[var(--card)] text-[var(--ink)] border-2 shadow-sm'
                    : 'bg-[var(--card)]/40 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
                }`}
                style={{
                  borderColor: isSelected ? z.color : undefined,
                }}
              >
                <span className="block font-mono font-black" style={{ color: z.color }}>
                  {z.code}
                </span>
                <span className="text-[10px] truncate block text-[var(--ink)]">
                  {language === 'fa' ? z.nameFa.split(' ')[0] : z.nameEn.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Distance Presets */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-2">
          {t.splits.distanceLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          {SPLIT_DISTANCES.map((d) => {
            const isSelected = !isCustom && selectedMeters === d.meters;
            return (
              <button
                key={d.meters}
                type="button"
                onClick={() => {
                  setSelectedMeters(d.meters);
                  setIsCustom(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  isSelected
                    ? 'bg-[var(--card)] text-[var(--ink)] border-[var(--accent)] ring-1 ring-[var(--accent)]'
                    : 'bg-[var(--card)]/40 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
                }`}
              >
                {d.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              isCustom
                ? 'bg-[var(--card)] text-[var(--ink)] border-[var(--accent)] ring-1 ring-[var(--accent)]'
                : 'bg-[var(--card)]/40 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
            }`}
          >
            {language === 'fa' ? 'دلخواه...' : 'Custom...'}
          </button>
        </div>

        {isCustom && (
          <div className="mt-3 flex items-center gap-2 max-w-xs">
            <input
              type="number"
              min="50"
              max="10000"
              step="50"
              value={customDistanceStr}
              onChange={(e) => setCustomDistanceStr(e.target.value)}
              placeholder="500"
              className="w-28 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
            />
            <span className="text-xs text-[var(--ink-faint)] font-mono">meters</span>
          </div>
        )}
      </div>

      {/* Split Result Hero Display */}
      <div
        className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="text-center sm:text-left rtl:sm:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] block mb-1">
            {language === 'fa' ? `زمان هدف برای ${currentDistanceMeters} متر` : `Target split for ${currentDistanceMeters}m`}
          </span>
          <div className="text-4xl sm:text-5xl font-black font-mono" style={{ color: activeZone.color }}>
            {formatDuration(splitSeconds, numeralSystem)}
          </div>
          <span className="text-xs font-mono text-[var(--ink-muted)] mt-1 block">
            {language === 'fa' ? 'معادل پیس: ' : 'Equivalent pace: '}
            <strong className="text-[var(--ink)]">{formatPace(midPaceSecPerKm, 'km', numeralSystem)}</strong>
          </span>
        </div>

        <div className="flex flex-col gap-2 max-w-xs text-xs text-[var(--ink-muted)]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>
              {language === 'fa'
                ? `شدت زون: ${activeZone.vdotPercentageMin}% – ${activeZone.vdotPercentageMax}% VDOT`
                : `Zone target: ${activeZone.vdotPercentageMin}% – ${activeZone.vdotPercentageMax}% VDOT`}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Warnings for Zone R and I */}
      {isDangerZoneR && (
        <div className="mt-4 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-400 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block mb-1">
              {language === 'fa' ? 'هشدار فیزیولوژیک شدت تکرار (Zone R):' : 'Physiological Caution (Zone R):'}
            </strong>
            {language === 'fa'
              ? 'تکرارهای سرعتی شدیدتر از توان بیشینه هوازی هستند و هدف آن‌ها اقتصاد دویدن است. تکرار پیوسته بیش از ۶۰۰ متر در این شدت منجر به اسیدوز شدید و تخریب فرم صحیح دویدن می‌شود. فواصل بازیابی کامل الزامی است.'
              : 'Repetition intervals exceed VO2max pace. Running continuously over 600m at R pace causes severe lactate pooling and mechanics breakdown.'}
          </div>
        </div>
      )}

      {isDangerZoneI && (
        <div className="mt-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-400 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block mb-1">
              {language === 'fa' ? 'توصیه تمرینی اینتروال (Zone I):' : 'Interval Training Guidance (Zone I):'}
            </strong>
            {language === 'fa'
              ? 'اینتروال‌های توان هوازی بیشینه (VO2max) معمولاً در بازه‌های ۲ تا ۵ دقیقه (معمولاً ۴۰۰ تا ۱۲۰۰ متر) اجرا می‌شوند تا بالاترین کارایی را بدون خستگی مفرط داشته باشند.'
              : 'VO2max intervals are most effective when kept between 2 and 5 minutes (typically 400m to 1200m).'}
          </div>
        </div>
      )}
    </div>
  );
};
