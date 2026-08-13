import { useRef, useEffect } from 'react';
import { drawBuilderIDCard } from '../utils/canvasGenerator';

interface BuilderIDCardProps {
  photoUrl: string;
  name: string;
  role: string;
  funFact: string;
  title: string;
}

export default function BuilderIDCard({
  photoUrl,
  name,
  role,
  funFact,
  title
}: BuilderIDCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redraw canvas on updates
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
      photoState: { zoom: 1.0, panX: 0, panY: 0 }
    }).catch(err => {
      if (active) console.error('Failed to render canvas:', err);
    });

    return () => {
      active = false;
    };
  }, [photoUrl, name, role, funFact, title]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Canvas Container */}
      <div className="w-full max-w-[340px] sm:max-w-[360px] aspect-[1080/1350] bg-obsidian-dark rounded-3xl relative overflow-hidden shadow-2xl ring-1 ring-slate-800/80">
        {/* Canvas for rendering */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block select-none rounded-3xl"
        />
      </div>
    </div>
  );
}
