import { useState, useEffect } from 'react';
import { Download, ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

import LandingSection from './components/LandingSection';
import DetailsForm from './components/DetailsForm';
import BuilderIDCard, { PhotoState } from './components/BuilderIDCard';
import { getRandomTitle } from './utils/builderTitles';

// Custom SVG component for the X (formerly Twitter) logo
function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function App() {
  // Navigation Step: 'landing' | 'details' | 'success' | 'shared'
  const [step, setStep] = useState<'landing' | 'details' | 'success' | 'shared'>('landing');
  
  // Form Details
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState('Avaneesh');
  const [role, setRole] = useState('Backend / AI');
  const [funFact, setFunFact] = useState('Ships bugs faster than features');
  const [title, setTitle] = useState('');

  // Photo crop/zoom state
  const [photoState, setPhotoState] = useState<PhotoState>({ zoom: 1.0, panX: 0, panY: 0 });
  
  // Share and Export States
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImageBlob, setFinalImageBlob] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  // Read configuration from Vite env
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Handle URL shared parameters (e.g. /?shared=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('shared');
    if (shared) {
      setSharedId(shared);
      setStep('shared');
    }
  }, []);

  const handlePhotoLoaded = (url: string) => {
    setPhotoUrl(url);
    setTitle(getRandomTitle());
    setName('Avaneesh');
    setRole('Backend / AI');
    setFunFact('Ships bugs faster than features');
    setPhotoState({ zoom: 1.0, panX: 0, panY: 0 });
    setStep('details');
  };

  const handleUpdateDetails = (fields: Partial<{ name: string; role: string; funFact: string; title: string }>) => {
    if (fields.name !== undefined) setName(fields.name);
    if (fields.role !== undefined) setRole(fields.role);
    if (fields.funFact !== undefined) setFunFact(fields.funFact);
    if (fields.title !== undefined) setTitle(fields.title);
  };

  // Triggers final high-res card compilation
  const generateFinalCard = async (): Promise<string> => {
    const visibleCanvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!visibleCanvas) {
      throw new Error('Canvas element not found in DOM.');
    }
    return visibleCanvas.toDataURL('image/png', 1.0);
  };

  const handleCreateID = async () => {
    if (!name.trim() || !role.trim()) {
      alert('Please fill out Name and Stack/Role.');
      return;
    }

    setIsProcessing(true);
    try {
      const dataUrl = await generateFinalCard();
      setFinalImageBlob(dataUrl);
      setStep('success');
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F97316', '#F59E0B']
      });
    } catch (e) {
      console.error(e);
      alert('Could not compile card. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const dataUrl = finalImageBlob || `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${sharedId}`;
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `HH-Goa-Builder-ID-${name.replace(/\s+/g, '-') || 'Card'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareToX = async () => {
    setShareError(null);
    const shareText = `Heading to HH Goa 2026 🌴\nMy builder title: ${title}\n\n#FrameInGoa`;

    // Helper to build the personalised share URL with name + title embedded
    const buildShareUrl = (publicId: string) => {
      const base = `${window.location.origin}/share/${publicId}`;
      return `${base}?name=${encodeURIComponent(name)}&title=${encodeURIComponent(title)}`;
    };

    // Try Web Share API first — attaches actual image on iOS/Android
    if (navigator.canShare && finalImageBlob) {
      try {
        const res = await fetch(finalImageBlob);
        const blob = await res.blob();
        const file = new File([blob], `HH-Goa-Builder-ID.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `HH Goa 2026 Builder ID — ${name}`,
            text: shareText,
          });
          return;
        }
      } catch (e) {
        console.warn('Web Share failed, falling back:', e);
      }
    }

    // Desktop: need a public Cloudinary URL for the OG image preview on X
    if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === 'your_cloud_name') {
      // No Cloudinary — open X with just text
      const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
      return;
    }

    // Already uploaded — reuse existing public_id
    if (sharedId) {
      const shareUrl = buildShareUrl(sharedId);
      const twitterUrl = `https://x.com/intent/post?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
      return;
    }

    // Upload image to Cloudinary, then open X with personalised share URL
    setIsProcessing(true);
    try {
      const cardPngData = finalImageBlob || await generateFinalCard();
      const formData = new FormData();
      formData.append('file', cardPngData);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'hh_goa_2026');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Cloudinary upload failed');

      const result = await response.json();
      const publicId = result.public_id;
      setSharedId(publicId);

      const shareUrl = buildShareUrl(publicId);
      const twitterUrl = `https://x.com/intent/post?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
    } catch (e) {
      console.error(e);
      setShareError("Couldn't upload image. Try downloading and sharing manually.");
      setTimeout(() => {
        const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank');
      }, 2500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {

    setPhotoUrl(null);
    setName('Avaneesh');
    setRole('Backend / AI');
    setFunFact('Ships bugs faster than features');
    setTitle('');
    setFinalImageBlob(null);
    setSharedId(null);
    setShareError(null);
    
    window.history.replaceState({}, document.title, window.location.pathname);
    setStep('landing');
  };

  return (
    <div className="min-h-screen flex flex-col relative cyber-grid ambient-glow">
      <div className="absolute top-0 left-0 right-0 h-1 border-t border-goa-emerald/20 pointer-events-none"></div>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        
        {/* Landing Section */}
        {step === 'landing' && (
          <LandingSection onPhotoLoaded={handlePhotoLoaded} />
        )}

        {/* Details Form + Live Canvas Preview */}
        {step === 'details' && photoUrl && (
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-4">
            
            {/* Left Column: Live Card Canvas Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="text-center lg:text-left w-full max-w-[360px]">
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-white transition-colors mb-3 outline-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Pick a different photo</span>
                </button>
                <h4 className="text-lg font-bold text-white tracking-tight">Preview</h4>
              </div>
              
              <BuilderIDCard
                photoUrl={photoUrl}
                name={name}
                role={role}
                funFact={funFact}
                title={title}
                photoState={photoState}
                onPhotoStateChange={setPhotoState}
              />
            </div>

            {/* Right Column: User Details Form */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
              <DetailsForm
                name={name}
                role={role}
                funFact={funFact}
                title={title}
                onUpdate={handleUpdateDetails}
              />
              
              <button
                onClick={handleCreateID}
                disabled={!name.trim() || !role.trim() || isProcessing}
                className="w-full py-4 bg-gradient-to-r from-goa-emerald to-goa-teal hover:from-goa-emerald/90 hover:to-goa-teal/90 active:scale-[0.99] text-obsidian font-bold text-lg rounded-2xl transition-all shadow-xl shadow-goa-emerald/10 flex items-center justify-center space-x-2 disabled:opacity-30 disabled:pointer-events-none select-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Putting it together…</span>
                  </>
                ) : (
                  <span>Make my ID</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {step === 'success' && finalImageBlob && (
          <div className="w-full max-w-xl text-center space-y-6 my-6 flex flex-col items-center">
            
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-goa-emerald/10 border border-goa-emerald/30 rounded-full text-goa-emerald mb-2">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">That's your Builder ID.</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Download your card or share it on X.
              </p>
            </div>

            <div className="w-full max-w-[320px] aspect-[1080/1350] bg-obsidian rounded-3xl overflow-hidden shadow-2xl ring-1 ring-goa-emerald/30 relative">
              <img
                src={finalImageBlob}
                alt="HH Goa 2026 Builder ID"
                className="w-full h-full object-contain"
              />
            </div>

            {shareError && (
              <div className="w-full max-w-sm p-4 bg-amber-950/20 border border-amber-900/50 rounded-2xl text-amber-400 text-xs flex items-start space-x-2 text-left animate-pulse">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{shareError}</span>
              </div>
            )}

            <div className="flex flex-col space-y-3 w-full max-w-[320px]">
              {/* Download button */}
              <button
                onClick={handleDownload}
                className="flex items-center justify-center space-x-2 py-4 px-6 bg-white hover:bg-slate-100 text-obsidian font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] select-none"
              >
                <Download className="w-5 h-5 text-obsidian" />
                <span>Download Image</span>
              </button>

              {/* Direct download link as fallback */}
              {finalImageBlob && (
                <a
                  href={finalImageBlob}
                  download={`HH-Goa-Builder-ID-${name.replace(/\s+/g, '-') || 'Card'}.png`}
                  className="flex items-center justify-center space-x-2 py-2.5 px-6 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm font-mono rounded-xl transition-all active:scale-[0.98] select-none"
                >
                  <span>↓ Direct link download</span>
                </a>
              )}
              
              <button
                onClick={handleShareToX}
                disabled={isProcessing}
                className="flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-goa-teal to-goa-emerald hover:from-goa-teal/90 hover:to-goa-emerald/90 text-white font-bold rounded-2xl shadow-xl shadow-goa-emerald/10 transition-all active:scale-[0.98] select-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <XLogoIcon className="w-4 h-4" />
                    <span>Share on X</span>
                  </>
                )}
              </button>

              <button
                onClick={handleStartOver}
                className="text-xs font-mono text-slate-500 hover:text-white transition-colors py-2 outline-none"
              >
                Make another
              </button>
            </div>
          </div>
        )}

        {/* Shared View (Direct Landing from Twitter/X links) */}
        {step === 'shared' && sharedId && (
          <div className="w-full max-w-xl text-center space-y-6 my-6 flex flex-col items-center">
            
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-goa-teal/10 border border-goa-teal/30 px-3 py-1 rounded-full text-xs text-goa-emerald tracking-wider font-mono uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-goa-emerald animate-pulse"></span>
                <span>HH Goa 2026</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">Builder ID</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                HH Goa 2026 Builder ID.
              </p>
            </div>

            <div className="w-full max-w-[320px] aspect-[1080/1350] bg-obsidian rounded-3xl overflow-hidden shadow-2xl ring-1 ring-goa-emerald/30 relative">
              <img
                src={`https://res.cloudinary.com/${CLOUD_NAME || 'demo'}/image/upload/${sharedId}`}
                alt="HH Goa 2026 Builder ID"
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image load failed, showing placeholder');
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%221080%22 height=%221350%22 viewBox=%220 0 1080 1350%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%230B0F17%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2240%22 fill=%22%2364748B%22 text-anchor=%22middle%22>PHOTO LOAD ERROR</text></svg>';
                }}
              />
            </div>

            <div className="flex flex-col space-y-3 w-full max-w-[320px]">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center space-x-2 py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] select-none border border-slate-700"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              <button
                onClick={handleStartOver}
                className="flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-goa-teal to-goa-emerald hover:from-goa-teal/90 hover:to-goa-emerald/90 text-white font-bold rounded-2xl shadow-xl shadow-goa-emerald/10 transition-all active:scale-[0.98] select-none"
              >
                <span>Make your ID</span>
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="w-full py-6 text-center border-t border-slate-900/60 bg-obsidian-dark/40 z-10">
        <p className="text-[11px] font-mono text-slate-600">
          HH GOA 2026 // NO SIGNUPS // #FrameInGoa 🌴
        </p>
      </footer>
    </div>
  );
}
