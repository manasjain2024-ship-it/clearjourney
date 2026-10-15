import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';
import { Badge } from '../common/Card';

interface BeforeAfterSliderProps {
  baselineImage: string;
  currentImage: string;
  baselineLabel?: string;
  currentLabel?: string;
  currentDay: number;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  baselineImage,
  currentImage,
  baselineLabel = 'Day 0 • Baseline',
  currentLabel = 'Day 28 • Cellular Renewal',
  currentDay,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(clamped);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-charcoal-800 flex items-center gap-1.5">
          <ArrowLeftRight className="w-4 h-4 text-sage-700" />
          Interactive Cellular Comparison
        </span>
        <span className="text-charcoal-500 text-[11px]">Drag divider to compare</span>
      </div>

      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-sage-200 select-none shadow-clinical cursor-ew-resize touch-none"
      >
        {/* Baseline (Full width behind) */}
        <img
          src={baselineImage}
          alt="Baseline Skin"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Current (Clipped on top) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={currentImage}
            alt="Current Skin"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
        </div>

        {/* Vertical Split Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 flex items-center justify-center -translate-x-1/2"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Thumb handle */}
          <div className="w-8 h-8 rounded-full bg-sage-800 text-white shadow-xl flex items-center justify-center border-2 border-white ring-2 ring-sage-800/40 transform hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Left Badge (Current) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-sage-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">
            {currentLabel}
          </span>
        </div>

        {/* Right Badge (Baseline) */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-charcoal-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">
            {baselineLabel}
          </span>
        </div>

        {/* Micro-Progress Markers Overlay at bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1 text-[10px]">
          <span className="bg-emerald-950/80 text-emerald-300 font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm border border-emerald-500/30">
            ✓ Pore canal smoothed
          </span>
          <span className="bg-emerald-950/80 text-emerald-300 font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm border border-emerald-500/30">
            ✓ -78% Sub-surface Sebum
          </span>
        </div>
      </div>

      {/* Reassurance Microcopy */}
      <div className="p-3 bg-mint-50 rounded-2xl border border-mint-200 text-xs text-charcoal-700">
        <p className="font-semibold text-sage-900 mb-0.5 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-sage-700" />
          The Stratum Corneum Shift:
        </p>
        <p className="text-[11px] text-charcoal-600 leading-relaxed">
          Notice how the follicular ostia (pore openings) appear less clogged. Even if surface redness is still balancing during Day 14–21, underlying keratin plug dissolution has successfully begun.
        </p>
      </div>
    </div>
  );
};
