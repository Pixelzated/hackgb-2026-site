// The ReHome backend, scripted for the web demo. The real version (feature/kiosk, ui/src/lib/api.js)
// calls the FastAPI backend; this one has the same exports and returns what the agents said about
// the sweater in the demo video, with their steps arriving over a few seconds like the real feed.
const ITEM = {
  category: 'tops',
  item: 'knit sweater',
  brand: null,
  color: 'coral',
  size: 'M',
  condition: 'like new',
  season: 'winter',
  attributes: ['knit', 'warm', 'soft'],
  summary: 'Coral knit sweater, size M, like new.'
};

const log = [];
const emit = (agent, message) => log.push({ id: log.length + 1, agent, message });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function config() {
  return { zip: '54311', site: '' };
}

export async function health() {
  return { status: 'ok', stubs: false };
}

export async function events(after = 0) {
  return log.filter((e) => e.id > after);
}

export async function parse() {
  emit('orchestrator', 'New item received');
  await wait(900);
  emit('parser', 'Reading the photo');
  await wait(1200);
  emit('parser', 'Identified coral knit sweater (tops, like new)');
  await wait(400);
  return { draft_id: 'drf_demo', item: ITEM, image_url: null, options: ['sell', 'donate'] };
}

export async function donate() {
  await wait(500);
  emit('orchestrator', 'Saved itm_0187 as available');
  await wait(500);
  emit('requester', '2 open requests want warm tops nearby');
  return { item_id: 'itm_0187', status: 'available', message: 'Thanks! Your knit sweater is now searchable.' };
}

export async function quote() {
  emit('pricing', 'Looking up going rates');
  await wait(1100);
  emit('pricing', 'Found 5 similar sweaters listed online');
  await wait(900);
  emit('pricing', 'Suggested $18–28');
  return {
    draft_id: 'drf_demo',
    suggested_price: { low: 18, high: 28, currency: 'USD' },
    basis: 'web search',
    comps: [
      { title: 'Coral knit crewneck sweater, women’s M', price: 24, source: 'web' },
      { title: 'Chunky knit pullover, salmon pink, size M', price: 21.5, source: 'web' }
    ],
    listing_draft: { title: 'Coral Knit Sweater, Size M, Like New', description: 'Soft, warm knit sweater.' }
  };
}
