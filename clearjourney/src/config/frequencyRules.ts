export interface StepLadderStage {
  minDay: number;
  maxDay: number;
  stageName: string;
  recommendedNightsPerWeek: number;
  regimeGuideline: string;
  clinicalRationale: string;
  barrierTip: string;
  purgingRisk: 'high' | 'moderate' | 'low';
}

export const DERMATOLOGIST_STEP_LADDER_RULES: StepLadderStage[] = [
  {
    minDay: 1,
    maxDay: 7,
    stageName: 'Phase 1: Acclimation & Patch Habituation',
    recommendedNightsPerWeek: 3,
    regimeGuideline: 'Every other night (PM only). Leave on skin for exactly 60 seconds.',
    clinicalRationale: 'Allows the lipid bilayer of your epidermis to adapt to the 2.0% beta-hydroxy acid concentration without acute irritation.',
    barrierTip: 'Apply lightweight hyaluronic or ceramide moisturizer directly to damp skin afterwards.',
    purgingRisk: 'moderate',
  },
  {
    minDay: 8,
    maxDay: 21,
    stageName: 'Phase 2: Follicular Turnover ("The 3-Week Patience Deficit")',
    recommendedNightsPerWeek: 4,
    regimeGuideline: '4 to 5 nights weekly (PM only). Never exceed 1 application per 24 hours.',
    clinicalRationale: 'Salicylic acid is clearing micro-comedones that were already trapped 30 days under the dermis. New bumps are accelerated follicular turnover, not a product rejection.',
    barrierTip: 'Do NOT pick or scrub. The medicinal aroma confirms 100% unmasked active acid doing heavy lifting.',
    purgingRisk: 'high',
  },
  {
    minDay: 22,
    maxDay: 42,
    stageName: 'Phase 3: The Turning Point & Comedolytic Resolution',
    recommendedNightsPerWeek: 6,
    regimeGuideline: '6 nights weekly to daily PM use.',
    clinicalRationale: 'Purging subsides as pre-existing follicular impactions are resolved. Cellular renewal speed now matches sebum evacuation.',
    barrierTip: 'Observe pore refinement and reduced mid-day oil slicking.',
    purgingRisk: 'low',
  },
  {
    minDay: 43,
    maxDay: 999,
    stageName: 'Phase 4: Prophylactic Equilibrium & Barrier Defense',
    recommendedNightsPerWeek: 7,
    regimeGuideline: 'Daily PM use or alternate PM maintenance depending on season and oiliness.',
    clinicalRationale: 'Continuous low-level desquamation prevents future micro-plugs from ever forming into inflammatory lesions.',
    barrierTip: 'Daily broad-spectrum SPF 50 every single morning is mandatory to protect freshly revealed cells.',
    purgingRisk: 'low',
  },
];

export function getRecommendedStage(day: number): StepLadderStage {
  const found = DERMATOLOGIST_STEP_LADDER_RULES.find(r => day >= r.minDay && day <= r.maxDay);
  return found || DERMATOLOGIST_STEP_LADDER_RULES[DERMATOLOGIST_STEP_LADDER_RULES.length - 1];
}
