import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `bun run build` produces a normal multi-file dist/ (for static hosting), then
// scripts/prerender.mjs writes one HTML file per route into it.
// `bun run build:preview` produces a single self-contained index.html for previews.
//
// base is absolute because the site is served from real URLs (/council, /clubs);
// relative asset paths would resolve against the route and 404.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'preview' ? [react(), tailwindcss(), viteSingleFile()] : [react(), tailwindcss()],
  base: '/',
}))
