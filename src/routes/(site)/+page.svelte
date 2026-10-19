<script>
  // ReHome's landing page as a static showcase: the same hero and animations, with the
  // app's live parts (photo upload, search, inventory, agent feed) replaced by links,
  // example items, and a replayed agent run.
  import Trophy from '@lucide/svelte/icons/trophy';
  import Play from '@lucide/svelte/icons/play';
  import Code from '@lucide/svelte/icons/code';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import House from '@lucide/svelte/icons/house';
  import Cpu from '@lucide/svelte/icons/cpu';
  import AsciiHome from '$lib/landing/AsciiHome.svelte';
  import WireFigure from '$lib/landing/WireFigure.svelte';
  import ItemTag from '$lib/landing/ItemTag.svelte';
  import ReplayActivity from '$lib/landing/ReplayActivity.svelte';
  import KioskDevice from '$lib/components/KioskDevice.svelte';
  import AsciiClip from '$lib/components/AsciiClip.svelte';
  import { photo, context, rehome } from '$lib/landing/figures.js';
  import { DEVPOST, REPO, VIDEO, KIOSK, FOOTAGE } from '$lib/links.js';

  const STEPS = [
    { draw: photo, title: 'One photo becomes a listing' },
    { draw: context, title: 'Ask the way you’d ask a friend' },
    { draw: rehome, title: 'Matched with someone nearby' }
  ];

  const PRIZES = [
    { name: 'Best Hardware Hack', note: 'for the Raspberry Pi drop-off kiosk', href: KIOSK },
    { name: 'Best Environment & Sustainability' },
    { name: 'Best Use of Tiger Data', note: 'MLH' }
  ];

  const ITEMS = [
    { id: 'ex1', category: 'outerwear', item: 'puffer jacket', color: 'black', size: 'M', condition: 'like new' },
    { id: 'ex2', category: 'footwear', item: 'snow boots', color: 'brown', size: '9', condition: 'good' },
    { id: 'ex3', category: 'home', item: 'wool blanket', color: 'beige', size: null, condition: 'good' },
    { id: 'ex4', category: 'accessories', item: 'knit beanie', color: 'red', size: null, condition: 'new' }
  ];
  const TILTS = [-2.5, 1.5, -1, 2];

  let home = $state();
  let hovered = $state(-1);
</script>

