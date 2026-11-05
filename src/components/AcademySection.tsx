'use client';

import React, { useState } from 'react';
import { AcademyArticle, Language, NumeralSystem } from '@/types';
import { ACADEMY_ARTICLES } from '@/lib/academy/articles';
import { formatDigits } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { BookOpen, Clock, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface AcademySectionProps {
  language: Language;
  numeralSystem: NumeralSystem;
}

export const AcademySection: React.FC<AcademySectionProps> = ({
  language,
  numeralSystem,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<AcademyArticle | null>(null);

  const categories = [
    { id: 'all', label: t.academy.filterAll },
    { id: 'fundamentals', label: t.academy.filterFundamentals },
    { id: 'zones', label: t.academy.filterZones },
    { id: 'testing', label: t.academy.filterTesting },
    { id: 'coaching', label: t.academy.filterCoaching },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? ACADEMY_ARTICLES
    : ACADEMY_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div id="academy-section" className="rounded-3xl border p-6 sm:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-[#C8FF4D]" />
            <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
              {t.academy.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {t.academy.subtitle}
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-[#C8FF4D] text-[#0B0F14] border-[#C8FF4D] shadow-sm'
                  : 'border-[var(--border)] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              style={{ backgroundColor: isSelected ? '#C8FF4D' : 'var(--card)' }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:border-[#C8FF4D]/40 group"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2.5">
                <span className="font-semibold px-2 py-0.5 rounded-md bg-white/5 uppercase text-[10px] tracking-wider text-[#C8FF4D]">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3" />
                  {formatDigits(article.readingTimeMinutes, numeralSystem)} {t.academy.readingTime}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-[#F8FAFC] group-hover:text-[#C8FF4D] transition-colors mb-2">
                {language === 'fa' ? article.titleFa : article.titleEn}
              </h4>

              <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2 mb-4">
                {language === 'fa' ? article.summaryFa : article.summaryEn}
              </p>
            </div>

            <div className="pt-3 border-t flex items-center justify-between text-xs font-bold text-[#C8FF4D]" style={{ borderColor: 'var(--border)' }}>
              <span>{t.academy.readMore}</span>
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${language === 'fa' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 relative shadow-2xl"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3">
              <span className="font-bold text-[#C8FF4D] uppercase text-[10px]">
                {activeArticle.category}
              </span>
              <span>•</span>
              <span className="font-mono">
                {formatDigits(activeArticle.readingTimeMinutes, numeralSystem)} {t.academy.readingTime}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC] mb-4 leading-snug">
              {language === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
            </h3>

            {/* Key Takeaways */}
            <div className="p-4 rounded-2xl border mb-6 bg-[#C8FF4D]/5 border-[#C8FF4D]/20">
              <h5 className="text-xs font-black text-[#C8FF4D] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.academy.keyTakeawaysTitle}</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-[#F8FAFC]">
                {(language === 'fa' ? activeArticle.keyTakeawaysFa : activeArticle.keyTakeawaysEn).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8FF4D] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content Body */}
            <div className="text-xs sm:text-sm text-[#94A3B8] leading-loose whitespace-pre-line space-y-4 font-normal">
              {language === 'fa' ? activeArticle.contentFa : activeArticle.contentEn}
            </div>

            <div className="mt-8 pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0F14] bg-[#C8FF4D] hover:bg-[#bbf340] transition-colors"
              >
                {t.academy.backToAcademy}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

