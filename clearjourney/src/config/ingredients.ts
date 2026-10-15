import { IngredientClashItem } from '../types';

export interface FormulationHighlight {
  name: string;
  percentage?: string;
  role: string;
  sensoryOrClinicalNote: string;
}

export const BODYWISE_SALICYLIC_FORMULATION: FormulationHighlight[] = [
  {
    name: 'Salicylic Acid (Beta Hydroxy Acid)',
    percentage: '2.0% W/W',
    role: 'Oil-Soluble Exfoliant & Keratolytic',
    sensoryOrClinicalNote: 'Deeply penetrates lipid-rich sebum inside pores to dissolve intercellular cement. Produces the characteristic clean, medicinal aroma.',
  },
  {
    name: 'Menthol & Peppermint Distillate',
    percentage: '0.15%',
    role: 'Cooling Counter-Irritant & Micro-Circulation',
    sensoryOrClinicalNote: 'Activates TRPM8 cold-sensing receptors on facial skin, soothing inflammatory heat and calming cystic throb without harsh chemical anesthetics.',
  },
  {
    name: 'Mild Amino Acid Surfactant Base',
    percentage: 'Synergistic Complex',
    role: 'Gentle Micellar Cleansing',
    sensoryOrClinicalNote: 'Free from harsh SLS/SLES sulfates. Lathers cleanly while respecting the stratum corneum lipid bilayer.',
  },
  {
    name: 'Glycerin & Allantoin',
    percentage: 'Moisture Barrier Support',
    role: 'Osmoprotective Humectants',
    sensoryOrClinicalNote: 'Binds moisture to the upper layers of the epidermis to prevent the tight, stripped squeaky feeling common with cheap acne washes.',
  },
  {
    name: '0.00% Synthetic Perfumes / Phthalates',
    percentage: '0.0%',
    role: 'Hypoallergenic Purity Standard',
    sensoryOrClinicalNote: 'Artificial fragrances are the #1 trigger for allergic contact dermatitis in acne patients. We intentionally left it 100% fragrance-free.',
  },
];

export const SENSORY_EDUCATION_FACTS = [
  {
    title: 'Why It Smells Medicated',
    subtitle: 'The Scent of Pure Clinical Potency',
    body: 'Commercial cleansers mask active ingredients behind synthetic perfume cocktails that irritate sensitive acne lesions. Be Bodywise leaves 2% Salicylic Acid unmasked. That brisk, sterile, medicinal note is proof that active, clinical-strength BHA is working on your sebum.',
    badge: 'Zero Synthetic Fragrance',
  },
  {
    title: 'The Menthol Sensation',
    subtitle: 'Micro-Vascular Soothing, Not Irritation',
    body: 'The gentle cooling sensation you feel during the 60-second lather activates natural cold receptors in your skin. This induces vasoconstriction, which visibly calms red, angry papules within minutes of washing.',
    badge: 'Anti-Inflammatory Cool',
  },
  {
    title: 'The 60-Second Contact Rule',
    subtitle: 'Why 10-Second Washing Fails',
    body: 'Salicylic acid is lipophilic (oil-soluble). It needs 45 to 60 seconds of gentle friction to dissolve hardened sebum and penetrate the sebaceous duct. Rinsing too fast washes the active ingredient down the drain before it can act.',
    badge: 'Clinical Contact Time',
  },
];

export const INGREDIENT_COMPATIBILITY_DATABASE: Record<string, IngredientClashItem> = {
  benzoyl_peroxide: {
    name: 'Benzoyl Peroxide (2.5% - 5%)',
    category: 'Antimicrobial / Oxidizing Agent',
    safetyTier: 'danger',
    advice: 'High risk of barrier collapse and severe flaking if used in the same wash session.',
    bufferInstructions: 'Alternate days, or use Be Bodywise Salicylic wash PM, and leave Benzoyl Peroxide spot treatment for AM after SPF.',
  },
  retinol_tretinoin: {
    name: 'Retinol / Retinoids / Tretinoin',
    category: 'Vitamin A Cellular Regulator',
    safetyTier: 'caution',
    advice: 'Using BHA wash immediately before a strong retinoid can spike retinization stinging.',
    bufferInstructions: 'On Retinoid nights, use a gentle hydrating cleanser. On alternate nights, use your Be Bodywise 2% Salicylic wash.',
  },
  glycolic_lactic_aha: {
    name: 'Glycolic / Lactic Acid (AHA 7%+)',
    category: 'Water-Soluble Exfoliant',
    safetyTier: 'caution',
    advice: 'Double acid exposure can compromise the lipid barrier and cause trans-epidermal water loss.',
    bufferInstructions: 'Limit AHA to once weekly chemical peel on a night when you skip Salicylic Acid.',
  },
  niacinamide: {
    name: 'Niacinamide (Vitamin B3 2% - 5%)',
    category: 'Barrier Lipid Booster & Sebum Balancer',
    safetyTier: 'safe',
    advice: 'Excellent synergy! Niacinamide strengthens ceramide synthesis while BHA cleanses the pore canal.',
    bufferInstructions: 'Apply Niacinamide serum 5 minutes after patting dry from your 60-second salicylic cleanse.',
  },
  hyaluronic_acid: {
    name: 'Hyaluronic Acid & Ceramides',
    category: 'Barrier Hydration Complex',
    safetyTier: 'safe',
    advice: 'Mandatory clinical best practice. Halts compensatory sebum rebound.',
    bufferInstructions: 'Apply immediately to damp skin after rinsing to lock in essential water hydration.',
  },
  vitamin_c: {
    name: 'L-Ascorbic Acid (Vitamin C)',
    category: 'Antioxidant & Brightener',
    safetyTier: 'safe',
    advice: 'Best split by time of day: Vitamin C in AM, Salicylic wash in PM.',
    bufferInstructions: 'Use Vitamin C serum in the morning under SPF 50; use 2% Salicylic Acid in your evening PM shower/wash.',
  },
};
