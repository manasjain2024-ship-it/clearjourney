import React from 'react';
import { QuantitativeMetrics } from '../../types';
import { ProgressBar } from '../common/Card';
import { ShieldCheck, Droplet, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface MetricsRadarProps {
  metrics: QuantitativeMetrics;
  dayNumber: number;
  isPurgeLikely?: boolean;
}

export const MetricsRadar: React.FC<MetricsRadarProps> = ({
  metrics,
  dayNumber,
  isPurgeLikely = false,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-sage-100 shadow-clinical space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-charcoal-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sage-700" />
          Quantitative Biometric Metrics
        </h4>
        <span className="text-[11px] text-sage-700 font-semibold bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
          Day {dayNumber} Audit
        </span>
      </div>

      <div className="space-y-3.5">
        {/* Sebum Control */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-charcoal-700 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-sage-600" />
              Sebum Regulation Control
            </span>
            <span className="font-bold text-sage-800">{metrics.sebumControlPercentage}%</span>
          </div>
          <ProgressBar value={metrics.sebumControlPercentage} color="sage" />
          <p className="text-[10px] text-charcoal-500 mt-1">
            {metrics.sebumControlPercentage > 75
              ? 'Sebaceous lipid production normalized to optimal baseline.'
              : 'Salicylic acid lipophilic action dissolving sebum plugs.'}
          </p>
        </div>

        {/* Inflammatory Lesions */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-charcoal-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-coral" />
              Inflammatory Lesion Count
            </span>
            <span className="font-bold text-charcoal-800">
              {metrics.inflammatoryLesionCount} <span className="text-[10px] font-normal text-charcoal-500">active spots</span>
            </span>
          </div>
          <ProgressBar
            value={Math.max(0, 100 - metrics.inflammatoryLesionCount * 4)}
            color={metrics.inflammatoryLesionCount > 15 ? 'coral' : 'mint'}
          />
          <p className="text-[10px] text-charcoal-500 mt-1">
            {dayNumber <= 21 && metrics.inflammatoryLesionCount > 10
              ? 'Temporary purging elevation: deep microcomedones surfacing.'
              : 'Post-inflammatory erythema clearing rapidly.'}
          </p>
        </div>

        {/* Barrier Hydration */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-charcoal-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Stratum Corneum Hydration Index
            </span>
            <span className="font-bold text-emerald-700">{metrics.barrierHydrationScore}/100</span>
          </div>
          <ProgressBar value={metrics.barrierHydrationScore} color="mint" />
          <p className="text-[10px] text-charcoal-500 mt-1">
            Glycerin & Allantoin humectants protecting skin barrier from moisture depletion.
          </p>
        </div>

        {/* Pore Refinement */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-charcoal-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Follicular Pore Refinement
            </span>
            <span className="font-bold text-amber-700">{metrics.poreRefinementScore}%</span>
          </div>
          <ProgressBar value={metrics.poreRefinementScore} color="amber" />
          <p className="text-[10px] text-charcoal-500 mt-1">
            Keratolytic action clearing cellular debris around pore margins.
          </p>
        </div>
      </div>

      {/* Adaptive Care Frequency Advisory Box */}
      <div className="p-3.5 rounded-2xl bg-sage-50/80 border border-sage-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-sage-700" />
          <span className="text-xs font-bold text-sage-900 uppercase tracking-wider">
            Adaptive Frequency Advisory
          </span>
        </div>
        <p className="text-xs text-charcoal-700 font-medium leading-relaxed">
          {dayNumber <= 14
            ? 'Phase 1: Limit to 3-4x/week PM only. Contact time: 60s strictly. Follow with lightweight ceramide lotion.'
            : dayNumber <= 28
            ? 'Phase 2: Safe for 5 nights weekly PM. Purge clearing underway.'
            : 'Phase 3: Safe for daily PM maintenance. Optimal pore prophylaxis.'}
        </p>
      </div>
    </div>
  );
};
