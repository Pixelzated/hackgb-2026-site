<script>
  import House from '@lucide/svelte/icons/house';
  import { DEVPOST, REPO } from '$lib/links.js';
</script>

<header class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
  <a href="/" class="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
    <span class="grid size-8 place-items-center rounded-xl bg-night text-lamp">
      <House class="size-4.5" strokeWidth={2.25} />
    </span>
    ReHome
  </a>

  <nav class="flex items-center gap-1 text-sm font-medium" aria-label="Main">
    <a href="#how" class="hidden rounded-full px-3 py-2 hover:bg-ink/5 md:block">How it works</a>
    <a href="#kiosk" class="hidden rounded-full px-3 py-2 hover:bg-ink/5 sm:block">Kiosk</a>
    <a href={REPO} class="rounded-full px-3 py-2 hover:bg-ink/5">GitHub</a>
    <a href={DEVPOST} class="rounded-full bg-ink px-4 py-2 text-ground hover:bg-ink/85">Devpost</a>
  </nav>
</header>
