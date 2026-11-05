'use client';

import React, { useRef, useState } from 'react';
import { HistoryRecord, Language, NumeralSystem } from '@/types';
import { formatDigits, formatDuration, formatPace } from '@/lib/vdot/formatters';
import { clearAllHistory, deleteRecordFromHistory, exportHistoryAsJSON, importHistoryFromJSON } from '@/lib/vdot/storage';
import { TRANSLATIONS } from '@/lib/translations';
import { Award, Download, Upload, Trash2, TrendingUp, TrendingDown, Minus, Calendar, LineChart } from 'lucide-react';

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
    if (confirm(t.history.confirmClear)) {
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
      const success = importHistoryFromJSON(content);
      if (success) {
        setImportStatus(language === 'fa' ? 'اطلاعات با موفقیت بازنشانی شد.' : 'History imported successfully.');
        setTimeout(() => setImportStatus(null), 3000);
        // Reload
        const updated = JSON.parse(localStorage.getItem('ritm_vdot_history') || '[]');
        onHistoryUpdated(updated);
      } else {
        alert(language === 'fa' ? 'خطا در بارگذاری فایل JSON' : 'Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Prepare chart points (chronological: oldest to newest)
  const chronological = [...history].reverse();
  const minVdotVal = Math.min(...history.map((r) => r.vdot), currentVdot) - 2;
  const maxVdotVal = Math.max(...history.map((r) => r.vdot), currentVdot) + 2;
  const range = maxVdotVal - minVdotVal || 1;

  const chartHeight = 120;
  const chartWidth = 500;
  const paddingX = 20;
  const paddingY = 15;

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
    <div id="performance-history-section" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
              {t.history.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
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
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.history.importJsonBtn}</span>
          </button>

          <button
            onClick={exportHistoryAsJSON}
            disabled={history.length === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] flex items-center gap-1.5 transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{t.history.exportJsonBtn}</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all flex items-center gap-1.5"
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

      {history.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)]/30">
          <Award className="w-10 h-10 mx-auto text-[var(--ink-faint)] mb-3 opacity-60" />
          <h4 className="text-sm font-bold text-[var(--ink)] mb-1">
            {t.history.noHistoryText}
          </h4>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Callout */}
          {diffText && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-bold ${
                diffType === 'better'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : diffType === 'worse'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-[var(--card)] border-[var(--border)] text-[var(--ink-muted)]'
              }`}
            >
              {diffType === 'better' ? (
                <TrendingUp className="w-5 h-5 shrink-0" />
              ) : diffType === 'worse' ? (
                <TrendingDown className="w-5 h-5 shrink-0" />
              ) : (
                <Minus className="w-5 h-5 shrink-0" />
              )}
              <span>{diffText}</span>
            </div>
          )}

          {/* Progression SVG Trend Chart */}
          {chronological.length >= 2 && (
            <div className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-faint)]">
                  {language === 'fa' ? 'روند تغییرات VDOT' : 'VDOT Progression'}
                </span>
                <span className="text-xs font-mono text-[var(--accent)] font-bold">
                  PB: {formatDigits(pbVdot.toFixed(1), numeralSystem)} VDOT
                </span>
              </div>

              <div className="w-full overflow-hidden">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-28 sm:h-36 overflow-visible"
                >
                  {/* Subtle Grid horizontal guide lines */}
                  <line
                    x1={paddingX}
                    y1={paddingY}
                    x2={chartWidth - paddingX}
                    y2={paddingY}
                    stroke="currentColor"
                    className="text-[var(--border)]"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={paddingX}
                    y1={chartHeight - paddingY}
                    x2={chartWidth - paddingX}
                    y2={chartHeight - paddingY}
                    stroke="currentColor"
                    className="text-[var(--border)]"
                    strokeDasharray="4 4"
                  />

                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                  />

                  {/* Points */}
                  {chronological.map((r, i) => {
                    const cx = getX(i, chronological.length);
                    const cy = getY(r.vdot);
                    const isLatest = i === chronological.length - 1;
                    return (
                      <g key={r.id || i}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isLatest ? 5 : 3.5}
                          fill="var(--accent)"
                          className="transition-all hover:r-6"
                        />
                        <text
                          x={cx}
                          y={cy - 9}
                          textAnchor="middle"
                          className="text-[10px] font-mono font-black fill-[var(--ink)]"
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
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-left border-collapse" dir={language === 'fa' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)] bg-[var(--card)]">
                  <th className="py-3 px-4">{t.history.colDate}</th>
                  <th className="py-3 px-4">{t.history.colDistance}</th>
                  <th className="py-3 px-4">{t.history.colTime}</th>
                  <th className="py-3 px-4">{t.history.colVdot}</th>
                  <th className="py-3 px-4 text-center">{t.history.deleteItem}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs sm:text-sm">
                {history.map((rec) => {
                  const dateObj = new Date(rec.date);
                  const dateStr = mounted
                    ? dateObj.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '';

                  return (
                    <tr
                      key={rec.id}
                      className="transition-colors hover:bg-[var(--card)]/60"
                    >
                      <td className="py-3 px-4 text-[var(--ink-muted)] font-mono text-xs">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4 font-bold text-[var(--ink)]">
                        {rec.distanceName}
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--ink)]">
                        {formatDuration(rec.timeSeconds, numeralSystem)}
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-sm text-[var(--accent)]">
                        {formatDigits(rec.vdot.toFixed(1), numeralSystem)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(rec.id)}
                          title={language === 'fa' ? 'حذف این رکورد' : 'Delete record'}
                          className="p-1.5 rounded-lg text-[var(--ink-faint)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
