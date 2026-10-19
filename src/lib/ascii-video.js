// Draws a video as colored ASCII on a canvas. The kiosk demo's mirror and the landing page's
// clip of the real kiosk both use it.
//
// Each frame: the picture is cropped to the canvas's shape and shrunk to one pixel per
// character cell. Brightness picks the character; the cell colors (saturation boosted) are then
// painted over the glyphs with `source-in`, so every character takes its spot's color.
// Where brightness changes sharply, the cell gets a line along the edge instead (- / | \),
// thinned to one cell like the landing page's ASCII house, so shapes stay readable.
// Brightness and color ease from frame to frame, and a character only changes when its cell
// clearly changes, so video noise doesn't make the picture shimmer.

const RAMP = ' .:-=+*#%@';
const EDGES = '-/|\\'; // by edge angle: 0°, 45°, 90°, 135°
const EDGE_AT = 1.1; // edge strength (Sobel, on 0-1 brightness) that draws a line
const FONT = '"DM Mono", monospace';

/**
 * @param {HTMLCanvasElement} canvas  sized by CSS; redrawn at that size
 * @param {HTMLVideoElement} video
 * @param {{ cellPx?: number, mirror?: boolean, fps?: number, smoothing?: number,
 *   zoom?: number, focus?: [number, number] }} [options]
 *   cellPx: character width in CSS pixels. Smaller is sharper but turns to stripes below ~5.
 *   smoothing: 0 = raw frames, 0.9 = very calm.
 *   zoom, focus: crop in by `zoom` around `focus` (0-1 across and down the video).
 */
