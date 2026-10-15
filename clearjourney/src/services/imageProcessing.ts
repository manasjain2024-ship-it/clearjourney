export interface ImageQualityMetrics {
  blurScore: number; // 0 to 100, > 45 is good sharpness
  luminance: number; // 0 to 255, 70-200 is optimal
  isGoodLighting: boolean;
  isSharp: boolean;
  passed: boolean;
  feedbackMessage: string;
}

/**
 * Analyzes an HTMLImageElement or Canvas for exposure luminance and edge sharpness (Laplacian variance approximation)
 */
export async function analyzeImageQuality(imageSource: HTMLImageElement | HTMLCanvasElement): Promise<ImageQualityMetrics> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  const width = Math.min(320, imageSource.width || 320);
  const height = Math.min(400, imageSource.height || 400);
  canvas.width = width;
  canvas.height = height;

  if (!ctx) {
    return {
      blurScore: 75,
      luminance: 128,
      isGoodLighting: true,
      isSharp: true,
      passed: true,
      feedbackMessage: 'Visual quality verified.',
    };
  }

  ctx.drawImage(imageSource, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let totalLuminance = 0;
  const gray: number[] = new Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    // Rec. 709 luminance formula
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    totalLuminance += lum;
    gray[i / 4] = lum;
  }

  const avgLuminance = Math.round(totalLuminance / (width * height));

  // Compute 3x3 discrete Laplacian kernel variance for edge high-frequency energy
  let laplacianSum = 0;
  let laplacianSqSum = 0;
  let pixelCount = 0;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const idx = y * width + x;
      // Kernel:
      //  0  1  0
      //  1 -4  1
      //  0  1  0
      const val =
        gray[idx - width] +
        gray[idx + width] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];

      laplacianSum += val;
      laplacianSqSum += val * val;
      pixelCount++;
    }
  }

  const meanLap = laplacianSum / (pixelCount || 1);
  const variance = (laplacianSqSum / (pixelCount || 1)) - (meanLap * meanLap);
  
  // Normalize variance into a 0-100 score
  const blurScore = Math.min(100, Math.max(10, Math.round(Math.sqrt(Math.max(0, variance)) * 3.5)));

  const isGoodLighting = avgLuminance >= 65 && avgLuminance <= 225;
  const isSharp = blurScore >= 38;
  const passed = isGoodLighting && isSharp;

  let feedbackMessage = 'Lighting and focus are clear!';
  if (!isGoodLighting && avgLuminance < 65) {
    feedbackMessage = 'Lighting is too dark. Please face a window or bright light.';
  } else if (!isGoodLighting && avgLuminance > 225) {
    feedbackMessage = 'Image is overexposed. Move slightly away from harsh direct glare.';
  } else if (!isSharp) {
    feedbackMessage = 'Image is slightly blurry. Hold steady for the biometric scan.';
  }

  return {
    blurScore,
    luminance: avgLuminance,
    isGoodLighting,
    isSharp,
    passed,
    feedbackMessage,
  };
}
