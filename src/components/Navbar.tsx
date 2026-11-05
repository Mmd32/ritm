'use client';

import React from 'react';
import { Language, NumeralSystem, ThemeMode } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { Moon, Sun, Globe, Hash, BookOpen } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  numeralSystem: NumeralSystem;
  onNumeralSystemChange: (num: NumeralSystem) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenMethodology: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  numeralSystem,
  onNumeralSystemChange,
  theme,
  onThemeToggle,
  activeSection,
  onNavigate,
  onOpenMethodology,
}) => {
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'calculator', label: t.nav.calculator },
    { id: 'zones', label: t.nav.zones },
    { id: 'predictions', label: t.nav.predictions },
    { id: 'splits', label: t.nav.splits },
    { id: 'history', label: t.nav.history },
    { id: 'tools', label: t.nav.tools },
    { id: 'academy', label: t.nav.academy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-[var(--border)] bg-[var(--surface)]/90 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onNavigate('calculator')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--card)] border border-[var(--border)] group-hover:border-[var(--accent)] transition-all">
            <svg
              className="w-5 h-5 text-[var(--accent)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight leading-none text-[var(--ink)]">
                {language === 'fa' ? 'ریتم' : 'RITM'}
              </span>
              <span className="text-[11px] font-mono tracking-widest text-[var(--accent)] font-extrabold uppercase">
                {language === 'fa' ? 'VDOT' : 'PACE'}
              </span>
            </div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[var(--ink-faint)] mt-0.5">
              Jack Daniels System
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'text-[var(--accent)] bg-[var(--card)] border border-[var(--border)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--card)]/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={onOpenMethodology}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)] hover:bg-[var(--card)]/50 transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.nav.methodology}</span>
          </button>
        </nav>

        {/* Controls: Numeral Switch, Language Switch, Theme Switch */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Numeral Switch (۱۲۳ / 123) */}
          <button
            onClick={() => onNumeralSystemChange(numeralSystem === 'fa' ? 'en' : 'fa')}
            title={language === 'fa' ? 'تغییر ارقام به فارسی / انگلیسی' : 'Toggle Persian / English Numerals'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)]"
          >
            <Hash className="w-3 h-3 text-[var(--ink-faint)]" />
            <span>{numeralSystem === 'fa' ? '۱۲۳' : '123'}</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => onLanguageChange(language === 'fa' ? 'en' : 'fa')}
            title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)]"
          >
            <Globe className="w-3 h-3 text-[var(--ink-faint)]" />
            <span>{language === 'fa' ? 'EN' : 'فا'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            title={theme === 'dark' ? 'حالت روشن' : 'Dark Mode'}
            className="p-2 rounded-lg text-xs font-medium transition-all border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)]"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[var(--accent)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--accent)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
