# ReHome site

**[rehome.casa](https://rehome.casa)**: the static showcase for [ReHome](https://devpost.com/software/rehome-c28jmv), built at HackGB 2026, where it won Best Hardware Hack, Best Environment & Sustainability, and Best Use of Tiger Data.

It is the app's landing page without the app: the ASCII hero, the "How it works" drawings, example items, and a replayed agent run, with links to the [demo video](https://youtu.be/v5hnEXgy-P0), Devpost, and the [code](https://github.com/shuja-waraich-03/HackGB). Nothing on it talks to a backend.

It also has a playable demo of the Raspberry Pi kiosk (`/kiosk`, shown in a drawing of the device). It's the real kiosk UI from the [`feature/kiosk`](https://github.com/shuja-waraich-03/HackGB/tree/feature/kiosk/rehome/kiosk) branch with its hardware and backend faked: a stock video stands in for the webcam, the drawing's button and LEDs stand in for the Grove ones, and the agents' answers are scripted. Opened on its own, `/kiosk` fills the screen like the real thing (space or a tap is the button).

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

**The domain:** `wrangler.jsonc` routes `rehome.casa` to the Worker as a custom domain; Cloudflare creates the DNS record and certificate on the first deploy. That needs the domain's DNS on the same Cloudflare account (it is: its nameservers already point to Cloudflare).

## Where things are

| Path | What |
|---|---|
| `src/routes/+page.svelte` | The page |
| `src/lib/links.js` | Devpost, repo, video, and kiosk links |
| `src/lib/landing/` | Hero (`AsciiHome`, three.js), line drawings (`WireFigure`, `figures.js`), item tags, the replayed agent run |
| `src/app.css` | Colors and fonts, shared with the app |
| `src/routes/kiosk/`, `src/lib/kiosk/` | The kiosk demo: the kiosk's UI, with `hw.js` and `api.js` faked for the web |
| `src/lib/components/KioskDevice.svelte` | The kiosk drawing around the demo: LEDs and the button |
| `static/media/sweater.mp4` | The demo's "webcam" |

## Credits

The kiosk demo's footage is [Woman Holding a Knitted Sweater](https://www.pexels.com/video/woman-holding-a-knitted-sweater-7578150/) by Miriam Alonso on Pexels ([Pexels license](https://www.pexels.com/license/)), cut to 480p without sound.
