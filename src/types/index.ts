export type Language = 'fa' | 'en';
export type NumeralSystem = 'fa' | 'en';
export type ThemeMode = 'dark' | 'light';

export type PerformanceType = 'official_race' | 'time_trial' | 'estimate';

export interface DistancePreset {
  id: string;
  nameFa: string;
  nameEn: string;
  meters: number;
  category: 'track' | 'road';
}

export interface CalculationInput {
  distanceMeters: number;
  timeSeconds: number;
  performanceType: PerformanceType;
  customDistanceName?: string;
}

export interface TrainingZone {
  code: 'E' | 'M' | 'T' | 'I' | 'R';
  nameFa: string;
  nameEn: string;
  taglineFa: string;
  taglineEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  vdotPercentageMin: number;
  vdotPercentageMax: number;
  paceSecPerKmMin: number;
  paceSecPerKmMax: number;
  paceSecPerMileMin: number;
  paceSecPerMileMax: number;
  speedKmhMin: number;
  speedKmhMax: number;
  rpeFa: string;
  rpeEn: string;
  conversationTestFa: string;
  conversationTestEn: string;
  purposeFa: string;
  purposeEn: string;
  sampleWorkoutsFa: string[];
  sampleWorkoutsEn: string[];
  recommendedRepetitionsFa?: string;
  recommendedRepetitionsEn?: string;
}

export interface RacePrediction {
  distanceId: string;
  nameFa: string;
  nameEn: string;
  distanceMeters: number;
  predictedSeconds: number;
  paceSecPerKm: number;
  paceSecPerMile: number;
  speedKmh: number;
}

export interface VDOTResult {
  vdot: number;
  inputDistanceMeters: number;
  inputDistanceLabelFa: string;
  inputDistanceLabelEn: string;
  inputTimeSeconds: number;
  avgPaceSecPerKm: number;
  avgPaceSecPerMile: number;
  avgSpeedKmh: number;
  performanceType: PerformanceType;
  calculatedAt: string;
  zones: TrainingZone[];
  predictions: RacePrediction[];
  vo2Cost: number;
  fractionOfVO2Max: number;
}

export interface HistoryRecord {
  id: string;
  date: string;
  distanceMeters: number;
  distanceName: string;
  timeSeconds: number;
  vdot: number;
  performanceType: PerformanceType;
  notes?: string;
  isPersonalBest?: boolean;
}

export interface AcademyArticle {
  id: string;
  titleFa: string;
  titleEn: string;
  summaryFa: string;
  summaryEn: string;
  readingTimeMinutes: number;
  category: 'fundamentals' | 'zones' | 'testing' | 'coaching';
  contentFa: string;
  contentEn: string;
  keyTakeawaysFa: string[];
  keyTakeawaysEn: string[];
}
