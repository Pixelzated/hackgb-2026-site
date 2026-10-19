import adapter from '@sveltejs/adapter-static';

// Every page is prerendered to plain HTML in build/, which Cloudflare serves as static assets.
export default {
  kit: { adapter: adapter({ fallback: '404.html' }) }
};
