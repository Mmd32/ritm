'use client';

import React from 'react';
import { Language, NumeralSystem, VDOTResult } from '@/types';
import { generateTrainingInsights } from '@/lib/vdot/insights';
import { TRANSLATIONS } from '@/lib/translations';
import { Lightbulb, Target, Shield, Zap, TrendingUp } from 'lucide-react';

interface TrainingInsightsCardProps {
  result: VDOTResult;
  language: Language;
  numeralSystem: NumeralSystem;
}

export const TrainingInsightsCard: React.FC<TrainingInsightsCardProps> = ({
  result,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const insights = generateTrainingInsights(result);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-5 h-5 text-[#C8FF4D]" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-[#38BDF8]" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-[#FBBF24]" />;
      case 'trendUp':
        return <TrendingUp className="w-5 h-5 text-[#34D399]" />;
      default:
        return <Lightbulb className="w-5 h-5 text-[#C8FF4D]" />;
    }
  };

  return (
    <div id="training-insights-section" className="rounded-3xl border p-6 sm:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#C8FF4D]/10 border border-[#C8FF4D]/30">
          <Lightbulb className="w-5 h-5 text-[#C8FF4D]" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
            {t.insights.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {t.insights.subtitle}
          </p>
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-5 rounded-2xl border transition-all flex flex-col justify-between"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-white/5 text-[#94A3B8]">
                  {language === 'fa' ? insight.categoryFa : insight.categoryEn}
                </span>
                {getIcon(insight.iconName)}
              </div>
              <h4 className="text-sm font-bold text-[#F8FAFC] mb-2">
                {language === 'fa' ? insight.titleFa : insight.titleEn}
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {language === 'fa' ? insight.bodyFa : insight.bodyEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

