# ReHome site

The static showcase for [ReHome](https://devpost.com/software/rehome-c28jmv), built at HackGB 2026, where it won Best Hardware Hack, Best Environment & Sustainability, and Best Use of Tiger Data.

It is the app's landing page without the app: the ASCII hero, the "How it works" drawings, example items, and a replayed agent run, with links to the [demo video](https://youtu.be/v5hnEXgy-P0), Devpost, and the [code](https://github.com/shuja-waraich-03/HackGB). Nothing on it talks to a backend.

SvelteKit + Tailwind CSS, prerendered to plain files with `@sveltejs/adapter-static`, and served by Cloudflare Workers as static assets.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # writes build/
npm run preview    # serves build/
```

## Deploy to Cloudflare Workers

**From GitHub (deploys on every push):** in the Cloudflare dashboard, go to Workers & Pages → Create → Import a repository, and pick this repo. Use build command `npm run build` and deploy command `npx wrangler deploy`. `wrangler.jsonc` tells it to serve `build/`.

**From this machine:** `npm run deploy` (runs `wrangler login` the first time).

**On your own domain:** add the domain to Cloudflare (Websites → Add a site) and switch its nameservers at the registrar to the two Cloudflare gives you. Then add it under the Worker's Settings → Domains & Routes, or uncomment `routes` in `wrangler.jsonc`.

## Where things are

| Path | What |
|---|---|
| `src/routes/+page.svelte` | The page |
| `src/lib/links.js` | Devpost, repo, video, and kiosk links |
| `src/lib/landing/` | Hero (`AsciiHome`, three.js), line drawings (`WireFigure`, `figures.js`), item tags, the replayed agent run |
| `src/app.css` | Colors and fonts, shared with the app |
