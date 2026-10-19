<script>
  // Fonts are bundled, not loaded from Google.
  import '../app.css';
  import '@fontsource-variable/bricolage-grotesque/opsz.css';
  import '@fontsource-variable/figtree';
  import '@fontsource/dm-mono/400.css';
  import '@fontsource/dm-mono/500.css';
  import SiteHeader from '$lib/components/SiteHeader.svelte';

  let { children } = $props();

  const title = 'ReHome · HackGB 2026';
  const description =
    'Sell or give away what you don’t use with one photo, or ask for what you need in one sentence. Built in 24 hours at HackGB 2026.';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta name="theme-color" content="#1d1522" />
</svelte:head>

<SiteHeader />
{@render children()}
