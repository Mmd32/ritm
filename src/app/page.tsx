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

  // Active Nav Section
  const [activeSection, setActiveSection] = useState<string>('calculator');

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
    }, 100);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    let targetEl: HTMLElement | null = null;

    if (sectionId === 'calculator') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (sectionId === 'zones') {
      targetEl = document.getElementById('training-zones-section');
    } else if (sectionId === 'predictions') {
      targetEl = document.getElementById('race-predictions-section');
    } else if (sectionId === 'splits') {
      targetEl = document.getElementById('split-calculator-section');
    } else if (sectionId === 'history') {
      targetEl = document.getElementById('performance-history-section');
    } else if (sectionId === 'tools') {
      targetEl = document.getElementById('running-tools-section');
    } else if (sectionId === 'academy') {
      targetEl = document.getElementById('academy-section');
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        {/* Hero Section with Instant VDOT Calculator */}
        <HeroCalculator
          language={language}
          numeralSystem={numeralSystem}
          onResultCalculated={handleResultCalculated}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
        />

        {/* Primary VDOT Dashboard Result Card */}
        <VDOTResultCard
          result={result}
          language={language}
          numeralSystem={numeralSystem}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
          onRecordSaved={() => setHistory(loadHistory())}
        />

        {/* Interactive Pace Spectrum Map */}
        <PaceSpectrum
          zones={result.zones}
          selectedZoneCode={selectedZoneCode}
          onSelectZone={(code) => {
            setSelectedZoneCode(code);
            const cardEl = document.getElementById(`zone-card-${code}`);
            if (cardEl) {
              cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          language={language}
          numeralSystem={numeralSystem}
        />

        {/* 5 Dedicated Physiological Training Intensity Cards */}
        <TrainingZonesGrid
          zones={result.zones}
          selectedZoneCode={selectedZoneCode}
          language={language}
          numeralSystem={numeralSystem}
        />

        {/* Personalized Deterministic Coaching Insights */}
        <TrainingInsightsCard
          result={result}
          language={language}
          numeralSystem={numeralSystem}
        />

        {/* Race Time Predictor Table & Explorer */}
        <RacePredictor
          predictions={result.predictions}
          currentVdot={result.vdot}
          language={language}
          numeralSystem={numeralSystem}
        />

        {/* Track & Repetition Split Calculator */}
        <SplitCalculator
          zones={result.zones}
          language={language}
          numeralSystem={numeralSystem}
        />

        {/* Personal Performance History & Interactive SVG Progression Chart */}
        <PerformanceHistory
          history={history}
          currentVdot={result.vdot}
          language={language}
          numeralSystem={numeralSystem}
          onHistoryUpdated={setHistory}
        />

        {/* Practical Running Utilities Toolkit (Pace, Time, Speed Converter) */}
        <RunningTools
          language={language}
          numeralSystem={numeralSystem}
        />

        {/* Educational Running Academy (10 Authentic Articles) */}
        <AcademySection
          language={language}
          numeralSystem={numeralSystem}
        />
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
        activeSection={activeSection}
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
