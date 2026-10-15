import React from 'react';
import { Milestone } from '../../types';
import { Card, Badge } from '../common/Card';
import { Sparkles, ShieldCheck, Target, RefreshCw, Award, Lock, CheckCircle2 } from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  currentDay: number;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  currentDay,
}) => {
  const isUnlocked = milestone.unlocked || currentDay >= milestone.dayThreshold;

  const getIcon = () => {
    switch (milestone.icon) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isUnlocked
          ? 'bg-white border-sage-200 shadow-clinical'
          : 'bg-sage-50/40 border-dashed border-sage-200 opacity-75'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon Circle */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isUnlocked
              ? 'bg-sage-100 text-sage-800 shadow-xs'
              : 'bg-charcoal-100 text-charcoal-400'
          }`}
        >
          {isUnlocked ? getIcon() : <Lock className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-extrabold text-sm text-charcoal-900 truncate">
              {milestone.title}
            </span>
            <Badge variant={isUnlocked ? 'mint' : 'neutral'} size="sm">
              {isUnlocked ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline mr-0.5" />
                  Day {milestone.dayThreshold}
                </>
              ) : (
                `Day ${milestone.dayThreshold}`
              )}
            </Badge>
          </div>

          <p className="text-xs text-charcoal-600 mb-2 leading-relaxed">
            {milestone.description}
          </p>

          {/* Clinical Biological Fact */}
          <div className="p-2 rounded-xl bg-sage-50/70 border border-sage-100 text-[11px] text-sage-900 leading-snug">
            <span className="font-bold text-sage-800">Biometric Marker: </span>
            {milestone.clinicalFact}
          </div>
        </div>
      </div>
    </Card>
  );
};
