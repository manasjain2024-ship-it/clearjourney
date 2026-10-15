import React from 'react';
import { Modal } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Clock } from 'lucide-react';

interface FairChanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairChanceModal: React.FC<FairChanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentDay } = useApp();

  const daysToTurningPoint = Math.max(0, 21 - currentDay);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The 3-Week Patience Deficit Shield" maxWidth="max-w-md">
      <div className="space-y-4 text-left">
        {/* Urgent Empathetic Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <h4 className="font-extrabold text-sm text-amber-900">
              Why Quitting At Week 2 Guarantees Acne Rebound
            </h4>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Clinical studies show <strong>74% of acne treatment drop-offs occur between Days 10 and 18</strong>. Users mistake the acceleration of deep microcomedones for product failure and switch, resetting their skin barrier repeatedly.
          </p>
        </div>

        {/* Biological Turnover Clock Visual */}
        <div className="p-3.5 rounded-2xl bg-white border border-sage-100 shadow-clinical">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
            Cellular Turnover Velocity
          </span>
          <h5 className="font-bold text-sm text-charcoal-900 mb-2">
            Where Your Skin Stands on Day {currentDay}
          </h5>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-sage-50/60 border border-sage-100">
              <span className="text-charcoal-600">Stratum Corneum Renewal:</span>
              <span className="font-bold text-sage-900">28 Full Days</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-sage-50/60 border border-sage-100">
              <span className="text-charcoal-600">Turning Point Benchmark:</span>
              <span className="font-bold text-amber-800">Day 21</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-sage-50/60 border border-sage-100">
              <span className="text-charcoal-600">Days Until Turning Point:</span>
              <span className="font-extrabold text-emerald-700">
                {daysToTurningPoint === 0 ? 'Turning Point Achieved! 🎉' : `${daysToTurningPoint} Days Remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Purge vs Irritation Quick Differentiation */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Healthy Purging
            </span>
            <ul className="text-[11px] text-emerald-800 space-y-1 leading-snug">
              <li>• Located in usual breakout areas (T-zone, cheeks)</li>
              <li>• Spots resolve 2-3x faster than normal</li>
              <li>• No stinging outside wash time</li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-coral-50/70 border border-coral-200">
            <span className="font-bold text-coral-900 block mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-coral-600" />
              True Irritation
            </span>
            <ul className="text-[11px] text-coral-800 space-y-1 leading-snug">
              <li>• New rash-like bumps in non-oily areas</li>
              <li>• Burning sensation when applying plain water</li>
              <li>• Severe peeling / redness</li>
            </ul>
          </div>
        </div>

        {/* Commitment Action */}
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={onClose}
          icon={<Sparkles className="w-4 h-4 text-amber-300" />}
        >
          I Commit to The 28-Day Fair Chance
        </Button>
      </div>
    </Modal>
  );
};
