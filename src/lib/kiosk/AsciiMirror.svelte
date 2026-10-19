<script>
  // The webcam drawn as colored ASCII and mirrored like a looking glass: the attract screen,
  // and a dim backdrop behind the others. In the web demo, the "webcam" is the stock video in hw.js.
  import { onMount } from 'svelte';
  import { asciiVideo } from '$lib/ascii-video.js';
  import { video } from './hw.js';

  let { opacity = 0.5 } = $props();

  let canvas;

  onMount(() => asciiVideo(canvas, video, { mirror: true, cellPx: 6 }));
</script>

<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 size-full transition-opacity duration-[1600ms] ease-out"
  style:opacity aria-hidden="true"></canvas>
