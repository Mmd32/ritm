'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem, VDOTResult } from '@/types';
import { formatDigits, formatDuration, formatPace, getConfidenceBadge } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { saveRecordToHistory } from '@/lib/vdot/storage';
import { Check, Copy, Bookmark, BookmarkCheck, HelpCircle } from 'lucide-react';

interface VDOTResultCardProps {
  result: VDOTResult;
  language: Language;
  numeralSystem: NumeralSystem;
  onOpenMethodology: () => void;
  onRecordSaved?: () => void;
}

export const VDOTResultCard: React.FC<VDOTResultCardProps> = ({
  result,
  language,
  numeralSystem,
  onOpenMethodology,
  onRecordSaved,
}) => {
  const t = TRANSLATIONS[language];
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const confidence = getConfidenceBadge(result.performanceType, result.inputDistanceMeters);

  const handleSave = () => {
    saveRecordToHistory({
      date: new Date().toISOString(),
      distanceMeters: result.inputDistanceMeters,
      distanceName: language === 'fa' ? result.inputDistanceLabelFa : result.inputDistanceLabelEn,
      timeSeconds: result.inputTimeSeconds,
      vdot: result.vdot,
      performanceType: result.performanceType,
      notes: language === 'fa' ? 'ثبت‌شده در ریتم' : 'Logged via RITM',
    });

    setIsSaved(true);
    if (onRecordSaved) onRecordSaved();
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopy = () => {
    const text = `RITM | VDOT: ${result.vdot.toFixed(1)} (${language === 'fa' ? result.inputDistanceLabelFa : result.inputDistanceLabelEn} in ${formatDuration(result.inputTimeSeconds, 'en')}) - https://ritm-rosy.vercel.app`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div
      id="vdot-result-dashboard"
      className="max-w-4xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-xl transition-all duration-200"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
        {/* Main VDOT Numeric Telemetry Display */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest font-black text-[var(--accent)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              {t.vdotCard.currentVdot}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--ink-muted)]"
            >
              {language === 'fa' ? confidence.levelFa : confidence.levelEn}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-[var(--ink)] leading-none">
              {formatDigits(result.vdot.toFixed(1), numeralSystem)}
            </span>
            <span className="text-sm sm:text-base font-bold text-[var(--ink-faint)] uppercase tracking-wider font-mono">
              VDOT
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-2 font-normal leading-relaxed max-w-md">
            {t.vdotCard.assessmentSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 mt-6">
            <button
              onClick={handleSave}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                  : 'bg-[var(--card)] border-[var(--border)] text-[var(--ink)] hover:border-[var(--accent)]'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? (language === 'fa' ? 'ذخیره شد' : 'Saved') : t.vdotCard.saveToHistoryBtn}</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--border)] bg-[var(--card)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--ink-muted)] flex items-center gap-1.5 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? (language === 'fa' ? 'کپی شد' : 'Copied') : (language === 'fa' ? 'اشتراک‌گذاری' : 'Share')}</span>
            </button>

            <button
              onClick={onOpenMethodology}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--ink-faint)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.vdotCard.howCalculatedBtn}</span>
            </button>
          </div>
        </div>

        {/* 4-Cell Technical Telemetry Grid */}
        <div className="w-full lg:w-80 grid grid-cols-2 gap-2.5 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-r lg:rtl:border-r-0 lg:rtl:border-l border-[var(--border)] lg:pr-8 lg:rtl:pr-0 lg:rtl:pl-8">
          {/* 1. Recorded Distance & Time */}
          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)]">
              {t.vdotCard.recordedDistance}
            </span>
            <div className="mt-2">
              <span className="text-base font-black text-[var(--ink)] font-mono block">
                {language === 'fa' ? result.inputDistanceLabelFa : result.inputDistanceLabelEn}
              </span>
              <span className="text-[11px] font-mono text-[var(--ink-muted)]">
                {formatDuration(result.inputTimeSeconds, numeralSystem)}
              </span>
            </div>
          </div>

          {/* 2. Average Pace */}
          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)]">
              {t.vdotCard.avgPace}
            </span>
            <div className="mt-2">
              <span className="text-base font-black text-[var(--ink)] font-mono block">
                {formatPace(result.avgPaceSecPerKm, 'km', numeralSystem)}
              </span>
              <span className="text-[11px] font-mono text-[var(--ink-muted)]">
                {formatPace(result.avgPaceSecPerMile, 'mi', numeralSystem)}
              </span>
            </div>
          </div>

          {/* 3. Linear Velocity */}
          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)]">
              {t.vdotCard.avgSpeed}
            </span>
            <div className="mt-2">
              <span className="text-base font-black text-[var(--ink)] font-mono block">
                {formatDigits(result.avgSpeedKmh.toFixed(1), numeralSystem)}
                <span className="text-[10px] font-normal text-[var(--ink-faint)] mr-1 ml-1">km/h</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--ink-muted)]">
                {formatDigits((result.avgSpeedKmh * 0.621371).toFixed(1), numeralSystem)} mph
              </span>
            </div>
          </div>

          {/* 4. Estimated VO2 Cost */}
          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)]">
              VO₂ Cost
            </span>
            <div className="mt-2">
              <span className="text-base font-black text-[var(--ink)] font-mono block">
                {formatDigits(result.vo2Cost.toFixed(1), numeralSystem)}
              </span>
              <span className="text-[10px] font-mono text-[var(--ink-muted)]">
                mL/kg/min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
