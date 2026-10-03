import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// BrowserRouter, not HashRouter: every page is a real, individually crawlable
// URL (/council, /clubs, ...) that a search engine can index and that returns
// HTTP 200. scripts/prerender.mjs writes one HTML file per route so those URLs
// exist on disk - GitHub Pages serves no SPA fallback with a 200 status.
//
// Links shared before the switch look like /#/council. Rewrite them to the real
// path before React mounts, so old bookmarks and messages keep working instead
// of silently landing on the homepage.
if (window.location.hash.startsWith('#/')) {
  const path = window.location.hash.slice(1) || '/'
  window.history.replaceState(null, '', path + window.location.search)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
