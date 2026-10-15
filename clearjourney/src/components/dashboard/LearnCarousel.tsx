import React, { useState } from 'react';
import { Card, Badge } from '../common/Card';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle, Droplet } from 'lucide-react';

export const LearnCarousel: React.FC = () => {
  const { setIsScentModalOpen, setIsFairChanceModalOpen } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 'patience-deficit',
      tag: 'Core Biology',
      tagVariant: 'coral' as const,
      title: 'The 3-Week Patience Deficit',
      subtitle: 'Why 74% of consumers quit before active ingredients work',
      body: 'Acne treatments require 6 to 12 weeks for full clinical cellular turnover. During weeks 1–3, follicular desquamation pushes trapped micro-comedones upward simultaneously. Mistaking this healthy purge for adverse breakout causes premature quitting.',
      cta: 'Explore Purge vs Breakout Shield',
      action: () => setIsFairChanceModalOpen(true),
    },
    {
      id: 'sensory-misconception',
      tag: 'Sensory Transparency',
      tagVariant: 'mint' as const,
      title: 'Why It Smells Medicated',
      subtitle: 'Zero perfume masking = 100% active acid purity',
      body: 'Commercial cleansers dump synthetic fragrance to mimic floral perfumes—the #1 cause of contact dermatitis in acne patients. Be Bodywise leaves 2.0% pure Salicylic Acid unmasked. That clean, clinical aroma confirms active potency.',
      cta: 'Decode The Aroma Science',
      action: () => setIsScentModalOpen(true),
    },
    {
      id: 'contact-time',
      tag: 'Application Rule',
      tagVariant: 'sage' as const,
      title: 'The 60-Second Contact Rule',
      subtitle: 'Why rinsing in 10 seconds washes money down the drain',
      body: 'Salicylic acid is lipophilic (oil-soluble). It requires at least 45 to 60 seconds of gentle friction to penetrate the lipid-rich sebaceous duct and dissolve intercellular desmosome glue.',
      cta: 'Launch 60s Timer',
      action: () => {},
    },
  ];

  return (
    <Card className="bg-white border-sage-100 shadow-clinical">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-extrabold text-sm text-charcoal-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sage-700" />
          Clinical Intelligence Briefings
        </h4>
        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeSlide === i ? 'w-5 bg-sage-800' : 'bg-sage-200'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant={slides[activeSlide].tagVariant} size="sm">
            {slides[activeSlide].tag}
          </Badge>
          <span className="text-[11px] font-semibold text-charcoal-500">
            Topic {activeSlide + 1} of {slides.length}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-charcoal-900 leading-tight mb-1">
          {slides[activeSlide].title}
        </h3>
        <p className="text-xs font-medium text-sage-800 mb-2">
          {slides[activeSlide].subtitle}
        </p>

        <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
          {slides[activeSlide].body}
        </p>

        <button
          onClick={slides[activeSlide].action}
          className="text-xs font-bold text-sage-800 hover:text-sage-900 flex items-center gap-1.5 transition-colors group"
        >
          <span>{slides[activeSlide].cta}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
};
