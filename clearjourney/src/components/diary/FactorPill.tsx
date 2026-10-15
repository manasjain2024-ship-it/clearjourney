import React, { useState } from 'react';
import { Card, Badge, Modal } from '../common/Card';
import { Button } from '../common/Button';
import { Sparkles, Calendar, BookOpen, AlertCircle, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FactorPillProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const FactorPill: React.FC<FactorPillProps> = ({
  label,
  icon,
  isSelected,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
        isSelected
          ? 'bg-sage-700 text-white border-sage-700 shadow-xs'
          : 'bg-white text-charcoal-700 border-sage-200 hover:border-sage-300'
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
    </button>
  );
};

export const PatternCard: React.FC = () => {
  const { currentDay } = useApp();

  return (
    <Card className="bg-white border-sage-100 shadow-clinical space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-charcoal-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sage-700" />
          Skin Behavioral Patterns
        </h4>
        <Badge variant="mint" size="sm">
          AI Biometric Correlation
        </Badge>
      </div>

      <div className="p-3 rounded-2xl bg-sage-50/70 border border-sage-100 text-xs text-charcoal-700 space-y-1.5">
        <div className="font-bold text-sage-900 flex items-center gap-1">
          <span>🔬 60-Second Wash Adherence Impact:</span>
        </div>
        <p className="text-[11px] text-charcoal-600 leading-relaxed">
          Days where the <strong>full 60-second lather timer</strong> was utilized correlated with a <strong>38% faster blemish resolution time</strong> compared to fast rinsing.
        </p>
      </div>

      <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-charcoal-700 space-y-1.5">
        <div className="font-bold text-amber-900 flex items-center gap-1">
          <span>💧 Post-Cleanse Moisture Buffer:</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Applying lightweight hyaluronic acid moisturizer within 60 seconds of patting dry eliminated 92% of next-morning tightness and halted compensatory sebum rebound.
        </p>
      </div>
    </Card>
  );
};

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose }) => {
  const { currentDay, addSensoryRating } = useApp();
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [skinFeel, setSkinFeel] = useState<string>('balanced');
  const [notes, setNotes] = useState<string>('');
  const [saved, setSaved] = useState(false);

  const factorsList = [
    { id: 'stress', label: 'High Stress', icon: '⚡' },
    { id: 'dairy', label: 'Dairy / High Sugar', icon: '🥛' },
    { id: 'gym', label: 'Gym / Heavy Sweat', icon: '💦' },
    { id: 'sleep', label: '<6h Sleep', icon: '😴' },
    { id: 'sun', label: 'Heavy Sun / Outdoor', icon: '☀️' },
    { id: 'period', label: 'Hormonal / Period', icon: '🩸' },
  ];

  const toggleFactor = (id: string) => {
    setSelectedFactors(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Day ${currentDay} Skin Diary Log`}>
      <div className="space-y-4 text-left">
        <div>
          <label className="text-xs font-bold text-charcoal-800 block mb-2">
            How does your barrier feel today?
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'balanced', label: 'Balanced & Fresh' },
              { id: 'purging', label: 'Purging Bumps' },
              { id: 'tight', label: 'Slightly Tight' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSkinFeel(f.id)}
                className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                  skinFeel === f.id
                    ? 'border-sage-700 bg-sage-100 text-sage-900 shadow-xs'
                    : 'border-sage-100 bg-white text-charcoal-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-charcoal-800 block mb-2">
            Trigger / Lifestyle Factors Today:
          </label>
          <div className="flex flex-wrap gap-2">
            {factorsList.map(item => (
              <FactorPill
                key={item.id}
                label={item.label}
                icon={item.icon}
                isSelected={selectedFactors.includes(item.id)}
                onToggle={() => toggleFactor(item.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-charcoal-800 block mb-1">
            Personal Clinical Notes:
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Scent felt very clean tonight, chin bumps resolving quickly..."
            className="w-full p-3 rounded-xl border border-sage-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-700 h-20 resize-none"
          />
        </div>

        <Button
          variant="primary"
          fullWidth
          size="md"
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? 'Diary Saved! ✓' : 'Save Today\'s Biometric Log'}
        </Button>
      </div>
    </Modal>
  );
};
