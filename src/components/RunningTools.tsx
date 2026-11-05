'use client';

import React, { useState } from 'react';
import { Language, NumeralSystem } from '@/types';
import { formatDigits, formatDuration, formatPace, normalizeDigits, parseTimeString } from '@/lib/vdot/formatters';
import { paceKmToPaceMile } from '@/lib/vdot/daniels';
import { TRANSLATIONS } from '@/lib/translations';
import { Calculator, Clock, Gauge, ArrowRightLeft } from 'lucide-react';

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
    <div id="running-tools-section" className="rounded-3xl border p-6 sm:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#38BDF8]/10 border border-[#38BDF8]/30">
          <Calculator className="w-5 h-5 text-[#38BDF8]" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
            {t.tools.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {t.tools.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl border mb-6 max-w-md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <button
          onClick={() => setActiveTab('pace')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pace' ? 'bg-[#38BDF8] text-[#0B0F14] shadow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          {t.tools.tabPace}
        </button>
        <button
          onClick={() => setActiveTab('time')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'time' ? 'bg-[#38BDF8] text-[#0B0F14] shadow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          {t.tools.tabTime}
        </button>
        <button
          onClick={() => setActiveTab('convert')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'convert' ? 'bg-[#38BDF8] text-[#0B0F14] shadow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
              <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">{t.tools.distanceInput}</label>
              <input
                type="text"
                value={tool1Distance}
                onChange={(e) => setTool1Distance(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-bold num-mono border focus:outline-none focus:border-[#38BDF8]"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">{t.tools.timeInput}</label>
              <input
                type="text"
                value={tool1TimeStr}
                onChange={(e) => setTool1TimeStr(e.target.value)}
                placeholder="00:50:00"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-bold num-mono border focus:outline-none focus:border-[#38BDF8]"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border text-center space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div>
              <div className="text-xs text-[#94A3B8]">{t.tools.resultPace}</div>
              <div className="text-3xl sm:text-4xl font-black text-[#38BDF8] num-mono my-1">
                {tool1PaceSec ? formatPace(tool1PaceSec, 'km', numeralSystem) : '--:--'}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#94A3B8]">{t.tools.resultSpeed}</div>
              <div className="text-xl font-bold text-[#F8FAFC] num-mono">
                {tool1SpeedKmh ? `${formatDigits(tool1SpeedKmh.toFixed(2), numeralSystem)} km/h` : '--'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Time Calculator */}
      {activeTab === 'time' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">{t.tools.distanceInput}</label>
              <input
                type="text"
                value={tool2Distance}
                onChange={(e) => setTool2Distance(e.target.value)}
                placeholder="21.1"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-bold num-mono border focus:outline-none focus:border-[#38BDF8]"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">{t.tools.paceInput}</label>
              <input
                type="text"
                value={tool2PaceStr}
                onChange={(e) => setTool2PaceStr(e.target.value)}
                placeholder="05:00"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-bold num-mono border focus:outline-none focus:border-[#38BDF8]"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="text-xs text-[#94A3B8]">{t.tools.resultFinishTime}</div>
            <div className="text-3xl sm:text-4xl font-black text-[#38BDF8] num-mono my-2">
              {tool2TimeSec ? formatDuration(tool2TimeSec, numeralSystem, true) : '--:--:--'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Speed Converter */}
      {activeTab === 'convert' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => { setTool3InputType('pace_km'); setTool3Val('5:00'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                tool3InputType === 'pace_km' ? 'bg-[#38BDF8] text-[#0B0F14]' : 'text-[#94A3B8]'
              }`}
              style={{ borderColor: 'var(--border)' }}
            >
              min/km
            </button>
            <button
              onClick={() => { setTool3InputType('kmh'); setTool3Val('12'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                tool3InputType === 'kmh' ? 'bg-[#38BDF8] text-[#0B0F14]' : 'text-[#94A3B8]'
              }`}
              style={{ borderColor: 'var(--border)' }}
            >
              km/h
            </button>
            <button
              onClick={() => { setTool3InputType('mph'); setTool3Val('7.5'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                tool3InputType === 'mph' ? 'bg-[#38BDF8] text-[#0B0F14]' : 'text-[#94A3B8]'
              }`}
              style={{ borderColor: 'var(--border)' }}
            >
              mph
            </button>
          </div>

          <div className="max-w-xs">
            <input
              type="text"
              value={tool3Val}
              onChange={(e) => setTool3Val(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-base font-bold num-mono border focus:outline-none focus:border-[#38BDF8]"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-[11px] text-[#94A3B8]">{t.tools.convertedPaceKm}</div>
              <div className="text-base sm:text-lg font-bold text-[#F8FAFC] num-mono mt-1">
                {formatPace(convPaceKm, 'km', numeralSystem)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-[11px] text-[#94A3B8]">{t.tools.convertedPaceMile}</div>
              <div className="text-base sm:text-lg font-bold text-[#F8FAFC] num-mono mt-1">
                {formatPace(convPaceMile, 'mi', numeralSystem)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-[11px] text-[#94A3B8]">{t.tools.convertedSpeedKmh}</div>
              <div className="text-base sm:text-lg font-bold text-[#38BDF8] num-mono mt-1">
                {formatDigits(convSpeedKmh.toFixed(2), numeralSystem)} km/h
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

