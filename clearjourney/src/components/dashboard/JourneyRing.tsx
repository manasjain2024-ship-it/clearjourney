import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, Badge } from '../common/Card';

export const JourneyRing: React.FC = () => {
  const { currentDay, streak, setIsFairChanceModalOpen } = useApp();

  // 28 days = 1 biological cellular cycle, 84 days = 3 cycles (clinical baseline)
  const cycleNumber = Math.min(3, Math.floor(currentDay / 28) + 1);
  const cycleDay = (currentDay % 28) === 0 && currentDay > 0 ? 28 : (currentDay % 28);
  const cyclePercentage = Math.min(100, Math.round((currentDay / 84) * 100));

  const isPurgePhase = currentDay >= 7 && currentDay <= 21;

  return (
    <Card className="bg-gradient-to-br from-white via-mint-50/40 to-sage-50 border-sage-200 shadow-clinical">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-sage-800 bg-sage-100 px-2 py-0.5 rounded-full inline-block mb-1">
            Keratinocyte Cellular Clock
          </span>
          <h2 className="text-xl font-black text-charcoal-900 tracking-tight">
            Day {currentDay} of 84
          </h2>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Cellular Cycle {cycleNumber} of 3 • Day {cycleDay}/28
          </p>
        </div>

        {isPurgePhase ? (
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-coral-700 bg-coral-50 border border-coral-200 px-2.5 py-1 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
              Peak Purge Zone
            </span>
          </div>
        ) : (
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Optimal Adherence
            </span>
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="relative pt-2 pb-1">
        <div className="w-full bg-sage-200/60 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sage-600 via-mint-500 to-sage-800 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, cyclePercentage)}%` }}
          />
        </div>

        {/* Milestone Tick Marks */}
        <div className="flex justify-between items-center text-[10px] text-charcoal-500 mt-1.5 px-0.5 font-medium">
          <span className="text-sage-800 font-bold">Day 0 (Start)</span>
          <span className="text-amber-800 font-bold">Day 21 (Turning Point)</span>
          <span className="text-charcoal-700">Day 28 (Cycle 1)</span>
          <span className="text-emerald-800 font-bold">Day 84 (Homeostasis)</span>
        </div>
      </div>

      {/* Contextual Reassurance or Retention Shield Banner */}
      {isPurgePhase ? (
        <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between gap-2">
          <div className="text-left">
            <p className="font-bold text-amber-900 leading-tight">
              Experiencing new bumps right now?
            </p>
            <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
              Normal follicular turnover is active. Check symptoms before switching.
            </p>
          </div>
          <button
            onClick={() => setIsFairChanceModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs flex items-center gap-1"
          >
            Switch Shield
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-2xl bg-white/80 border border-sage-100 text-xs flex items-center justify-between">
          <span className="text-charcoal-700 text-[11px]">
            {currentDay > 28
              ? '✨ Full biological turnover completed. Maintenance active.'
              : '🌱 Desmosome bonds dissolving. Pores clearing gradually.'}
          </span>
          <span className="font-bold text-sage-800 text-[11px] shrink-0">
            {cyclePercentage}% Cleared
          </span>
        </div>
      )}
    </Card>
  );
};
