'use client';

import React from 'react';
import { Language, NumeralSystem, ThemeMode } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { Activity, Moon, Sun, Globe, Hash } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(11, 15, 20, 0.85)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onNavigate('calculator')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Activity className="w-5 h-5 text-[#C8FF4D]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight leading-none text-[#F8FAFC]">
              {language === 'fa' ? 'ریتم | RITM' : 'RITM'}
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#94A3B8] mt-0.5">
              Running Performance
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-[#0B0F14] bg-[#C8FF4D] font-bold shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={onOpenMethodology}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-[#C8FF4D] hover:bg-white/5 transition-all flex items-center gap-1"
          >
            {t.nav.methodology}
          </button>
        </nav>

        {/* Controls: Numeral Switch, Language Switch, Theme Switch */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Numeral Switch (۱۲۳ / 123) */}
          <button
            onClick={() => onNumeralSystemChange(numeralSystem === 'fa' ? 'en' : 'fa')}
            title={language === 'fa' ? 'تغییر ارقام به فارسی / انگلیسی' : 'Toggle Persian / English Numerals'}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
          >
            <Hash className="w-3.5 h-3.5 text-[#C8FF4D]" />
            <span className="font-bold text-[11px]">{numeralSystem === 'fa' ? '۱۲۳' : '123'}</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => onLanguageChange(language === 'fa' ? 'en' : 'fa')}
            title="تغییر زبان / Switch Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
          >
            <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="font-semibold text-[11px]">{language === 'fa' ? 'English' : 'فارسی'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            title={theme === 'dark' ? 'حالت روشن / Light Mode' : 'حالت تیره / Dark Mode'}
            className="p-2 rounded-lg text-xs transition-colors border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FBBF24]" />
            ) : (
              <Moon className="w-4 h-4 text-[#38BDF8]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

