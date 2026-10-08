/**
 * Freebuff Sites entrypoint.
 *
 * The site is a client-side React SPA: data is fetched from Supabase in the
 * browser, so every route is just a static file. `dist/` holds one
 * prerendered HTML file per route (dist/about/index.html, dist/council/...)
 * plus the hashed JS/CSS bundles, so this Worker only needs to hand the
 * request to the assets binding.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  },
}
