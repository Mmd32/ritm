'use client';

import React from 'react';
import { Language, NumeralSystem, TrainingZone } from '@/types';
import { formatDigits, formatPace, formatPaceRange } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { Activity, Dumbbell, MessageSquare, Gauge, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface TrainingZonesGridProps {
  zones: TrainingZone[];
  selectedZoneCode: 'E' | 'M' | 'T' | 'I' | 'R';
  language: Language;
  numeralSystem: NumeralSystem;
  onSelectZone?: (code: 'E' | 'M' | 'T' | 'I' | 'R') => void;
}

export const TrainingZonesGrid: React.FC<TrainingZonesGridProps> = ({
  zones,
  selectedZoneCode,
  language,
  numeralSystem,
  onSelectZone,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'fa';

  const activeZone = zones.find((z) => z.code === selectedZoneCode) || zones[0];

  return (
    <div id="training-zones-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold mb-1">
            {language === 'fa' ? 'شدت‌های فیزیولوژیک' : 'Training Intensities'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
            {t.zones.title}
          </h2>
        </div>
        <p className="text-xs text-[var(--ink-muted)] max-w-md">
          {t.zones.subtitle}
        </p>
      </div>

      {/* Asymmetric Master Pace Console: Focused Dossier + Comparative Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (7 Cols): Active Focused Zone Detailed Dossier */}
        <div
          className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl transition-all duration-300 relative overflow-hidden"
          style={{ borderColor: activeZone.color }}
        >
          {/* Subtle top indicator bar in zone accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: activeZone.color }}
          />

          {/* Dossier Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono text-xl"
                style={{ backgroundColor: activeZone.bgColor, color: activeZone.color, border: `1.5px solid ${activeZone.color}` }}
              >
                {activeZone.code}
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
                  {language === 'fa' ? activeZone.nameFa : activeZone.nameEn}
                </h3>
                <span className="text-xs font-mono font-semibold text-[var(--ink-muted)]">
                  {activeZone.vdotPercentageMin}% – {activeZone.vdotPercentageMax}% VDOT
                </span>
              </div>
            </div>

            <span
              className="text-xs font-bold px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--ink)]"
            >
              {language === 'fa' ? activeZone.rpeFa : activeZone.rpeEn}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-[var(--ink-muted)] font-medium mb-6 leading-relaxed">
            {language === 'fa' ? activeZone.taglineFa : activeZone.taglineEn}
          </p>

          {/* Primary Pace Readout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] block mb-1">
                {t.zones.pacePerKm}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono" style={{ color: activeZone.color }}>
                {formatPaceRange(activeZone.paceSecPerKmMin, activeZone.paceSecPerKmMax, 'km', numeralSystem)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] block mb-1">
                {t.zones.pacePerMile}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[var(--ink-muted)]">
                {formatPaceRange(activeZone.paceSecPerMileMin, activeZone.paceSecPerMileMax, 'mi', numeralSystem)}
              </span>
            </div>
          </div>

          {/* Clinical Breakdown: Purpose, Talk Test, Workout */}
          <div className="space-y-4">
            {/* Purpose */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[var(--ink)]">
                <Activity className="w-4 h-4 text-[var(--accent)]" />
                <span>{t.zones.purpose}</span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                {language === 'fa' ? activeZone.purposeFa : activeZone.purposeEn}
              </p>
            </div>

            {/* Talk Test */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[var(--ink)]">
                <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                <span>{t.zones.talkTest}</span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                {language === 'fa' ? activeZone.conversationTestFa : activeZone.conversationTestEn}
              </p>
            </div>

            {/* Sample Workout */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[var(--ink)]">
                <Dumbbell className="w-4 h-4 text-[var(--accent)]" />
                <span>{t.zones.sampleWorkouts}</span>
              </div>
              <p className="text-xs font-mono font-medium text-[var(--ink)] leading-relaxed">
                {language === 'fa'
                  ? activeZone.sampleWorkoutsFa.join(' • ')
                  : activeZone.sampleWorkoutsEn.join(' • ')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): High-Density Comparative Telemetry Table */}
        <div className="lg:col-span-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black text-[var(--ink)]">
              {language === 'fa' ? 'مقایسه ۵ شدت تمرینی' : 'Zone Matrix Overview'}
            </h4>
            <span className="text-[11px] font-mono text-[var(--ink-faint)]">
              {language === 'fa' ? 'انتخاب جهت تحلیل' : 'Click to inspect'}
            </span>
          </div>

          <div className="space-y-2">
            {zones.map((z) => {
              const isSelected = z.code === selectedZoneCode;
              return (
                <div
                  key={z.code}
                  onClick={() => onSelectZone && onSelectZone(z.code)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[var(--card)] border-[var(--border)] ring-1 ring-[var(--accent)] shadow-sm'
                      : 'bg-[var(--card)]/40 border-[var(--border)] hover:bg-[var(--card)] hover:border-[var(--ink-muted)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0"
                      style={{ backgroundColor: z.bgColor, color: z.color, border: `1px solid ${z.borderColor}` }}
                    >
                      {z.code}
                    </span>
                    <div>
                      <div className="text-xs font-black text-[var(--ink)] flex items-center gap-1.5">
                        <span>{language === 'fa' ? z.nameFa : z.nameEn}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--ink-faint)]">
                        {z.vdotPercentageMin}% – {z.vdotPercentageMax}% VDOT
                      </span>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left">
                    <span className="text-xs font-mono font-bold block" style={{ color: z.color }}>
                      {formatPaceRange(z.paceSecPerKmMin, z.paceSecPerKmMax, 'km', numeralSystem)}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--ink-faint)]">
                      {language === 'fa' ? z.rpeFa.split(' ')[0] : z.rpeEn.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Box */}
          <div className="mt-5 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-[11px] text-[var(--ink-muted)] leading-relaxed">
            <span className="font-bold text-[var(--ink)] block mb-0.5">
              {language === 'fa' ? '💡 قانون ۸۰/۲۰ دویدن:' : '💡 The 80/20 Running Rule:'}
            </span>
            {language === 'fa'
              ? 'حدود ۸۰٪ از حجم هفتگی دویدن باید در زون آسان (Zone E) انجام شود و تنها ۲۰٪ باقی‌مانده به تمرینات آستانه (T)، اینتروال (I) و تکرارهای سرعتی (R) اختصاص یابد.'
              : 'Approximately 80% of weekly volume should stay in Zone E, with only ~20% reserved for threshold, interval, and speed repetition workouts.'}
          </div>
        </div>
      </div>
    </div>
  );
};
