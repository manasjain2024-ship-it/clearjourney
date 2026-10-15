import React, { useState } from 'react';
import { ReviewItem } from '../../types';
import { Card, Badge } from '../common/Card';
import { Star, ThumbsUp, CheckCircle, Filter, Sparkles, MessageSquareQuote } from 'lucide-react';

const COMMUNITY_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Ananya S.',
    age: 23,
    skinType: 'Oily & Congested',
    startingConcern: 'Stubborn closed comedones on forehead & chin',
    phaseCategory: 'purge_phase',
    phaseTitle: 'The Purge Phase (Week 1–2)',
    weeksToClear: 3,
    rating: 5,
    reviewText:
      'I almost threw the bottle out on Day 10 because tiny whiteheads appeared everywhere! The app urged me to hold on for the 28-day turnover. By Day 18, all those tiny bumps disappeared and my forehead has literally never been smoother. Trust the purge!',
    verifiedBuyer: true,
    helpfulCount: 412,
    beforeAfterSummary: 'Comedones surfaced in week 2, completely flattened by week 3.',
    scentComment: 'Smelled like a sterile dermatology clinic at first; now I love it because I know there is zero fake perfume.',
  },
  {
    id: 'rev-2',
    author: 'Rohan M.',
    age: 26,
    skinType: 'Combination & Acne-Prone',
    startingConcern: 'Cystic cheek breakouts and 3pm oily shine',
    phaseCategory: 'turning_point',
    phaseTitle: 'The Turning Point (Week 3–4)',
    weeksToClear: 4,
    rating: 5,
    reviewText:
      'Week 3 is where the magic happened. The 60-second lather timer made all the difference—I used to wash my face in 5 seconds and wonder why cleansers never worked. Now my midday grease is 80% reduced and pores look tightened.',
    verifiedBuyer: true,
    helpfulCount: 289,
    beforeAfterSummary: 'Oil control locked in from week 3 onwards.',
    scentComment: 'Menthol cooling sensation is genuinely soothing after a long day in the heat.',
  },
  {
    id: 'rev-3',
    author: 'Priya K.',
    age: 28,
    skinType: 'Sensitive Acneic',
    startingConcern: 'Hormonal jawline papules and post-acne marks',
    phaseCategory: 'clear_repurchasing',
    phaseTitle: 'Clear & Repurchasing (Week 6+)',
    weeksToClear: 6,
    rating: 5,
    reviewText:
      'On my third bottle now! Be Bodywise 2% Salicylic Acid has replaced every expensive chemical exfoliant on my shelf. If you have sensitive skin, start with 3 nights a week and always follow with moisturizer. 12 weeks in and my barrier is solid.',
    verifiedBuyer: true,
    helpfulCount: 567,
    beforeAfterSummary: 'Zero active breakouts for 2 consecutive months.',
    scentComment: 'Unscented medicinal aroma is 100x better than fragranced washes that used to burn my eczema.',
  },
  {
    id: 'rev-4',
    author: 'Devansh T.',
    age: 21,
    skinType: 'Oily & Congested',
    startingConcern: 'Blackheads on nose and clogged pores',
    phaseCategory: 'purge_phase',
    phaseTitle: 'The Purge Phase (Week 1–2)',
    weeksToClear: 3,
    rating: 5,
    reviewText:
      'Day 8 I noticed bumps coming to a head faster than usual. The app explained this is accelerated desquamation. It prevented me from switching to another brand in a panic. Day 14 was the peak, then clear sailing.',
    verifiedBuyer: true,
    helpfulCount: 198,
    beforeAfterSummary: 'Blackheads extruded easily without manual squeezing.',
    scentComment: 'Clean, medicinal, unmasked active aroma.',
  },
  {
    id: 'rev-5',
    author: 'Meera V.',
    age: 25,
    skinType: 'Combination & Acne-Prone',
    startingConcern: 'Texture and recurring cheek pimples',
    phaseCategory: 'clear_repurchasing',
    phaseTitle: 'Clear & Repurchasing (Week 6+)',
    weeksToClear: 5,
    rating: 5,
    reviewText:
      'Best purchase ever. Completed the full 12-week ClearJourney track. The habit streak kept me consistent every single night. Even my dermatologist noticed the pore refinement.',
    verifiedBuyer: true,
    helpfulCount: 341,
    beforeAfterSummary: 'Pore texture refined by 90%.',
    scentComment: 'Zero artificial perfume is a blessing for inflamed skin.',
  },
];

export const ProofFeed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'purge_phase' | 'turning_point' | 'clear_repurchasing'>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const filteredReviews = COMMUNITY_REVIEWS.filter(rev => {
    if (activeFilter === 'all') return true;
    return rev.phaseCategory === activeFilter;
  });

  const toggleHelpful = (id: string, initialCount: number) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: prev[id] ? prev[id] - 1 : (initialCount + 1),
    }));
  };

  return (
    <div className="space-y-4 text-left">
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-sage-800 text-white shadow-clinical">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquareQuote className="w-5 h-5 text-amber-300" />
          <h3 className="font-extrabold text-base tracking-tight">
            Real Adherence & Proof Feed
          </h3>
        </div>
        <p className="text-xs text-sage-200 leading-relaxed">
          Unfiltered stories from verified Be Bodywise users who navigated the 3-week patience deficit to reach clinical clarity.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Experiences' },
          { id: 'purge_phase', label: 'The Purge Phase (Wk 1–2)' },
          { id: 'turning_point', label: 'The Turning Point (Wk 3–4)' },
          { id: 'clear_repurchasing', label: 'Clear & Repurchasing (Wk 6+)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition-all ${
              activeFilter === tab.id
                ? 'bg-sage-700 text-white shadow-xs'
                : 'bg-white text-charcoal-700 border border-sage-200 hover:bg-sage-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {filteredReviews.map(rev => {
          const currentHelpful = helpfulVotes[rev.id] || rev.helpfulCount;
          const isVoted = !!helpfulVotes[rev.id];

          return (
            <Card key={rev.id} className="bg-white border-sage-100 shadow-clinical space-y-3">
              {/* Author Info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-charcoal-900">{rev.author}</span>
                    <span className="text-[11px] text-charcoal-500">({rev.age} yrs)</span>
                    {rev.verifiedBuyer && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-600 inline" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-sage-800 font-medium mt-0.5">
                    {rev.skinType} • {rev.startingConcern}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-charcoal-700 leading-relaxed">
                "{rev.reviewText}"
              </p>

              {/* Scent & Efficacy Callout Box */}
              <div className="p-2.5 rounded-xl bg-sage-50/80 border border-sage-100 text-[11px] space-y-1">
                <div className="text-sage-900 font-bold flex items-center gap-1">
                  <span>🍃 Scent & Sensory Experience:</span>
                </div>
                <p className="text-charcoal-600 leading-snug">{rev.scentComment}</p>
              </div>

              {/* Footer details */}
              <div className="flex items-center justify-between pt-2 border-t border-sage-100/70 text-[11px]">
                <Badge variant={rev.phaseCategory === 'purge_phase' ? 'amber' : 'mint'} size="sm">
                  Visible Clearing in {rev.weeksToClear} Weeks
                </Badge>

                <button
                  onClick={() => toggleHelpful(rev.id, rev.helpfulCount)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                    isVoted
                      ? 'bg-sage-100 text-sage-900 border-sage-300 font-bold'
                      : 'border-sage-200 text-charcoal-500 hover:text-charcoal-800'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${isVoted ? 'text-sage-800 fill-sage-700' : ''}`} />
                  <span>Helpful ({currentHelpful})</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
