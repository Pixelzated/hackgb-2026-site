// The kiosk's two LEDs (D5 "press me", D16 countdown and errors), as patterns computed from the
// clock. A copy of PATTERNS in the kiosk's server.py, so the page's LEDs blink the same way.
const breathe = (t, period) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / period);

// name: [levels at t seconds -> [d5, d16], length in seconds or null, pattern that follows]
export const PATTERNS = {
  off: [() => [0, 0], null, null],
  idle: [(t) => [0.06 + 0.6 * breathe(t, 5), 0], null, null],
  ready: [() => [1, 0], null, null],
  tick: [(t) => [0, t < 0.15 ? 1 : Math.max(0, 1 - (t - 0.15) / 0.35)], 0.5, 'off'],
  flash: [(t) => { const l = t < 0.3 ? 1 : Math.max(0, 1 - (t - 0.3) / 0.4); return [l, l]; }, 0.7, 'off'],
  thinking: [(t) => [breathe(t, 1.6), breathe(t + 0.8, 1.6)], null, null],
  success: [(t) => {
    if (t < 1.5) { const on = (t * 4) % 1 < 0.6 ? 1 : 0; return [on, on]; }
    const l = 0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, (t - 1.5) / 2.5));
    return [l, l];
  }, 4, 'idle'],
  error: [(t) => [0, (t * 5) % 1 < 0.5 ? 1 : 0], 1.6, 'off']
};

/** Run the patterns every animation frame and report [d5, d16] levels (0 to 1). */
export function createLeds(onLevels) {
  let name = 'idle', then = null, t0 = performance.now(), frame;
  const loop = (now) => {
    const [fn, length, follow] = PATTERNS[name];
    let t = (now - t0) / 1000;
    if (length !== null && t >= length) {
      name = then || follow || 'off';
      then = null;
      t0 = now;
      t = 0;
    }
    onLevels(PATTERNS[name][0](t));
    frame = requestAnimationFrame(loop);
  };
  frame = requestAnimationFrame(loop);
  return {
    set(pattern, next = null) {
      if (!(pattern in PATTERNS)) return;
      name = pattern;
      then = next;
      t0 = performance.now();
    },
    destroy: () => cancelAnimationFrame(frame)
  };
}
