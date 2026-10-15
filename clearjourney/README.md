# ClearJourney • Be Bodywise (2% Salicylic Acid Face Wash)

> **A Mobile-First Progressive Web App (PWA) & Clinical Adherence Companion designed for Be Bodywise (a Mosaic Wellness brand).**

---

## 1. Mission & Behavioral Skincare Philosophy

Skincare churn in acne treatments is overwhelmingly driven by **two human behavioral failure modes**, not formula inefficacy:

1. **"The 3-Week Patience Deficit"**: Clinical cellular turnover takes 6 to 12 weeks for full keratolytic homeostasis. However, users frequently quit between **Days 10 and 18** during the early follicular purging phase, mistaking accelerated microcomedone desquamation for adverse breakouts.
2. **"The Sensory Misconception"**: Commercial cleansers mask harsh surfactants with artificial perfumes that disrupt the acid mantle. Users encountering the natural, unperfumed, medicinal aroma of pure 2% Salicylic Acid mistake it for a harsh or unrefined formula.

**ClearJourney** solves this through objective AI visual analysis, localized biometric tracking, sensory education, and habit gamification. It is **not** an acute medical diagnostic tool; it is an empathetic, science-based behavioral adherence companion.

---

## 2. Brand Visual Design & Theme

- **Brand Aesthetic**: Clean, clinical, and premium wellness.
- **Palette**:
  - **Sage Green**: `#2E5A44` (Primary brand tone) / `#E8F0EC` (Soft mint tint)
  - **Soft Mint**: `#E8F0EC` / `#D1E6DC`
  - **Off-White**: `#FBFBF9` (Clean background)
  - **Charcoal Text**: `#1F2937`
  - **Alert Amber**: `#D97706` (Purge phase flags)
  - **Clinical Coral**: `#E11D48` (Inflammatory markers)
- **Viewport**: Mobile-first architecture (max-width `max-w-md` centered on desktop displays with responsive touch margins).
- **Accessibility**: Generous tap targets (minimum 48px), 16px base font size to prevent iOS auto-zoom, and smooth micro-animations.

---

## 3. Core Functional Modules

### Module A: AI Skin Progress & Purge Predictor
- **Photo Intake Simulator & Guided Camera**:
  - Frontal, Left Cheek, and Right Cheek capture views.
  - Interactive Date Selector (`Day 0`, `Day 7`, `Day 14`, `Day 21`, `Day 42`, `Day 84`).
  - Client-side exposure and blur quality validation.
- **AI Diagnostic Engine**:
  - **Active Blemish & Congestion Heatmap**: SVG & Canvas overlay marking comedones (amber) vs. inflammatory papules (coral).
  - **Quantitative Metric Bars**: Sebum Control (%), Inflammatory Lesion Count, Stratum Corneum Hydration Index, and Pore Refinement score.
  - **Purge vs. Breakout AI Classifier**: Informs the user whether bumps are typical 2% Salicylic Acid follicular turnover or contact irritation.
  - **Adaptive Care Advisory**: Recommends usage frequency dynamically (`Day 1–14: 3x/week PM only` $\rightarrow$ `Day 21+: 5–6x/week PM` $\rightarrow$ `Day 28+: Daily PM maintenance`).
- **Interactive "Before & After" Split-Slider**:
  - Compares Day 0 Baseline against Current / Day 28 with micro-progress markers (pore canal smoothing, sebum reduction).

### Module B: "Why It Smells Medicated" Science Lab & Sensory Onboarding
- **Sensory Transparency Card**:
  - **Zero Synthetic Perfume**: Explains why artificial fragrances trigger contact dermatitis on acneic skin.
  - **Pure BHA Medicinal Aroma**: The unmasked scent confirming 2.0% pure active acid without filler chemicals.
  - **Menthol Cooling Gauge**: Explains TRPM8 cold-sensing receptor activation and micro-vascular vasoconstriction to reduce redness.
- **Active Routine Compatibility Engine (Cocktail Clash Checker)**:
  - Warns against simultaneous pairing with Benzoyl Peroxide or Retinoids without buffer nights.
  - **"Moisture Lock" Rule**: Reminds oily skin users to follow with an oil-free moisturizer to stop compensatory sebum rebound.

