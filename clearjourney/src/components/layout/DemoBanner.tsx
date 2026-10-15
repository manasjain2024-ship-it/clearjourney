import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Card';

export const DemoBanner: React.FC = () => {
  const { isDemoLoaded, loadDemoData, resetToFresh, currentDay } = useApp();

  return (
    <div className="bg-gradient-to-r from-sage-900 via-sage-800 to-sage-900 text-white px-4 py-2.5 text-xs shadow-inner">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin-slow" />
          <div className="truncate">
            <span className="font-semibold text-white">
              {isDemoLoaded ? '12-Week Clinical Simulation' : 'Explore Complete Journey'}
            </span>
            <span className="text-sage-200 ml-1 hidden sm:inline">
              {isDemoLoaded ? '(6 Scans Loaded)' : '(Day 0 to Day 84)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isDemoLoaded ? (
            <>
              <Badge variant="mint" size="sm" className="bg-emerald-950/80 text-emerald-300 border-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Sample Data Active
              </Badge>
              <button
                onClick={resetToFresh}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-sage-100 flex items-center gap-1 transition-colors"
                title="Reset to fresh clean state"
              >
                <RefreshCcw className="w-3 h-3" />
                Reset
              </button>
            </>
          ) : (
            <button
              onClick={loadDemoData}
              className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-charcoal-900 font-bold text-[11px] flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-charcoal-900" />
              Try Demo (12 Weeks)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
