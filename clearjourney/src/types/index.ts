export type ScanAngle = 'front' | 'left' | 'right' | 'FRONT' | 'LEFT' | 'RIGHT';

export interface PhotoIntakeData {
  id: string;
  timestamp: string;
  dayNumber: number;
  angles: {
    front?: string; // base64 or object URL
    left?: string;
    right?: string;
  };
  quality: {
    blurScore: number; // 0-100 (higher is sharper)
    luminance: number; // 0-255
    passed: boolean;
  };
}

export interface HeatmapPoint {
  id: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  type: 'comedone' | 'inflammatory' | 'pore_texture';
  severity: 'mild' | 'moderate' | 'dense';
  label: string;
}

export interface QuantitativeMetrics {
  sebumControlPercentage: number; // 0-100
  inflammatoryLesionCount: number; // e.g. 0-40
  comedoneCount: number; // e.g. 0-60
  barrierHydrationScore: number; // 0-100
  poreRefinementScore: number; // 0-100
}

export interface ScanRecord {
  id: string;
  dayNumber: number;
  dateString: string;
  timestamp: number;
  isSampleData?: boolean;
  photoUrl?: string;
  angles: {
    front?: string;
    left?: string;
    right?: string;
  };
  metrics: QuantitativeMetrics;
  heatmapPoints: HeatmapPoint[];
  classification: {
    isPurgeLikely: boolean;
    title: string;
    explanation: string;
    stage: 'acclimation' | 'peak_purge' | 'turning_point' | 'clinical_clear';
  };
  adaptiveFrequency: {
    recommendedWeeklyPMFrequency: number;
    currentStage: string;
    actionableAdvisory: string;
    cautionNotes: string[];
  };
  smellRating?: number; // 1 (medicinal/unusual) to 5 (clean/efficacy-coded)
  userNotes?: string;
}

export interface RoutineStatus {
  date: string;
  amCleanseSpfDone: boolean;
  pmSalicylic60sDone: boolean;
  secondsLathered: number;
  notes?: string;
}

export interface HabitStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  totalLogsCount: number;
  milestonesUnlocked: string[];
}

export interface Milestone {
  id: string;
  dayThreshold: number;
  title: string;
  badgeName: string;
  icon: string;
  description: string;
  clinicalFact: string;
  unlocked: boolean;
}

export interface SensoryFeedback {
  date: string;
  scentAcceptanceScore: number; // 1 to 5
  coolingSensationScore: number; // 1 to 5
  textureFeel: 'clean' | 'tight' | 'hydrated' | 'slight_tingle';
  perceivedMedicinalNote: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatarUrl?: string;
  age: number;
  skinType: 'Oily & Congested' | 'Combination & Acne-Prone' | 'Sensitive Acneic' | 'Normal/Dry Hormonal';
  startingConcern: string;
  phaseCategory: 'purge_phase' | 'turning_point' | 'clear_repurchasing';
  phaseTitle: string;
  weeksToClear: number;
  rating: number;
  reviewText: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
  beforeAfterSummary: string;
  scentComment: string;
}

export interface IngredientClashItem {
  name: string;
  category: string;
  safetyTier: 'safe' | 'caution' | 'danger';
  advice: string;
  bufferInstructions: string;
}

export interface AppGlobalState {
  currentDay: number;
  daysUsingProduct: number;
  streak: HabitStreak;
  activeScanIndex: number;
  scans: ScanRecord[];
  routineHistory: Record<string, RoutineStatus>;
  sensoryLogs: SensoryFeedback[];
  isDemoLoaded: boolean;
  currentTab: 'dashboard' | 'analysis' | 'science' | 'routine' | 'reviews';
  userProfile: {
    name: string;
    skinType: string;
    startDate: string;
    primaryConcern: string;
  };
}

export interface LifestyleDiaryEntry {
  date: string;
  workout_level: 'NONE' | 'MODERATE' | 'INTENSE (HEAVY PERSPIRATION)';
  sun_exposure: 'MINIMAL (<15 MIN)' | 'MODERATE (15-60 MIN)' | 'PROLONGED (>60 MIN)';
  spf_compliance: 'NO SPF' | 'APPLIED ONCE' | 'REAPPLIED (SPF 50+)';
  water_intake: '<1.0 L' | '1.0 - 2.0 L' | '>2.0 L';
  sleep_duration: '<6 HOURS' | '6 - 8 HOURS' | '>8 HOURS';
  barrier_symptoms: string[];
  notes?: string;
  timestamp?: number;
}

export interface LifestyleDiaryContext {
  avgWorkoutIntensity: string;
  avgSunExposure: string;
  spfCompliance: string;
  barrierSensations: string[];
  avgSleep: string;
  waterIntake?: string;
}

export interface ScanUploadState {
  front: string | null;
  left: string | null;
  right: string | null;
}


