import { NumeralSystem, PerformanceType } from '@/types';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Convert any string or number to Persian digits if numeralSystem is 'fa'
 */
export function formatDigits(val: string | number, numeralSystem: NumeralSystem = 'fa'): string {
  const str = String(val);
  if (numeralSystem !== 'fa') {
    return str;
  }
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

/**
 * Normalize any input string containing Persian or Arabic digits to standard ASCII English digits.
 */
export function normalizeDigits(input: string): string {
  if (!input) return '';
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

/**
 * Format seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(
  totalSeconds: number,
  numeralSystem: NumeralSystem = 'fa',
  alwaysShowHours = false
): string {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds < 0) {
    return formatDigits('00:00', numeralSystem);
  }

  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (hours > 0 || alwaysShowHours) {
    const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return formatDigits(formatted, numeralSystem);
  }

  const formatted = `${pad(minutes)}:${pad(seconds)}`;
  return formatDigits(formatted, numeralSystem);
}

/**
 * Format pace in seconds/km to MM:SS /km (or /mi)
 */
export function formatPace(
  paceSeconds: number,
  unit: 'km' | 'mi' = 'km',
  numeralSystem: NumeralSystem = 'fa'
): string {
  if (!paceSeconds || isNaN(paceSeconds) || paceSeconds <= 0) {
    return formatDigits('--:--', numeralSystem);
  }

  const rounded = Math.round(paceSeconds);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  const unitLabel = unit === 'km' ? (numeralSystem === 'fa' ? 'دقیقه/کیلومتر' : 'min/km') : (numeralSystem === 'fa' ? 'دقیقه/مایل' : 'min/mi');
  const paceStr = `${minutes}:${pad(seconds)}`;
  return `${formatDigits(paceStr, numeralSystem)} ${unitLabel}`;
}

/**
 * Format pace range (e.g., "5:20 - 5:45")
 */
export function formatPaceRange(
  paceMinSec: number,
  paceMaxSec: number,
  unit: 'km' | 'mi' = 'km',
  numeralSystem: NumeralSystem = 'fa'
): string {
  // paceMinSec is faster, paceMaxSec is slower
  const fast = formatDuration(paceMinSec, numeralSystem);
  const slow = formatDuration(paceMaxSec, numeralSystem);
  const unitLabel = unit === 'km' ? (numeralSystem === 'fa' ? 'دقیقه/کیلومتر' : 'min/km') : (numeralSystem === 'fa' ? 'دقیقه/مایل' : 'min/mi');

  return `${fast} – ${slow} ${unitLabel}`;
}

/**
 * Parse flexible time string input (e.g. "25:00", "00:25:00", "1:45:30", "25.5") into total seconds.
 */
export function parseTimeString(input: string): number | null {
  if (!input) return null;
  const clean = normalizeDigits(input.trim());

  // Format: HH:MM:SS
  const parts = clean.split(':').map((p) => p.trim());
  if (parts.length === 3) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const s = parseFloat(parts[2]);
    if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
    return h * 3600 + m * 60 + s;
  }

  // Format: MM:SS
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseFloat(parts[1]);
    if (isNaN(m) || isNaN(s)) return null;
    return m * 60 + s;
  }

  // Single number treated as minutes if under 240, or seconds if large
  if (parts.length === 1) {
    const num = parseFloat(parts[0]);
    if (isNaN(num) || num <= 0) return null;
    return num * 60; // default to minutes
  }

  return null;
}

/**
 * Evaluate calculation confidence level based on input type and distance.
 */
export function getConfidenceBadge(
  performanceType: PerformanceType,
  distanceMeters: number
): {
  levelFa: string;
  levelEn: string;
  color: string;
  descriptionFa: string;
  descriptionEn: string;
} {
  if (performanceType === 'official_race') {
    return {
      levelFa: 'دقت بالا (رسمی)',
      levelEn: 'High Confidence (Official)',
      color: '#C8FF4D',
      descriptionFa: 'عملکرد در شرایط مسابقه بیشترین انطباق را با توان واقعی حداکثر تلاش دارد.',
      descriptionEn: 'Race conditions deliver the highest fidelity reflection of true maximal aerobic capacity.',
    };
  }

  if (performanceType === 'time_trial') {
    return {
      levelFa: 'دقت خوب (آزمون انفرادی)',
      levelEn: 'Good Confidence (Time Trial)',
      color: '#38BDF8',
      descriptionFa: 'آزمون زمان‌گیری انفرادی به دلیل نبود رقابت جمعی، ممکن است ۲ الی ۳ درصد از پتانسیل حداکثری کمتر باشد.',
      descriptionEn: 'Solo time trials typically yield 2-3% lower pacing than head-to-head race events.',
    };
  }

  return {
    levelFa: 'تخمینی (احتیاط در شدت‌ها)',
    levelEn: 'Estimate (Use with Caution)',
    color: '#FB923C',
    descriptionFa: 'رکورد تخمینی دقت پایینی دارد؛ پیشنهاد می‌شود برای ایمنی در هفته‌های نخست از مرزهای کندتر محدوده تمرینی استفاده کنید.',
    descriptionEn: 'Estimated efforts lack strict timing accuracy; start with the slower end of training ranges.',
  };
}

