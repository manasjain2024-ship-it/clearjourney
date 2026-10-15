import React from 'react';
import { ScanAngle } from '../../types';

interface FaceGuideOverlayProps {
  currentAngle: ScanAngle;
}

export const FaceGuideOverlay: React.FC<FaceGuideOverlayProps> = ({ currentAngle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
      {/* Target Oval Face Silhouette */}
      <div className="relative w-56 h-72 border-2 border-dashed border-white/70 rounded-[50%/60%_60%_40%_40%] shadow-2xl flex items-center justify-center">
        {/* Center Crosshair / alignment markers */}
        <div className="absolute top-1/4 w-32 border-b border-white/40" />
        <div className="absolute top-1/2 w-40 border-b border-white/30" />
        <div className="absolute left-1/2 h-44 -translate-x-1/2 border-l border-white/30" />

        {/* Dynamic Angle Indicator Badge */}
        <div className="absolute -top-3 bg-sage-800/90 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-md">
          {currentAngle === 'front' && 'Frontal Alignment'}
          {currentAngle === 'left' && 'Left Cheek (Tilt 30°)'}
          {currentAngle === 'right' && 'Right Cheek (Tilt 30°)'}
        </div>

        {/* Target Focal Points */}
        <div className="absolute bottom-6 bg-charcoal-900/70 text-white/90 text-[10px] px-2.5 py-0.5 rounded-full">
          Align chin inside frame
        </div>
      </div>

      <p className="mt-4 text-white text-xs font-medium drop-shadow bg-charcoal-900/60 px-3 py-1 rounded-full backdrop-blur-sm">
        Even lighting • Remove glasses • Neutral expression
      </p>
    </div>
  );
};
