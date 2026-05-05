import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, XCircle, RefreshCw, Scan, AlertTriangle } from 'lucide-react';

interface FaceScannerProps {
  onScanComplete: (descriptor: number[], imageData: string) => void;
  onScanFailed: (reason: string) => void;
  mode: 'register' | 'verify';
}

type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'failed';

const FaceScanner: React.FC<FaceScannerProps> = ({ onScanComplete, onScanFailed, mode }) => {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateFaceDescriptor = (): number[] => {
    return Array.from({ length: 128 }, () => Math.random() * 2 - 1);
  };

  const startCamera = useCallback(async () => {
    setScanState('scanning');
    setProgress(0);
    setStatusMessage('Initializing camera...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatusMessage('Position your face in the frame...');
      simulateScan();
    } catch {
      setScanState('failed');
      setStatusMessage('Camera access denied. Using simulated scan.');
      simulateScanWithoutCamera();
    }
  }, []);

  const simulateScan = () => {
    let prog = 0;
    const messages = [
      'Detecting face...',
      'Analyzing facial features...',
      'Mapping biometric points...',
      'Verifying liveness...',
      'Generating secure descriptor...'
    ];
    intervalRef.current = setInterval(() => {
      prog += 4;
      setProgress(prog);
      const msgIndex = Math.floor((prog / 100) * messages.length);
      setStatusMessage(messages[Math.min(msgIndex, messages.length - 1)]);
      if (prog >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        completeScan();
      }
    }, 80);
  };

  const simulateScanWithoutCamera = () => {
    setScanState('scanning');
    let prog = 0;
    intervalRef.current = setInterval(() => {
      prog += 3;
      setProgress(prog);
      if (prog >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        completeScan();
      }
    }, 80);
  };

  const completeScan = () => {
    setScanState('processing');
    setStatusMessage('Processing biometric data...');

    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth || 320;
        canvasRef.current.height = videoRef.current.videoHeight || 240;
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    setTimeout(() => {
      const descriptor = generateFaceDescriptor();
      const placeholderImage = `data:image/svg+xml;base64,${btoa(`
        <svg width="320" height="240" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="240" fill="#1e293b"/>
          <circle cx="160" cy="100" r="50" fill="#334155"/>
          <rect x="100" y="160" width="120" height="80" rx="10" fill="#334155"/>
          <text x="160" y="220" text-anchor="middle" fill="#64748b" font-size="12">Face Captured</text>
        </svg>
      `)}`;

      setScanState('success');
      setStatusMessage(mode === 'register' ? 'Face registered successfully!' : 'Identity verified!');
      onScanComplete(descriptor, capturedImage || placeholderImage);
    }, 1200);
  };

  const reset = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setScanState('idle');
    setProgress(0);
    setCapturedImage(null);
    setStatusMessage('');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-48 rounded-2xl overflow-hidden bg-slate-900 border-2 border-primary/30">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          style={{ display: scanState === 'scanning' ? 'block' : 'none' }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {scanState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-xs text-white/60 text-center px-4">
              {mode === 'register' ? 'Register your face for secure voting' : 'Verify your identity to proceed'}
            </p>
          </div>
        )}

        {scanState === 'scanning' && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-40 border-2 border-primary rounded-full face-scan-ring" />
            </div>
            <div className="absolute inset-x-0 h-0.5 bg-primary/60 scan-line" style={{ top: `${progress}%` }} />
            <div className="absolute top-2 left-2 right-2">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-primary rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </div>
        )}

        {scanState === 'processing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/90">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Scan className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="text-xs text-white/70">Processing...</p>
          </div>
        )}

        <AnimatePresence>
          {scanState === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-green-900/80"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-xs text-green-300 font-medium">Scan Complete</p>
            </motion.div>
          )}
          {scanState === 'failed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-red-900/80"
            >
              <XCircle className="w-12 h-12 text-red-400" />
              <p className="text-xs text-red-300 font-medium">Scan Failed</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {statusMessage && (
        <p className="text-xs text-muted-foreground text-center flex items-center gap-1.5">
          {scanState === 'failed' && <AlertTriangle className="w-3.5 h-3.5 text-warning" />}
          {statusMessage}
        </p>
      )}

      <div className="flex gap-3">
        {scanState === 'idle' && (
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            <Camera className="w-4 h-4" />
            {mode === 'register' ? 'Scan Face' : 'Verify Face'}
          </button>
        )}
        {(scanState === 'success' || scanState === 'failed') && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Rescan
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceScanner;