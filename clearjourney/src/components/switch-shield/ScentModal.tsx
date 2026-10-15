import React, { useState } from 'react';
import { Modal } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Sparkles, Wind, ShieldAlert, CheckCircle2, HeartHandshake } from 'lucide-react';
import { BODYWISE_SALICYLIC_FORMULATION, SENSORY_EDUCATION_FACTS } from '../../config/ingredients';

interface ScentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScentModal: React.FC<ScentModalProps> = ({ isOpen, onClose }) => {
  const { sensoryHistory, addSensoryRating, currentDay } = useApp();
  const [selectedRating, setSelectedRating] = useState<number>(4);
  const [hasRated, setHasRated] = useState(false);

  const handleSubmitRating = () => {
    addSensoryRating(selectedRating);
    setHasRated(true);
    setTimeout(() => {
      setHasRated(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Sensory Misconception Decoded" maxWidth="max-w-md">
      <div className="space-y-4 text-left">
        {/* Intro Banner */}
        <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-sage-700" />
            <h4 className="font-extrabold text-sm text-sage-900">
              Why Does It Smell Medicated / Unperfumed?
            </h4>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Most commercial face washes mask harsh surfactants with heavy artificial perfumes to smell like flowers or candy. Synthetic fragrances are the <strong>#1 dermatological cause of contact allergy</strong> on acne-prone skin.
          </p>
        </div>

        {/* Clinical Proof Cards */}
        <div className="space-y-2.5">
          {SENSORY_EDUCATION_FACTS.map((fact, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white border border-sage-100 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-charcoal-900">{fact.title}</span>
                <span className="text-[10px] font-semibold text-sage-800 bg-sage-100 px-2 py-0.5 rounded-full">
                  {fact.badge}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-relaxed">{fact.body}</p>
            </div>
          ))}
        </div>

        {/* Menthol / Cooling Sensation Gauge */}
        <div className="p-3 rounded-2xl bg-mint-50/70 border border-mint-200">
          <span className="text-xs font-bold text-sage-900 block mb-1">
            Menthol Receptor Activation:
          </span>
          <p className="text-[11px] text-charcoal-600 leading-relaxed mb-2">
            The brisk tingling coolness you feel is pure menthol activating TRPM8 thermal cold sensors. This constricts dilated capillaries to calm visible acne redness in real time.
          </p>
          <div className="flex items-center justify-between text-[10px] font-bold text-sage-800 bg-white p-2 rounded-xl border border-mint-200">
            <span>❄️ Cooling Vasoconstriction</span>
            <span className="text-emerald-700">Calms Red Papules Instantly</span>
          </div>
        </div>

        {/* Interactive Smell Evolution Tracker */}
        <div className="p-3.5 rounded-2xl bg-white border border-sage-200">
          <h5 className="font-bold text-xs text-charcoal-900 mb-1">
            Rate Your Perception Today (Day {currentDay})
          </h5>
          <p className="text-[11px] text-charcoal-500 mb-3">
            Over 82% of users evolve from finding the smell "unfamiliar" in Week 1 to associating it with clinical freshness by Week 3.
          </p>

          <div className="grid grid-cols-5 gap-1.5 mb-3 text-center">
            {[
              { val: 1, label: 'Unusual' },
              { val: 2, label: 'Medicinal' },
              { val: 3, label: 'Neutral' },
              { val: 4, label: 'Fresh' },
              { val: 5, label: 'Efficacy!' },
            ].map(item => (
              <button
                key={item.val}
                onClick={() => setSelectedRating(item.val)}
                className={`p-2 rounded-xl border text-xs flex flex-col items-center justify-center transition-all ${
                  selectedRating === item.val
                    ? 'border-sage-700 bg-sage-700 text-white font-bold shadow-xs'
                    : 'border-sage-100 bg-sage-50/50 text-charcoal-600 hover:bg-sage-100'
                }`}
              >
                <span className="text-sm font-bold">{item.val}</span>
                <span className="text-[9px] mt-0.5 leading-tight">{item.label}</span>
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            fullWidth
            size="sm"
            onClick={handleSubmitRating}
            disabled={hasRated}
          >
            {hasRated ? 'Perception Logged! ✓' : 'Save Scent Perception Log'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
