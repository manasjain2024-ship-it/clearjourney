import React, { useState } from 'react';
import { Card, Badge } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Wind, AlertTriangle, CheckCircle2, Droplet, Sparkles, Plus, Info } from 'lucide-react';
import { BODYWISE_SALICYLIC_FORMULATION, INGREDIENT_COMPATIBILITY_DATABASE } from '../../config/ingredients';

export const ScienceLab: React.FC = () => {
  const { setIsScentModalOpen } = useApp();
  const [selectedActive, setSelectedActive] = useState<string>('benzoyl_peroxide');
  const [showMoistureLockModal, setShowMoistureLockModal] = useState(false);

  const activeCompatibility = INGREDIENT_COMPATIBILITY_DATABASE[selectedActive];

  return (
    <div className="space-y-4 text-left">
      {/* Hero Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-sage-900 via-sage-800 to-sage-900 text-white shadow-clinical">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-5 h-5 text-mint-400" />
          <h3 className="font-extrabold text-base tracking-tight">
            "Why It Smells Medicated" Science Lab
          </h3>
        </div>
        <p className="text-xs text-sage-200 leading-relaxed mb-3">
          Demystifying the natural aroma of 2.0% pure Salicylic Acid and unlocking dermatological active compatibility.
        </p>
        <button
          onClick={() => setIsScentModalOpen(true)}
          className="px-3 py-1.5 rounded-full bg-white text-sage-900 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-sage-50 transition-colors"
        >
          <Wind className="w-3.5 h-3.5 text-sage-700" />
          Decode Sensory Transparency
        </button>
      </div>

      {/* Sensory Transparency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Zero Fragrance */}
        <Card className="bg-white border-sage-100 shadow-clinical space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-charcoal-900">
              0.0% Added Fragrance
            </span>
            <Badge variant="mint" size="sm">
              Acid Mantle Safe
            </Badge>
          </div>
          <p className="text-[11px] text-charcoal-600 leading-relaxed">
            Synthetic perfumes disrupt the epidermal lipid matrix and cause micro-dermatitis on active comedones. Be Bodywise is 100% unperfumed.
          </p>
        </Card>

        {/* Pure BHA Potency */}
        <Card className="bg-white border-sage-100 shadow-clinical space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-charcoal-900">
              Medicinal Active Note
            </span>
            <Badge variant="sage" size="sm">
              Active Efficacy
            </Badge>
          </div>
          <p className="text-[11px] text-charcoal-600 leading-relaxed">
            That brisk, clinical scent confirms pure 2.0% W/W Salicylic Acid ready to penetrate lipid-rich pores without inert filler masks.
          </p>
        </Card>
      </div>

      {/* Active Routine Compatibility Engine (Cocktail Clash Checker) */}
      <Card className="bg-white border-sage-100 shadow-clinical space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-charcoal-900 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sage-700" />
              Active Routine Compatibility Engine
            </h4>
            <p className="text-[11px] text-charcoal-500">Prevent barrier breakdown from accidental cocktail clashing</p>
          </div>
        </div>

        {/* Active Ingredient Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
          {Object.entries(INGREDIENT_COMPATIBILITY_DATABASE).map(([key, item]) => {
            const isSelected = selectedActive === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedActive(key)}
                className={`p-2 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? 'border-sage-700 bg-sage-50 text-sage-900 font-bold shadow-xs'
                    : 'border-sage-100 bg-white text-charcoal-600 hover:bg-sage-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="truncate text-[11px] font-bold">{item.name.split('(')[0]}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.safetyTier === 'danger'
                        ? 'bg-coral-500'
                        : item.safetyTier === 'caution'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-charcoal-500 block truncate">{item.category}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Active Verdict Display */}
        {activeCompatibility && (
          <div
            className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
              activeCompatibility.safetyTier === 'danger'
                ? 'bg-coral-50 border-coral-200 text-coral-900'
                : activeCompatibility.safetyTier === 'caution'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs flex items-center gap-1.5">
                {activeCompatibility.safetyTier === 'danger' && <AlertTriangle className="w-4 h-4 text-coral-600" />}
                {activeCompatibility.safetyTier === 'caution' && <Info className="w-4 h-4 text-amber-600" />}
                {activeCompatibility.safetyTier === 'safe' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {activeCompatibility.name}
              </span>
              <Badge
                variant={
                  activeCompatibility.safetyTier === 'danger'
                    ? 'coral'
                    : activeCompatibility.safetyTier === 'caution'
                    ? 'amber'
                    : 'mint'
                }
                size="sm"
              >
                {activeCompatibility.safetyTier.toUpperCase()}
              </Badge>
            </div>

            <p className="text-xs leading-relaxed font-medium">
              {activeCompatibility.advice}
            </p>

            <div className="p-2.5 rounded-xl bg-white/80 border border-current/20 text-[11px]">
              <span className="font-bold">Dermatologist Buffer Protocol: </span>
              {activeCompatibility.bufferInstructions}
            </div>
          </div>
        )}
      </Card>

      {/* The Moisture Lock Reminder Card */}
      <Card className="bg-gradient-to-r from-mint-50 to-sage-50 border-mint-200 shadow-clinical space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-sage-700" />
            <h4 className="font-extrabold text-xs text-sage-900">
              The "Moisture Lock" Golden Rule
            </h4>
          </div>
          <Badge variant="sage" size="sm">
            Prevents Rebound Oil
          </Badge>
        </div>
        <p className="text-xs text-charcoal-700 leading-relaxed">
          Common mistake: acne patients with oily skin skip moisturizer after washing. This triggers <strong>compensatory hyper-seborrhea</strong> (skin pumps 2x oil to compensate). Always lock in hydration with an oil-free hyaluronic moisturizer.
        </p>
      </Card>

      {/* Be Bodywise Formulation Data */}
      <Card className="bg-white border-sage-100 shadow-clinical space-y-3">
        <h4 className="font-extrabold text-xs text-charcoal-900 uppercase tracking-wider">
          Complete Formulation Architecture
        </h4>
        <div className="space-y-2 text-xs">
          {BODYWISE_SALICYLIC_FORMULATION.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-sage-50/50 border border-sage-100 flex flex-col gap-0.5">
              <div className="flex items-center justify-between font-bold text-charcoal-900">
                <span>{item.name}</span>
                {item.percentage && (
                  <span className="text-[10px] text-sage-800 bg-sage-100 px-2 py-0.2 rounded font-semibold">
                    {item.percentage}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-sage-800 font-medium">{item.role}</span>
              <p className="text-[10px] text-charcoal-500 leading-snug mt-0.5">
                {item.sensoryOrClinicalNote}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