export function asciiVideo(canvas, video, { cellPx = 6, mirror = false, fps = 12, smoothing = 0.6, zoom = 1, focus = [0.5, 0.5] } = {}) {
  const out = canvas.getContext('2d');
  const small = document.createElement('canvas');
  const sctx = small.getContext('2d', { willReadFrequently: true });
  const tint = document.createElement('canvas');
  const tctx = tint.getContext('2d');
  let cols = 0, rows = 0, cellW = 0, fontPx = 0, W = 0, H = 0;
  let lum, rgb, glyph, colors;
  let lo = 0, hi = 255;

  function layout() {
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (!cw || !ch) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.width = Math.round(cw * dpr);
    H = canvas.height = Math.round(ch * dpr);
    cols = Math.max(24, Math.min(160, Math.round(cw / cellPx)));
    cellW = W / cols;
    out.font = `500 100px ${FONT}`;
    fontPx = (cellW / out.measureText('0').width) * 100; // glyph advance == cell width exactly
    rows = Math.ceil(H / fontPx);
    small.width = tint.width = cols;
    small.height = tint.height = rows;
    lum = rgb = null; // start the easing over at the new size
    glyph = new Int8Array(cols * rows).fill(-1);
    colors = tctx.createImageData(cols, rows);
  }

  function draw() {
    if (!cols || video.readyState < 2 || (video.paused && lum)) return; // paused: off screen, keep the last frame
    // Crop the video to the grid's shape (like object-fit: cover), zoomed in around `focus`
    const vw = video.videoWidth, vh = video.videoHeight, shape = (cols * cellW) / (rows * fontPx);
    const sw = Math.min(vw, vh * shape) / zoom, sh = Math.min(vh, vw / shape) / zoom;
    const sx = Math.max(0, Math.min(vw - sw, focus[0] * vw - sw / 2));
    const sy = Math.max(0, Math.min(vh - sh, focus[1] * vh - sh / 2));
    sctx.setTransform(mirror ? -1 : 1, 0, 0, 1, mirror ? cols : 0, 0);
    sctx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
    const px = sctx.getImageData(0, 0, cols, rows).data;

    const n = cols * rows;
    const first = !lum;
    if (first) (lum = new Float32Array(n)), (rgb = new Float32Array(n * 3));
    const keep = first ? 0 : smoothing;
    let min = 255, max = 0;
    for (let i = 0, j = 0; i < n; i++, j += 4) {
      const k = i * 3;
      rgb[k] = rgb[k] * keep + px[j] * (1 - keep);
      rgb[k + 1] = rgb[k + 1] * keep + px[j + 1] * (1 - keep);
      rgb[k + 2] = rgb[k + 2] * keep + px[j + 2] * (1 - keep);
      const l = 0.299 * rgb[k] + 0.587 * rgb[k + 1] + 0.114 * rgb[k + 2];
      lum[i] = l;
      if (l < min) min = l;
      if (l > max) max = l;
      // Richer, brighter color than a webcam gives, so it reads on a dark screen
      colors.data[j] = Math.min(255, (l + (rgb[k] - l) * 1.9) * 1.35 + 30);
      colors.data[j + 1] = Math.min(255, (l + (rgb[k + 1] - l) * 1.9) * 1.35 + 30);
      colors.data[j + 2] = Math.min(255, (l + (rgb[k + 2] - l) * 1.9) * 1.35 + 30);
      colors.data[j + 3] = 255;
    }
    // Stretch the contrast to this scene, eased so the picture doesn't pump
    lo += (min - lo) * 0.1;
    hi += (Math.max(max, lo + 48) - hi) * 0.1;

    out.globalCompositeOperation = 'source-over';
    out.clearRect(0, 0, W, H);
    out.fillStyle = '#fff';
    out.font = `500 ${fontPx}px ${FONT}`;
    out.textBaseline = 'top';
    // Edges: Sobel on 0-1 brightness, then keep only the strongest cell across each edge
    const range = hi - lo;
    const at = (c, r) => (lum[Math.min(rows - 1, Math.max(0, r)) * cols + Math.min(cols - 1, Math.max(0, c))] - lo) / range;
    const gx = new Float32Array(n), gy = new Float32Array(n), mag = new Float32Array(n);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const tl = at(c - 1, r - 1), tc = at(c, r - 1), tr = at(c + 1, r - 1);
        const ml = at(c - 1, r), mr = at(c + 1, r);
        const bl = at(c - 1, r + 1), bc = at(c, r + 1), br = at(c + 1, r + 1);
        gx[i] = tr + 2 * mr + br - tl - 2 * ml - bl;
        gy[i] = bl + 2 * bc + br - tl - 2 * tc - tr;
        mag[i] = Math.hypot(gx[i], gy[i]);
      }
    }

    let changed = 0;
    for (let r = 0; r < rows; r++) {
      let line = '';
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        let next = -1;
        if (mag[i] > EDGE_AT) {
          const dx = Math.round(gx[i] / mag[i]), dy = Math.round(gy[i] / mag[i]);
          const ahead = mag[Math.min(rows - 1, Math.max(0, r + dy)) * cols + Math.min(cols - 1, Math.max(0, c + dx))];
          const behind = mag[Math.min(rows - 1, Math.max(0, r - dy)) * cols + Math.min(cols - 1, Math.max(0, c - dx))];
          if (mag[i] >= ahead && mag[i] >= behind) {
            // The line runs across the gradient; 0° is horizontal, 90° vertical (screen y points down)
            const angle = ((Math.atan2(-gx[i], -gy[i]) * 180) / Math.PI + 360) % 180;
            next = RAMP.length + (Math.round(angle / 45) % 4);
          }
        }
        let g = glyph[i];
        if (next < 0) {
          const target = (Math.max(0, (lum[i] - lo) / range) ** 0.75) * (RAMP.length - 1);
          // Only switch fill characters on a clear change, not on noise at the boundary between two
          next = g >= 0 && g < RAMP.length && Math.abs(target - g) <= 0.75 ? g : Math.max(0, Math.min(RAMP.length - 1, Math.round(target)));
        }
        if (next !== g) changed++;
        glyph[i] = g = next;
        line += g < RAMP.length ? RAMP[g] : EDGES[g - RAMP.length];
      }
      out.fillText(line, 0, r * fontPx);
    }
    canvas.dataset.flicker = (changed / n).toFixed(3); // share of characters that changed this frame
    tctx.putImageData(colors, 0, 0);
    out.globalCompositeOperation = 'source-in';
    out.imageSmoothingEnabled = false;
    out.drawImage(tint, 0, 0, cols * cellW, rows * fontPx);
  }

  let timer;
  const resize = new ResizeObserver(layout);
  document.fonts.load(`500 16px ${FONT}`).finally(() => {
    resize.observe(canvas);
    layout();
    timer = setInterval(draw, 1000 / fps);
  });
  return () => {
    clearInterval(timer);
    resize.disconnect();
  };
}
