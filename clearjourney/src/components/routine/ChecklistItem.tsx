import React from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';

interface ChecklistItemProps {
  title: string;
  subtitle: string;
  isDone: boolean;
  onToggle: () => void;
  tag?: string;
  hasTimer?: boolean;
  onTimerClick?: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  title,
  subtitle,
  isDone,
  onToggle,
  tag,
  hasTimer = false,
  onTimerClick,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`group p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
        isDone
          ? 'bg-sage-50/80 border-sage-300 shadow-xs'
          : 'bg-white border-sage-100 hover:border-sage-300 shadow-clinical'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Custom Checkbox circle */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
            isDone
              ? 'bg-sage-700 border-sage-700 text-white scale-105'
              : 'border-sage-300 bg-white group-hover:border-sage-500'
          }`}
        >
          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4
              className={`font-bold text-sm tracking-tight transition-colors ${
                isDone ? 'text-sage-900 line-through opacity-80' : 'text-charcoal-900'
              }`}
            >
              {title}
            </h4>
            {tag && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-100 text-sage-800">
                {tag}
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-500 leading-snug">{subtitle}</p>
        </div>
      </div>

      {/* Embedded 60s timer button shortcut */}
      {hasTimer && (
        <button
          onClick={e => {
            e.stopPropagation();
            onTimerClick?.();
          }}
          className="px-2.5 py-1.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-800 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 border border-sage-200"
          title="Launch 60s Active Contact Timer"
        >
          <Clock className="w-3.5 h-3.5 text-sage-700" />
          <span>60s Rule</span>
        </button>
      )}
    </div>
  );
};
