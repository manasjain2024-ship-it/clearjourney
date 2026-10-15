import React, { useEffect } from 'react';
import { Info, X, CheckCircle2, Sparkles, Activity, Clock, ShieldCheck, Camera, BookOpen } from 'lucide-react';

export type TabKey = 'DASHBOARD' | 'CHECK-IN' | 'SCIENCE' | 'DIARY' | 'home' | 'dashboard' | 'scan' | 'science' | 'diary' | 'routine' | 'analysis' | 'reviews';

interface TabInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab?: TabKey | string;
}

interface TabContentData {
  title: string;
  purpose: string;
  sectionTitle: string;
  features: {
    title?: string;
    description: string;
    icon?: React.ReactNode;
  }[];
}

const TAB_DATA_MAP: Record<string, TabContentData> = {
  DASHBOARD: {
    title: "About Home Dashboard",
    purpose: "Your daily command center for tracking the 84-day (12-week) skin turnover cycle.",
    sectionTitle: "Key Features",
    features: [
      {
        title: "Activity Rings",
        description: "The outer green ring tracks your daily BHA routine, the cyan ring tracks your lifestyle balance, and the inner coral ring measures overall progress toward your 12-week turnover milestone.",
      },
      {
        title: "60-Second Lather Timer",
        description: "Tap 'Start PM Wash' to launch the contact timer. Keeping salicylic acid on the skin for 45–60 seconds lets the active acid penetrate oily pores before rinsing.",
      },
      {
        title: "Latest Scan Summary",
        description: "Displays your most recent visual metrics and barrier status at a glance.",
      },
    ],
  },
  'CHECK-IN': {
    title: "About the 2-Step Check-In",
    purpose: "Captures your daily habits and visual facial data so the AI can evaluate your true progress.",
    sectionTitle: "How It Works",
    features: [
      {
        title: "Step 1 (Daily Diary)",
        description: "Takes 20 seconds to log sweat/exercise, sun exposure, sunscreen use, and barrier stinging.",
      },
      {
        title: "Step 2 (3-Profile Camera)",
        description: "Snaps Front, Left 45°, and Right 45° profile shots under consistent lighting.",
      },
      {
        title: "AI Correlation",
        description: "The system pairs your photos with your diary logs to show if new bumps are an expected active purge or lifestyle-related irritation (not a medical diagnosis).",
      },
    ],
  },
  SCIENCE: {
    title: "About the Science Lab",
    purpose: "Formulation transparency and biological education for Be Bodywise 2% Salicylic Acid Face Wash.",
    sectionTitle: "Key Topics",
    features: [
      {
        title: "Sensory & Aroma Profile",
        description: "Explains why the wash has a clinical/medicinal smell (zero added synthetic perfume to protect vulnerable skin barriers).",
      },
      {
        title: "Purging vs. Irritation",
        description: "Helps you distinguish between deep pores clearing out during weeks 1–3 versus an allergic reaction.",
      },
      {
        title: "Active Ingredients",
        description: "Clinical breakdowns of 2% Salicylic Acid (BHA), Allantoin, and Panthenol.",
      },
    ],
  },
  DIARY: {
    title: "About Lifestyle History",
    purpose: "Review your historical daily inputs and habit correlations over time.",
    sectionTitle: "Key Topics",
    features: [
      {
        description: "View logged exercise, water intake, UV exposure, and barrier comfort.",
      },
      {
        description: "See emerging patterns linking lifestyle factors (like heavy post-workout sweat) to facial clarity.",
      },
    ],
  },
};

function normalizeTabKey(tab?: string): string {
  if (!tab) return 'DASHBOARD';
  const lower = tab.toLowerCase();
  if (lower === 'home' || lower === 'dashboard' || lower === 'routine') return 'DASHBOARD';
  if (lower === 'scan' || lower === 'check-in' || lower === 'camera') return 'CHECK-IN';
  if (lower === 'science') return 'SCIENCE';
  if (lower === 'diary' || lower === 'analysis' || lower === 'reviews') return 'DIARY';
  return 'DASHBOARD';
}

export const TabInfoModal: React.FC<TabInfoModalProps> = ({ isOpen, onClose, currentTab = 'DASHBOARD' }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedKey = normalizeTabKey(currentTab);
  const data = TAB_DATA_MAP[normalizedKey] || TAB_DATA_MAP.DASHBOARD;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tab-info-modal-title"
    >
      <div
        className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-[#121418] text-white rounded-t-[32px] sm:rounded-[32px] border border-white/10 shadow-2xl p-6 flex flex-col gap-5 transform transition-transform duration-300 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle for mobile bottom sheet feel */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                Screen Guide & Help
              </span>
              <h3 id="tab-info-modal-title" className="text-lg font-bold text-white tracking-tight leading-snug">
                {data.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Purpose Statement */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block mb-1">
            Purpose
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {data.purpose}
          </p>
        </div>

        {/* Key Features / How It Works / Key Topics */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {data.sectionTitle}
          </span>
          <div className="space-y-2.5">
            {data.features.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#1A1D24] border border-white/5 flex gap-3 items-start"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  {item.title && (
                    <h4 className="text-xs font-bold text-white">
                      {item.title}
                    </h4>
                  )}
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] mt-1"
        >
          [ Got It ]
        </button>
      </div>
    </div>
  );
};
