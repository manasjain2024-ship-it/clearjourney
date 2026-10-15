import React, { useState } from 'react';
import { Card, Badge } from '../common/Card';
import { Button } from '../common/Button';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RetentionWizard: React.FC = () => {
  const { currentDay } = useApp();
  const [step, setStep] = useState<number>(1);
  const [symptom, setSymptom] = useState<string | null>(null);
  const [contactTime, setContactTime] = useState<string | null>(null);
  const [isMixingActives, setIsMixingActives] = useState<boolean | null>(null);

  const resetWizard = () => {
    setStep(1);
    setSymptom(null);
    setContactTime(null);
    setIsMixingActives(null);
  };

  const isPurgeProfile = symptom === 'tzone_bumps' && currentDay <= 21;

  return (
    <Card className="bg-white border-sage-200 shadow-clinical text-left space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-sage-100">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full inline-block">
            Retention Diagnostic Shield
          </span>
          <h4 className="font-extrabold text-sm text-charcoal-900 mt-0.5">
            Thinking of Quitting or Switching?
          </h4>
        </div>
        <Badge variant="amber" size="sm">
          Step {step} of 3
        </Badge>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-charcoal-700">
            What is your primary concern right now?
          </p>
          <div className="space-y-2">
            {[
              { id: 'tzone_bumps', title: 'Seeing more bumps on my forehead, nose, or chin' },
              { id: 'dryness_tightness', title: 'My skin feels tight or slightly dry after washing' },
              { id: 'medicinal_scent', title: 'The wash smells strongly medicinal / unperfumed' },
              { id: 'stinging_burning', title: 'Stinging sensation even when applying plain water' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSymptom(item.id)}
                className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${
                  symptom === item.id
                    ? 'border-sage-700 bg-sage-50 text-sage-900 font-bold shadow-xs'
                    : 'border-sage-100 bg-white text-charcoal-700 hover:bg-sage-50/50'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            fullWidth
            size="sm"
            disabled={!symptom}
            onClick={() => setStep(2)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Contact Time Audit
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-charcoal-700">
            How long do you leave the wash on your skin before rinsing?
          </p>
          <div className="space-y-2">
            {[
              { id: 'ten_sec', title: 'Quick splash & rinse (under 15 seconds)' },
              { id: 'sixty_sec', title: 'Full 45 to 60 seconds with circular lather (Recommended)' },
              { id: 'too_long', title: 'Over 2 minutes / Left on as a mask' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setContactTime(item.id)}
                className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${
                  contactTime === item.id
                    ? 'border-sage-700 bg-sage-50 text-sage-900 font-bold shadow-xs'
                    : 'border-sage-100 bg-white text-charcoal-700 hover:bg-sage-50/50'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            fullWidth
            size="sm"
            disabled={!contactTime}
            onClick={() => setStep(3)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Active Compatibility
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-charcoal-700">
            Are you using other strong active acids, Retinoids, or Benzoyl Peroxide in the same evening?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsMixingActives(true)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                isMixingActives === true
                  ? 'border-coral bg-coral-50 text-coral-700'
                  : 'border-sage-100 bg-white text-charcoal-700'
              }`}
            >
              Yes, I combine them
            </button>
            <button
              onClick={() => setIsMixingActives(false)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                isMixingActives === false
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-sage-100 bg-white text-charcoal-700'
              }`}
            >
              No, BHA wash only
            </button>
          </div>

          {isMixingActives !== null && (
            <div className="mt-4 p-3.5 rounded-2xl bg-sage-50 border border-sage-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-sage-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Dermatological Diagnosis & Plan:
              </div>

              {isPurgeProfile ? (
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  <strong>Classic Active Purge:</strong> Since you are on Day {currentDay} and new bumps are appearing in existing congestion zones, your skin is shedding microcomedones. Switching now will abort the cellular cycle right before clearance.
                </p>
              ) : symptom === 'medicinal_scent' ? (
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  <strong>Purity Standard Confirmed:</strong> The medicinal smell is unmasked 2.0% pure Salicylic Acid. No synthetic phthalates were added to trigger contact eczema.
                </p>
              ) : isMixingActives ? (
                <p className="text-xs text-coral-700 leading-relaxed">
                  <strong>Active Conflict Detected:</strong> Combining 2% BHA with other strong acids or retinoids causes lipid barrier stripping. Separate them: use Salicylic wash PM, and move other actives to alternate nights.
                </p>
              ) : (
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  <strong>Moisture Lock Required:</strong> Apply a non-comedogenic ceramide moisturizer immediately to damp skin after rinsing to stop compensatory sebum rebound.
                </p>
              )}

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={resetWizard}
                  className="text-[11px] text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Retake Diagnostic
                </button>
                <span className="text-[11px] font-bold text-sage-800">
                  Stay with routine until Day 28
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
