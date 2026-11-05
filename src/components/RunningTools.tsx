'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem } from '@/types';
import { formatDigits, formatDuration, formatPace, normalizeDigits, parseTimeString } from '@/lib/vdot/formatters';
import { paceKmToPaceMile } from '@/lib/vdot/daniels';
import { TRANSLATIONS } from '@/lib/translations';
import { Calculator } from 'lucide-react';

interface RunningToolsProps {
  language: Language;
  numeralSystem: NumeralSystem;
}

export const RunningTools: React.FC<RunningToolsProps> = ({
  language,
  numeralSystem,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'pace' | 'time' | 'convert'>('pace');

  // Tool 1: Pace Calculator
  const [tool1Distance, setTool1Distance] = useState<string>('10');
  const [tool1TimeStr, setTool1TimeStr] = useState<string>('50:00');

  // Tool 2: Time Calculator
  const [tool2Distance, setTool2Distance] = useState<string>('21.1');
  const [tool2PaceStr, setTool2PaceStr] = useState<string>('5:00');

  // Tool 3: Speed Converter
  const [tool3InputType, setTool3InputType] = useState<'pace_km' | 'kmh' | 'mph'>('pace_km');
  const [tool3Val, setTool3Val] = useState<string>('5:00');

  // Compute Tool 1 (Pace)
  let tool1PaceSec: number | null = null;
  let tool1SpeedKmh: number | null = null;
  const dist1 = parseFloat(normalizeDigits(tool1Distance));
  const time1 = parseTimeString(tool1TimeStr);
  if (dist1 > 0 && time1 && time1 > 0) {
    tool1PaceSec = time1 / dist1;
    tool1SpeedKmh = dist1 / (time1 / 3600);
  }

  // Compute Tool 2 (Time)
  let tool2TimeSec: number | null = null;
  const dist2 = parseFloat(normalizeDigits(tool2Distance));
  const pace2Sec = parseTimeString(tool2PaceStr);
  if (dist2 > 0 && pace2Sec && pace2Sec > 0) {
    tool2TimeSec = dist2 * pace2Sec;
  }

  // Compute Tool 3 (Converter)
  let convPaceKm = 300; // 5:00
  if (tool3InputType === 'pace_km') {
    const parsed = parseTimeString(tool3Val);
    if (parsed) convPaceKm = parsed;
  } else if (tool3InputType === 'kmh') {
    const kmh = parseFloat(normalizeDigits(tool3Val));
    if (kmh > 0) convPaceKm = 3600 / kmh;
  } else {
    const mph = parseFloat(normalizeDigits(tool3Val));
    if (mph > 0) {
      const kmh = mph * 1.609344;
      convPaceKm = 3600 / kmh;
    }
  }

  const convSpeedKmh = convPaceKm > 0 ? 3600 / convPaceKm : 0;
  const convPaceMile = paceKmToPaceMile(convPaceKm);

  return (
    <div id="running-tools-section" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--card)] border border-[var(--border)]">
          <Calculator className="w-5 h-5 text-[var(--accent)]" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
            {t.tools.title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
            {t.tools.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('pace')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pace'
              ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
          }`}
        >
          {t.tools.tabPace}
        </button>
        <button
          onClick={() => setActiveTab('time')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'time'
              ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
          }`}
        >
          {t.tools.tabTime}
        </button>
        <button
          onClick={() => setActiveTab('convert')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'convert'
              ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-sm'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
          }`}
        >
          {t.tools.tabConvert}
        </button>
      </div>

      {/* Tab 1: Pace Calculator */}
      {activeTab === 'pace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                {language === 'fa' ? 'مسافت (کیلومتر):' : 'Distance (km):'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={tool1Distance}
                onChange={(e) => setTool1Distance(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-base font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                {language === 'fa' ? 'زمان کل (مثال ۵۰:۰۰):' : 'Total Time (e.g. 50:00):'}
              </label>
              <input
                type="text"
                value={tool1TimeStr}
                onChange={(e) => setTool1TimeStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-base font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] block mb-1">
              {t.tools.resultPace}
            </span>
            <div className="text-4xl font-black font-mono text-[var(--accent)] mb-2">
              {tool1PaceSec ? formatPace(tool1PaceSec, 'km', numeralSystem) : '--:--'}
            </div>
            <span className="text-xs font-mono text-[var(--ink-muted)]">
              {tool1SpeedKmh
                ? `${formatDigits(tool1SpeedKmh.toFixed(1), numeralSystem)} km/h`
                : ''}
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Time Calculator */}
      {activeTab === 'time' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                {language === 'fa' ? 'مسافت هدف (کیلومتر):' : 'Target Distance (km):'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={tool2Distance}
                onChange={(e) => setTool2Distance(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-base font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                {language === 'fa' ? 'پیس هدف به ازای هر کیلومتر (مثال ۵:۰۰):' : 'Target Pace per km (e.g. 5:00):'}
              </label>
              <input
                type="text"
                value={tool2PaceStr}
                onChange={(e) => setTool2PaceStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-base font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] block mb-1">
              {t.tools.resultFinishTime}
            </span>
            <div className="text-4xl font-black font-mono text-[var(--accent)] mb-2">
              {tool2TimeSec ? formatDuration(tool2TimeSec, numeralSystem) : '--:--:--'}
            </div>
            <span className="text-xs text-[var(--ink-muted)]">
              {language === 'fa' ? 'زمان پیش‌بینی‌شده خط پایان' : 'Estimated finish time'}
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Speed Converter */}
      {activeTab === 'convert' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 max-w-sm">
            <button
              onClick={() => {
                setTool3InputType('pace_km');
                setTool3Val('5:00');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                tool3InputType === 'pace_km'
                  ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]'
                  : 'bg-[var(--card)] text-[var(--ink-muted)] border-[var(--border)]'
              }`}
            >
              min/km
            </button>
            <button
              onClick={() => {
                setTool3InputType('kmh');
                setTool3Val('12.0');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                tool3InputType === 'kmh'
                  ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]'
                  : 'bg-[var(--card)] text-[var(--ink-muted)] border-[var(--border)]'
              }`}
            >
              km/h
            </button>
            <button
              onClick={() => {
                setTool3InputType('mph');
                setTool3Val('7.5');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                tool3InputType === 'mph'
                  ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]'
                  : 'bg-[var(--card)] text-[var(--ink-muted)] border-[var(--border)]'
              }`}
            >
              mph
            </button>
          </div>

          <div className="max-w-xs">
            <input
              type="text"
              value={tool3Val}
              onChange={(e) => setTool3Val(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xl font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center">
              <span className="text-[10px] uppercase font-bold text-[var(--ink-faint)] block mb-1">Pace / km</span>
              <strong className="text-xl font-mono font-black text-[var(--ink)]">
                {formatPace(convPaceKm, 'km', numeralSystem)}
              </strong>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center">
              <span className="text-[10px] uppercase font-bold text-[var(--ink-faint)] block mb-1">Speed (km/h)</span>
              <strong className="text-xl font-mono font-black text-[var(--accent)]">
                {formatDigits(convSpeedKmh.toFixed(1), numeralSystem)}
              </strong>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center">
              <span className="text-[10px] uppercase font-bold text-[var(--ink-faint)] block mb-1">Pace / mile</span>
              <strong className="text-xl font-mono font-black text-[var(--ink)]">
                {formatPace(convPaceMile, 'mi', numeralSystem)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
