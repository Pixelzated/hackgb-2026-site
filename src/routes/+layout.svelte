<script>
  // Bare root layout: the landing page's styles and header live in (site)/+layout.svelte,
  // so /kiosk (the kiosk demo, shown in an iframe) gets only the kiosk's own styles.
  let { children } = $props();
</script>

{@render children()}
