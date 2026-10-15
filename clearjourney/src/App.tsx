import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { TopHeader } from './components/layout/TopHeader';
import { TabInfoModal } from './components/common/TabInfoModal';
import { BottomNav } from './components/layout/BottomNav';
import { DemoBanner } from './components/layout/DemoBanner';
import { DisclaimerFooter } from './components/layout/DisclaimerFooter';
import { JourneyRing } from './components/dashboard/JourneyRing';
import { HabitStreak } from './components/dashboard/HabitStreak';
import { LearnCarousel } from './components/dashboard/LearnCarousel';
import { MilestoneCard } from './components/dashboard/MilestoneCard';
import { ChecklistItem } from './components/routine/ChecklistItem';
import { LatherTimerModal } from './components/routine/LatherTimerModal';
import { ScentModal } from './components/switch-shield/ScentModal';
import { FairChanceModal } from './components/switch-shield/FairChanceModal';
import { RetentionWizard } from './components/switch-shield/RetentionWizard';
import { HeatmapCanvas } from './components/analysis/HeatmapCanvas';
import { BeforeAfterSlider } from './components/analysis/BeforeAfterSlider';
import { MetricsRadar } from './components/analysis/MetricsRadar';
import { TrendChart } from './components/analysis/TrendChart';
import { GuidedCamera } from './components/camera/GuidedCamera';
import { PatternCard, QuickLogModal } from './components/diary/FactorPill';
import { ProofFeed } from './components/reviews/ProofFeed';
import { ScienceLab } from './components/science/ScienceLab';
import { Button } from './components/common/Button';
import { Card, Badge, Modal } from './components/common/Card';
import { Camera, Sparkles, Clock, Flame, Calendar, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { DEMO_SCANS } from './services/demoSeeder';

export const App: React.FC = () => {
  const {
    activeTab,
    currentDay,
    scans,
    activeScanIndex,
    setActiveScanIndex,
    activeScan,
    routineToday,
    toggleRoutineAm,
    toggleRoutinePm,
    milestones,
    isLatherModalOpen,
    setIsLatherModalOpen,
    isScentModalOpen,
    setIsScentModalOpen,
    isFairChanceModalOpen,
    setIsFairChanceModalOpen,
    addNewScan,
    isDemoLoaded,
  } = useApp();

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isTabInfoOpen, setIsTabInfoOpen] = useState(false);

  // Baseline scan for split slider comparison
  const baselineScan = scans.find(s => s.dayNumber === 0) || scans[0] || DEMO_SCANS[0];
  const displayScan = activeScan || scans[0] || DEMO_SCANS[2];

  const handleScanCompleted = async (newScanData: any) => {
    await addNewScan(newScanData);
    setIsCameraModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-offwhite text-charcoal-900 flex flex-col font-sans selection:bg-sage-100 selection:text-sage-900">
      {/* Top Mobile-First Header with contextual info button */}
      <TopHeader onOpenInfo={() => setIsTabInfoOpen(true)} />

      {/* Prominent Demo Hydration / Reset Banner */}
      <DemoBanner />

      {/* Main Responsive Viewport (Centered max-w-md on desktop) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-5">
        {/* ================= TAB 1: ROUTINE HUB & DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Cellular Turnover Clock Ring */}
            <JourneyRing />

            {/* Daily Routine Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-charcoal-900 tracking-tight flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sage-700" />
                  Today's Clinical Adherence
                </h3>
                <span className="text-[11px] font-bold text-sage-800 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
                  {routineToday.amCleanseSpfDone && routineToday.pmSalicylic60sDone ? '2/2 Completed 🎉' : '1 Task Pending'}
                </span>
              </div>

              <ChecklistItem
                title="AM Cleanse & SPF 50 Shield"
                subtitle="Lightweight rinse + broad spectrum SPF to protect newly exfoliated cells"
                isDone={routineToday.amCleanseSpfDone}
                onToggle={toggleRoutineAm}
                tag="Morning Protection"
              />

              <ChecklistItem
                title="PM 2% Salicylic Cleanse (60s Rule)"
                subtitle="Pure lipophilic BHA contact to liquefy deep sebum & dissolve desmosome plugs"
                isDone={routineToday.pmSalicylic60sDone}
                onToggle={() => toggleRoutinePm(60)}
                tag="Active Turnover"
                hasTimer={true}
                onTimerClick={() => setIsLatherModalOpen(true)}
              />
            </div>

            {/* Quick Action Bar: AI Scan + Skin Diary */}
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="primary"
                onClick={() => setIsCameraModalOpen(true)}
                className="bg-sage-800 hover:bg-sage-900 shadow-md text-xs py-3"
                icon={<Camera className="w-4 h-4 text-white" />}
              >
                Log Facial Scan
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsDiaryModalOpen(true)}
                className="text-xs py-3 border border-mint-200"
                icon={<BookOpen className="w-4 h-4 text-sage-800" />}
              >
                Skin Diary Check-in
              </Button>
            </div>

            {/* Habit Streak Counter */}
            <HabitStreak />

            {/* Clinical Educational Carousel */}
            <LearnCarousel />

            {/* Retention Shield Diagnostic Tool */}
            <RetentionWizard />
          </div>
        )}

        {/* ================= TAB 2: AI SKIN JOURNEY & PURGE PREDICTOR ================= */}
        {activeTab === 'analysis' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header & Scan Day Selector */}
            <div className="p-4 rounded-3xl bg-sage-800 text-white shadow-clinical">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-sage-200">
                    AI Diagnostic Engine
                  </span>
                </div>
                {displayScan.isSampleData && (
                  <Badge variant="mint" size="sm" className="bg-emerald-950/80 text-emerald-300 border-emerald-700">
                    Sample Data
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-black tracking-tight mb-1">
                {displayScan.classification.title}
              </h3>
              <p className="text-xs text-sage-200 leading-relaxed">
                {displayScan.classification.explanation}
              </p>

              {/* Day Selector Buttons */}
              <div className="mt-3 pt-3 border-t border-sage-700/60 flex items-center justify-between overflow-x-auto gap-1.5 scrollbar-none">
                {scans.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScanIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      idx === activeScanIndex
                        ? 'bg-white text-sage-900 shadow-sm'
                        : 'bg-sage-900/60 text-sage-200 hover:bg-sage-700'
                    }`}
                  >
                    D{s.dayNumber}
                  </button>
                ))}
                <button
                  onClick={() => setIsCameraModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-charcoal-900 shrink-0 flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  + Scan
                </button>
              </div>
            </div>

            {/* Purge vs Breakout AI Classifier Card */}
            <Card
              className={`border-2 ${
                displayScan.classification.isPurgeLikely
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-emerald-50/50 border-emerald-300'
              } p-4 shadow-clinical`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs uppercase tracking-wider text-charcoal-700">
                  Follicular Classifier:
                </span>
                <Badge variant={displayScan.classification.isPurgeLikely ? 'amber' : 'mint'}>
                  {displayScan.classification.isPurgeLikely
                    ? 'Active Turnover (Purging)'
                    : 'Clearance & Equilibrium'}
                </Badge>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                {displayScan.classification.isPurgeLikely ? (
                  <>
                    <strong>Why this is NOT a breakout:</strong> Trapped microcomedones formed 3 to 4 weeks ago are being pushed to the surface simultaneously by 2% BHA desmolysis. This confirms active ingredient efficacy.
                  </>
                ) : (
                  <>
                    <strong>Equilibrium confirmed:</strong> Pre-existing follicular plugs have cleared. New acne formation rate is below baseline velocity.
                  </>
                )}
              </p>
            </Card>

            {/* Active Blemish & Congestion Heatmap */}
            <HeatmapCanvas
              photoUrl={displayScan.photoUrl || DEMO_SCANS[2].photoUrl!}
              points={displayScan.heatmapPoints}
              isPurgeLikely={displayScan.classification.isPurgeLikely}
            />

            {/* Quantitative Biometric Metric Bars */}
            <MetricsRadar
              metrics={displayScan.metrics}
              dayNumber={displayScan.dayNumber}
              isPurgeLikely={displayScan.classification.isPurgeLikely}
            />

            {/* Interactive Before & After Split-Slider */}
            <BeforeAfterSlider
              baselineImage={baselineScan.photoUrl || DEMO_SCANS[0].photoUrl!}
              currentImage={displayScan.photoUrl || DEMO_SCANS[activeScanIndex].photoUrl!}
              baselineLabel={`Day 0 • Baseline`}
              currentLabel={`Day ${displayScan.dayNumber} • Current`}
              currentDay={displayScan.dayNumber}
            />

            {/* 12-Week Trajectory Curve */}
            <TrendChart />
          </div>
        )}

        {/* ================= TAB 3: SCIENCE LAB & SENSORY ONBOARDING ================= */}
        {activeTab === 'science' && (
          <div className="space-y-4 animate-fadeIn">
            <ScienceLab />
          </div>
        )}

        {/* ================= TAB 4: MILESTONES & HABIT TRACKER ================= */}
        {activeTab === 'routine' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-sage-800 text-white shadow-clinical">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sage-200 bg-sage-900/60 px-2 py-0.5 rounded-full inline-block mb-1">
                Cellular Turnover Badges
              </span>
              <h3 className="text-base font-extrabold tracking-tight">
                Biological Milestone Roadmap
              </h3>
              <p className="text-xs text-sage-200 mt-0.5 leading-relaxed">
                Unlock clinical milestones as your stratum corneum replaces old plugged cells with healthy, un-impacted keratinocytes.
              </p>
            </div>

            <HabitStreak />

            {/* Milestones List */}
            <div className="space-y-3">
              {milestones.map(m => (
                <MilestoneCard key={m.id} milestone={m} currentDay={currentDay} />
              ))}
            </div>

            {/* Behavioral Pattern Analysis */}
            <PatternCard />
          </div>
        )}

        {/* ================= TAB 5: REAL FEEDBACK & PROOF FEED ================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-fadeIn">
            <ProofFeed />
          </div>
        )}

        {/* Clinical Disclaimer Footer */}
        <DisclaimerFooter />
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

      {/* ================= MODALS ================= */}

      {/* 60-Second Lather Timer Modal */}
      <LatherTimerModal
        isOpen={isLatherModalOpen}
        onClose={() => setIsLatherModalOpen(false)}
        onComplete={() => toggleRoutinePm(60)}
      />

      {/* Scent & Sensory Misconception Modal */}
      <ScentModal
        isOpen={isScentModalOpen}
        onClose={() => setIsScentModalOpen(false)}
      />

      {/* Fair Chance Guarantee / Patience Shield Modal */}
      <FairChanceModal
        isOpen={isFairChanceModalOpen}
        onClose={() => setIsFairChanceModalOpen(false)}
      />

      {/* Quick Diary Log Modal */}
      <QuickLogModal
        isOpen={isDiaryModalOpen}
        onClose={() => setIsDiaryModalOpen(false)}
      />

      {/* Camera / Scan Intake Modal */}
      <Modal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        title="Biometric Facial Intake"
        maxWidth="max-w-md"
      >
        <GuidedCamera
          currentDay={currentDay}
          onScanComplete={handleScanCompleted}
          onCancel={() => setIsCameraModalOpen(false)}
        />
      </Modal>

      {/* Contextual Screen Explainer Modal */}
      <TabInfoModal
        isOpen={isTabInfoOpen}
        onClose={() => setIsTabInfoOpen(false)}
        currentTab={activeTab}
      />
    </div>
  );
};
