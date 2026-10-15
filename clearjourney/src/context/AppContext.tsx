import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScanRecord, HabitStreak, Milestone, RoutineStatus, SensoryFeedback } from '../types';
import { getAllScans, saveScan } from '../services/db';
import { hydrateDemoState, DEMO_SCANS } from '../services/demoSeeder';

export const CLINICAL_MILESTONES: Milestone[] = [
  {
    id: 'milestone-day-3',
    dayThreshold: 3,
    title: 'Acclimation Pioneer',
    badgeName: 'Barrier Habituation',
    icon: 'Sparkles',
    description: 'Initial tolerance established without acute epidermal barrier compromise.',
    clinicalFact: 'Sebum liquefaction initiated in upper follicular funnel.',
    unlocked: false,
  },
  {
    id: 'milestone-day-14',
    dayThreshold: 14,
    title: 'Cellular Turnover Cadet',
    badgeName: 'Purge Survivor',
    icon: 'ShieldCheck',
    description: 'Conquered the peak purge phase where 74% of users drop off.',
    clinicalFact: 'Salicylic acid has accelerated desquamation rate by 2.4x.',
    unlocked: false,
  },
  {
    id: 'milestone-day-21',
    dayThreshold: 21,
    title: 'Patience Pioneer',
    badgeName: 'The Turning Point',
    icon: 'Target',
    description: 'Purging drops precipitously as sub-surface comedones clear out.',
    clinicalFact: 'New acne lesion emergence slows down to sub-baseline velocity.',
    unlocked: false,
  },
  {
    id: 'milestone-day-28',
    dayThreshold: 28,
    title: 'Cell Cycle Hero',
    badgeName: 'Full Turnover Complete',
    icon: 'RefreshCw',
    description: 'Completed 1 full biological keratinocyte turnover cycle (28 days).',
    clinicalFact: 'Entire stratum corneum replaced with healthier, un-impacted cells.',
    unlocked: false,
  },
  {
    id: 'milestone-day-84',
    dayThreshold: 84,
    title: 'Clinical Barrier Champion',
    badgeName: 'Master Equilibrium',
    icon: 'Award',
    description: '3 consecutive cellular cycles achieved. Long-term microcomedone prevention.',
    clinicalFact: 'Sebaceous gland lipid excretion stabilized at 92-95% balanced control.',
    unlocked: false,
  },
];

