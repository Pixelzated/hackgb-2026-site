<script>
  // The landing page's agent-activity panel, replaying a scripted demo run on a loop
  // instead of polling a backend. Messages match what the real agents logged.
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';

  const SCRIPT = [
    { agent: 'orchestrator', message: 'New item received' },
    { agent: 'parser', message: 'Identified black Columbia puffer jacket, size M' },
    { agent: 'pricing', message: 'Going rate $35–55 from listings online' },
    { agent: 'orchestrator', message: 'Saved itm_0142; searchable now' },
    { agent: 'requester', message: 'Inferred snow and sub-freezing winters; needs insulated, water-resistant' },
    { agent: 'orchestrator', message: 'Found 3 matches for req_0031' },
    { agent: 'orchestrator', message: 'Reserved itm_0142; donor notified' }
  ];
  const STEP_MS = 2400;
  const REST_MS = 4500; // pause on the finished run before it starts over

  const AGENT_COLOR = { parser: 'text-[#f6bd66]', pricing: 'text-[#e0805f]', requester: 'text-[#a2c19b]', orchestrator: 'text-night-soft' };

  const clock = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  // Before the page is interactive (and with reduced motion) the whole run shows at once.
  let rows = $state(SCRIPT.slice(-5).map((e, i) => ({ ...e, id: `s${i}`, time: '14:02:0' + i })));
  let n = 0;

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer;
    const next = () => {
      if (n === SCRIPT.length) {
        n = 0;
        rows = [];
        timer = setTimeout(next, 900);
        return;
      }
      rows = [...rows, { ...SCRIPT[n], id: `r${Date.now()}`, time: clock() }].slice(-5);
      n += 1;
      timer = setTimeout(next, n === SCRIPT.length ? REST_MS : STEP_MS);
    };
    rows = [];
    timer = setTimeout(next, 600);
    return () => clearTimeout(timer);
  });
</script>

<div class="rounded-3xl bg-night p-5 text-night-ink sm:p-6">
  <div class="flex items-center gap-2 font-mono text-xs text-night-soft">
    <span class="size-2 animate-pulse rounded-full bg-lamp"></span>
    replay of a demo run
  </div>
  <ol class="mt-4 flex min-h-[11.5rem] flex-col gap-3 font-mono text-[0.8rem] leading-snug">
    {#each rows as e (e.id)}
      <li class="grid grid-cols-[4.5rem_7.5rem_1fr] gap-2 max-sm:grid-cols-[7rem_1fr]"
        in:fly={{ y: 10, duration: 700, easing: cubicOut }} out:fade={{ duration: 400 }}
        animate:flip={{ duration: 600, easing: cubicOut }}>
        <span class="text-night-soft/70 tabular-nums max-sm:hidden">{e.time}</span>
        <span class={AGENT_COLOR[e.agent] ?? 'text-night-soft'}>{e.agent}</span>
        <span>{e.message}</span>
      </li>
    {/each}
  </ol>
</div>
