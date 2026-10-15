import { ScanRecord, HabitStreak, SensoryFeedback } from '../types';
import { saveScan, clearAllScans } from './db';

/**
 * Creates high-fidelity SVG face representations for each milestone
 * showing gradual clearance of blemishes and skin tone evening
 */
function createSyntheticFaceSvg(stage: 'baseline' | 'week1' | 'week2' | 'week3' | 'week6' | 'week12', angle: 'front' | 'left' | 'right' = 'front'): string {
  // Config per stage
  let skinBase = '#F4E7DF';
  let cheekFlush = 'rgba(235, 130, 130, 0.28)';
  let blemishes: Array<{ cx: number; cy: number; r: number; fill: string; stroke?: string }> = [];

  if (stage === 'baseline') {
    // Dull tone, multiple comedones and inflamed bumps
    skinBase = '#EEDCD2';
    cheekFlush = 'rgba(225, 110, 110, 0.42)';
    blemishes = [
      { cx: 100, cy: 90, r: 4, fill: '#E11D48', stroke: '#BE123C' },
      { cx: 120, cy: 96, r: 3.5, fill: '#D97706' },
      { cx: 80, cy: 94, r: 3, fill: '#D97706' },
      { cx: 68, cy: 135, r: 4.5, fill: '#E11D48' },
      { cx: 76, cy: 145, r: 3, fill: '#D97706' },
      { cx: 132, cy: 138, r: 4, fill: '#E11D48' },
      { cx: 124, cy: 150, r: 3, fill: '#D97706' },
      { cx: 100, cy: 180, r: 4.5, fill: '#E11D48' },
      { cx: 94, cy: 188, r: 3, fill: '#D97706' },
      { cx: 106, cy: 190, r: 3, fill: '#D97706' },
    ];
  } else if (stage === 'week1') {
    skinBase = '#F0DFD5';
    cheekFlush = 'rgba(230, 120, 120, 0.4)';
    blemishes = [
      { cx: 98, cy: 88, r: 4.5, fill: '#E11D48' },
      { cx: 122, cy: 92, r: 3.5, fill: '#E11D48' },
      { cx: 78, cy: 98, r: 3, fill: '#D97706' },
      { cx: 66, cy: 132, r: 5, fill: '#E11D48' },
      { cx: 74, cy: 142, r: 4, fill: '#E11D48' },
      { cx: 134, cy: 135, r: 4.5, fill: '#E11D48' },
      { cx: 126, cy: 146, r: 3.5, fill: '#D97706' },
      { cx: 100, cy: 178, r: 5, fill: '#E11D48' },
      { cx: 104, cy: 188, r: 3.5, fill: '#E11D48' },
    ];
  } else if (stage === 'week2') {
    // Peak Purge: More active surface pustules/papules as trapped sebum is purged
    skinBase = '#F2E2D8';
    cheekFlush = 'rgba(235, 120, 120, 0.45)';
    blemishes = [
      { cx: 95, cy: 86, r: 5, fill: '#E11D48' },
      { cx: 110, cy: 90, r: 4, fill: '#E11D48' },
      { cx: 68, cy: 130, r: 5.5, fill: '#E11D48' },
      { cx: 78, cy: 140, r: 4, fill: '#E11D48' },
      { cx: 132, cy: 132, r: 5, fill: '#E11D48' },
      { cx: 100, cy: 176, r: 5, fill: '#E11D48' },
      { cx: 108, cy: 185, r: 4, fill: '#E11D48' },
    ];
  } else if (stage === 'week3') {
    // Turning point: Calm, redness fading, bumps significantly reduced
    skinBase = '#F6EAE2';
    cheekFlush = 'rgba(230, 150, 150, 0.22)';
    blemishes = [
      { cx: 70, cy: 135, r: 3, fill: '#F43F5E', stroke: '#FDA4AF' },
      { cx: 130, cy: 136, r: 2.5, fill: '#F43F5E' },
      { cx: 100, cy: 180, r: 2.5, fill: '#F59E0B' },
      { cx: 102, cy: 90, r: 2, fill: '#F59E0B' },
    ];
  } else if (stage === 'week6') {
    // Significant clear
    skinBase = '#FAF0EB';
    cheekFlush = 'rgba(240, 170, 170, 0.18)';
    blemishes = [
      { cx: 72, cy: 136, r: 2, fill: '#FDA4AF' },
      { cx: 100, cy: 182, r: 1.5, fill: '#FDA4AF' },
    ];
  } else {
    // Week 12: Radiant, healthy glowing barrier, 0-1 tiny resolving mark
    skinBase = '#FCF4F0';
    cheekFlush = 'rgba(242, 180, 180, 0.14)';
    blemishes = [{ cx: 100, cy: 182, r: 1.2, fill: '#FBCFE8' }];
  }

  const blemishElements = blemishes
    .map(
      b =>
        `<circle cx="${b.cx}" cy="${b.cy}" r="${b.r}" fill="${b.fill}" ${
          b.stroke ? `stroke="${b.stroke}" stroke-width="1"` : ''
        } opacity="0.92" filter="url(#glow)"/>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="100%" height="100%">
    <defs>
      <radialGradient id="skinGrad" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#FFF8F4"/>
        <stop offset="60%" stop-color="${skinBase}"/>
        <stop offset="100%" stop-color="#E2C7B8"/>
      </radialGradient>
      <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${cheekFlush}"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <!-- Background backdrop -->
    <rect width="200" height="240" rx="16" fill="#F3F6F4"/>
    
    <!-- Neck -->
    <path d="M 82 170 L 82 225 C 82 230 118 230 118 225 L 118 170 Z" fill="#E2C7B8"/>
    
    <!-- Face Silhouette -->
    <path d="M 100 24 C 54 24 44 65 44 115 C 44 165 72 210 100 210 C 128 210 156 165 156 115 C 156 65 146 24 100 24 Z" fill="url(#skinGrad)" stroke="#D4B6A6" stroke-width="1.2"/>
    
    <!-- Hairline subtle cap -->
    <path d="M 52 70 C 60 40 100 32 148 70 C 144 44 126 30 100 30 C 74 30 56 44 52 70 Z" fill="#4B382A" opacity="0.8"/>
    
    <!-- Eyebrows -->
    <path d="M 68 84 Q 82 78 94 83" stroke="#5C4533" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M 132 84 Q 118 78 106 83" stroke="#5C4533" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    
    <!-- Eyes -->
    <ellipse cx="80" cy="98" rx="6.5" ry="4" fill="#3D2B1F"/>
    <circle cx="78" cy="97" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="120" cy="98" rx="6.5" ry="4" fill="#3D2B1F"/>
    <circle cx="118" cy="97" r="1.5" fill="#FFFFFF"/>
    
    <!-- Nose bridge & tip -->
    <path d="M 100 95 L 98 126 Q 100 132 104 126" stroke="#C9A897" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="130" rx="3.5" ry="2" fill="#BA9684" opacity="0.6"/>
    
    <!-- Cheek glow patches -->
    <ellipse cx="72" cy="138" rx="20" ry="16" fill="url(#cheekGlow)"/>
    <ellipse cx="128" cy="138" rx="20" ry="16" fill="url(#cheekGlow)"/>
    
    <!-- Lips -->
    <path d="M 88 160 Q 100 156 112 160 Q 100 170 88 160 Z" fill="#D4827A" opacity="0.85"/>
    
    <!-- Rendered Blemishes / Purge Heatmap Elements -->
    ${blemishElements}
    
    <!-- Clinical Grid Overlay lines (subtle) -->
    <circle cx="100" cy="120" r="70" stroke="#2E5A44" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.25" fill="none"/>
    <line x1="100" y1="30" x2="100" y2="210" stroke="#2E5A44" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.2"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEMO_SCANS: ScanRecord[] = [
  {
    id: 'demo-scan-1',
    dayNumber: 0,
    dateString: 'Day 0 • Baseline Intake',
    timestamp: Date.now() - 84 * 86400000,
    isSampleData: true,
    photoUrl: createSyntheticFaceSvg('baseline', 'front'),
    angles: {
      front: createSyntheticFaceSvg('baseline', 'front'),
      left: createSyntheticFaceSvg('baseline', 'left'),
      right: createSyntheticFaceSvg('baseline', 'right'),
    },
    metrics: {
      sebumControlPercentage: 35,
      inflammatoryLesionCount: 16,
      comedoneCount: 34,
      barrierHydrationScore: 62,
      poreRefinementScore: 40,
    },
    heatmapPoints: [
      { id: 'p1', x: 50, y: 38, type: 'inflammatory', severity: 'moderate', label: 'Forehead Papule' },
      { id: 'p2', x: 38, y: 58, type: 'comedone', severity: 'dense', label: 'Cheek Congestion' },
      { id: 'p3', x: 64, y: 56, type: 'inflammatory', severity: 'moderate', label: 'Right Cheek Lesion' },
      { id: 'p4', x: 50, y: 78, type: 'inflammatory', severity: 'moderate', label: 'Perioral Breakout' },
    ],
    classification: {
      isPurgeLikely: false,
      title: 'Baseline Congestion Profile',
      explanation: 'Stratum corneum presents high sebum impaction with trapped sub-surface microcomedones.',
      stage: 'acclimation',
    },
    adaptiveFrequency: {
      recommendedWeeklyPMFrequency: 3,
      currentStage: 'Acclimation (Week 1)',
      actionableAdvisory: 'Start slow: 3 nights PM only. Lather in palms for 60 seconds. Follow immediately with non-comedogenic hydration.',
      cautionNotes: ['Do not use harsh physical scrubs.', 'Avoid mixing with strong retinoids on same night.'],
    },
    smellRating: 2,
    userNotes: 'Scent was distinctly medicinal/unperfumed. Felt very fresh and cooling.',
  },
  {
    id: 'demo-scan-2',
    dayNumber: 7,
    dateString: 'Day 7 • Week 1 Follicular Awakening',
    timestamp: Date.now() - 77 * 86400000,
    isSampleData: true,
    photoUrl: createSyntheticFaceSvg('week1', 'front'),
    angles: {
      front: createSyntheticFaceSvg('week1', 'front'),
      left: createSyntheticFaceSvg('week1', 'left'),
      right: createSyntheticFaceSvg('week1', 'right'),
    },
    metrics: {
      sebumControlPercentage: 48,
      inflammatoryLesionCount: 19, // Notice slight rise: purging!
      comedoneCount: 28,
      barrierHydrationScore: 64,
      poreRefinementScore: 46,
    },
    heatmapPoints: [
      { id: 'p1', x: 49, y: 36, type: 'inflammatory', severity: 'moderate', label: 'Accelerated Follicle' },
      { id: 'p2', x: 37, y: 56, type: 'inflammatory', severity: 'moderate', label: 'Deep Sebum Surfacing' },
      { id: 'p3', x: 67, y: 57, type: 'comedone', severity: 'mild', label: 'Loose Keratin Plug' },
      { id: 'p4', x: 50, y: 76, type: 'inflammatory', severity: 'moderate', label: 'Pore Turnover Zone' },
    ],
    classification: {
      isPurgeLikely: true,
      title: 'Early Purge Detected (Healthy Efficacy)',
      explanation: 'Slight bump increase detected in pre-existing congestion zones. Salicylic acid is pushing deep plugs to the surface.',
      stage: 'peak_purge',
    },
    adaptiveFrequency: {
      recommendedWeeklyPMFrequency: 4,
      currentStage: 'Purge Management (Week 1-2)',
      actionableAdvisory: 'Maintain 4x weekly PM usage. Do NOT abandon routine; this temporary bump rise confirms active desmolysis.',
      cautionNotes: ['The medicinal scent confirms zero synthetic masking perfumes.', 'Resist the urge to extract blemishes.'],
    },
    smellRating: 3,
    userNotes: 'More bumps on forehead, but app explained it is follicular turnover. Continuing faithfully.',
  },
  {
    id: 'demo-scan-3',
    dayNumber: 14,
    dateString: 'Day 14 • The Critical Patience Deficit Zone',
    timestamp: Date.now() - 70 * 86400000,
    isSampleData: true,
    photoUrl: createSyntheticFaceSvg('week2', 'front'),
    angles: {
      front: createSyntheticFaceSvg('week2', 'front'),
      left: createSyntheticFaceSvg('week2', 'left'),
      right: createSyntheticFaceSvg('week2', 'right'),
    },
    metrics: {
      sebumControlPercentage: 62,
      inflammatoryLesionCount: 22, // Peak purge
      comedoneCount: 19,
      barrierHydrationScore: 66,
      poreRefinementScore: 52,
    },
    heatmapPoints: [
      { id: 'p1', x: 48, y: 35, type: 'inflammatory', severity: 'dense', label: 'Purging Zone' },
      { id: 'p2', x: 36, y: 55, type: 'inflammatory', severity: 'moderate', label: 'Follicular Evacuation' },
      { id: 'p3', x: 66, y: 55, type: 'inflammatory', severity: 'moderate', label: 'Blemish Maturing' },
    ],
    classification: {
      isPurgeLikely: true,
      title: 'Peak Follicular Purge (Hold The Line!)',
      explanation: '74% of consumers quit during Week 2-3 mistaking purging for failure. You are clearing 30 days of underlying debris right now.',
      stage: 'peak_purge',
    },
    adaptiveFrequency: {
      recommendedWeeklyPMFrequency: 4,
      currentStage: 'Patience Shield Phase (Day 14)',
      actionableAdvisory: 'Stay steady! Your cell cycle turnover will cross into the clearing phase in approximately 7-10 days.',
      cautionNotes: ['Focus 60-second lather specifically on oily T-zone.', 'Menthol cooling eases inflammation.'],
    },
    smellRating: 4,
    userNotes: 'Scent now smells like clinical reassurance. Trusting the 28-day turnover clock.',
  },
  {
    id: 'demo-scan-4',
    dayNumber: 21,
    dateString: 'Day 21 • The Turning Point Milestone',
    timestamp: Date.now() - 63 * 86400000,
    isSampleData: true,
    photoUrl: createSyntheticFaceSvg('week3', 'front'),
    angles: {
      front: createSyntheticFaceSvg('week3', 'front'),
      left: createSyntheticFaceSvg('week3', 'left'),
      right: createSyntheticFaceSvg('week3', 'right'),
    },
    metrics: {
      sebumControlPercentage: 76,
      inflammatoryLesionCount: 11, // Plunge from 22 down to 11
      comedoneCount: 12,
      barrierHydrationScore: 74,
      poreRefinementScore: 68,
    },
    heatmapPoints: [
      { id: 'p1', x: 38, y: 56, type: 'pore_texture', severity: 'mild', label: 'Fading Erythema' },
      { id: 'p2', x: 65, y: 57, type: 'comedone', severity: 'mild', label: 'Minimal Surface Plug' },
    ],
    classification: {
      isPurgeLikely: false,
      title: 'The Turning Point Achieved!',
      explanation: 'Purging has officially ceased. New bumps dropping precipitously as pore pathways remain unobstructed.',
      stage: 'turning_point',
    },
    adaptiveFrequency: {
      recommendedWeeklyPMFrequency: 5,
      currentStage: 'Rapid Clearance Phase',
      actionableAdvisory: 'Increase to 5-6 nights PM. Pores are tighter, shine is controlled for up to 8 hours post-cleanse.',
      cautionNotes: ['Always wear SPF 50 daily to prevent post-inflammatory hyperpigmentation.'],
    },
    smellRating: 4,
    userNotes: 'Massive turnaround! Red bumps cleared in 4 days. Face feels so smooth.',
  },
  {
    id: 'demo-scan-5',
    dayNumber: 42,
    dateString: 'Day 42 • Week 6 Sustained Clarity',
    timestamp: Date.now() - 42 * 86400000,
    isSampleData: true,
    photoUrl: createSyntheticFaceSvg('week6', 'front'),
    angles: {
      front: createSyntheticFaceSvg('week6', 'front'),
      left: createSyntheticFaceSvg('week6', 'left'),
      right: createSyntheticFaceSvg('week6', 'right'),
    },
    metrics: {
      sebumControlPercentage: 86,
      inflammatoryLesionCount: 4,
      comedoneCount: 6,
      barrierHydrationScore: 82,
      poreRefinementScore: 84,
    },
    heatmapPoints: [
      { id: 'p1', x: 39, y: 57, type: 'pore_texture', severity: 'mild', label: 'Refined Texture' },
      { id: 'p2', x: 50, y: 78, type: 'pore_texture', severity: 'mild', label: 'Clear Chin Line' },
    ],
    classification: {
      isPurgeLikely: false,
      title: 'Deep Follicular Clarity',
      explanation: 'Over 75% reduction in active inflammatory spots compared to baseline. Skin barrier is resilient.',
      stage: 'clinical_clear',
    },
    adaptiveFrequency: {
      recommendedWeeklyPMFrequency: 6,
      currentStage: 'Prophylactic Maintenance',
      actionableAdvisory: 'Use daily or 6 nights weekly. You have achieved cellular homeostasis.',
      cautionNotes: ['Continue morning SPF 50 discipline.'],
    },
    smellRating: 5,
    userNotes: 'Skin has never looked this clear. Friends asking what my routine is.',
  },
  {
    id: 'demo-scan-6',
    dayNumber: 84,
    dateString: 'Day 84 • Week 12 Clinical Barrier Champion',
    timestamp: Date.now(),
    isSampleData: true,
    photoUrl: createSyntheticFaceSvg('week12', 'front'),
    angles: {
      front: createSyntheticFaceSvg('week12', 'front'),
      left: createSyntheticFaceSvg('week12', 'left'),
      right: createSyntheticFaceSvg('week12', 'right'),
    },
    metrics: {
      sebumControlPercentage: 94,
      inflammatoryLesionCount: 1,
      comedoneCount: 2,
      barrierHydrationScore: 90,
      poreRefinementScore: 95,
    },
    heatmapPoints: [
      { id: 'p1', x: 50, y: 78, type: 'pore_texture', severity: 'mild', label: 'Refined Micro-Pore' },
    ],
    classification: {
      isPurgeLikely: false,
      title: 'Clinical Equilibrium & Barrier Mastery',
      explanation: 'Complete 3-cycle cellular turnover achieved. Sebaceous lipid barrier is balanced with 94% sebum control.',
      stage: 'clinical_clear',
    },
    adaptiveFrequency: {
      recommendedWeeklyPMFrequency: 7,
      currentStage: 'Equilibrium Care',
      actionableAdvisory: 'Maintain your 60-second PM wash ritual for continuous preventative maintenance.',
      cautionNotes: ['Milestone Unlocked: Clear Skin Barrier Champion.'],
    },
    smellRating: 5,
    userNotes: '100% repurchased bottle 2! The medicinal scent is now my favorite part of the evening.',
  },
];

export async function hydrateDemoState(): Promise<{
  scans: ScanRecord[];
  streak: HabitStreak;
  sensoryFeedback: SensoryFeedback[];
}> {
  await clearAllScans();

  for (const scan of DEMO_SCANS) {
    await saveScan(scan);
  }

  const demoStreak: HabitStreak = {
    currentStreak: 42,
    longestStreak: 42,
    lastCompletedDate: new Date().toISOString().split('T')[0],
    totalLogsCount: 84,
    milestonesUnlocked: [
      'milestone-day-3',
      'milestone-day-14',
      'milestone-day-21',
      'milestone-day-28',
      'milestone-day-84',
    ],
  };

  const demoSensory: SensoryFeedback[] = [
    { date: 'Day 0', scentAcceptanceScore: 2, coolingSensationScore: 4, textureFeel: 'clean', perceivedMedicinalNote: true },
    { date: 'Day 7', scentAcceptanceScore: 3, coolingSensationScore: 4, textureFeel: 'slight_tingle', perceivedMedicinalNote: true },
    { date: 'Day 14', scentAcceptanceScore: 4, coolingSensationScore: 5, textureFeel: 'clean', perceivedMedicinalNote: true },
    { date: 'Day 21', scentAcceptanceScore: 4, coolingSensationScore: 5, textureFeel: 'hydrated', perceivedMedicinalNote: false },
    { date: 'Day 42', scentAcceptanceScore: 5, coolingSensationScore: 5, textureFeel: 'hydrated', perceivedMedicinalNote: false },
    { date: 'Day 84', scentAcceptanceScore: 5, coolingSensationScore: 5, textureFeel: 'hydrated', perceivedMedicinalNote: false },
  ];

  localStorage.setItem('clearjourney_demo_active', 'true');
  localStorage.setItem('clearjourney_streak', JSON.stringify(demoStreak));
  localStorage.setItem('clearjourney_sensory', JSON.stringify(demoSensory));
  localStorage.setItem('clearjourney_day', '84');

  return {
    scans: DEMO_SCANS,
    streak: demoStreak,
    sensoryFeedback: demoSensory,
  };
}
