'use client';

import React from 'react';
import { Language, NumeralSystem, TrainingZone } from '@/types';
import { formatPaceRange } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { MessageSquare, Target, Dumbbell, Compass, Gauge, Zap } from 'lucide-react';

interface TrainingZonesGridProps {
  zones: TrainingZone[];
  selectedZoneCode: string;
  language: Language;
  numeralSystem: NumeralSystem;
}

export const TrainingZonesGrid: React.FC<TrainingZonesGridProps> = ({
  zones,
  selectedZoneCode,
  language,
  numeralSystem,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div id="training-zones-section" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const isSelected = selectedZoneCode === zone.code;
          return (
            <div
              key={zone.code}
              id={`zone-card-${zone.code}`}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isSelected ? 'ring-2 ring-offset-2 ring-offset-[#0B0F14] shadow-xl' : ''
              }`}
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: isSelected ? zone.color : 'var(--border)',
              }}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{ backgroundColor: zone.bgColor, color: zone.color, border: `1px solid ${zone.borderColor}` }}
                    >
                      {zone.code}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-base text-[#F8FAFC]">
                        {language === 'fa' ? zone.nameFa : zone.nameEn}
                      </h4>
                      <span className="text-[11px] font-semibold text-[#94A3B8]">
                        {zone.vdotPercentageMin}% – {zone.vdotPercentageMax}% VDOT
                      </span>
                    </div>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  />
                </div>

                <p className="text-xs text-[#94A3B8] font-medium mb-4 leading-relaxed">
                  {language === 'fa' ? zone.taglineFa : zone.taglineEn}
                </p>

                {/* Primary Pace Range Display */}
                <div
                  className="p-4 rounded-2xl border mb-5"
                  style={{ backgroundColor: 'var(--card)', borderColor: zone.borderColor }}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    {t.zones.pacePerKm}
                  </div>
                  <div className="text-xl sm:text-2xl font-black num-mono" style={{ color: zone.color }}>
                    {formatPaceRange(zone.paceSecPerKmMin, zone.paceSecPerKmMax, 'km', numeralSystem)}
                  </div>
                  <div className="text-[11px] font-mono text-[#94A3B8] mt-1">
                    {formatPaceRange(zone.paceSecPerMileMin, zone.paceSecPerMileMax, 'mi', numeralSystem)}
                  </div>
                </div>

                {/* Characteristics */}
                <div className="space-y-3 text-xs mb-5">
                  {/* Talk test */}
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: 'var(--canvas)' }}>
                    <MessageSquare className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F8FAFC] block mb-0.5">{t.zones.talkTest}:</span>
                      <span className="text-[#94A3B8] leading-normal">
                        {language === 'fa' ? zone.conversationTestFa : zone.conversationTestEn}
                      </span>
                    </div>
                  </div>

                  {/* RPE & Purpose */}
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: 'var(--canvas)' }}>
                    <Gauge className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F8FAFC] block mb-0.5">{t.zones.rpe}:</span>
                      <span className="text-[#94A3B8]">
                        {language === 'fa' ? zone.rpeFa : zone.rpeEn}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: 'var(--canvas)' }}>
                    <Target className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F8FAFC] block mb-0.5">{t.zones.purpose}:</span>
                      <span className="text-[#94A3B8] leading-normal">
                        {language === 'fa' ? zone.purposeFa : zone.purposeEn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Workouts */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F8FAFC] mb-2">
                  <Dumbbell className="w-3.5 h-3.5 text-[#C8FF4D]" />
                  <span>{t.zones.sampleWorkouts}:</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#94A3B8]">
                  {(language === 'fa' ? zone.sampleWorkoutsFa : zone.sampleWorkoutsEn).map((workout, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-normal">
                      <span className="text-[#C8FF4D] font-bold">•</span>
                      <span>{workout}</span>
                    </li>
                  ))}
                </ul>

                {zone.recommendedRepetitionsFa && (
                  <div className="mt-3 text-[11px] font-semibold text-[#FB923C] bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                    {language === 'fa' ? zone.recommendedRepetitionsFa : zone.recommendedRepetitionsEn}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