<!-- Hero: a night window with the ASCII home, and the way in -->
<section class="px-4 sm:px-6">
  <div class="relative mx-auto max-w-6xl">
    <div class="pt-4 pb-6 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:left-0 lg:z-10 lg:flex lg:w-[50%] lg:flex-col lg:justify-center lg:p-14 lg:pb-28">
      <h1 class="font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.95] font-bold tracking-[-0.035em] text-ink lg:text-night-ink">
        Good things deserve a <span class="text-lamp-ink lg:text-lamp">second home.</span>
      </h1>
      <p class="mt-5 max-w-md text-lg text-pretty text-ink-soft lg:max-w-sm lg:text-night-soft">
        Sell or give away what you don’t use with one photo. Need something? Ask in one sentence. Our AI helpers
        handle everything in between.
      </p>
    </div>

    <div class="relative h-[340px] overflow-hidden rounded-[2rem] bg-night sm:h-[460px] lg:h-[620px]">
      <AsciiHome bind:this={home} />
      <div class="pointer-events-none absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r from-night via-night/85 to-transparent lg:block"></div>
      <p class="absolute top-5 right-6 flex items-center gap-2 font-mono text-xs text-night-soft">
        <span class="size-1.5 animate-pulse rounded-full bg-lamp"></span>
        HackGB 2026 · 3 prizes
      </p>
    </div>
  </div>

  <div class="relative z-20 mx-auto -mt-14 grid max-w-5xl gap-4 sm:px-2 md:grid-cols-2 lg:-mt-24">
    <div
      role="group"
      aria-labelledby="won-title"
      class="rounded-[1.75rem] bg-surface p-6 shadow-[0_28px_50px_-30px_rgb(29_21_34/0.5)] ring-1 ring-line sm:p-7"
      onpointerenter={() => home?.launch('give')}
    >
      <div class="flex items-center gap-3">
        <span class="grid size-11 place-items-center rounded-2xl bg-lamp text-night"><Trophy class="size-5" /></span>
        <h2 id="won-title" class="font-display text-2xl font-semibold tracking-tight">Won at HackGB</h2>
      </div>
      <ul class="mt-5 flex flex-col gap-3">
        {#each PRIZES as prize}
          <li class="flex items-baseline gap-3">
            <span class="size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-lamp"></span>
            <span>
              <span class="font-medium">{prize.name}</span>
              {#if prize.note}
                {#if prize.href}
                  <a href={prize.href} class="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">{prize.note}</a>
                {:else}
                  <span class="font-mono text-xs text-ink-soft">{prize.note}</span>
                {/if}
              {/if}
            </span>
          </li>
        {/each}
      </ul>
    </div>

    <div
      role="group"
      aria-labelledby="see-title"
      class="rounded-[1.75rem] bg-surface p-6 shadow-[0_28px_50px_-30px_rgb(29_21_34/0.5)] ring-1 ring-line sm:p-7"
      onpointerenter={() => home?.launch('help')}
    >
      <div class="flex items-center gap-3">
        <span class="grid size-11 place-items-center rounded-2xl bg-sage text-on-sage"><Play class="size-5" /></span>
        <h2 id="see-title" class="font-display text-2xl font-semibold tracking-tight">See it work</h2>
      </div>
      <p class="mt-3 text-ink-soft">The demo, the story, and every line of code.</p>
      <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <a href={VIDEO}
          class="inline-flex items-center gap-2 rounded-full bg-sage px-5 py-3 font-semibold text-on-sage transition hover:brightness-110">
          <Play class="size-4.5" /> Watch the demo
        </a>
        <a href={DEVPOST} class="text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline">Devpost</a>
        <a href={REPO} class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline">
          <Code class="size-4" /> GitHub
        </a>
      </div>
    </div>
  </div>
</section>

<!-- How it works: three line drawings that come alive on hover -->
<section id="how" class="mx-auto max-w-6xl scroll-mt-6 px-4 pt-28 pb-24 sm:px-6">
  <p class="flex items-center gap-2 font-mono text-sm text-lamp-ink">
    <span class="grid size-6 place-items-center rounded-md bg-lamp/15"><Sparkles class="size-3.5" /></span>
    How it works
  </p>
  <h2 class="mt-4 max-w-2xl font-display text-4xl leading-[1.05] font-semibold tracking-[-0.025em] sm:text-5xl">
    A small team of AI helpers does the legwork.
  </h2>
  <a href={VIDEO} class="mt-8 inline-flex items-center gap-2 rounded-full bg-ink/7 px-5 py-2.5 font-medium transition hover:bg-ink/12">
    Watch them work <ArrowRight class="size-4" />
  </a>

  <div class="mt-16 grid gap-y-14 md:grid-cols-3">
    {#each STEPS as step, i}
      <article
        class="flex flex-col border-l border-line pr-2 pl-5"
        onpointerenter={() => (hovered = i)}
        onpointerleave={() => (hovered = -1)}
      >
        <span class="font-mono text-xs text-ink-soft">{i + 1}</span>
        <div class="mx-auto aspect-square w-full max-w-[22rem] max-sm:px-9"><!-- room for labels that slide outward -->
          <WireFigure draw={step.draw} active={hovered === i} />
        </div>
        <h3 class="font-display text-xl font-semibold tracking-tight">{step.title}</h3>
      </article>
    {/each}
  </div>
</section>

<!-- The kiosk: the real one at the expo as ASCII art, and its screen to play with -->
<section id="kiosk" class="mx-auto max-w-6xl scroll-mt-6 px-4 pb-28 sm:px-6">
  <p class="flex items-center gap-2 font-mono text-sm text-lamp-ink">
    <span class="grid size-6 place-items-center rounded-md bg-lamp/15"><Cpu class="size-3.5" /></span>
    Best Hardware Hack
  </p>
  <h2 class="mt-4 max-w-2xl font-display text-4xl leading-[1.05] font-semibold tracking-[-0.025em] sm:text-5xl">
    And a kiosk for the drop-off bin.
  </h2>
  <p class="mt-5 max-w-xl text-lg text-pretty text-ink-soft">
    A Raspberry Pi with a webcam, one button and two LEDs. Hold something up, press, and it’s on the shelf.
  </p>
  <a href={KIOSK} class="mt-8 inline-flex items-center gap-2 rounded-full bg-ink/7 px-5 py-2.5 font-medium transition hover:bg-ink/12">
    The kiosk’s code <ArrowRight class="size-4" />
  </a>

  <div class="mt-16 grid items-start justify-items-center gap-14 md:grid-cols-2">
    <figure class="w-full max-w-[19rem]">
      <AsciiClip src="/media/kiosk-expo.mp4" cellPx={5.5} zoom={1.4} focus={[0.42, 0.46]} label="The ReHome kiosk on a table at the HackGB expo, drawn in ASCII"
        class="aspect-[9/16] w-full rounded-[2.2rem] shadow-[0_40px_60px_-35px_rgb(29_21_34/0.75)] ring-1 ring-black/20" />
      <figcaption class="mt-4 text-center font-mono text-xs text-ink-soft">the real one, at the expo table</figcaption>
    </figure>
    <KioskDevice />
  </div>

  <p class="mt-14 text-center font-mono text-xs text-ink-soft">
    The demo watches <a href={FOOTAGE} class="underline underline-offset-4 hover:text-ink">stock footage</a> instead of a webcam.
  </p>
</section>

<!-- Example inventory, and the agents at work -->
<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
  <div class="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
    <div>
      <div class="flex flex-wrap items-baseline justify-between gap-3">
        <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Looking for a new home</h2>
        <p class="font-mono text-xs text-ink-soft">example items</p>
      </div>
      <div class="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {#each ITEMS as item, i (item.id)}
          <ItemTag {item} tilt={TILTS[i % TILTS.length]} />
        {/each}
      </div>
    </div>

    <div>
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Watch the helpers work</h2>
      <div class="mt-8"><ReplayActivity /></div>
    </div>
  </div>
</section>

<footer>
  <div aria-hidden="true" class="overflow-hidden font-mono text-[10px] leading-[0.9] tracking-[0.25em] whitespace-nowrap text-line select-none">
    {'v'.repeat(320)}<br />{'v'.repeat(320)}
  </div>
  <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-ink-soft sm:px-6">
    <span class="flex items-center gap-2 font-display text-base font-semibold text-ink">
      <House class="size-4" /> ReHome
    </span>
    <span>Made in 24 hours at HackGB 2026, UW–Green Bay, by Alan B, Ibrahim Mansoor, Shayan Rehman and Shuja Waraich</span>
  </div>
</footer>
