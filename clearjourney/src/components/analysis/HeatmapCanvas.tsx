import React, { useState } from 'react';
import { HeatmapPoint } from '../../types';
import { Badge } from '../common/Card';
import { Eye, Info } from 'lucide-react';

interface HeatmapCanvasProps {
  photoUrl: string;
  points: HeatmapPoint[];
  isPurgeLikely?: boolean;
}

export const HeatmapCanvas: React.FC<HeatmapCanvasProps> = ({
  photoUrl,
  points,
  isPurgeLikely = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'comedone' | 'inflammatory' | 'pore_texture'>('all');
  const [activeTooltip, setActiveTooltip] = useState<HeatmapPoint | null>(null);

  const filteredPoints = points.filter(p => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  return (
    <div className="relative rounded-3xl overflow-hidden border border-sage-200 bg-sage-50/50 shadow-md">
      {/* Top Filter Chips */}
      <div className="p-3 bg-white/90 backdrop-blur-sm border-b border-sage-100 flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              filter === 'all'
                ? 'bg-sage-700 text-white shadow-xs'
                : 'bg-sage-100 text-sage-800 hover:bg-sage-200'
            }`}
          >
            All Zones ({points.length})
          </button>
          <button
            onClick={() => setFilter('inflammatory')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1 ${
              filter === 'inflammatory'
                ? 'bg-coral text-white shadow-xs'
                : 'bg-coral-50 text-coral-600 hover:bg-coral-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" />
            Inflammatory Papules
          </button>
          <button
            onClick={() => setFilter('comedone')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1 ${
              filter === 'comedone'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Comedones
          </button>
        </div>
      </div>

      {/* Main Heatmap Visual Container */}
      <div className="relative w-full aspect-[4/5] bg-charcoal-900 overflow-hidden select-none">
        <img
          src={photoUrl}
          alt="Facial Heatmap Scan"
          className="w-full h-full object-cover"
        />

        {/* SVG Overlay for Coordinates */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <radialGradient id="purgeGlow">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#E11D48" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="comedoneGlow">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#D97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {filteredPoints.map((pt, idx) => {
            const isInflammatory = pt.type === 'inflammatory';
            const radius = pt.severity === 'dense' ? 18 : pt.severity === 'moderate' ? 14 : 10;
            return (
              <g key={pt.id || idx}>
                {/* Glow ring */}
                <circle
                  cx={`${pt.x}%`}
                  cy={`${pt.y}%`}
                  r={radius}
                  fill={isInflammatory ? 'url(#purgeGlow)' : 'url(#comedoneGlow)'}
                  className="animate-pulse"
                />
                {/* Center marker */}
                <circle
                  cx={`${pt.x}%`}
                  cy={`${pt.y}%`}
                  r={3.5}
                  fill={isInflammatory ? '#FFFFFF' : '#FFFFFF'}
                  stroke={isInflammatory ? '#E11D48' : '#D97706'}
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Pointer Click Area */}
        <div className="absolute inset-0 pointer-events-auto">
          {filteredPoints.map((pt, idx) => (
            <button
              key={pt.id || idx}
              onClick={() => setActiveTooltip(pt)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full focus:outline-none"
              aria-label={pt.label}
            />
          ))}
        </div>

        {/* Active Tooltip Popover */}
        {activeTooltip && (
          <div
            style={{
              left: `${Math.min(80, Math.max(20, activeTooltip.x))}%`,
              top: `${Math.min(80, Math.max(15, activeTooltip.y))}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full mb-3 z-20 bg-charcoal-900/95 text-white p-2.5 rounded-xl text-[11px] shadow-xl border border-white/20 max-w-[180px] backdrop-blur-md animate-fadeIn"
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span className={activeTooltip.type === 'inflammatory' ? 'text-coral-400' : 'text-amber-400'}>
                {activeTooltip.type === 'inflammatory' ? 'Inflammatory' : 'Comedone'}
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setActiveTooltip(null);
                }}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-white/80 leading-tight mb-1">{activeTooltip.label}</p>
            <div className="text-[10px] text-sage-300 font-medium">
              {isPurgeLikely
                ? 'Follicular turnover active: sebum clearing'
                : 'Pore canal resolving'}
            </div>
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-charcoal-900/80 backdrop-blur-md text-white text-[10px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-coral-500" />
              Active Blemish
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Trapped Sebum
            </span>
          </div>
          <span className="text-white/60">Tap markers for details</span>
        </div>
      </div>
    </div>
  );
};
