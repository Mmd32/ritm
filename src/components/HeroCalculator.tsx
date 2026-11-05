'use client';

import React, { useState, useMemo } from 'react';
import { CalculationInput, DistancePreset, Language, NumeralSystem, PerformanceType, VDOTResult } from '@/types';
import { DISTANCE_PRESETS, computeFromKnownVDOT, computeVDOTResult } from '@/lib/vdot/daniels';
import { formatDigits, normalizeDigits, parseTimeString } from '@/lib/vdot/formatters';
import { TRANSLATIONS } from '@/lib/translations';
import { Timer, Gauge, HelpCircle, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

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
  const isRtl = language === 'fa';

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

  // Time input style toggle: 'detailed' vs 'quick'
  const [timeInputMode, setTimeInputMode] = useState<'detailed' | 'quick'>('detailed');
  const [quickTimeStr, setQuickTimeStr] = useState<string>('25:00');

  // Performance classification
  const [performanceType, setPerformanceType] = useState<PerformanceType>('official_race');

  // Known VDOT direct input
  const [knownVdot, setKnownVdot] = useState<string>('38.3');

  // Error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active distance in meters
  const currentDistanceMeters = useMemo(() => {
    if (isCustomDistance) {
      const val = parseFloat(normalizeDigits(customDistanceValue));
      if (isNaN(val) || val <= 0) return 5000;
      return customDistanceUnit === 'km' ? val * 1000 : val;
    }
    const preset = DISTANCE_PRESETS.find((p) => p.id === selectedPresetId);
    return preset ? preset.meters : 5000;
  }, [isCustomDistance, customDistanceValue, customDistanceUnit, selectedPresetId]);

  // Current total seconds computed on the fly
  const currentTotalSeconds = useMemo(() => {
    if (timeInputMode === 'quick') {
      const parsed = parseTimeString(quickTimeStr);
      return parsed ?? 1500;
    }
    const h = parseInt(normalizeDigits(hours) || '0', 10);
    const m = parseInt(normalizeDigits(minutes) || '0', 10);
    const s = parseInt(normalizeDigits(seconds) || '0', 10);
    return h * 3600 + m * 60 + s;
  }, [timeInputMode, quickTimeStr, hours, minutes, seconds]);

  // Live preview telemetry
  const liveTelemetry = useMemo(() => {
    if (currentDistanceMeters <= 0 || currentTotalSeconds <= 0) return null;
    const speedKmH = (currentDistanceMeters / 1000) / (currentTotalSeconds / 3600);
    const paceSecPerKm = currentTotalSeconds / (currentDistanceMeters / 1000);
    const pMin = Math.floor(paceSecPerKm / 60);
    const pSec = Math.round(paceSecPerKm % 60);
    const paceStr = `${pMin}:${pSec < 10 ? '0' : ''}${pSec}`;
    return {
      speedKmH: speedKmH.toFixed(1),
      paceStr,
    };
  }, [currentDistanceMeters, currentTotalSeconds]);

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
        const res = computeFromKnownVDOT(vdotNum);
        onResultCalculated(res);
        return;
      }

      let distanceMeters = currentDistanceMeters;
      let customLabelFa: string | undefined;
      let customLabelEn: string | undefined;

      if (isCustomDistance) {
        customLabelFa = `${customDistanceValue} ${customDistanceUnit === 'km' ? 'کیلومتر' : 'متر'}`;
        customLabelEn = `${customDistanceValue} ${customDistanceUnit}`;
      }

      const totalSeconds = currentTotalSeconds;
      if (totalSeconds <= 0) {
        setErrorMessage(
          language === 'fa' ? 'لطفاً زمان معتبری برای رکورد وارد کنید.' : 'Please enter a valid recorded duration.'
        );
        return;
      }

      const durationMinutes = totalSeconds / 60;
      const velocityMPerMin = distanceMeters / durationMinutes;

      if (velocityMPerMin < 40) {
        setErrorMessage(
          language === 'fa'
            ? 'سرعت محاسبه‌شده کمتر از آستانه دویدن استاندارد است (حداقل ۴۰ متر در دقیقه).'
            : 'Calculated velocity is below running thresholds.'
        );
        return;
      }

      const res = computeVDOTResult(
        distanceMeters,
        totalSeconds,
        performanceType,
        customLabelFa,
        customLabelEn
      );

      onResultCalculated(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    }
  };

  return (
    <section className="pt-4 pb-8 sm:pt-8 sm:pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Editorial Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider mb-3 border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>{language === 'fa' ? 'محاسبات علمی فیزیولوژی دویدن' : 'Daniels–Gilbert Running Engine'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 text-[var(--ink)]">
            {t.hero.titleMain}
          </h1>

          <p className="text-sm sm:text-base max-w-2xl mx-auto font-normal text-[var(--ink-muted)] leading-relaxed">
            {t.hero.titleSub}
          </p>
        </div>

        {/* Precision Cockpit Chassis */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl overflow-hidden transition-all duration-200">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[var(--border)] bg-[var(--card)]/40 p-1">
            <button
              type="button"
              onClick={() => {
                setCalculationMode('race');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                calculationMode === 'race'
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Timer className="w-4 h-4 text-[var(--accent)]" />
              <span>{t.hero.tabRace}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCalculationMode('known_vdot');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                calculationMode === 'known_vdot'
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Gauge className="w-4 h-4 text-[var(--accent)]" />
              <span>{t.hero.tabVdot}</span>
            </button>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {calculationMode === 'race' ? (
              <form onSubmit={handleCalculate} className="space-y-6">
                {/* 1. Distance Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      {t.hero.distanceLabel}
                    </label>
                    <span className="text-[11px] font-mono text-[var(--ink-faint)]">
                      {isCustomDistance ? 'Custom' : `${formatDigits(currentDistanceMeters, numeralSystem)}m`}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {DISTANCE_PRESETS.map((p) => {
                      const isSelected = !isCustomDistance && selectedPresetId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePresetSelect(p)}
                          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                            isSelected
                              ? 'bg-[var(--card)] text-[var(--ink)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]'
                              : 'bg-[var(--card)]/60 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)] hover:border-[var(--ink-muted)]'
                          }`}
                        >
                          {language === 'fa' ? p.nameFa : p.nameEn}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={handleCustomToggle}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                        isCustomDistance
                          ? 'bg-[var(--card)] text-[var(--ink)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]'
                          : 'bg-[var(--card)]/60 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {language === 'fa' ? 'سفارشی...' : 'Custom...'}
                    </button>
                  </div>

                  {/* Custom Distance Input Field */}
                  {isCustomDistance && (
                    <div className="mt-3 flex items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/40 max-w-sm">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={customDistanceValue}
                        onChange={(e) => setCustomDistanceValue(e.target.value)}
                        placeholder={language === 'fa' ? 'مثال: ۲۱.۱' : 'e.g. 21.1'}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                      />
                      <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setCustomDistanceUnit('km')}
                          className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                            customDistanceUnit === 'km'
                              ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                              : 'bg-[var(--surface)] text-[var(--ink-muted)]'
                          }`}
                        >
                          km
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomDistanceUnit('m')}
                          className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                            customDistanceUnit === 'm'
                              ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                              : 'bg-[var(--surface)] text-[var(--ink-muted)]'
                          }`}
                        >
                          m
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Chronometer Time Input */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      {t.hero.timeLabel}
                    </label>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setTimeInputMode('detailed')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          timeInputMode === 'detailed'
                            ? 'font-bold text-[var(--accent)] bg-[var(--card)]'
                            : 'text-[var(--ink-faint)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {language === 'fa' ? 'ساعت:دقیقه:ثانیه' : 'HH:MM:SS'}
                      </button>
                      <span className="text-[var(--ink-faint)]">/</span>
                      <button
                        type="button"
                        onClick={() => setTimeInputMode('quick')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          timeInputMode === 'quick'
                            ? 'font-bold text-[var(--accent)] bg-[var(--card)]'
                            : 'text-[var(--ink-faint)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {language === 'fa' ? 'ورود مستقیم' : 'Quick entry'}
                      </button>
                    </div>
                  </div>

                  {timeInputMode === 'detailed' ? (
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md">
                      {/* Hours */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-[var(--ink-faint)] mb-1 text-center">
                          {t.hero.timeHours}
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={hours}
                          onChange={(e) => setHours(e.target.value.padStart(2, '0').slice(-2))}
                          onFocus={(e) => e.target.select()}
                          className="w-full text-center py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xl sm:text-2xl font-mono font-black text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all"
                        />
                      </div>

                      {/* Minutes */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-[var(--ink-faint)] mb-1 text-center">
                          {t.hero.timeMinutes}
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value.padStart(2, '0').slice(-2))}
                          onFocus={(e) => e.target.select()}
                          className="w-full text-center py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xl sm:text-2xl font-mono font-black text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all"
                        />
                      </div>

                      {/* Seconds */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-[var(--ink-faint)] mb-1 text-center">
                          {t.hero.timeSeconds}
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={seconds}
                          onChange={(e) => setSeconds(e.target.value.padStart(2, '0').slice(-2))}
                          onFocus={(e) => e.target.select()}
                          className="w-full text-center py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xl sm:text-2xl font-mono font-black text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-md">
                      <input
                        type="text"
                        value={quickTimeStr}
                        onChange={(e) => setQuickTimeStr(e.target.value)}
                        placeholder="25:00 or 1:45:30"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-lg font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                      />
                      <span className="text-[11px] text-[var(--ink-faint)] mt-1 block">
                        {language === 'fa' ? 'مثال: ۲۵:۰۰ یا ۱:۴۵:۳۰' : 'Format: mm:ss or hh:mm:ss'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Performance Classification Type */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      {t.hero.perfTypeLabel}
                    </label>
                    <span className="text-[11px] text-[var(--ink-faint)]">
                      {performanceType === 'official_race'
                        ? (language === 'fa' ? 'اعتبار حداکثری' : 'Max accuracy')
                        : (language === 'fa' ? 'تخمینی' : 'Approximate')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-w-lg">
                    <button
                      type="button"
                      onClick={() => setPerformanceType('official_race')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                        performanceType === 'official_race'
                          ? 'bg-[var(--card)] text-[var(--ink)] border-[var(--accent)] ring-1 ring-[var(--accent)]'
                          : 'bg-[var(--card)]/40 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {t.hero.perfOfficial}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPerformanceType('time_trial')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                        performanceType === 'time_trial'
                          ? 'bg-[var(--card)] text-[var(--ink)] border-[var(--accent)] ring-1 ring-[var(--accent)]'
                          : 'bg-[var(--card)]/40 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {t.hero.perfTimeTrial}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPerformanceType('estimate')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                        performanceType === 'estimate'
                          ? 'bg-[var(--card)] text-[var(--ink)] border-[var(--accent)] ring-1 ring-[var(--accent)]'
                          : 'bg-[var(--card)]/40 text-[var(--ink-muted)] border-[var(--border)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {t.hero.perfEstimate}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Live Telemetry Preview Strip & Submit CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)]">
                  {liveTelemetry && (
                    <div className="flex items-center gap-4 text-xs font-mono text-[var(--ink-muted)]">
                      <div>
                        <span className="text-[var(--ink-faint)]">{language === 'fa' ? 'پیس: ' : 'Pace: '}</span>
                        <strong className="text-[var(--ink)]">{formatDigits(liveTelemetry.paceStr, numeralSystem)} /km</strong>
                      </div>
                      <div>
                        <span className="text-[var(--ink-faint)]">{language === 'fa' ? 'سرعت: ' : 'Speed: '}</span>
                        <strong className="text-[var(--ink)]">{formatDigits(liveTelemetry.speedKmH, numeralSystem)} km/h</strong>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 active:scale-[0.99] cursor-pointer"
                  >
                    <span>{t.hero.calculateBtn}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            ) : (
              /* Known VDOT Direct Calculation */
              <form onSubmit={handleCalculate} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-2">
                    {language === 'fa' ? 'مقدار شاخص VDOT شناخته‌شده' : 'Known VDOT Value'}
                  </label>
                  <p className="text-xs text-[var(--ink-faint)] mb-4">
                    {language === 'fa'
                      ? 'اگر قبلاً VDOT خودت رو در مسابقه یا آزمون‌های قبلی محاسبه کردی، مقدار اون رو مستقیماً وارد کن تا سرعت‌های ۵ زون تمرینی فوراً استخراج بشن.'
                      : 'Enter your existing VDOT score (15.0 - 85.0) to instantly calculate training paces.'}
                  </p>

                  <div className="flex items-center gap-3 max-w-xs">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={knownVdot}
                      onChange={(e) => setKnownVdot(e.target.value)}
                      placeholder="38.3"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-2xl font-mono font-black text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] text-center"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end border-t border-[var(--border)]">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 active:scale-[0.99] cursor-pointer"
                  >
                    <span>{language === 'fa' ? 'محاسبه شدت‌های تمرینی' : 'Calculate Training Intensities'}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Methodology Quick Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onOpenMethodology}
            className="text-xs font-medium text-[var(--ink-faint)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.vdotCard.howCalculatedBtn}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
