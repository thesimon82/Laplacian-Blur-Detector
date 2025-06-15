/**
 * blurMeter 1.0.3 – Evaluate image sharpness using Laplacian variance
 * Returns an integer from 1 (very blurry) to 10 (perfectly sharp).
 *
 * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|ImageBitmap} source
 * @param {{thresholdMin?:number, thresholdMax?:number}=} opts
 * @return {Promise<{score:number, variance:number}>}
 *
 * USAGE EXAMPLE:
 *   import { blurMeter } from './js/blur-meter.js';
 *   const { score } = await blurMeter(img);
 */
export async function blurMeter(source, opts = {}) {
  // --- Calibrated defaults based on your empirical data (variance ≈ 9 … 50) ---
  const T_min = opts.thresholdMin ?? 25;    // variance that maps to score 1
  const T_max = opts.thresholdMax ?? 10000;   // variance that maps to score 10

  /* ---------- 1. Prepare off-screen canvas ---------- */
  const w = source.width  || source.videoWidth  || source.naturalWidth;
  const h = source.height || source.videoHeight || source.naturalHeight;
  if (!w || !h) throw new Error("Source has invalid dimensions");

  // Use OffscreenCanvas when available; otherwise fall back to a hidden <canvas>
  const off = typeof OffscreenCanvas === "function"
    ? new OffscreenCanvas(w, h)
    : (() => {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        return c;
      })();
  const ctx = off.getContext("2d");
  ctx.drawImage(source, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h); // Uint8ClampedArray RGBA

  /* ---------- 2. Convert to grayscale ---------- */
  const gray = new Float32Array(w * h);
  for (let i = 0, j = 0; i < data.length; i += 4, ++j) {
    // Standard sRGB luminance conversion
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  /* ---------- 3. Apply Laplacian (4-neighbor kernel) ---------- */
  const lap = new Float32Array(w * h);
  const idx = (x, y) => y * w + x;
  for (let y = 1; y < h - 1; ++y) {
    for (let x = 1; x < w - 1; ++x) {
      const i = idx(x, y);
      lap[i] =
        4 * gray[i] -
        gray[idx(x - 1, y)] -
        gray[idx(x + 1, y)] -
        gray[idx(x, y - 1)] -
        gray[idx(x, y + 1)];
    }
  }

  /* ---------- 4. Compute variance of Laplacian ---------- */
  let sum = 0, sumSq = 0, count = (w - 2) * (h - 2);
  for (let y = 1; y < h - 1; ++y) {
    for (let x = 1; x < w - 1; ++x) {
      const v = lap[idx(x, y)];
      sum   += v;
      sumSq += v * v;
    }
  }
  const mean = sum / count;
  const variance = (sumSq / count) - (mean * mean);

  /* ---------- 5. Map variance to 1-10 score ---------- */
  const norm  = Math.max(0, Math.min(1, (variance - T_min) / (T_max - T_min)));
  const score = Math.round(1 + 9 * norm);

  return { score, variance };
}

/* ---------- Optional: default export for brace-less import ---------- */
export default blurMeter;