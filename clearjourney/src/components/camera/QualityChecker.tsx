import React from 'react';
import { ImageQualityMetrics } from '../../services/imageProcessing';
import { CheckCircle2, AlertTriangle, Sun, Focus } from 'lucide-react';
import { Badge } from '../common/Card';

interface QualityCheckerProps {
  metrics: ImageQualityMetrics;
}

export const QualityChecker: React.FC<QualityCheckerProps> = ({ metrics }) => {
  return (
    <div className="bg-sage-50/90 rounded-2xl p-3.5 border border-sage-200 text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-charcoal-800 flex items-center gap-1.5">
          {metrics.passed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          )}
          Biometric Scan Quality
        </span>
        <Badge variant={metrics.passed ? 'mint' : 'amber'} size="sm">
          {metrics.passed ? 'Scan Approved' : 'Optimal Adjustments Needed'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-sage-100">
          <span className="text-charcoal-500 flex items-center gap-1">
            <Focus className="w-3.5 h-3.5 text-sage-600" />
            Sharpness
          </span>
          <span className="font-semibold text-charcoal-800">{metrics.blurScore}%</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-sage-100">
          <span className="text-charcoal-500 flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Luminance
          </span>
          <span className="font-semibold text-charcoal-800">{metrics.luminance}/255</span>
        </div>
      </div>

      <p className="text-charcoal-600 text-[11px] leading-tight italic">
        {metrics.feedbackMessage}
      </p>
    </div>
  );
};
