'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem, TrainingZone } from '@/types';
import { calculateSplitTime } from '@/lib/vdot/daniels';
import { formatDigits, formatDuration, formatPace } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { AlertTriangle, Clock, FastForward, ShieldAlert } from 'lucide-react';

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
    <div id="split-calculator-section" className="rounded-3xl border p-6 sm:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FastForward className="w-5 h-5 text-[#38BDF8]" />
          <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
            {t.splits.title}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          {t.splits.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Zone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
              {t.splits.zoneLabel}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {zones.map((z) => {
                const isSelected = selectedZoneCode === z.code;
                return (
                  <button
                    key={z.code}
                    onClick={() => setSelectedZoneCode(z.code)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-[#0B0F14] scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: z.color,
                      backgroundColor: isSelected ? z.bgColor : 'var(--card)',
                      color: z.color,
                    }}
                  >
                    <span className="block text-sm">{z.code}</span>
                    <span className="text-[10px] font-normal truncate block">
                      {language === 'fa' ? z.nameFa.split(' ')[0] : z.nameEn.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distance Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
              {t.splits.distanceLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {SPLIT_DISTANCES.map((d) => {
                const isSelected = !isCustom && selectedMeters === d.meters;
                return (
                  <button
                    key={d.meters}
                    onClick={() => {
                      setSelectedMeters(d.meters);
                      setIsCustom(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-[#C8FF4D] text-[#0B0F14] border-[#C8FF4D]'
                        : 'border-[var(--border)] text-[#F8FAFC] hover:border-white/20'
                    }`}
                    style={{ backgroundColor: isSelected ? '#C8FF4D' : 'var(--card)' }}
                  >
                    {formatDigits(d.label, numeralSystem)}
                  </button>
                );
              })}
              <button
                onClick={() => setIsCustom(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isCustom
                    ? 'bg-[#C8FF4D] text-[#0B0F14] border-[#C8FF4D]'
                    : 'border-[var(--border)] text-[#F8FAFC] hover:border-white/20'
                }`}
                style={{ backgroundColor: isCustom ? '#C8FF4D' : 'var(--card)' }}
              >
                {language === 'fa' ? 'سفارشی' : 'Custom'}
              </button>
            </div>

            {isCustom && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={customDistanceStr}
                  onChange={(e) => setCustomDistanceStr(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-lg text-xs font-bold num-mono text-center border focus:outline-none focus:border-[#C8FF4D]"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                />
                <span className="text-xs text-[#94A3B8] font-semibold">{t.splits.customDistanceLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Display Card */}
        <div className="lg:col-span-5">
          <div
            className="rounded-3xl border p-6 text-center relative overflow-hidden"
            style={{ backgroundColor: 'var(--card)', borderColor: activeZone.borderColor }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeZone.color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                {language === 'fa' ? activeZone.nameFa : activeZone.nameEn} (
                {formatDigits(currentDistanceMeters, numeralSystem)} m)
              </span>
            </div>

            <div className="text-xs text-[#94A3B8] mb-1">{t.splits.targetSplitTime}</div>
            <div
              className="text-4xl sm:text-5xl font-black num-mono my-2"
              style={{ color: activeZone.color }}
            >
              {formatDuration(splitSeconds, numeralSystem, splitSeconds >= 3600)}
            </div>

            <div className="text-xs text-[#94A3B8] mt-2">
              {t.splits.targetPaceLabel}:{' '}
              <strong className="text-[#F8FAFC] num-mono">
                {formatPace(midPaceSecPerKm, 'km', numeralSystem)}
              </strong>
            </div>

            {/* Safety Alerts */}
            {isDangerZoneR && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-left leading-normal flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t.splits.safetyWarningHighSpeed}</span>
              </div>
            )}

            {isDangerZoneI && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs text-left leading-normal flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t.splits.safetyWarningContinuous}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
