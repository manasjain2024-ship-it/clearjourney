import React, { useState, useEffect, useRef } from 'react';
import { audioChime } from './AudioChime';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '../common/Button';

interface LatherTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface StepGuidance {
  minSec: number;
  maxSec: number;
  title: string;
  instruction: string;
  focusArea: string;
}

const PHASES: StepGuidance[] = [
  {
    minSec: 0,
    maxSec: 15,
    title: 'Phase 1: Emulsification',
    instruction: 'Pump 1-2 pea-sized drops. Emulsify with lukewarm water between palms to generate rich micro-lather.',
    focusArea: 'Palms & Cheeks',
  },
  {
    minSec: 15,
    maxSec: 35,
    title: 'Phase 2: Targeted Lipophilic Massage',
    instruction: 'Gently circulate fingertips over your T-zone, nose crevice, and chin. Do not scrub harshly.',
    focusArea: 'Forehead, Nose, Chin',
  },
  {
    minSec: 35,
    maxSec: 50,
    title: 'Phase 3: Active Penetration Window',
    instruction: 'Pause physical friction. Allow the 2.0% unmasked salicylic acid to dissolve sebum plugs. Feel the menthol cooling soothe inflammation.',
    focusArea: 'Sebaceous Follicles',
  },
  {
    minSec: 50,
    maxSec: 60,
    title: 'Phase 4: Cryo-Soothing Rinse',
    instruction: 'Rinse thoroughly with cool water. Pat dry gently with clean towel. Do not rub.',
    focusArea: 'Entire Face & Neck',
  },
];

export const LatherTimerModal: React.FC<LatherTimerModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<any>(null);

  // Audio start tone
  useEffect(() => {
    if (isOpen) {
      setSeconds(0);
      setIsActive(false);
      setIsFinished(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          // Phase sound triggers
          if (next === 15 || next === 35 || next === 50) {
            audioChime.playPhaseChime();
          }
          if (next >= 60) {
            clearInterval(timerRef.current);
            setIsActive(false);
            setIsFinished(true);
            audioChime.playCompletionChime();
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2E5A44', '#E8F0EC', '#52B788', '#F59E0B'],
              });
            } catch (e) {}
            return 60;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => {
    if (!isActive && seconds === 0) {
      audioChime.playStartChime();
    }
    setIsActive(prev => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setIsFinished(false);
  };

  const currentPhase = PHASES.find(p => seconds >= p.minSec && seconds < p.maxSec) || PHASES[PHASES.length - 1];

  if (!isOpen) return null;

  // SVG Circle calculation
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (seconds / 60) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-sage-100 p-6 text-center animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-sage-100">
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full">
              Clinical Protocol
            </span>
            <h3 className="text-base font-extrabold text-charcoal-900 mt-0.5">
              60-Second Lather Timer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-sage-50 hover:bg-sage-100 text-charcoal-600 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-52 h-52 mx-auto my-3 flex items-center justify-center select-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background Ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#E8F0EC"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#2E5A44"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-black text-charcoal-900 tracking-tight">
              {60 - seconds}
              <span className="text-xl font-sans font-bold text-sage-700">s</span>
            </span>
            <span className="text-xs font-semibold text-sage-800 uppercase tracking-wider mt-1">
              {isFinished ? 'Completed!' : currentPhase.title.split(':')[1] || 'Lathering'}
            </span>
          </div>
        </div>

        {/* Micro-Guidance Banner */}
        <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200 text-left mb-5 transition-all min-h-[96px] flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-bold text-sage-900 mb-1">
            <span>{currentPhase.title}</span>
            <span className="text-[10px] text-sage-700 font-semibold bg-white px-2 py-0.5 rounded-md border border-sage-200">
              Focus: {currentPhase.focusArea}
            </span>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            {currentPhase.instruction}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {isFinished ? (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => {
                onComplete();
                onClose();
              }}
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            >
              Log 60s Wash & Claim Streak
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={resetTimer}
                disabled={seconds === 0}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={toggleTimer}
                icon={isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              >
                {isActive ? 'Pause' : seconds === 0 ? 'Start 60s Lather' : 'Resume'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
