'use client';

import React, { useEffect, useState } from 'react';
import { HistoryRecord, Language, NumeralSystem, ThemeMode, VDOTResult } from '@/types';
import { computeVDOTResult } from '@/lib/vdot/daniels';
import { loadHistory, loadUserPreferences, saveUserPreferences } from '@/lib/vdot/storage';
import { Navbar } from '@/components/Navbar';
import { HeroCalculator } from '@/components/HeroCalculator';
import { VDOTResultCard } from '@/components/VDOTResultCard';
import { PaceSpectrum } from '@/components/PaceSpectrum';
import { TrainingZonesGrid } from '@/components/TrainingZonesGrid';
import { RacePredictor } from '@/components/RacePredictor';
import { SplitCalculator } from '@/components/SplitCalculator';
import { PerformanceHistory } from '@/components/PerformanceHistory';
import { TrainingInsightsCard } from '@/components/TrainingInsightsCard';
import { RunningTools } from '@/components/RunningTools';
import { AcademySection } from '@/components/AcademySection';
import { MethodologyModal } from '@/components/MethodologyModal';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Footer } from '@/components/Footer';
import { Activity, Flame, Trophy, LineChart, BookOpen, Calculator, Layers, Grid } from 'lucide-react';

type DashboardTab = 'zones' | 'race' | 'progress' | 'tools' | 'academy';

