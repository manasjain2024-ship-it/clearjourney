import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Info } from 'lucide-react';

interface TopHeaderProps {
  onOpenInfo?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenInfo }) => {
  const { streak, currentDay } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#121418]/90 backdrop-blur-md border-b border-sage-100 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sage-700 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-sage-100">
            BW
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-charcoal-900 dark:text-white text-sm tracking-tight">ClearJourney</span>
              <span className="text-[10px] text-sage-700 bg-sage-100 px-1.5 py-0.2 rounded font-semibold">2% BHA</span>
            </div>
            <p className="text-[10px] text-charcoal-500 dark:text-slate-400 font-medium">Be Bodywise Acne Adherence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Persistent Streak Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
            <span className="text-xs font-bold">{streak.currentStreak}d</span>
          </div>

          {/* Current Day Indicator */}
          <div className="px-2.5 py-1.5 rounded-full bg-sage-50 dark:bg-slate-800 border border-sage-200 dark:border-slate-700 text-sage-800 dark:text-slate-200 text-xs font-bold">
            Day {currentDay}
          </div>

          {/* Contextual (i) Info Button */}
          <button
            onClick={onOpenInfo}
            aria-label="Tab Guide & Help"
            title="Tab Guide & Help"
            className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A1D24] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:border-emerald-500 dark:hover:text-emerald-400 dark:hover:border-emerald-400 transition-all shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <Info size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  );
};
