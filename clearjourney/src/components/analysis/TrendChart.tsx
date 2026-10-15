import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../common/Card';
import { TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const TrendChart: React.FC = () => {
  const { scans, activeScanIndex, setActiveScanIndex } = useApp();
  const [activeMetric, setActiveMetric] = useState<'lesions' | 'sebum' | 'refinement'>('lesions');

  // Days progression: 0, 7, 14, 21, 42, 84
  const dataPoints = scans.map(s => ({
    day: s.dayNumber,
    lesions: s.metrics.inflammatoryLesionCount,
    sebum: s.metrics.sebumControlPercentage,
    refinement: s.metrics.poreRefinementScore,
  }));

  const maxVal = activeMetric === 'lesions' ? 25 : 100;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-sm text-charcoal-900 tracking-tight flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-sage-700" />
            12-Week Clinical Cellular Trajectory
          </h4>
          <p className="text-[11px] text-charcoal-500">The 3-Week Patience Deficit mapped objectively</p>
        </div>
      </div>

      {/* Metric Selector Buttons */}
      <div className="flex gap-1.5 bg-sage-50 p-1 rounded-xl text-xs">
        <button
          onClick={() => setActiveMetric('lesions')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
            activeMetric === 'lesions'
              ? 'bg-white text-coral-600 shadow-xs'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Lesions (Purge Curve)
        </button>
        <button
          onClick={() => setActiveMetric('sebum')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
            activeMetric === 'sebum'
              ? 'bg-white text-sage-800 shadow-xs'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Sebum Control %
        </button>
        <button
          onClick={() => setActiveMetric('refinement')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
            activeMetric === 'refinement'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Pore Refinement %
        </button>
      </div>

      {/* SVG Trajectory Chart */}
      <div className="relative pt-6 pb-2">
        <div className="h-40 flex items-end justify-between gap-2 px-2 border-b border-sage-200">
          {dataPoints.map((pt, i) => {
            const rawVal = pt[activeMetric];
            const heightPercent = Math.min(100, Math.max(12, (rawVal / maxVal) * 100));
            const isSelected = i === activeScanIndex;
            const isPurgePeak = pt.day === 14 && activeMetric === 'lesions';

            let barBg = 'bg-sage-600';
            if (activeMetric === 'lesions') {
              barBg = isPurgePeak ? 'bg-coral-500' : pt.day <= 21 ? 'bg-amber-500' : 'bg-emerald-600';
            } else if (activeMetric === 'sebum') {
              barBg = 'bg-sage-700';
            } else {
              barBg = 'bg-amber-600';
            }

            return (
              <div
                key={pt.day}
                onClick={() => setActiveScanIndex(i)}
                className="flex-1 flex flex-col items-center cursor-pointer group h-full justify-end"
              >
                {/* Value tooltip tag */}
                <span
                  className={`text-[10px] font-bold mb-1 transition-all ${
                    isSelected ? 'text-charcoal-900 scale-110' : 'text-charcoal-500 group-hover:text-charcoal-800'
                  }`}
                >
                  {rawVal}
                  {activeMetric !== 'lesions' ? '%' : ''}
                </span>

                {/* Animated bar */}
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${barBg} ${
                    isSelected ? 'ring-2 ring-sage-800 ring-offset-2' : 'opacity-80 group-hover:opacity-100'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Day label */}
                <span className={`text-[10px] font-semibold mt-2 ${isSelected ? 'text-sage-800 font-bold' : 'text-charcoal-500'}`}>
                  D{pt.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Phase annotation lines */}
        <div className="flex justify-between text-[10px] text-charcoal-500 pt-2 px-1">
          <span className="text-amber-800 font-semibold">Weeks 1-2: Purge Spike</span>
          <span className="text-sage-800 font-semibold">Week 3: Turning Point</span>
          <span className="text-emerald-800 font-semibold">Week 6-12: Clarity</span>
        </div>
      </div>

      {/* Critical Reassurance Callout */}
      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs flex gap-2.5 items-start">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900">The 3-Week Patience Window Rule:</p>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
            BHA does not cause new acne. It clears <strong>pre-existing micro-comedones</strong> already incubating in the follicular infundibulum. Lesions appearing between Day 7 and 18 are expected clinical turnover.
          </p>
        </div>
      </div>
    </Card>
  );
};