export default function Home() {
  // User Preferences
  const [language, setLanguage] = useState<Language>('fa');
  const [numeralSystem, setNumeralSystem] = useState<NumeralSystem>('fa');
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // Calculation Result: Default to classic 5km in 25:00 (VDOT 38.3)
  const [result, setResult] = useState<VDOTResult>(() =>
    computeVDOTResult(5000, 1500, 'official_race')
  );

  // Performance History
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Active Zone Selection in Pace Spectrum
  const [selectedZoneCode, setSelectedZoneCode] = useState<'E' | 'M' | 'T' | 'I' | 'R'>('E');

  // Active Nav Section & Dashboard Tab
  const [activeTab, setActiveTab] = useState<DashboardTab>('zones');
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');

  // Methodology Modal State
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // Mount effect: load preferences and history
  useEffect(() => {
    const prefs = loadUserPreferences();
    setLanguage(prefs.language || 'fa');
    setNumeralSystem(prefs.numeralSystem || 'fa');
    setTheme(prefs.theme || 'dark');
    setHistory(loadHistory());
  }, []);

  // Update HTML document attributes when language or theme changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', language === 'fa' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [language, theme]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    saveUserPreferences({ language: newLang });
  };

  const handleNumeralSystemChange = (newNum: NumeralSystem) => {
    setNumeralSystem(newNum);
    saveUserPreferences({ numeralSystem: newNum });
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveUserPreferences({ theme: nextTheme });
  };

  const handleResultCalculated = (newResult: VDOTResult) => {
    setResult(newResult);
    // Smooth scroll down to the results dashboard
    setTimeout(() => {
      const el = document.getElementById('vdot-result-dashboard');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'calculator') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'zones') {
      setActiveTab('zones');
    } else if (sectionId === 'predictions' || sectionId === 'splits') {
      setActiveTab('race');
    } else if (sectionId === 'history') {
      setActiveTab('progress');
    } else if (sectionId === 'tools') {
      setActiveTab('tools');
    } else if (sectionId === 'academy') {
      setActiveTab('academy');
    }

    setTimeout(() => {
      const el = document.getElementById('dashboard-hub');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        numeralSystem={numeralSystem}
        onNumeralSystemChange={handleNumeralSystemChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        activeSection={activeTab}
        onNavigate={handleNavigate}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
        {/* 1. Hero Section with Instant VDOT Calculator */}
        <HeroCalculator
          language={language}
          numeralSystem={numeralSystem}
          onResultCalculated={handleResultCalculated}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
        />

        {/* 2. Primary VDOT Dashboard Result Card */}
        <VDOTResultCard
          result={result}
          language={language}
          numeralSystem={numeralSystem}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
          onRecordSaved={() => setHistory(loadHistory())}
        />

        {/* 3. Performance Hub & Tab Navigation */}
        <div id="dashboard-hub" className="pt-2">
          {/* Section Mode Switcher Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border)]">
            {/* Primary Tab Navigation */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab('zones')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'zones'
                    ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>{language === 'fa' ? 'شدت‌های تمرینی' : 'Training Zones'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('race')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'race'
                    ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>{language === 'fa' ? 'پیش‌بینی و اسپلیت‌ها' : 'Races & Splits'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('progress')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'progress'
                    ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>{language === 'fa' ? 'کارنامه و پیشرفت' : 'Progress & Log'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tools')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'tools'
                    ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>{language === 'fa' ? 'جعبه‌ابزار' : 'Tools'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('academy')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'academy'
                    ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{language === 'fa' ? 'آکادمی' : 'Academy'}</span>
              </button>
            </div>

            {/* View Mode Toggle: Tabs vs All Sections */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'tabs' ? 'all' : 'tabs')}
              className="text-xs font-semibold text-[var(--ink-faint)] hover:text-[var(--ink)] flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
            >
              {viewMode === 'tabs' ? (
                <>
                  <Grid className="w-3.5 h-3.5" />
                  <span>{language === 'fa' ? 'مشاهده یک‌جای همه بخش‌ها' : 'Show all sections'}</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>{language === 'fa' ? 'نمای تب‌بندی شده' : 'Switch to tabbed view'}</span>
                </>
              )}
            </button>
          </div>

          {/* Active Tab View or All Views */}
          <div className="space-y-8">
            {/* 1. TRAINING ZONES */}
            {(viewMode === 'all' || activeTab === 'zones') && (
              <div className="space-y-6 animate-fade-in">
                <PaceSpectrum
                  zones={result.zones}
                  selectedZoneCode={selectedZoneCode}
                  onSelectZone={setSelectedZoneCode}
                  language={language}
                  numeralSystem={numeralSystem}
                />
                <TrainingZonesGrid
                  zones={result.zones}
                  selectedZoneCode={selectedZoneCode}
                  language={language}
                  numeralSystem={numeralSystem}
                  onSelectZone={setSelectedZoneCode}
                />
              </div>
            )}

            {/* 2. RACES & SPLITS */}
            {(viewMode === 'all' || activeTab === 'race') && (
              <div className="space-y-6 animate-fade-in">
                <RacePredictor
                  predictions={result.predictions}
                  currentVdot={result.vdot}
                  language={language}
                  numeralSystem={numeralSystem}
                />
                <SplitCalculator
                  zones={result.zones}
                  language={language}
                  numeralSystem={numeralSystem}
                />
              </div>
            )}

            {/* 3. PROGRESS & COACHING INSIGHTS */}
            {(viewMode === 'all' || activeTab === 'progress') && (
              <div className="space-y-6 animate-fade-in">
                <TrainingInsightsCard
                  result={result}
                  language={language}
                  numeralSystem={numeralSystem}
                />
                <PerformanceHistory
                  history={history}
                  currentVdot={result.vdot}
                  language={language}
                  numeralSystem={numeralSystem}
                  onHistoryUpdated={setHistory}
                />
              </div>
            )}

            {/* 4. RUNNING UTILITIES */}
            {(viewMode === 'all' || activeTab === 'tools') && (
              <div className="animate-fade-in">
                <RunningTools
                  language={language}
                  numeralSystem={numeralSystem}
                />
              </div>
            )}

            {/* 5. ACADEMY ARTICLES */}
            {(viewMode === 'all' || activeTab === 'academy') && (
              <div className="animate-fade-in">
                <AcademySection
                  language={language}
                  numeralSystem={numeralSystem}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Scientific Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        language={language}
        numeralSystem={numeralSystem}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation
        activeSection={activeTab}
        onNavigate={handleNavigate}
        language={language}
      />

      {/* Transparent Footer */}
      <Footer
        language={language}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />
    </div>
  );
}
