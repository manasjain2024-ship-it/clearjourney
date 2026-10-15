/**
 * Exponential moving average and window smoothing for biometric scan metrics
 * Prevents single-day fluctuations (e.g. sweat, lighting) from triggering panic
 */
export function smoothMetricTrend(dataPoints: number[], alpha: number = 0.4): number[] {
  if (dataPoints.length === 0) return [];
  const smoothed: number[] = [dataPoints[0]];
  for (let i = 1; i < dataPoints.length; i++) {
    smoothed.push(Math.round(alpha * dataPoints[i] + (1 - alpha) * smoothed[i - 1]));
  }
  return smoothed;
}

export function calculateClinicalVelocity(currentDay: number, currentLesions: number, baselineLesions: number): {
  reductionRate: number; // percentage reduction
  status: 'accelerating' | 'purging' | 'plateau' | 'clearance';
  trajectoryText: string;
} {
  if (currentDay <= 7) {
    return {
      reductionRate: 0,
      status: 'purging',
      trajectoryText: 'Initial follicular acclimation. Sub-surface comedones activating.',
    };
  }

  const reduction = ((baselineLesions - currentLesions) / (baselineLesions || 1)) * 100;

  if (currentDay <= 21 && reduction < 0) {
    return {
      reductionRate: Math.abs(Math.round(reduction)),
      status: 'purging',
      trajectoryText: 'Normal purging inflection: deep sebum plugs rising to the surface.',
    };
  }

  if (reduction >= 50) {
    return {
      reductionRate: Math.round(reduction),
      status: 'clearance',
      trajectoryText: 'Clinical cellular turnover complete. Porous clarity achieved.',
    };
  }

  return {
    reductionRate: Math.max(0, Math.round(reduction)),
    status: 'accelerating',
    trajectoryText: 'The turning point reached. Lesions clearing faster than new formations.',
  };
}
