import { useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { drawBuilderIDCard } from '../utils/canvasGenerator';

export interface PhotoState {
  zoom: number;
  panX: number;
  panY: number;
}

interface BuilderIDCardProps {
  photoUrl: string;
  name: string;
  role: string;
  funFact: string;
  title: string;
  photoState: PhotoState;
  onPhotoStateChange: (state: PhotoState) => void;
}

export default function BuilderIDCard({
  photoUrl,
  name,
  role,
  funFact,
  title,
  photoState,
  onPhotoStateChange,
}: BuilderIDCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redraw canvas whenever any value changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let active = true;
    drawBuilderIDCard(canvas, {
      photoUrl,
      name,
      role,
      funFact,
      title,
      photoState,
    }).catch(err => {
      if (active) console.error('Failed to render canvas:', err);
    });

    return () => { active = false; };
  }, [photoUrl, name, role, funFact, title, photoState]);

  // --- Pan drag handling ---
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ panX: 0, panY: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { panX: photoState.panX, panY: photoState.panY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const scale = 1080 / (canvasRef.current?.offsetWidth ?? 360); // canvas scale factor
    const dx = (e.clientX - dragStart.current.x) * scale;
    const dy = (e.clientY - dragStart.current.y) * scale;
    onPhotoStateChange({
      ...photoState,
      panX: panStart.current.panX + dx,
      panY: panStart.current.panY + dy,
    });
  };

  const onMouseUp = () => { isDragging.current = false; };

  // Touch pan
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    isDragging.current = true;
    dragStart.current = { x: t.clientX, y: t.clientY };
    panStart.current = { panX: photoState.panX, panY: photoState.panY };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const t = e.touches[0];
    const scale = 1080 / (canvasRef.current?.offsetWidth ?? 360);
    const dx = (t.clientX - dragStart.current.x) * scale;
    const dy = (t.clientY - dragStart.current.y) * scale;
    onPhotoStateChange({
      ...photoState,
      panX: panStart.current.panX + dx,
      panY: panStart.current.panY + dy,
    });
  };

  const onTouchEnd = () => { isDragging.current = false; };

  const handleZoom = (delta: number) => {
    const newZoom = Math.min(3.0, Math.max(0.5, photoState.zoom + delta));
    onPhotoStateChange({ ...photoState, zoom: newZoom });
  };

  const handleReset = () => {
    onPhotoStateChange({ zoom: 1.0, panX: 0, panY: 0 });
  };

  return (
    <div className="w-full flex flex-col items-center px-2 gap-3">
      {/* Canvas Preview */}
      <div
        className="w-full max-w-[calc(100vw-40px)] sm:max-w-[360px] aspect-[1080/1350] bg-obsidian-dark rounded-3xl relative overflow-hidden shadow-2xl ring-1 ring-slate-800/80 cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block select-none rounded-3xl pointer-events-none"
        />
      </div>

      {/* Photo Adjustment Controls */}
      {photoUrl && (
        <div className="flex items-center gap-3 bg-obsidian-light/60 border border-slate-800 rounded-2xl px-4 py-2.5 backdrop-blur-sm w-full max-w-[calc(100vw-40px)] sm:max-w-[360px]">
          {/* Zoom out */}
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all active:scale-90"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom slider */}
          <div className="flex-1 flex flex-col gap-0.5">
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.05}
              value={photoState.zoom}
              onChange={e => onPhotoStateChange({ ...photoState, zoom: parseFloat(e.target.value) })}
              className="w-full h-1.5 appearance-none rounded-full bg-slate-700 accent-goa-emerald cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono px-0.5">
              <span>0.5×</span>
              <span className="text-slate-400">{photoState.zoom.toFixed(1)}×</span>
              <span>3×</span>
            </div>
          </div>

          {/* Zoom in */}
          <button
            onClick={() => handleZoom(0.1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all active:scale-90"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-goa-emerald hover:bg-slate-700/50 rounded-lg transition-all active:scale-90"
            title="Reset position"
          >
            <Move className="w-4 h-4" />
          </button>
        </div>
      )}

      {photoUrl && (
        <p className="text-[11px] text-slate-600 font-mono text-center">
          Drag to reposition · Scroll to zoom
        </p>
      )}
    </div>
  );
}
