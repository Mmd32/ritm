import { HistoryRecord, Language, NumeralSystem, ThemeMode } from '@/types';

const STORAGE_KEYS = {
  HISTORY: 'ritm_vdot_history_v1',
  LAST_RESULT: 'ritm_vdot_last_result_v1',
  PREFERENCES: 'ritm_user_preferences_v1',
};

export interface UserPreferences {
  language: Language;
  numeralSystem: NumeralSystem;
  theme: ThemeMode;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'fa',
  numeralSystem: 'fa',
  theme: 'dark',
};

export function loadUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadUserPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save preferences:', err);
  }
}

export function loadHistory(): HistoryRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const list: HistoryRecord[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to load history:', err);
    return [];
  }
}

export function saveRecordToHistory(record: Omit<HistoryRecord, 'id'>): HistoryRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = loadHistory();
    const newRecord: HistoryRecord = {
      ...record,
      id: `ritm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    // Determine if it is a personal best VDOT
    const maxVdot = history.reduce((max, r) => Math.max(max, r.vdot), 0);
    newRecord.isPersonalBest = newRecord.vdot >= maxVdot;

    const updated = [newRecord, ...history];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save record:', err);
    return [];
  }
}

export function deleteRecordFromHistory(id: string): HistoryRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = loadHistory();
    const updated = history.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete record:', err);
    return [];
  }
}

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

export function exportHistoryAsJSON(): void {
  if (typeof window === 'undefined') return;
  try {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'RITM | ریتم',
      records: loadHistory(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ritm-running-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export history:', err);
  }
}

export function importHistoryFromJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const records = parsed.records || parsed;
    if (!Array.isArray(records)) {
      return { success: false, count: 0, error: 'قالب فایل واردشده نامعتبر است.' };
    }

    const current = loadHistory();
    const existingIds = new Set(current.map((r) => r.id));
    const toAdd = records.filter((r: HistoryRecord) => r && r.vdot && !existingIds.has(r.id));

    const merged = [...toAdd, ...current];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(merged));
    return { success: true, count: toAdd.length };
  } catch (err) {
    return { success: false, count: 0, error: 'خطا در خواندن فایل JSON.' };
  }
}

