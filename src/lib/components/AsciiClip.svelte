<script>
  // A muted, looping video shown only as colored ASCII art (the video itself stays hidden).
  // It pauses while it's off screen.
  import { onMount } from 'svelte';
  import { asciiVideo } from '$lib/ascii-video.js';

  let { src, label, cellPx = 6, zoom = 1, focus = [0.5, 0.5], class: className = '' } = $props();

  let canvas, video;

  onMount(() => {
    const stop = asciiVideo(canvas, video, { cellPx, zoom, focus, smoothing: 0.65 });
    const seen = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()));
    seen.observe(canvas);
    return () => {
      stop();
      seen.disconnect();
    };
  });
</script>

<div class="relative overflow-hidden bg-night {className}" role="img" aria-label={label}>
  <video bind:this={video} {src} muted loop playsinline preload="auto" class="pointer-events-none absolute size-px opacity-0"></video>
  <canvas bind:this={canvas} class="absolute inset-0 size-full"></canvas>
</div>
