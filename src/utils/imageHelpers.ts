/**
 * Helper to check and convert HEIC files to JPEGs client-side using heic2any
 */
async function handleHeicIfNecessary(file: File): Promise<File | Blob> {
  const name = file.name.toLowerCase();
  const isHeic = name.endsWith('.heic') || name.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';
  
  if (!isHeic) {
    return file;
  }

  try {
    // Dynamically import heic2any to keep bundle size small initially
    // @ts-ignore
    const heic2anyModule = await import('heic2any');
    const heic2any = heic2anyModule.default || heic2anyModule;
    
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.85
    });
    
    if (Array.isArray(converted)) {
      return converted[0];
    }
    return converted;
  } catch (error) {
    console.error('HEIC conversion failed:', error);
    throw new Error('Could not convert HEIC photo. Please upload a standard JPG/PNG.');
  }
}

/**
 * Resizes and compresses an image file to a maximum dimension (default 1200px)
 * to prevent high memory usage and ensure fast canvas rendering.
 * Returns a Promise resolving to a base64 Data URL.
 */
export async function processUploadedFile(file: File, maxDimension = 1200): Promise<string> {
  // 1. Process HEIC files if necessary
  const processedBlob = await handleHeicIfNecessary(file);
  
  // 2. Read file as Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate target dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        // Draw to a temporary canvas to resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize canvas context.'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as JPEG at 0.85 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Invalid image file. Please try another photo.'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading photo file.'));
    };
    
    reader.readAsDataURL(processedBlob);
  });
}
