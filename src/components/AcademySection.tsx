'use client';

import React, { useState } from 'react';
import { AcademyArticle, Language, NumeralSystem } from '@/types';
import { ACADEMY_ARTICLES } from '@/lib/academy/articles';
import { formatDigits } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { BookOpen, Clock, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface AcademySectionProps {
  language: Language;
  numeralSystem: NumeralSystem;
}

export const AcademySection: React.FC<AcademySectionProps> = ({
  language,
  numeralSystem,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'fa';
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
    <div id="academy-section" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
              {t.academy.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
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
                  ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)] shadow-sm'
                  : 'bg-[var(--card)] text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:bg-[var(--card)] hover:border-[var(--accent)] group"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--ink-faint)] mb-2.5">
                <span className="uppercase font-bold tracking-wider text-[var(--accent)]">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDigits(article.readingTimeMinutes, numeralSystem)} {t.academy.readingTime}</span>
                </span>
              </div>

              <h4 className="font-black text-base sm:text-lg text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors leading-snug">
                {language === 'fa' ? article.titleFa : article.titleEn}
              </h4>

              <p className="text-xs text-[var(--ink-muted)] line-clamp-3 leading-relaxed">
                {language === 'fa' ? article.summaryFa : article.summaryEn}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--ink-muted)] group-hover:text-[var(--ink)]">
              <span>{t.academy.readMore}</span>
              {isRtl ? (
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 left-6 rtl:left-auto rtl:right-6 p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[var(--accent)] font-bold mb-3 mt-1">
              <span>{activeArticle.category}</span>
              <span>•</span>
              <span>{formatDigits(activeArticle.readingTimeMinutes, numeralSystem)} {t.academy.readingTime}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)] mb-4 leading-tight">
              {language === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
            </h3>

            <div className="text-xs sm:text-sm text-[var(--ink-muted)] leading-loose whitespace-pre-line space-y-4 font-normal">
              {language === 'fa' ? activeArticle.contentFa : activeArticle.contentEn}
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-opacity"
              >
                {language === 'fa' ? 'بستن مقاله' : 'Close Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
