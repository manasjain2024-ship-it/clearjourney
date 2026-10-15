import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Calendar, Award, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';

export const HabitStreak: React.FC = () => {
  const { streak, currentDay } = useApp();

  return (
    <Card className="bg-white border-sage-100 shadow-clinical">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-charcoal-900 tracking-tight">
              Habit Consistency Ring
            </h4>
            <p className="text-[11px] text-charcoal-500">60-Second PM Wash Discipline</p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-black text-2xl text-charcoal-900 leading-none">
            {streak.currentStreak}
          </span>
          <span className="text-xs font-semibold text-charcoal-500 ml-1">Days</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-sage-100/70">
        <div className="p-2 rounded-xl bg-sage-50/60">
          <span className="text-[10px] text-charcoal-500 block uppercase font-bold tracking-wider">
            Total Washes
          </span>
          <span className="text-sm font-extrabold text-sage-800">
            {streak.totalLogsCount} Logs
          </span>
        </div>
        <div className="p-2 rounded-xl bg-sage-50/60">
          <span className="text-[10px] text-charcoal-500 block uppercase font-bold tracking-wider">
            Best Run
          </span>
          <span className="text-sm font-extrabold text-sage-800">
            {streak.longestStreak} Days
          </span>
        </div>
        <div className="p-2 rounded-xl bg-sage-50/60">
          <span className="text-[10px] text-charcoal-500 block uppercase font-bold tracking-wider">
            Turnover Rate
          </span>
          <span className="text-sm font-extrabold text-emerald-700">
            {currentDay >= 28 ? '100%' : `${Math.round((currentDay / 28) * 100)}%`}
          </span>
        </div>
      </div>
    </Card>
  );
};