### Module C: Daily Wellness & Routine Hub
- **Checklist**:
  - `AM Cleanse & SPF 50 Shield`
  - `PM 2% Salicylic Cleanse (60-second rule)`
- **60-Second Lather Timer**:
  - Circular animated countdown timer with 4-phase micro-guidance (Emulsification $\rightarrow$ T-Zone Massage $\rightarrow$ Active Penetration $\rightarrow$ Cryo Rinse).
  - Built-in Web Audio API synthesizer for clinical chimes and confetti celebration.
- **Habit Streak & Milestone Tracker**:
  - Unlocked milestones: `Acclimation Pioneer (Day 3)`, `Cellular Turnover Cadet (Day 14)`, `Patience Pioneer (Day 21)`, `Cell Cycle Hero (Day 28)`, `Clear Skin Barrier Champion (Day 84)`.

### Module D: Real Feedback & Proof Feed
- Filterable community feed categorised into:
  - `The Purge Phase (Week 1–2)`
  - `The Turning Point (Week 3–4)`
  - `Clear & Repurchasing (Week 6+)`

---

## 4. File & Folder Structure

```text
clearjourney/
├── public/
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json          # PWA Web App Manifest
│   └── sw.js                  # PWA Service Worker for offline logs & content
├── api/
│   └── analyze.ts             # Serverless function calling Google Gemini 1.5 API
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/            # Button, Card, Modal, Badge, ProgressBar, Toast
│   │   ├── layout/            # BottomNav, TopHeader, DisclaimerFooter, DemoBanner
│   │   ├── camera/            # GuidedCamera, FaceGuideOverlay, QualityChecker
│   │   ├── dashboard/         # JourneyRing, MilestoneCard, HabitStreak, LearnCarousel
│   │   ├── routine/           # LatherTimerModal, ChecklistItem, AudioChime
│   │   ├── analysis/          # BeforeAfterSlider, MetricsRadar, HeatmapCanvas, TrendChart
│   │   ├── diary/             # QuickLogModal, FactorPill, PatternCard
│   │   ├── reviews/           # ProofFeed
│   │   ├── science/           # ScienceLab
│   │   └── switch-shield/     # RetentionWizard, FairChanceModal, ScentModal
│   ├── config/
│   │   ├── frequencyRules.ts   # Dermatologist usage step-ladder rules
│   │   └── ingredients.ts      # Be Bodywise 2% BHA formulation data & clash rules
│   ├── context/
│   │   └── AppContext.tsx     # Global State & IndexedDB sync
│   ├── hooks/
│   │   ├── useCamera.ts
│   │   ├── useIndexedDB.ts
│   │   └── useNotifications.ts
│   ├── services/
│   │   ├── db.ts              # IndexedDB store schema (photos, scans, logs)
│   │   ├── demoSeeder.ts      # 12-week mock data generator with SVG faces
│   │   └── imageProcessing.ts # Client-side blur & luminance canvas analysis
│   ├── types/
│   │   └── index.ts           # Strict TypeScript interfaces
│   ├── utils/
│   │   └── trendSmoothing.ts  # Moving average smoothing for scan variations
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html                 # Standalone runnable PWA distribution
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 5. How to Run Locally

### Option 1: Instant Browser Preview (Zero npm install needed)
The project includes a standalone runnable PWA distribution at `clearjourney/index.html`. You can run it with Python's built-in HTTP server:

```powershell
# From the project root
python -m http.server 8080
```
Open your browser to:
[http://localhost:8080/clearjourney/index.html](http://localhost:8080/clearjourney/index.html)

### Option 2: Standard Vite / Node.js Dev Server
If Node.js and npm are installed on your machine:

```bash
cd clearjourney
npm install
npm run dev
```

### Option 3: Deploying to Vercel or Netlify
1. Connect your repository to Vercel or Netlify.
2. In Project Settings, set the environment variable:
   `GEMINI_API_KEY=your_gemini_api_key`
3. Deploy! The `/api/analyze` serverless endpoint will automatically connect to Gemini 1.5 Flash.
