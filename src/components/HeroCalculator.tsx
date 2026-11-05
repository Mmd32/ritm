'use client';

import React, { useState } from 'react';
import { CalculationInput, DistancePreset, Language, NumeralSystem, PerformanceType, VDOTResult } from '@/types';
import { DISTANCE_PRESETS, computeFromKnownVDOT, computeVDOTResult } from '@/lib/vdot/daniels';
import { formatDigits, normalizeDigits, parseTimeString } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { Activity, Gauge, Sparkles, AlertCircle, Timer, ShieldCheck } from 'lucide-react';

interface HeroCalculatorProps {
  language: Language;
  numeralSystem: NumeralSystem;
  onResultCalculated: (result: VDOTResult) => void;
  onOpenMethodology: () => void;
}

export const HeroCalculator: React.FC<HeroCalculatorProps> = ({
  language,
  numeralSystem,
  onResultCalculated,
  onOpenMethodology,
}) => {
  const t = TRANSLATIONS[language];

  // Mode: 'race' or 'known_vdot'
  const [calculationMode, setCalculationMode] = useState<'race' | 'known_vdot'>('race');

  // Distance selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('5km');
  const [isCustomDistance, setIsCustomDistance] = useState<boolean>(false);
  const [customDistanceValue, setCustomDistanceValue] = useState<string>('5');
  const [customDistanceUnit, setCustomDistanceUnit] = useState<'km' | 'm'>('km');

  // Time inputs: separate fields
  const [hours, setHours] = useState<string>('00');
  const [minutes, setMinutes] = useState<string>('25');
  const [seconds, setSeconds] = useState<string>('00');

  // Or quick string time entry
  const [quickTimeStr, setQuickTimeStr] = useState<string>('');

  // Performance classification
  const [performanceType, setPerformanceType] = useState<PerformanceType>('official_race');

  // Known VDOT direct input
  const [knownVdot, setKnownVdot] = useState<string>('45.0');

  // Error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Preset Selection
  const handlePresetSelect = (preset: DistancePreset) => {
    setSelectedPresetId(preset.id);
    setIsCustomDistance(false);
    setErrorMessage(null);
  };

  const handleCustomToggle = () => {
    setIsCustomDistance(true);
    setSelectedPresetId('custom');
    setErrorMessage(null);
  };

  // Execute Calculation
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    try {
      if (calculationMode === 'known_vdot') {
        const vdotNum = parseFloat(normalizeDigits(knownVdot));
        if (isNaN(vdotNum) || vdotNum < 15 || vdotNum > 85) {
          setErrorMessage(
            language === 'fa'
              ? 'لطفاً عددی معتبر بین ۱۵ تا ۸۵ برای VDOT وارد کنید.'
              : 'Please enter a valid VDOT value between 15 and 85.'
          );
          return;
        }
        const result = computeFromKnownVDOT(vdotNum);
        onResultCalculated(result);
        return;
      }

      // Distance in meters
      let distanceMeters = 0;
      let customLabelFa: string | undefined;
      let customLabelEn: string | undefined;

      if (isCustomDistance) {
        const distNum = parseFloat(normalizeDigits(customDistanceValue));
        if (isNaN(distNum) || distNum <= 0) {
          setErrorMessage(
            language === 'fa' ? 'لطفاً مقدار مسافت را به درستی وارد کنید.' : 'Please enter a valid distance.'
          );
          return;
        }
        distanceMeters = customDistanceUnit === 'km' ? distNum * 1000 : distNum;
        customLabelFa = `${customDistanceValue} ${customDistanceUnit === 'km' ? 'کیلومتر' : 'متر'}`;
        customLabelEn = `${customDistanceValue} ${customDistanceUnit}`;
      } else {
        const preset = DISTANCE_PRESETS.find((p) => p.id === selectedPresetId);
        if (!preset) return;
        distanceMeters = preset.meters;
      }

      // Time calculation
      let totalSeconds: number | null = null;
      if (quickTimeStr.trim()) {
        totalSeconds = parseTimeString(quickTimeStr);
      } else {
        const h = parseInt(normalizeDigits(hours) || '0', 10);
        const m = parseInt(normalizeDigits(minutes) || '0', 10);
        const s = parseInt(normalizeDigits(seconds) || '0', 10);
        if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
          totalSeconds = h * 3600 + m * 60 + s;
        }
      }

      if (!totalSeconds || totalSeconds < 30 || totalSeconds > 86400) {
        setErrorMessage(
          language === 'fa'
            ? 'لطفاً زمان را به درستی وارد کنید (حداقل ۳۰ ثانیه).'
            : 'Please enter a valid elapsed time (minimum 30 seconds).'
        );
        return;
      }

      // Speed sanity check
      const velocityMPerMin = distanceMeters / (totalSeconds / 60);
      if (velocityMPerMin > 500) {
        // More than world record 100m speed sustained!
        setErrorMessage(
          language === 'fa'
            ? 'سرعت محاسبه‌شده فراتر از حدود فیزیولوژی انسانی است. لطفاً مسافت و زمان را بررسی فرمایید.'
            : 'Velocity exceeds human physiological limits. Please verify distance and time.'
        );
        return;
      }

      if (velocityMPerMin < 40) {
        setErrorMessage(
          language === 'fa'
            ? 'سرعت محاسبه‌شده کمتر از حداقل آستانه پیاده‌روی سریع است.'
            : 'Velocity is below standard running calculation thresholds.'
        );
        return;
      }

      const result = computeVDOTResult(
        distanceMeters,
        totalSeconds,
        performanceType,
        customLabelFa,
        customLabelEn
      );

      onResultCalculated(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    }
  };

  return (
    <section className="relative pt-6 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background athletic accent ambient light */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8FF4D 0%, rgba(56, 189, 248, 0.4) 60%, transparent 80%)' }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
               style={{ backgroundColor: 'rgba(200, 255, 77, 0.08)', borderColor: 'rgba(200, 255, 77, 0.25)', color: '#C8FF4D' }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-[#F8FAFC]">
            {t.hero.titleMain}
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto font-normal text-[#94A3B8] leading-relaxed">
            {t.hero.titleSub}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div
          className="rounded-2xl border p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl mb-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={() => setCalculationMode('race')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                calculationMode === 'race'
                  ? 'bg-[#C8FF4D] text-[#0B0F14] shadow'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>{t.hero.tabRace}</span>
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('known_vdot')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                calculationMode === 'known_vdot'
                  ? 'bg-[#C8FF4D] text-[#0B0F14] shadow'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>{t.hero.tabVdot}</span>
            </button>
          </div>

          {calculationMode === 'race' ? (
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Distance Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
                  {t.hero.distanceLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {DISTANCE_PRESETS.map((p) => {
                    const isSelected = !isCustomDistance && selectedPresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePresetSelect(p)}
                        className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#C8FF4D] text-[#0B0F14] border-[#C8FF4D] font-extrabold shadow-sm'
                            : 'border-[var(--border)] text-[#F8FAFC] hover:border-white/20'
                        }`}
                        style={{ backgroundColor: isSelected ? '#C8FF4D' : 'var(--card)' }}
                      >
                        {language === 'fa' ? p.nameFa : p.nameEn}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleCustomToggle}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                      isCustomDistance
                        ? 'bg-[#C8FF4D] text-[#0B0F14] border-[#C8FF4D] font-extrabold shadow-sm'
                        : 'border-[var(--border)] text-[#F8FAFC] hover:border-white/20'
                    }`}
                    style={{ backgroundColor: isCustomDistance ? '#C8FF4D' : 'var(--card)' }}
                  >
                    {t.hero.customDistance}
                  </button>
                </div>

                {/* Custom Distance Input Field */}
                {isCustomDistance && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <input
                      type="text"
                      value={customDistanceValue}
                      onChange={(e) => setCustomDistanceValue(e.target.value)}
                      placeholder="5"
                      className="w-24 px-3 py-1.5 rounded-lg text-sm font-bold num-mono text-center border focus:outline-none focus:ring-1 focus:ring-[#C8FF4D]"
                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCustomDistanceUnit('km')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          customDistanceUnit === 'km'
                            ? 'bg-[#C8FF4D] text-[#0B0F14]'
                            : 'text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {t.hero.distanceUnitKm}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomDistanceUnit('m')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          customDistanceUnit === 'm'
                            ? 'bg-[#C8FF4D] text-[#0B0F14]'
                            : 'text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {t.hero.distanceUnitM}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Time Inputs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
                  {t.hero.timeLabel}
                </label>

                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {/* Hours */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#94A3B8] mb-1">{t.hero.timeHours}</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="px-3 py-2.5 rounded-xl text-lg font-bold text-center num-mono border focus:outline-none focus:border-[#C8FF4D]"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                    />
                  </div>

                  {/* Minutes */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#94A3B8] mb-1">{t.hero.timeMinutes}</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      className="px-3 py-2.5 rounded-xl text-lg font-bold text-center num-mono border focus:outline-none focus:border-[#C8FF4D]"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                    />
                  </div>

                  {/* Seconds */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#94A3B8] mb-1">{t.hero.timeSeconds}</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      className="px-3 py-2.5 rounded-xl text-lg font-bold text-center num-mono border focus:outline-none focus:border-[#C8FF4D]"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                {/* Quick Time Entry Alternative */}
                <div className="mt-2.5 max-w-md">
                  <input
                    type="text"
                    value={quickTimeStr}
                    onChange={(e) => setQuickTimeStr(e.target.value)}
                    placeholder={t.hero.quickTimePlaceholder}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:border-[#C8FF4D]"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              {/* Performance Classification */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
                  {t.hero.perfTypeLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPerformanceType('official_race')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      language === 'fa' ? 'text-right' : 'text-left'
                    } ${
                      performanceType === 'official_race'
                        ? 'border-[#C8FF4D] bg-[rgba(200,255,77,0.06)]'
                        : 'border-[var(--border)] hover:border-white/20'
                    }`}
                    style={{ backgroundColor: performanceType === 'official_race' ? 'rgba(200, 255, 77, 0.06)' : 'var(--card)' }}
                  >
                    <div className="font-bold text-xs sm:text-sm text-[#F8FAFC]">{t.hero.perfOfficial}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-1 leading-normal">{t.hero.perfOfficialDesc}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPerformanceType('time_trial')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      language === 'fa' ? 'text-right' : 'text-left'
                    } ${
                      performanceType === 'time_trial'
                        ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.06)]'
                        : 'border-[var(--border)] hover:border-white/20'
                    }`}
                    style={{ backgroundColor: performanceType === 'time_trial' ? 'rgba(56, 189, 248, 0.06)' : 'var(--card)' }}
                  >
                    <div className="font-bold text-xs sm:text-sm text-[#F8FAFC]">{t.hero.perfTimeTrial}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-1 leading-normal">{t.hero.perfTimeTrialDesc}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPerformanceType('estimate')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      language === 'fa' ? 'text-right' : 'text-left'
                    } ${
                      performanceType === 'estimate'
                        ? 'border-[#FB923C] bg-[rgba(251,146,60,0.06)]'
                        : 'border-[var(--border)] hover:border-white/20'
                    }`}
                    style={{ backgroundColor: performanceType === 'estimate' ? 'rgba(251, 146, 60, 0.06)' : 'var(--card)' }}
                  >
                    <div className="font-bold text-xs sm:text-sm text-[#F8FAFC]">{t.hero.perfEstimate}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-1 leading-normal">{t.hero.perfEstimateDesc}</div>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-black text-base sm:text-lg tracking-wide transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 text-[#0B0F14] bg-[#C8FF4D] hover:bg-[#bbf340] accent-glow"
                >
                  <Activity className="w-5 h-5" />
                  <span>{t.hero.calculateBtn}</span>
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8] text-center mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF4D]" />
                  <span>{t.hero.instantNotice}</span>
                </div>
              </div>
            </form>
          ) : (
            /* Mode 2: Direct Known VDOT input */
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
                  {t.hero.knownVdotLabel}
                </label>
                <div className="max-w-xs">
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="85"
                    value={knownVdot}
                    onChange={(e) => setKnownVdot(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-2xl font-black text-center num-mono border focus:outline-none focus:border-[#C8FF4D]"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                  />
                  <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1.5 px-1 font-mono">
                    <span>{formatDigits('15.0', numeralSystem)}</span>
                    <span className="text-[#C8FF4D] font-bold">VDOT</span>
                    <span>{formatDigits('85.0', numeralSystem)}</span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-black text-base sm:text-lg tracking-wide transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 text-[#0B0F14] bg-[#C8FF4D] hover:bg-[#bbf340] accent-glow"
              >
                <Activity className="w-5 h-5" />
                <span>{t.hero.calculateBtn}</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8] text-center mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF4D]" />
                <span>{t.hero.instantNotice}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
