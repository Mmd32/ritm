'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem, RacePrediction } from '@/types';
import { formatDigits, formatDuration, formatPace } from '@/lib/vdot/formatters';
import { predictRaceTimeMinutes, velocityToKmh, velocityToPaceSecPerKm } from '@/lib/vdot/daniels';
import { TRANSLATIONS } from '@/lib/translations';
import { Trophy, Compass, ArrowRight, ArrowLeft } from 'lucide-react';

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
  const isRtl = language === 'fa';

  // Custom distance explorer
  const [customDistanceKm, setCustomDistanceKm] = useState<string>('8');
  const [customResult, setCustomResult] = useState<{
    timeSec: number;
    paceSec: number;
    speedKmh: number;
  } | null>(null);

  const handleCustomExplore = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const distKm = parseFloat(customDistanceKm);
    if (!isNaN(distKm) && distKm > 0.1 && distKm <= 100) {
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
    <div id="race-predictions-section" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
              {t.predictions.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
            {t.predictions.subtitle}
          </p>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] mb-6">
        <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
          <thead>
            <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)] bg-[var(--card)]">
              <th className="py-3 px-4">{t.predictions.colDistance}</th>
              <th className="py-3 px-4">{t.predictions.colPredictedTime}</th>
              <th className="py-3 px-4">{t.predictions.colAvgPace}</th>
              <th className="py-3 px-4">{t.predictions.colSpeed}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-xs sm:text-sm">
            {predictions.map((p) => (
              <tr
                key={p.distanceId}
                className="transition-colors hover:bg-[var(--card)]/60"
              >
                <td className="py-3.5 px-4 font-bold text-[var(--ink)]">
                  <span>{language === 'fa' ? p.nameFa : p.nameEn}</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-black text-[var(--accent)] text-sm sm:text-base">
                  {formatDuration(p.predictedSeconds, numeralSystem)}
                </td>
                <td className="py-3.5 px-4 font-mono text-[var(--ink)]">
                  {formatPace(p.paceSecPerKm, 'km', numeralSystem)}
                </td>
                <td className="py-3.5 px-4 font-mono text-[var(--ink-muted)]">
                  {formatDigits(p.speedKmh.toFixed(1), numeralSystem)} km/h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Distance Explorer Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleCustomExplore} className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[var(--ink)] whitespace-nowrap">
            {language === 'fa' ? 'پیش‌بینی مسافت دلخواه:' : 'Custom Distance:'}
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={customDistanceKm}
            onChange={(e) => setCustomDistanceKm(e.target.value)}
            placeholder="8"
            className="w-20 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
          />
          <span className="text-xs text-[var(--ink-faint)] font-mono">km</span>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 cursor-pointer"
          >
            {language === 'fa' ? 'محاسبه' : 'Predict'}
          </button>
        </form>

        {customResult && (
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--ink-muted)]">
            <div>
              <span className="text-[var(--ink-faint)]">{language === 'fa' ? 'زمان: ' : 'Time: '}</span>
              <strong className="text-[var(--accent)]">{formatDuration(customResult.timeSec, numeralSystem)}</strong>
            </div>
            <div>
              <span className="text-[var(--ink-faint)]">{language === 'fa' ? 'پیس: ' : 'Pace: '}</span>
              <strong className="text-[var(--ink)]">{formatPace(customResult.paceSec, 'km', numeralSystem)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Daniels Law Caveat Notice */}
      <div className="mt-4 text-[11px] text-[var(--ink-faint)] leading-relaxed">
        {language === 'fa'
          ? 'نکته فیزیولوژیک: پیش‌بینی زمان مسابقات طولانی‌تر (به‌ویژه نیمه‌ماراتن و ماراتن) مشروط بر تمرینات اختصاصی حجم استقامت و تغذیه مناسب درون‌مسابقه‌ای است. عدد VDOT پتانسیل هوازی شما را نشان می‌دهد.'
          : 'Physiological note: Race equivalency assumes specific preparation and endurance base for the respective distance. Marathon performance requires sufficient mileage and glycogen fueling.'}
      </div>
    </div>
  );
};
