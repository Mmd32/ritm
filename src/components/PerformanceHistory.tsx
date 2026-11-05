'use client';

import React, { useRef, useState } from 'react';
import { HistoryRecord, Language, NumeralSystem } from '@/types';
import { formatDigits, formatDuration, formatPace } from '@/lib/vdot/formatters';
import { clearAllHistory, deleteRecordFromHistory, exportHistoryAsJSON, importHistoryFromJSON } from '@/lib/vdot/storage';
import { TRANSLATIONS } from '@/lib/translations';
import { Award, Download, Upload, Trash2, TrendingUp, TrendingDown, Minus, Calendar, Plus, LineChart } from 'lucide-react';

interface PerformanceHistoryProps {
  history: HistoryRecord[];
  currentVdot: number;
  language: Language;
  numeralSystem: NumeralSystem;
  onHistoryUpdated: (newHistory: HistoryRecord[]) => void;
}

export const PerformanceHistory: React.FC<PerformanceHistoryProps> = ({
  history,
  currentVdot,
  language,
  numeralSystem,
  onHistoryUpdated,
}) => {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Highest VDOT (Personal Best)
  const pbVdot = history.reduce((max, r) => Math.max(max, r.vdot), 0);
  const latestRecord = history[0];
  const previousRecord = history[1];

  let diffText = '';
  let diffType: 'better' | 'worse' | 'same' = 'same';
  let diffVal = 0;

  if (history.length >= 2 && latestRecord && previousRecord) {
    diffVal = Number((latestRecord.vdot - previousRecord.vdot).toFixed(1));
    if (diffVal > 0) {
      diffType = 'better';
      diffText = t.history.compareImproved.replace('{diff}', formatDigits(diffVal.toString(), numeralSystem));
    } else if (diffVal < 0) {
      diffType = 'worse';
      diffText = t.history.compareDecreased.replace('{diff}', formatDigits(Math.abs(diffVal).toString(), numeralSystem));
    } else {
      diffType = 'same';
      diffText = t.history.compareEqual;
    }
  }

  const handleDelete = (id: string) => {
    const updated = deleteRecordFromHistory(id);
    onHistoryUpdated(updated);
  };

  const handleClearAll = () => {
    if (window.confirm(t.history.confirmClear)) {
      clearAllHistory();
      onHistoryUpdated([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importHistoryFromJSON(content);
        if (res.success) {
          setImportStatus(
            language === 'fa'
              ? `${formatDigits(res.count, numeralSystem)} رکورد بازیابی شد.`
              : `${res.count} records successfully imported.`
          );
          // Reload history from localStorage
          const raw = localStorage.getItem('ritm_vdot_history_v1');
          if (raw) onHistoryUpdated(JSON.parse(raw));
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus(res.error || 'Import error');
        }
      }
    };
    reader.readAsText(file);
  };

  // Prepare chronological list for SVG Chart
  const chronological = [...history].reverse();

  // SVG Chart Dimensions
  const chartWidth = 600;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 30;

  const minVdotVal = chronological.length > 0 ? Math.min(...chronological.map((r) => r.vdot)) - 2 : 30;
  const maxVdotVal = chronological.length > 0 ? Math.max(...chronological.map((r) => r.vdot)) + 2 : 55;
  const range = Math.max(1, maxVdotVal - minVdotVal);

  const getX = (idx: number, total: number) => {
    if (total <= 1) return chartWidth / 2;
    return paddingX + (idx / (total - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minVdotVal) / range) * (chartHeight - paddingY * 2);
  };

  const pointsString = chronological
    .map((r, i) => `${getX(i, chronological.length)},${getY(r.vdot)}`)
    .join(' ');

  return (
    <div id="performance-history-section" className="rounded-3xl border p-6 sm:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-5 h-5 text-[#C8FF4D]" />
            <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
              {t.history.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {t.history.subtitle}
          </p>
        </div>

        {/* Action Buttons: Export / Import / Clear */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
          >
            <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{t.history.importJsonBtn}</span>
          </button>

          <button
            onClick={exportHistoryAsJSON}
            disabled={history.length === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all disabled:opacity-40"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
          >
            <Download className="w-3.5 h-3.5 text-[#C8FF4D]" />
            <span>{t.history.exportJsonBtn}</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border text-rose-400 hover:bg-rose-500/10 transition-all flex items-center gap-1.5"
              style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.history.clearHistoryBtn}</span>
            </button>
          )}
        </div>
      </div>

      {importStatus && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          {importStatus}
        </div>
      )}

      {/* Metric Stat Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-[11px] font-bold text-[#94A3B8] mb-1">{t.history.currentVdotLabel}</div>
          <div className="text-2xl sm:text-3xl font-black text-[#C8FF4D] num-mono">
            {formatDigits(currentVdot.toFixed(1), numeralSystem)}
          </div>
        </div>

        <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-[11px] font-bold text-[#94A3B8] mb-1">{t.history.bestVdotLabel}</div>
          <div className="text-2xl sm:text-3xl font-black text-[#FBBF24] num-mono flex items-center justify-center gap-1">
            <span>{formatDigits(pbVdot > 0 ? pbVdot.toFixed(1) : currentVdot.toFixed(1), numeralSystem)}</span>
            <Award className="w-4 h-4 text-[#FBBF24]" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-[11px] font-bold text-[#94A3B8] mb-1">{t.history.totalEntriesLabel}</div>
          <div className="text-2xl sm:text-3xl font-black text-[#38BDF8] num-mono">
            {formatDigits(history.length, numeralSystem)}
          </div>
        </div>
      </div>

      {/* Comparison Analysis */}
      {diffText && (
        <div
          className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 ${
            diffType === 'better'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : diffType === 'worse'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-white/5 border-white/10 text-[#94A3B8]'
          }`}
        >
          {diffType === 'better' ? (
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : diffType === 'worse' ? (
            <TrendingDown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Minus className="w-5 h-5 text-[#94A3B8] shrink-0 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm font-semibold leading-relaxed">
            {diffText}
          </div>
        </div>
      )}

      {/* SVG Progression Chart */}
      {chronological.length > 1 && (
        <div className="mb-6 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-xs font-bold text-[#94A3B8] mb-2 flex items-center justify-between">
            <span>{language === 'fa' ? 'نمودار تغییرات VDOT' : 'VDOT Trend Trajectory'}</span>
            <span className="text-[11px] font-mono text-[#C8FF4D]">Jack Daniels Curve</span>
          </div>
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
            >
              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 4"
              />

              {/* Connected Line */}
              <polyline
                fill="none"
                stroke="#C8FF4D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />

              {/* Data points */}
              {chronological.map((r, i) => {
                const cx = getX(i, chronological.length);
                const cy = getY(r.vdot);
                return (
                  <g key={r.id} className="group">
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6"
                      fill="#0B0F14"
                      stroke="#C8FF4D"
                      strokeWidth="3"
                      className="transition-transform group-hover:scale-150"
                    />
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="Inter"
                    >
                      {formatDigits(r.vdot.toFixed(1), numeralSystem)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* History Records Table */}
      {history.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl border text-xs text-[#94A3B8]" style={{ borderColor: 'var(--border)' }}>
          {t.history.noHistoryText}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-left border-collapse" dir={language === 'fa' ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="border-b text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <th className="py-3 px-4">{t.history.colDate}</th>
                <th className="py-3 px-4">{t.history.colDistance}</th>
                <th className="py-3 px-4">{t.history.colTime}</th>
                <th className="py-3 px-4">{t.history.colPace}</th>
                <th className="py-3 px-4">{t.history.colVdot}</th>
                <th className="py-3 px-4 text-center">{t.history.deleteItem}</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs" style={{ borderColor: 'var(--border)' }}>
              {history.map((record) => {
                const paceSec = (record.timeSeconds / (record.distanceMeters / 1000));
                return (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#94A3B8]">
                      {mounted
                        ? new Date(record.date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')
                        : '2026/01/01'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#F8FAFC]">
                      {record.distanceName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#F8FAFC]">
                      {formatDuration(record.timeSeconds, numeralSystem, record.timeSeconds >= 3600)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#94A3B8]">
                      {formatPace(paceSec, 'km', numeralSystem)}
                    </td>
                    <td className="py-3 px-4 font-black num-mono text-[#C8FF4D]">
                      {formatDigits(record.vdot.toFixed(1), numeralSystem)}
                      {record.isPersonalBest && (
                        <span className="ml-1.5 mr-1.5 text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold">
                          PB
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
