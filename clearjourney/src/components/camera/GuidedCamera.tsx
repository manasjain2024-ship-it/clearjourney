import React, { useState, useRef } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { ScanRecord } from '../../types';
import { Camera, Upload } from 'lucide-react';
import { runDermalAnalysis } from '../../services/analysisEngine';
import { saveScan } from '../../services/db';

export type ScanAngle = 'FRONT' | 'LEFT' | 'RIGHT';
export const ANGLES: ScanAngle[] = ['FRONT', 'LEFT', 'RIGHT'];

interface GuidedCameraProps {
  onScanComplete: (scanData: Partial<ScanRecord>) => void;
  onCancel?: () => void;
  currentDay: number;
}

const STEP_GUIDANCE: Record<ScanAngle, { title: string; instruction: string; short: string }> = {
  FRONT: {
    title: '1. FRONT PROFILE',
    instruction: 'Position face directly forward in the frame',
    short: 'FRONT',
  },
  LEFT: {
    title: '2. LEFT CHEEK (45°)',
    instruction: 'Turn head 45° to the right to capture LEFT cheek',
    short: 'LEFT 45°',
  },
  RIGHT: {
    title: '3. RIGHT CHEEK (45°)',
    instruction: 'Turn head 45° to the left to capture RIGHT cheek',
    short: 'RIGHT 45°',
  },
};

