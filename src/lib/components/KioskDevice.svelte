<script>
  // A drawing of the kiosk around a live demo of its screen (/kiosk in an iframe): two LEDs that
  // run the real kiosk's patterns, and the big button. Press it, or tap the screen; hold to sell.
  import { onMount } from 'svelte';
  import { createLeds } from '$lib/kiosk/leds.js';

  let frame;
  let pressed = $state(false);
  let d5 = $state(0);
  let d16 = $state(0);

  const send = (msg) => frame?.contentWindow?.postMessage({ rehomeKiosk: true, ...msg }, location.origin);

  function press(e) {
    e?.preventDefault();
    if (pressed) return;
    pressed = true;
    send({ type: 'button', pressed: true });
  }

  function release() {
    if (!pressed) return;
    pressed = false;
    send({ type: 'button', pressed: false });
  }

  function onkeydown(e) {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) press(e);
  }

  function onkeyup(e) {
    if (e.key === ' ' || e.key === 'Enter') release();
  }

  onMount(() => {
    const leds = createLeds(([a, b]) => ((d5 = a), (d16 = b)));
    const onMessage = (e) => {
      if (e.origin !== location.origin || e.source !== frame?.contentWindow || !e.data?.rehomeKiosk) return;
      if (e.data.type === 'leds') leds.set(e.data.pattern, e.data.then);
    };
    addEventListener('message', onMessage);
    // Pause the video and its ASCII rendering while the kiosk is off screen
    const seen = new IntersectionObserver(([entry]) => send({ type: 'visible', visible: entry.isIntersecting }));
    seen.observe(frame);
    return () => {
      leds.destroy();
      seen.disconnect();
      removeEventListener('message', onMessage);
    };
  });

  // An LED: dark plastic when off, its color and a soft glow as it brightens
  const led = (level, rgb) =>
    `background: color-mix(in oklab, rgb(${rgb}) ${Math.round(level * 100)}%, #3a2f40); ` +
    `box-shadow: 0 0 ${(level * 18).toFixed(1)}px ${(level * 3).toFixed(1)}px rgb(${rgb} / ${(level * 0.7).toFixed(2)})`;
</script>

<figure class="mx-auto w-full max-w-[19rem]">
  <div class="rounded-[2.2rem] bg-night p-3 pb-0 shadow-[0_40px_60px_-35px_rgb(29_21_34/0.75)] ring-1 ring-black/20">
    <div class="relative aspect-[480/800] overflow-hidden rounded-[1.5rem] bg-[#141017] ring-1 ring-white/5">
      <iframe bind:this={frame} src="/kiosk" title="ReHome kiosk demo" loading="lazy"
        class="absolute inset-0 size-full border-0"></iframe>
    </div>
    <div class="flex items-center justify-between px-4 py-5">
      <div class="flex items-center gap-3" aria-hidden="true">
        <span class="size-3 rounded-full" style={led(d5, '244 174 71')}></span>
        <span class="size-3 rounded-full" style={led(d16, '224 92 72')}></span>
      </div>
      <button type="button" aria-label="The kiosk's button: press it, or hold it to sell instead"
        class="grid size-16 touch-none place-items-center rounded-full bg-[#2a2130] ring-1 ring-white/10 select-none"
        onpointerdown={press} onpointerup={release} onpointerleave={release} onpointercancel={release}
        {onkeydown} {onkeyup} oncontextmenu={(e) => e.preventDefault()}>
        <span class="size-11 rounded-full bg-lamp shadow-[inset_0_-0.3rem_0_rgb(0_0_0/0.25)] transition-transform duration-100"
          style:transform={pressed ? 'translateY(2px) scale(0.94)' : 'none'}></span>
      </button>
    </div>
  </div>
  <figcaption class="mt-4 text-center font-mono text-xs text-ink-soft">try it: press the button, or hold it to sell</figcaption>
</figure>
