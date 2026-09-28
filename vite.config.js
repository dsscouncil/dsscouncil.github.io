import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `bun run build` produces a normal multi-file dist/ (for static hosting).
// `bun run build:preview` produces a single self-contained index.html for previews.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'preview' ? [react(), tailwindcss(), viteSingleFile()] : [react(), tailwindcss()],
  base: './',
}))