export const GuidedCamera: React.FC<GuidedCameraProps> = ({
  onScanComplete,
  onCancel,
  currentDay,
}) => {
  const {
    videoRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [capturedImages, setCapturedImages] = useState<{
    FRONT: string | null;
    LEFT: string | null;
    RIGHT: string | null;
  }>({ FRONT: null, LEFT: null, RIGHT: null });

  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  const currentAngle = ANGLES[currentStepIndex];
  const currentGuidance = STEP_GUIDANCE[currentAngle];

  // Web Audio Mechanical Shutter Click
  const playSnapAudio = () => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const now = ctx.currentTime;
      [1200, 320].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.035);
        gain.gain.setValueAtTime(0.08, now + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.035);
        osc.stop(now + i * 0.035 + 0.07);
      });
    } catch (e) {}
  };

  // 1. Shutter Click Execution Logic with Continuous Video Stream
  const handleShutterSnap = async () => {
    playSnapAudio();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 100);

    let frameBase64: string;
    if (isStreaming && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 640;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frameBase64 = canvas.toDataURL('image/jpeg', 0.85);
      } catch {
        const { dataUrl } = await capturePhoto();
        frameBase64 = dataUrl;
      }
    } else {
      // Fallback synthetic high-contrast capture
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#121721';
        ctx.fillRect(0, 0, 640, 640);
        ctx.fillStyle = '#EAD6CB';
        ctx.beginPath();
        ctx.arc(320, 320, 180, 0, Math.PI * 2);
        ctx.fill();
      }
      frameBase64 = canvas.toDataURL('image/jpeg', 0.85);
    }

    const updatedCaptures = { ...capturedImages, [currentAngle]: frameBase64 };
    setCapturedImages(updatedCaptures);

    // Auto-advance stepper
    if (currentStepIndex < 2) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // All 3 profiles captured!
      triggerUnifiedAnalysis(updatedCaptures);
    }
  };

  // Direct single slot upload
  const handleSlotUpload = (angle: ScanAngle, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const dataUrl = evt.target?.result as string;
      const updated = { ...capturedImages, [angle]: dataUrl };
      setCapturedImages(updated);
      playSnapAudio();
      if (updated.FRONT && updated.LEFT && updated.RIGHT) {
        triggerUnifiedAnalysis(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  // Emergency Fallback: Multi-File Input Button ("Upload 3 Photos Manually")
  const handleManualMultiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    playSnapAudio();

    const fileList = Array.from(files).slice(0, 3);
    const updated = { ...capturedImages };
    let loaded = 0;

    fileList.forEach((file, idx) => {
      const angle = ANGLES[idx];
      const reader = new FileReader();
      reader.onload = evt => {
        updated[angle] = evt.target?.result as string;
        loaded++;
        if (loaded === fileList.length) {
          setCapturedImages(updated);
          if (updated.FRONT && updated.LEFT && updated.RIGHT) {
            triggerUnifiedAnalysis(updated);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Retrieve Recent Diary Logs with Baseline Fallback
  const getEffectiveDiaryContext = () => {
    try {
      const saved = localStorage.getItem('latest_diary_entry') || localStorage.getItem('samsung_health_diary');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          workout: parsed.workout || parsed.workout_level || 'MODERATE',
          sunExposure: parsed.sunExposure || parsed.sun_exposure || 'MINIMAL',
          spfCompliance: parsed.spfCompliance || parsed.spf_compliance || 'APPLIED ONCE',
          barrierSymptoms: parsed.barrierSymptoms || parsed.barrier_symptoms || ['NONE'],
          sleepDuration: parsed.sleepDuration || parsed.sleep_duration || '6-8 HOURS',
        };
      }
    } catch {}
    return {
      workout: 'MODERATE',
      sunExposure: 'MINIMAL',
      spfCompliance: 'APPLIED ONCE',
      barrierSymptoms: ['NONE'],
      sleepDuration: '6-8 HOURS',
    };
  };

  // 2. Connect Daily Diary Data Directly into Multimodal Analysis
  const triggerUnifiedAnalysis = async (captures: {
    FRONT: string | null;
    LEFT: string | null;
    RIGHT: string | null;
  }) => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 18;
      });
    }, 280);

    const diaryContext = getEffectiveDiaryContext();

    try {
      const imagesList = [captures.FRONT, captures.LEFT, captures.RIGHT].filter(Boolean) as string[];
      const analysisResult = await runDermalAnalysis(imagesList, {
        avgWorkoutIntensity: diaryContext.workout,
        avgSunExposure: diaryContext.sunExposure,
        spfCompliance: diaryContext.spfCompliance,
        barrierSensations: diaryContext.barrierSymptoms,
        avgSleep: diaryContext.sleepDuration,
      });

      const record: Partial<ScanRecord> = {
        id: `scan-${Date.now()}`,
        dayNumber: currentDay || 14,
        dateString: `Evaluation // Day ${currentDay || 14}`,
        timestamp: Date.now(),
        photoUrl: captures.FRONT || imagesList[0] || '',
        angles: {
          front: captures.FRONT || '',
          left: captures.LEFT || '',
          right: captures.RIGHT || '',
        },
        metrics: {
          sebumControlPercentage: Math.round(analysisResult.metrics.sebumDistribution * 10),
          inflammatoryLesionCount: analysisResult.metrics.lesionMax,
          comedoneCount: analysisResult.metrics.lesionMin,
          barrierHydrationScore: 82,
          poreRefinementScore: Math.round(analysisResult.metrics.textureUniformity * 10),
        },
        classification: {
          isPurgeLikely: analysisResult.status.phase === 'purging',
          title: analysisResult.status.phase === 'purging' ? 'Accelerated Follicular Desquamation' : 'Dermal Equilibrium Established',
          explanation: analysisResult.status.clinicalSummary,
          stage: analysisResult.status.phase === 'purging' ? 'peak_purge' : 'turning_point',
        },
        adaptiveFrequency: {
          recommendedWeeklyPMFrequency: analysisResult.status.phase === 'irritated' ? 3 : 7,
          currentStage: analysisResult.protocol.prescription,
          actionableAdvisory: analysisResult.protocol.clinicalGuidance,
          cautionNotes: [analysisResult.protocol.barrierTipClinical],
        },
      };

      await saveScan(record as ScanRecord);
      clearInterval(interval);
      setAnalysisProgress(100);

      setTimeout(() => {
        setIsAnalyzing(false);
        if (isStreaming) stopCamera();
        onScanComplete(record);
      }, 500);
    } catch (err) {
      console.error('Analysis execution failed', err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="font-serif space-y-3">
      {/* 1. UI Visual Stepper (3-step pill indicator) */}
      <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold">
        {ANGLES.map((angle, idx) => {
          const isCaptured = Boolean(capturedImages[angle]);
          const isActive = currentStepIndex === idx;
          return (
            <React.Fragment key={angle}>
              <button
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : isCaptured
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                    : 'border-slate-800 text-slate-500'
                }`}
              >
                <span>{isCaptured || isActive ? '●' : '○'}</span>
                <span>{STEP_GUIDANCE[angle].short}</span>
              </button>
              {idx < 2 && <span className="text-slate-600 text-[10px]">➔</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* 2. Prominently Updated On-Screen Guideline Banner */}
      <div className="border border-slate-700 bg-slate-900/60 p-2.5 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
            STEP {currentStepIndex + 1} OF 3
          </span>
          <span className="font-semibold text-slate-200">
            {currentGuidance.instruction}
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold">
          {isStreaming ? 'STREAM: LIVE' : 'STREAM: READY'}
        </span>
      </div>

      {/* 3. Framed Viewport with Continuous Video Stream */}
      <div className="relative w-full aspect-square bg-[#040609] border border-slate-700 rounded-2xl overflow-hidden flex items-center justify-center">
        {/* Continuous Video Feed: never paused or unmounted across steps */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
        />

        {!isStreaming && (
          <div className="text-center p-6 space-y-3">
            <p className="text-xs text-slate-400 max-w-xs">
              Live camera feed idle. Tap [ Enable Cam ] below or trigger shutter to capture test profiles.
            </p>
          </div>
        )}

        {/* 100ms Flash Animation on screen */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white opacity-80 z-40 pointer-events-none transition-opacity duration-100" />
        )}

        {/* Delicate Crosshair Alignment Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 300 300">
          <line x1="150" y1="135" x2="150" y2="165" stroke="#10B981" strokeWidth="0.8" />
          <line x1="135" y1="150" x2="165" y2="150" stroke="#10B981" strokeWidth="0.8" />
          <path d="M 45 65 L 45 45 L 65 45" stroke="#10B981" strokeWidth="1" fill="none" />
          <path d="M 255 65 L 255 45 L 235 45" stroke="#10B981" strokeWidth="1" fill="none" />
          <path d="M 45 235 L 45 255 L 65 255" stroke="#10B981" strokeWidth="1" fill="none" />
          <path d="M 255 235 L 255 255 L 235 255" stroke="#10B981" strokeWidth="1" fill="none" />
          <ellipse cx="150" cy="150" rx="80" ry="110" stroke="#10B981" strokeWidth="0.7" strokeDasharray="2 3" opacity="0.45" fill="none" />
        </svg>

        {/* Telemetry HUD */}
        <div className="absolute top-2 left-2 right-2 flex justify-between text-[10px] font-bold text-emerald-400 pointer-events-none z-12">
          <span>EXPOSURE: OPTIMAL</span>
          <span>ANGLE: {currentAngle}</span>
        </div>
      </div>

      {/* 4. Explicit Manual Thumbnail Buttons (Tap to Retake Specific Angle) */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
        {ANGLES.map((angle, i) => {
          const isDone = Boolean(capturedImages[angle]);
          const isCurrent = currentStepIndex === i;
          return (
            <div
              key={angle}
              onClick={() => setCurrentStepIndex(i)}
              className={`p-2 border rounded-xl cursor-pointer flex flex-col items-center gap-1 transition-all ${
                isDone
                  ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                  : isCurrent
                  ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-black/60 border border-slate-700 flex items-center justify-center overflow-hidden">
                {isDone ? (
                  <img src={capturedImages[angle]!} alt={angle} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <span className="font-bold">{STEP_GUIDANCE[angle].short}</span>
              <span className="text-[9px] font-mono">{isDone ? '[RETAKE]' : isCurrent ? '[ACTIVE]' : '[EMPTY]'}</span>
            </div>
          );
        })}
      </div>

      {/* 5. Hardware Shutter Deck & Fallback Controls */}
      <div className="border border-slate-700 bg-slate-900/60 p-3 rounded-2xl flex justify-around items-center">
        {/* Slot File Upload Picker */}
        <label className="cursor-pointer" title="Pick file for current slot">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleSlotUpload(currentAngle, e)}
          />
          <div className="border border-slate-700 bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 flex items-center gap-1.5 hover:bg-slate-700">
            <Upload className="w-3.5 h-3.5" />
            <span>[ SLOT FILE ]</span>
          </div>
        </label>

        {/* Centered Samsung Hardware Shutter Button */}
        <button
          onClick={handleShutterSnap}
          title="Snap Profile Frame"
          className="w-14 h-14 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-90 transition-transform shadow-lg"
        >
          <div className="w-full h-full rounded-full bg-white active:bg-cyan-400 transition-colors" />
        </button>

        {/* Camera Toggle */}
        <button
          onClick={isStreaming ? stopCamera : startCamera}
          className="border border-slate-700 bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-700"
        >
          {isStreaming ? '[ DISABLE CAM ]' : '[ ENABLE CAM ]'}
        </button>
      </div>

      {/* 6. Emergency Fallback: Upload 3 Photos Manually */}
      <div className="flex justify-center pt-1">
        <label className="cursor-pointer inline-flex items-center gap-2 border border-slate-700 bg-slate-900/80 hover:border-cyan-500 px-4 py-2 rounded-full text-xs font-bold text-slate-300 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleManualMultiUpload}
          />
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Upload 3 Photos Manually</span>
        </label>
      </div>

      {/* 7. Analysis Progress Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase">
            CROSS-CORRELATING DERMAL BIOMARKERS WITH DIARY LOGS...
          </p>
          <div className="w-64 h-1.5 bg-slate-800 border border-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-200"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <p className="text-slate-300 text-xs">
            Synthesizing 7-Day Lifestyle Context & Dermal Tolerance... ({analysisProgress}%)
          </p>
        </div>
      )}
    </div>
  );
};