interface AppContextType {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  scans: ScanRecord[];
  activeScanIndex: number;
  setActiveScanIndex: (idx: number) => void;
  activeScan: ScanRecord | null;
  streak: HabitStreak;
  milestones: Milestone[];
  isDemoLoaded: boolean;
  loadDemoData: () => Promise<void>;
  resetToFresh: () => void;
  routineToday: RoutineStatus;
  toggleRoutineAm: () => void;
  toggleRoutinePm: (secondsLathered?: number) => void;
  activeTab: 'dashboard' | 'analysis' | 'science' | 'routine' | 'reviews';
  setActiveTab: (tab: 'dashboard' | 'analysis' | 'science' | 'routine' | 'reviews') => void;
  addNewScan: (scan: ScanRecord) => Promise<void>;
  isLatherModalOpen: boolean;
  setIsLatherModalOpen: (open: boolean) => void;
  isScentModalOpen: boolean;
  setIsScentModalOpen: (open: boolean) => void;
  isFairChanceModalOpen: boolean;
  setIsFairChanceModalOpen: (open: boolean) => void;
  sensoryHistory: SensoryFeedback[];
  addSensoryRating: (rating: number, note?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDay, setCurrentDay] = useState<number>(() => {
    return parseInt(localStorage.getItem('clearjourney_day') || '14', 10);
  });

  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [activeScanIndex, setActiveScanIndex] = useState<number>(0);
  const [isDemoLoaded, setIsDemoLoaded] = useState<boolean>(() => {
    return localStorage.getItem('clearjourney_demo_active') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'science' | 'routine' | 'reviews'>('dashboard');

  const [streak, setStreak] = useState<HabitStreak>(() => {
    const saved = localStorage.getItem('clearjourney_streak');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      currentStreak: 14,
      longestStreak: 14,
      lastCompletedDate: new Date().toISOString().split('T')[0],
      totalLogsCount: 28,
      milestonesUnlocked: ['milestone-day-3', 'milestone-day-14'],
    };
  });

  const [routineToday, setRoutineToday] = useState<RoutineStatus>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`clearjourney_routine_${today}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      date: today,
      amCleanseSpfDone: true,
      pmSalicylic60sDone: false,
      secondsLathered: 0,
    };
  });

  const [sensoryHistory, setSensoryHistory] = useState<SensoryFeedback[]>(() => {
    const saved = localStorage.getItem('clearjourney_sensory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { date: 'Day 0', scentAcceptanceScore: 2, coolingSensationScore: 4, textureFeel: 'clean', perceivedMedicinalNote: true },
      { date: 'Day 7', scentAcceptanceScore: 3, coolingSensationScore: 4, textureFeel: 'slight_tingle', perceivedMedicinalNote: true },
      { date: 'Day 14', scentAcceptanceScore: 4, coolingSensationScore: 5, textureFeel: 'clean', perceivedMedicinalNote: true },
    ];
  });

  const [isLatherModalOpen, setIsLatherModalOpen] = useState(false);
  const [isScentModalOpen, setIsScentModalOpen] = useState(false);
  const [isFairChanceModalOpen, setIsFairChanceModalOpen] = useState(false);

  // Initialize DB and Scans
  useEffect(() => {
    async function init() {
      try {
        const storedScans = await getAllScans();
        if (storedScans && storedScans.length > 0) {
          setScans(storedScans);
          setActiveScanIndex(Math.min(storedScans.length - 1, 2)); // Default to Day 14 peak purge to highlight the core problem
        } else {
          // Hydrate demo scans by default so user is wowed immediately
          await loadDemoData();
        }
      } catch (e) {
        console.warn('IDB not ready or in SSR, fallback to DEMO_SCANS', e);
        setScans(DEMO_SCANS);
        setActiveScanIndex(2);
      }
    }
    init();
  }, []);

  const loadDemoData = async () => {
    const hydrated = await hydrateDemoState();
    setScans(hydrated.scans);
    setStreak(hydrated.streak);
    setSensoryHistory(hydrated.sensoryFeedback);
    setIsDemoLoaded(true);
    setCurrentDay(84);
    setActiveScanIndex(2); // Focus on Day 14 (peak purge) to educate on the patience deficit
  };

  const resetToFresh = () => {
    localStorage.removeItem('clearjourney_demo_active');
    localStorage.removeItem('clearjourney_streak');
    localStorage.removeItem('clearjourney_sensory');
    localStorage.setItem('clearjourney_day', '1');
    setIsDemoLoaded(false);
    setCurrentDay(1);
    setScans(DEMO_SCANS.slice(0, 1));
    setActiveScanIndex(0);
    setStreak({
      currentStreak: 1,
      longestStreak: 1,
      totalLogsCount: 1,
      milestonesUnlocked: [],
    });
  };

  const addNewScan = async (newScan: ScanRecord) => {
    await saveScan(newScan);
    setScans(prev => {
      const updated = [...prev, newScan].sort((a, b) => a.dayNumber - b.dayNumber);
      return updated;
    });
    setActiveScanIndex(scans.length);
    setCurrentDay(newScan.dayNumber);
  };

  const toggleRoutineAm = () => {
    const updated = { ...routineToday, amCleanseSpfDone: !routineToday.amCleanseSpfDone };
    setRoutineToday(updated);
    localStorage.setItem(`clearjourney_routine_${updated.date}`, JSON.stringify(updated));
  };

  const toggleRoutinePm = (seconds: number = 60) => {
    const nextVal = !routineToday.pmSalicylic60sDone;
    const updated = {
      ...routineToday,
      pmSalicylic60sDone: nextVal,
      secondsLathered: nextVal ? Math.max(seconds, 60) : 0,
    };
    setRoutineToday(updated);
    localStorage.setItem(`clearjourney_routine_${updated.date}`, JSON.stringify(updated));

    if (nextVal) {
      // Increment streak
      setStreak(prev => {
        const nextStreak = {
          ...prev,
          currentStreak: prev.currentStreak + 1,
          longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
          totalLogsCount: prev.totalLogsCount + 1,
        };
        localStorage.setItem('clearjourney_streak', JSON.stringify(nextStreak));
        return nextStreak;
      });
    }
  };

  const addSensoryRating = (rating: number) => {
    const newFeedback: SensoryFeedback = {
      date: `Day ${currentDay}`,
      scentAcceptanceScore: rating,
      coolingSensationScore: 5,
      textureFeel: 'clean',
      perceivedMedicinalNote: rating <= 3,
    };
    const updated = [...sensoryHistory, newFeedback];
    setSensoryHistory(updated);
    localStorage.setItem('clearjourney_sensory', JSON.stringify(updated));
  };

  const activeScan = scans[activeScanIndex] || null;

  const milestones = CLINICAL_MILESTONES.map(m => ({
    ...m,
    unlocked: streak.milestonesUnlocked.includes(m.id) || currentDay >= m.dayThreshold,
  }));

  return (
    <AppContext.Provider
      value={{
        currentDay,
        setCurrentDay,
        scans,
        activeScanIndex,
        setActiveScanIndex,
        activeScan,
        streak,
        milestones,
        isDemoLoaded,
        loadDemoData,
        resetToFresh,
        routineToday,
        toggleRoutineAm,
        toggleRoutinePm,
        activeTab,
        setActiveTab,
        addNewScan,
        isLatherModalOpen,
        setIsLatherModalOpen,
        isScentModalOpen,
        setIsScentModalOpen,
        isFairChanceModalOpen,
        setIsFairChanceModalOpen,
        sensoryHistory,
        addSensoryRating,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
