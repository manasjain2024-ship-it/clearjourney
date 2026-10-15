import { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeImageQuality, ImageQualityMetrics } from '../services/imageProcessing';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  const [lastQualityMetrics, setLastQualityMetrics] = useState<ImageQualityMetrics | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
    } catch (err: any) {
      console.warn('Webcam stream not accessible or permission denied, using photo simulation fallback:', err);
      setError(err?.message || 'Camera not accessible');
      setIsStreaming(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
  }, [stream]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  const capturePhoto = useCallback(async (): Promise<{ dataUrl: string; quality: ImageQualityMetrics }> => {
    if (!videoRef.current) {
      throw new Error('Video element not ready');
    }
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const quality = await analyzeImageQuality(canvas);
    setLastQualityMetrics(quality);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    return { dataUrl, quality };
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    toggleFacingMode,
    capturePhoto,
    facingMode,
    lastQualityMetrics,
  };
}
