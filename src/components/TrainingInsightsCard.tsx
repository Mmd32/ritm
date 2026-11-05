'use client';

import React from 'react';
import { Language, NumeralSystem, VDOTResult } from '@/types';
import { generateTrainingInsights, CoachingInsight } from '@/lib/vdot/insights';
import { TRANSLATIONS } from '@/lib/translations';
import { Lightbulb, Target, Shield, Zap, TrendingUp, Heart } from 'lucide-react';

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

  const getIcon = (iconName: CoachingInsight['iconName']) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-5 h-5 text-[var(--accent)]" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-sky-400" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'trendUp':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'heart':
        return <Heart className="w-5 h-5 text-rose-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-[var(--accent)]" />;
    }
  };

  return (
    <div id="training-insights-section" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--card)] border border-[var(--border)]">
          <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
            {t.insights.title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
            {t.insights.subtitle}
          </p>
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 flex flex-col justify-between transition-colors hover:bg-[var(--card)]"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                {getIcon(insight.iconName)}
                <h4 className="font-bold text-sm sm:text-base text-[var(--ink)]">
                  {language === 'fa' ? insight.titleFa : insight.titleEn}
                </h4>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                {language === 'fa' ? insight.bodyFa : insight.bodyEn}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--ink-faint)]">
              <span>{language === 'fa' ? 'راهکار پیشنهادی مربی' : 'Coach recommendation'}</span>
              <span className="text-[var(--accent)] font-bold">Daniels System</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
