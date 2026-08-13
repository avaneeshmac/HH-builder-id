import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { processUploadedFile } from '../utils/imageHelpers';

interface LandingSectionProps {
  onPhotoLoaded: (photoUrl: string) => void;
}

export default function LandingSection({ onPhotoLoaded }: LandingSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    try {
      const processedUrl = await processUploadedFile(file);
      onPhotoLoaded(processedUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Couldn't read that image. Try a JPG or PNG.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', 
          width: { ideal: 1080 }, 
          height: { ideal: 1080 } 
        },
        audio: false
      });
      
      setCameraStream(stream);
      setIsCameraActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError('Camera access denied. Try uploading a photo instead.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      const width = video.videoWidth || 800;
      const height = video.videoHeight || 800;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(video, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onPhotoLoaded(dataUrl);
        stopCamera();
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to snap photo. Try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-height-inherit w-full max-w-xl mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Make your <span className="text-transparent bg-clip-text bg-gradient-to-r from-goa-emerald via-goa-teal to-goa-orange">Builder ID</span>.
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Add your photo, tell us what you build, and you're good to go.
        </p>
      </div>

      {/* Main Drag-Drop Upload Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerFileBrowser}
        className={`w-full aspect-[4/3] sm:aspect-[16/10] min-h-[260px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          isDragging 
            ? 'border-goa-emerald bg-goa-emerald/5 scale-[1.01]' 
            : 'border-slate-800 bg-obsidian-light/30 hover:border-slate-700 hover:bg-obsidian-light/50'
        }`}
      >
        <div className="absolute inset-0 cyber-grid opacity-[0.15] pointer-events-none"></div>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-goa-emerald animate-spin" />
              <div className="absolute inset-0 bg-goa-emerald/20 blur-xl rounded-full"></div>
            </div>
            <p className="text-goa-emerald font-mono text-sm tracking-widest animate-pulse uppercase">
              Processing...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 z-10">
            <div className="p-4 bg-obsidian-light border border-slate-800 rounded-2xl group-hover:border-slate-700 group-hover:scale-105 transition-all duration-300">
              <Upload className="w-8 h-8 text-goa-teal group-hover:text-goa-emerald transition-colors" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                Drop your photo here, or <span className="text-goa-emerald">browse</span>
              </p>
              <p className="text-slate-500 text-xs mt-1">
                JPG, PNG, WEBP, or HEIC
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Mobile-Friendly Upload Actions */}
      <div className="grid grid-cols-2 gap-4 w-full mt-6">
        <button
          onClick={triggerFileBrowser}
          disabled={isProcessing}
          className="flex items-center justify-center space-x-2 py-4 px-6 bg-obsidian-light hover:bg-slate-800/80 active:scale-95 text-white font-semibold border border-slate-800 hover:border-slate-700 rounded-2xl transition-all select-none disabled:opacity-50 text-sm sm:text-base shadow-lg"
        >
          <ImageIcon className="w-5 h-5 text-goa-teal" />
          <span>Pick a photo</span>
        </button>
        <button
          onClick={startCamera}
          disabled={isProcessing}
          className="flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-goa-teal to-goa-emerald hover:from-goa-teal/90 hover:to-goa-emerald/90 active:scale-95 text-white font-semibold rounded-2xl transition-all select-none disabled:opacity-50 text-sm sm:text-base shadow-lg shadow-goa-emerald/10"
        >
          <Camera className="w-5 h-5" />
          <span>Use camera</span>
        </button>
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="w-full mt-6 flex items-start space-x-3 p-4 bg-red-950/20 border border-red-900/50 rounded-2xl text-red-400 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="font-bold">Something went wrong</h5>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Interactive In-App Webcam stream dialog overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-obsidian-dark/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-obsidian-light border border-slate-800/85 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-obsidian-dark/60">
              <h3 className="font-mono text-xs text-goa-emerald font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span>Camera</span>
              </h3>
              <button
                onClick={stopCamera}
                className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 bg-obsidian-dark border border-slate-850 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
            
            <div className="relative aspect-square bg-black overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute inset-8 border border-white/10 rounded-2xl pointer-events-none"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-goa-emerald/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-goa-emerald/30"></div>
              </div>
            </div>

            <div className="p-6 flex flex-col items-center space-y-4 bg-obsidian-dark/45 border-t border-slate-900/60">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-white/90 bg-goa-emerald hover:bg-goa-emerald/90 flex items-center justify-center active:scale-95 transition-all shadow-xl shadow-goa-emerald/20 cursor-pointer"
                title="Capture Photo"
              >
                <Camera className="w-7 h-7 text-obsidian" />
              </button>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Tap to snap.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
