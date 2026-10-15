import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer className="mt-8 mb-24 px-4 text-center">
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-sage-50/70 border border-sage-200/60 text-charcoal-500 text-xs leading-relaxed">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-sage-800 mb-1.5">
          <Info className="w-4 h-4 text-sage-700" />
          <span>Clinical Transparency & Advisory</span>
        </div>
        <p className="mb-2">
          ClearJourney by <strong>Be Bodywise</strong> is an adherence and behavioral companion designed to track skin adaptation to topical 2% Salicylic Acid.
        </p>
        <p className="text-[11px] text-charcoal-500">
          *Not intended for medical diagnosis of acute dermatological diseases. If you experience severe burning, swelling, or rash outside active acne regions, discontinue use and consult a dermatologist.
        </p>
        <div className="mt-3 pt-3 border-t border-sage-200/60 flex items-center justify-center gap-4 text-[10px] text-sage-800 font-semibold uppercase tracking-wider">
          <span>Zero Synthetic Fragrance</span>
          <span>•</span>
          <span>2.0% Active BHA</span>
          <span>•</span>
          <span>Sulfate-Free</span>
        </div>
      </div>
    </footer>
  );
};
