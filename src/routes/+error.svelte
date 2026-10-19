<script>
  import { page } from '$app/state';
</script>

<section class="mx-auto grid min-h-[60vh] max-w-6xl place-items-center px-4 text-center sm:px-6">
  <div>
    <p class="font-mono text-sm text-ink-soft">{page.status}</p>
    <h1 class="mt-3 font-display text-4xl font-semibold tracking-tight">Nothing lives here.</h1>
    <a href="/" class="mt-8 inline-flex rounded-full bg-ink px-5 py-2.5 font-medium text-ground hover:bg-ink/85">Back home</a>
  </div>
</section>
