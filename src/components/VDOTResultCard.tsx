'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem, VDOTResult } from '@/types';
import { formatDigits, formatDuration, formatPace, getConfidenceBadge } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { saveRecordToHistory } from '@/lib/vdot/storage';
import { Award, BookmarkCheck, Calendar, Check, Copy, Flame, HelpCircle, MapPin, Gauge, Timer, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [mounted, setMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C8FF4D', '#38BDF8', '#34D399', '#FBBF24'],
      });
    } catch {}

    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopy = () => {
    const text = `RITM | VDOT: ${result.vdot} (${language === 'fa' ? result.inputDistanceLabelFa : result.inputDistanceLabelEn} in ${formatDuration(result.inputTimeSeconds, 'en')}) - https://ritm.run`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div
      id="vdot-result-dashboard"
      className="max-w-4xl mx-auto rounded-3xl border p-6 sm:p-10 mb-12 shadow-2xl relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'rgba(200, 255, 77, 0.25)',
      }}
    >
      {/* Decorative subtle athletic glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{ backgroundColor: '#C8FF4D' }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left / Center VDOT Big Display */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#C8FF4D] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              {t.vdotCard.currentVdot}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                borderColor: confidence.color,
                color: confidence.color,
                backgroundColor: `${confidence.color}15`,
              }}
            >
              {language === 'fa' ? confidence.levelFa : confidence.levelEn}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span
              className="text-6xl sm:text-8xl font-black tracking-tighter text-[#C8FF4D] num-mono drop-shadow-[0_4px_16px_rgba(200,255,77,0.2)]"
            >
              {formatDigits(result.vdot.toFixed(1), numeralSystem)}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#94A3B8] uppercase tracking-wider">
              Score
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm mt-1 leading-relaxed">
            {t.vdotCard.assessmentSubtitle}
          </p>

          <button
            onClick={onOpenMethodology}
            className="mt-3 text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.vdotCard.howCalculatedBtn}</span>
          </button>
        </div>

        {/* Right Metric Grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-md">
          {/* Distance */}
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#94A3B8] mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{t.vdotCard.recordedDistance}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#F8FAFC]">
              {language === 'fa' ? result.inputDistanceLabelFa : result.inputDistanceLabelEn}
            </div>
          </div>

          {/* Time */}
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#94A3B8] mb-1">
              <Timer className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{t.vdotCard.recordedTime}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#F8FAFC] num-mono">
              {formatDuration(result.inputTimeSeconds, numeralSystem, true)}
            </div>
          </div>

          {/* Average Pace */}
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#94A3B8] mb-1">
              <Gauge className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{t.vdotCard.avgPace}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#F8FAFC] num-mono">
              {formatPace(result.avgPaceSecPerKm, 'km', numeralSystem)}
            </div>
          </div>

          {/* Average Speed */}
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#94A3B8] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#FB923C]" />
              <span>{t.vdotCard.avgSpeed}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#F8FAFC] num-mono">
              {formatDigits(result.avgSpeedKmh.toFixed(2), numeralSystem)}{' '}
              <span className="text-xs font-normal text-[#94A3B8]">km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
        <div className="text-xs text-[#94A3B8] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {t.vdotCard.calcDate}:{' '}
            {mounted
              ? new Date(result.calculatedAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')
              : '2026/01/01'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-[#C8FF4D]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? t.vdotCard.copied : t.vdotCard.shareResultBtn}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
            style={{
              backgroundColor: isSaved ? '#34D399' : '#C8FF4D',
              color: '#0B0F14',
            }}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Award className="w-4 h-4" />}
            <span>{isSaved ? t.vdotCard.recordSaved : t.vdotCard.saveToHistoryBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
