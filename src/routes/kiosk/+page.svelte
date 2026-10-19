<script>
  // The kiosk demo. The landing page shows it inside a drawing of the kiosk (an iframe);
  // opened directly, it fills the screen like the real one. Space or a tap is the button.
  import '$lib/kiosk/kiosk.css';
  import '@fontsource-variable/bricolage-grotesque/opsz.css';
  import '@fontsource-variable/figtree';
  import '@fontsource/dm-mono/400.css';
  import '@fontsource/dm-mono/500.css';
  import KioskApp from '$lib/kiosk/KioskApp.svelte';
</script>

<svelte:head>
  <title>ReHome kiosk · demo</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<KioskApp />
