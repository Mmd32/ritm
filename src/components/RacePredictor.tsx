'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem, RacePrediction } from '@/types';
import { formatDigits, formatDuration, formatPace } from '@/lib/vdot/formatters';
import { predictRaceTimeMinutes, velocityToKmh, velocityToPaceSecPerKm, paceKmToPaceMile } from '@/lib/vdot/daniels';
import { TRANSLATIONS } from '@/lib/translations';
import { Trophy, Compass, Info, ArrowUpRight, Search } from 'lucide-react';

interface RacePredictorProps {
  predictions: RacePrediction[];
  currentVdot: number;
  language: Language;
  numeralSystem: NumeralSystem;
}

export const RacePredictor: React.FC<RacePredictorProps> = ({
  predictions,
  currentVdot,
  language,
  numeralSystem,
}) => {
  const t = TRANSLATIONS[language];

  // Custom distance explorer
  const [customDistanceKm, setCustomDistanceKm] = useState<string>('8');
  const [customResult, setCustomResult] = useState<{
    timeSec: number;
    paceSec: number;
    speedKmh: number;
  } | null>(null);

  const handleCustomExplore = () => {
    const distKm = parseFloat(customDistanceKm);
    if (!isNaN(distKm) && distKm > 0.5 && distKm <= 100) {
      const distM = distKm * 1000;
      const timeMin = predictRaceTimeMinutes(distM, currentVdot);
      const timeSec = timeMin * 60;
      const v = distM / timeMin;
      const paceSec = velocityToPaceSecPerKm(v);
      const speedKmh = velocityToKmh(v);
      setCustomResult({ timeSec, paceSec, speedKmh });
    }
  };

  return (
    <div id="race-predictions-section" className="rounded-3xl border p-6 sm:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-[#C8FF4D]" />
            <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
              {t.predictions.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {t.predictions.subtitle}
          </p>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-left border-collapse" dir={language === 'fa' ? 'rtl' : 'ltr'}>
          <thead>
            <tr className="border-b text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <th className="py-3.5 px-4">{t.predictions.colDistance}</th>
              <th className="py-3.5 px-4">{t.predictions.colPredictedTime}</th>
              <th className="py-3.5 px-4">{t.predictions.colAvgPace}</th>
              <th className="py-3.5 px-4">{t.predictions.colSpeed}</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs sm:text-sm" style={{ borderColor: 'var(--border)' }}>
            {predictions.map((p) => (
              <tr
                key={p.distanceId}
                className="transition-colors hover:bg-white/5"
              >
                <td className="py-3.5 px-4 font-bold text-[#F8FAFC] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8FF4D]" />
                  <span>{language === 'fa' ? p.nameFa : p.nameEn}</span>
                </td>
                <td className="py-3.5 px-4 font-black num-mono text-[#C8FF4D] text-sm sm:text-base">
                  {formatDuration(p.predictedSeconds, numeralSystem, p.predictedSeconds >= 3600)}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#F8FAFC]">
                  {formatPace(p.paceSecPerKm, 'km', numeralSystem)}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#94A3B8]">
                  {formatDigits(p.speedKmh.toFixed(2), numeralSystem)} km/h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Target Distance Explorer */}
      <div className="mt-6 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-[#38BDF8]" />
          <span className="text-xs font-bold text-[#F8FAFC]">{t.predictions.exploreTargetLabel}</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.5"
              min="1"
              max="50"
              value={customDistanceKm}
              onChange={(e) => setCustomDistanceKm(e.target.value)}
              className="w-16 px-2.5 py-1.5 rounded-lg text-xs font-bold num-mono text-center border focus:outline-none focus:border-[#C8FF4D]"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            />
            <span className="text-xs font-medium text-[#94A3B8]">km</span>
            <button
              onClick={handleCustomExplore}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B0F14] bg-[#C8FF4D] hover:bg-[#bbf340] transition-all"
            >
              {language === 'fa' ? 'پیش‌بینی' : 'Predict'}
            </button>
          </div>
        </div>

        {customResult && (
          <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-4 num-mono">
            <span>
              {language === 'fa' ? 'زمان پیش‌بینی:' : 'Time:'}{' '}
              <strong className="text-[#C8FF4D] font-black text-sm">
                {formatDuration(customResult.timeSec, numeralSystem, customResult.timeSec >= 3600)}
              </strong>
            </span>
            <span>
              {language === 'fa' ? 'پیس:' : 'Pace:'}{' '}
              {formatPace(customResult.paceSec, 'km', numeralSystem)}
            </span>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-5 flex items-start gap-2.5 p-3 rounded-xl text-xs text-[#94A3B8] border" style={{ backgroundColor: 'var(--canvas)', borderColor: 'var(--border)' }}>
        <Info className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
        <span className="leading-relaxed">{t.predictions.disclaimer}</span>
      </div>
    </div>
  );
};

