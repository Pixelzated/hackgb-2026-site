// The kiosk's hardware, faked for the web demo. The real version (feature/kiosk, ui/src/lib/hw.js)
// talks to server.py on the Pi; this one has the same exports:
//   camera  -> a looping stock video (VIDEO_SRC)
//   button  -> messages from the page around the iframe (its big round button), or taps and the space bar
//   LEDs    -> pattern names sent up to that page, which draws the two LEDs
export const VIDEO_SRC = '/media/sweater.mp4';

const parentWindow = typeof window !== 'undefined' && window.parent !== window ? window.parent : null;
const tell = (msg) => parentWindow?.postMessage({ rehomeKiosk: true, ...msg }, location.origin);

/** True when the kiosk is shown inside the landing page's device frame. */
export const embedded = !!parentWindow;

/** The "webcam": one shared, muted, looping video that the ASCII mirror and snap() read from. */
export const video = typeof document === 'undefined' ? null : (() => {
  const v = document.createElement('video');
  Object.assign(v, { src: VIDEO_SRC, muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto' });
  v.setAttribute('aria-hidden', 'true');
  v.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
  document.body.append(v);
  v.play().catch(() => {});
  return v;
})();

/** Same events as the real kiosk server: a `state` right away, then `button` presses. */
export function connect(handlers) {
  handlers.state?.({
    button: { pressed: false, n: 0 },
    presence: { present: true, motion: 0 },
    camera: { status: 'running', device: 'demo video' },
    leds: { pattern: 'idle' },
    boot: 'demo'
  });
  const onMessage = (e) => {
    if (e.origin !== location.origin || !e.data?.rehomeKiosk) return;
    if (e.data.type === 'button') handlers.button?.({ pressed: e.data.pressed });
    if (e.data.type === 'visible') e.data.visible ? video?.play().catch(() => {}) : video?.pause();
  };
  addEventListener('message', onMessage);
  tell({ type: 'ready' });
  return () => removeEventListener('message', onMessage);
}

export function leds(pattern, then) {
  tell({ type: 'leds', pattern, then: then ?? null });
}

/** The current video frame as a JPEG, like the kiosk's /hw/frame.jpg. */
export async function snap() {
  if (!video || video.readyState < 2) throw new Error("The camera isn't ready yet.");
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
}
