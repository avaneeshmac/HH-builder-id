interface PhotoState {
  zoom: number;
  panX: number;
  panY: number;
}

interface DrawData {
  photoUrl: string;
  name: string;
  role: string;
  funFact: string;
  title: string;
  photoState: PhotoState;
}

/**
 * Loads an image from a URL or base64 string
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

/**
 * Helper to ensure fonts are fully loaded before rendering
 */
export async function ensureFontsLoaded(): Promise<boolean> {
  try {
    if ('fonts' in document) {
      await document.fonts.ready;
      await Promise.all([
        document.fonts.load('italic bold 72px "Playfair Display"'),
        document.fonts.load('italic bold 56px "Playfair Display"'),
        document.fonts.load('bold 40px "Space Mono"'),
        document.fonts.load('bold 30px "Space Mono"'),
        document.fonts.load('bold 28px "Space Mono"'),
        document.fonts.load('bold 26px "Space Mono"'),
        document.fonts.load('bold 24px "Space Mono"'),
        document.fonts.load('bold 22px "Space Mono"'),
      ]);
      return true;
    }
  } catch (e) {
    console.warn('Font loading API error:', e);
  }
  return false;
}

/**
 * Draws a 4-pointed star/sparkle on the canvas
 */
function drawSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, rOuter: number) {
  const rInner = rOuter * 0.25;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Programmatic vector drawing: Palm Tree
 */
function drawPalmTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // Trunk
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 40, y - 100, x - 10, y - 200);
  ctx.stroke();

  // Fronds
  const fx = x - 10;
  const fy = y - 200;
  const frondCount = 6;
  for (let i = 0; i < frondCount; i++) {
    const angle = (i * Math.PI) / (frondCount - 1) - Math.PI;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    const tx = fx + Math.cos(angle) * 70;
    const ty = fy + Math.sin(angle) * 50;
    ctx.quadraticCurveTo(fx + Math.cos(angle) * 35, fy + Math.sin(angle) * 70, tx, ty);
    ctx.stroke();
  }

  // Coconuts
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(fx - 5, fy + 10, 8, 0, Math.PI * 2);
  ctx.arc(fx + 5, fy + 5, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Programmatic vector drawing: Beer Mug
 */
function drawBeerMug(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.fillStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';

  // Mug Body
  ctx.beginPath();
  ctx.moveTo(x - 15, y + 40);
  ctx.lineTo(x - 20, y - 20);
  ctx.lineTo(x + 20, y - 20);
  ctx.lineTo(x + 15, y + 40);
  ctx.closePath();
  ctx.stroke();

  // Handle
  ctx.beginPath();
  ctx.moveTo(x + 18, y - 10);
  ctx.quadraticCurveTo(x + 35, y + 5, x + 16, y + 25);
  ctx.stroke();

  // Beer lines
  ctx.beginPath();
  ctx.moveTo(x - 8, y + 30);
  ctx.lineTo(x - 8, y - 5);
  ctx.moveTo(x + 8, y + 30);
  ctx.lineTo(x + 8, y - 5);
  ctx.stroke();

  // Foam bubbles on top
  ctx.beginPath();
  ctx.arc(x - 15, y - 25, 10, 0, Math.PI * 2);
  ctx.arc(x, y - 28, 12, 0, Math.PI * 2);
  ctx.arc(x + 15, y - 24, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Programmatic vector drawing: Fish
 */
function drawFish(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';

  // Fish body
  ctx.beginPath();
  ctx.moveTo(x - 30, y);
  ctx.quadraticCurveTo(x, y - 25, x + 25, y);
  ctx.quadraticCurveTo(x, y + 25, x - 30, y);
  ctx.closePath();
  ctx.stroke();

  // Tail fin
  ctx.beginPath();
  ctx.moveTo(x - 30, y);
  ctx.lineTo(x - 45, y - 15);
  ctx.lineTo(x - 45, y + 15);
  ctx.closePath();
  ctx.stroke();

  // Eye
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x + 12, y - 4, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Programmatic vector drawing: Sailboat
 */
function drawSailboat(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';

  // Boat Base
  ctx.beginPath();
  ctx.moveTo(x - 40, y + 20);
  ctx.lineTo(x + 40, y + 20);
  ctx.lineTo(x + 25, y + 40);
  ctx.lineTo(x - 25, y + 40);
  ctx.closePath();
  ctx.stroke();

  // Mast
  ctx.beginPath();
  ctx.moveTo(x, y + 20);
  ctx.lineTo(x, y - 35);
  ctx.stroke();

  // Big Sail (Left)
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 14);
  ctx.lineTo(x - 4, y - 30);
  ctx.lineTo(x - 32, y + 14);
  ctx.closePath();
  ctx.stroke();

  // Small Sail (Right)
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 14);
  ctx.lineTo(x + 4, y - 20);
  ctx.lineTo(x + 24, y + 14);
  ctx.closePath();
  ctx.stroke();

  // Wave line under boat
  ctx.beginPath();
  ctx.moveTo(x - 55, y + 48);
  ctx.quadraticCurveTo(x - 27, y + 43, x, y + 48);
  ctx.quadraticCurveTo(x + 27, y + 43, x + 55, y + 48);
  ctx.stroke();

  ctx.restore();
}

/**
 * Programmatic vector drawing: Crab
 */
function drawCrab(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;

  // Body
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 30, 20, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyes
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 8);
  ctx.lineTo(x - 12, y - 18);
  ctx.moveTo(x + 12, y - 8);
  ctx.lineTo(x + 12, y - 18);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x - 12, y - 20, 5, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 20, 5, 0, Math.PI * 2);
  ctx.fill();

  // Claws (Left & Right)
  ctx.beginPath();
  ctx.moveTo(x - 25, y + 5);
  ctx.quadraticCurveTo(x - 45, y - 15, x - 30, y - 30);
  ctx.moveTo(x + 25, y + 5);
  ctx.quadraticCurveTo(x + 45, y - 15, x + 30, y - 30);
  ctx.stroke();

  // Legs (3 on each side)
  for (let i = 0; i < 3; i++) {
    const legOffset = i * 8;
    ctx.beginPath();
    ctx.moveTo(x - 25, y + 10 + legOffset);
    ctx.quadraticCurveTo(x - 45, y + 15 + legOffset, x - 40, y + 30 + legOffset);
    
    ctx.moveTo(x + 25, y + 10 + legOffset);
    ctx.quadraticCurveTo(x + 45, y + 15 + legOffset, x + 40, y + 30 + legOffset);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws a clean centered pill badge with overflow protection
 */
function drawPillBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string) {
  const fontSize = 26;
  ctx.font = `bold ${fontSize}px "Space Mono"`;

  // Clamp text to max width of 880px inside the card
  const maxTextWidth = 880;
  let displayText = text;
  while (ctx.measureText(displayText).width > maxTextWidth && displayText.length > 4) {
    displayText = displayText.slice(0, -1);
  }
  if (displayText !== text) displayText += '…';

  const textWidth = ctx.measureText(displayText).width;
  const padX = 44;
  const padY = 18;
  const w = Math.min(textWidth + padX * 2, 980);
  const h = fontSize + padY * 2;
  const rx = cx - w / 2;
  const ry = cy - h / 2;

  // Shadow glow
  ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
  ctx.shadowBlur = 18;

  ctx.fillStyle = '#EC4899';
  ctx.beginPath();
  ctx.roundRect(rx, ry, w, h, h / 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayText, cx, cy);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

/**
 * Draws the Builder ID Card matching the user's forest green tropical design.
 * Dimensions: 1080x1350 px.
 */
export async function drawBuilderIDCard(
  canvas: HTMLCanvasElement,
  data: DrawData
): Promise<void> {
  const { photoUrl, name, role, funFact, title, photoState } = data;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  canvas.width = 1080;
  canvas.height = 1350;

  // Ensure fonts are ready
  await ensureFontsLoaded();

  // --- 1. Forest Green Background ---
  ctx.fillStyle = '#014F33';
  ctx.fillRect(0, 0, 1080, 1350);

  // --- 2. Symmetrical Thin White Frame ---
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(40, 40, 1000, 1270, 36);
  ctx.stroke();

  // Top camera notch circle decoration
  ctx.strokeStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(540, 60, 16, 0, Math.PI * 2);
  ctx.stroke();


  // Thin yellow accent stripe at the very top inside the frame
  ctx.fillStyle = '#FCD34D';
  ctx.fillRect(80, 78, 920, 5);

  // --- 3. Top Header Branding ---
  // Vertical centre of the header band: between stripe (y=83) and photo top (y=175)
  // Header band mid = ~130. Two-line block height ~60px, so top line at ~100, bottom at ~155.

  // LEFT: Stacked "HACKER" + "HOUSE" wordmark
  ctx.font = 'bold 22px "Space Mono"';
  ctx.fillStyle = 'rgba(252, 211, 77, 0.75)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('HACKER', 88, 108);

  ctx.font = 'bold 40px "Space Mono"';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('HOUSE', 88, 152);

  // RIGHT: Goa in Playfair Display + // 2026 in Space Mono — same band height
  ctx.font = 'italic bold 56px "Playfair Display"';
  ctx.fillStyle = '#FCD34D';
  ctx.textAlign = 'right';
  ctx.shadowColor = 'rgba(252, 211, 77, 0.35)';
  ctx.shadowBlur = 14;
  ctx.fillText('Goa', 985, 118);
  ctx.shadowBlur = 0;

  ctx.font = 'bold 24px "Space Mono"';
  ctx.fillStyle = '#FB923C';
  ctx.fillText('// 2026', 985, 152);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // --- 4. Draw Ambient Sparkles ---
  ctx.fillStyle = 'rgba(252, 211, 77, 0.2)';
  drawSparkle(ctx, 160, 185, 14);
  drawSparkle(ctx, 920, 185, 12);

  // --- 5. Center Photo view with thick Yellow Border ---
  const px = 220;
  const py = 160;
  const pw = 640;
  const ph = 580;

  if (photoUrl) {
    try {
      const img = await loadImage(photoUrl);
      ctx.save();
      
      // Strict sharp crop container inside yellow border
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
      
      const scale = Math.max(pw / img.width, ph / img.height);
      const coverW = img.width * scale;
      const coverH = img.height * scale;
      
      const cx = px + pw / 2;
      const cy = py + ph / 2;
      
      const dw = coverW * photoState.zoom;
      const dh = coverH * photoState.zoom;
      
      const dx = cx - dw / 2 + photoState.panX;
      const dy = cy - dh / 2 + photoState.panY;
      
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    } catch (e) {
      console.error(e);
    }
  }

  // Draw solid yellow border overlay
  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 14;
  ctx.strokeRect(px, py, pw, ph);

  // --- 6. Programmatic Side Vector Line Art ---
  // Left illustrations
  drawPalmTree(ctx, 110, 520);
  drawBeerMug(ctx, 110, 680);
  drawFish(ctx, 120, 800);

  // Right illustrations
  drawSailboat(ctx, 950, 480);
  drawCrab(ctx, 950, 640);

  // --- 7. Centered Details Text Area ---
  const textCX = 540;
  let textY = 860;

  // Name: Playfair Display Bold Italic — warm yellow, large & elegant
  const rawName = name.trim() || 'Your Name';
  ctx.font = 'italic bold 72px "Playfair Display"';
  ctx.fillStyle = '#FCD34D';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Auto-shrink name font if too wide
  let nameFontSize = 72;
  while (ctx.measureText(rawName).width > 920 && nameFontSize > 36) {
    nameFontSize -= 2;
    ctx.font = `italic bold ${nameFontSize}px "Playfair Display"`;
  }

  // Subtle text shadow for name
  ctx.shadowColor = 'rgba(252, 211, 77, 0.4)';
  ctx.shadowBlur = 20;
  ctx.fillText(rawName, textCX, textY);
  ctx.shadowBlur = 0;

  textY += nameFontSize * 0.72 + 18;

  // Thin separator dots
  ctx.fillStyle = 'rgba(252, 211, 77, 0.5)';
  for (let d = -1; d <= 1; d++) {
    ctx.beginPath();
    ctx.arc(textCX + d * 22, textY, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  textY += 28;

  // Role: Clean tracked uppercase in soft white
  const rawRole = role.trim() || 'Builder';
  ctx.font = 'bold 30px "Space Mono"';
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.textAlign = 'center';

  // Auto-shrink role font if too wide
  let roleFontSize = 30;
  while (ctx.measureText(rawRole.toUpperCase()).width > 920 && roleFontSize > 18) {
    roleFontSize -= 2;
    ctx.font = `bold ${roleFontSize}px "Space Mono"`;
  }
  ctx.fillText(rawRole.toUpperCase(), textCX, textY);

  textY += roleFontSize + 42;

  // --- 8. Double Pink Pill Badges ---
  const firstBadgeText = (title.trim() || 'Ship-It Architect').toUpperCase();
  drawPillBadge(ctx, textCX, textY, firstBadgeText);

  textY += 80;

  const secondBadgeText = (funFact.trim() || 'BUILD MODE: ON').toUpperCase();
  drawPillBadge(ctx, textCX, textY, secondBadgeText);

  // --- 9. Footer — just the hashtag ---
  ctx.font = 'bold 28px "Space Mono"';
  ctx.fillStyle = 'rgba(252, 211, 77, 0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('#FrameInGoa', textCX, 1290);

  // Reset
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}
export type { PhotoState };
