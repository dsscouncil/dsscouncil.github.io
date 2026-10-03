#!/usr/bin/env bun
// One real HTML file per route, generated after `vite build`.
//
// Why this exists: GitHub Pages has no SPA fallback that answers with HTTP 200.
// A request to /council either finds a file (200) or gets 404.html (404). With
// a hash router, /council 404s - which is why the old sitemap advertised ten
// dead URLs and Google could only ever index the homepage.
//
// So: vite builds the app once, and this writes dist/<route>/index.html for
// every route, each with its own <title>, its own self-referencing canonical
// and og:url. The description stays the single shared sentence from
// index.html, and sitemap.xml is regenerated from this same route table so the
// two can never disagree again.
//
//   bun run build        # vite build && bun scripts/prerender.mjs

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTES, servedPath, relatedFor } from '../src/site.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ORIGIN = 'https://www.ds-pulse.com'

// Markup that must appear verbatim and identically on every page, the only
// candidate that Google can always rely on for sitelinks.
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Markup that must appear verbatim and identically on every page, the only
 *  candidate that Google can always rely on for sitelinks. */
const NAV_NAV =
  '<nav class="sr-only" aria-label="Site sections"><ul>' +
  ROUTES.map((r) => `<li><a href="${escapeAttr(servedPath(r.path))}">${escapeAttr(r.label)}</a></li>`).join('') +
  '</ul></nav>'

/** The exact wording of a sibling section, the same wording used in its <title>
 *  and in the <link title> below. Match the reference layout (e.g.
 *  "Secondary Stage" / "Highlights of the Phase ...") - short title, descriptive
 *  subtitle, one per section. */
const SECTION_SUBTITLES = {
  '/council': 'Meet the council that runs Dubai Scholars Secondary, with its members and its work.',
  '/clubs': 'Extracurricular activities and societies students can join, along with how to sign up.',
  '/events': 'Upcoming assemblies, exhibitions and student-led events, and a record of past ones.',
  '/news': 'Announcements and write-ups from the Council, straight from the students running it.',
  '/initiatives': 'The campaigns and projects the Council has committed to, with who leads each one.',
  '/about': 'What DS Pulse is, how the Council is elected, and what it has promised the school.',
  '/documents': 'The Constitution, policies and meeting minutes published by the Council.',
  '/student-voice': 'Share an idea, raise a concern, or see what other students have already put forward.',
  '/contact': 'Email the Council, find who to ask about what, or send a message.',
}

/** One `<link rel="sitelinks" title="..." href="...">` per sibling section. */
function sectionLinks(route) {
  return ROUTES.map((r) =>
    `<link rel="sitelinks" title="${escapeAttr(r.label)}" href="${escapeAttr(servedPath(r.path))}" />`,
  ).join('\n    ')
}



/** Per-page meta keyword line: the section titles as a keywords token list. */
function keywords(route) {
  return `<meta name="keywords" content="${route.label}, ${ROUTES.map((r) => r.label).join(', ')}, Dubai Scholars, Secondary Student Council, DS Pulse" />`
}

/** The full <head> block a route sells: normal meta, then the explicit
 *  sitelinks signals Google applies to the result block. */
function sitelinksHeadHtml(route) {
  const title = route.title.split(' | ')[0]
  const subtitle = SECTION_SUBTITLES[route.path] || ''
  const sub = subtitle ? `<meta name="sitelinks:description" content="${escapeAttr(subtitle)}" />` : ''
  return `
    <!-- Explicit sitelinks for this result. The <link title> is the section
         name Google shows as a bold sub-link, the href the URL, and the
         keywords/meta line the sentence under it. -->
    ${sectionLinks(route)}
    <meta name="sitelinks:title" content="${escapeAttr(title)}" />
    ${sub}
    <link rel="sitelinks:page" href="${escapeAttr(servedPath(route.path))}" title="${escapeAttr(route.title)}" />
  `.trim()
}

const LD_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/

const shellPath = join(dist, 'index.html')
if (!existsSync(shellPath)) {
  console.error('prerender: dist/index.html is missing - run `vite build` first')
  process.exit(1)
}
const shell = readFileSync(shellPath, 'utf8')

const DESCRIPTION = shell.match(/<meta name="description" content="([^"]*)"/)?.[1]
if (!DESCRIPTION) {
  console.error('prerender: no <meta name="description"> in the built HTML')
  process.exit(1)
}

/** Replace exactly one occurrence, or fail loudly - a silent no-op here would
 *  ship ten pages that all carry the homepage's title. */
function swapOnce(html, pattern, replacement, label) {
  const matches = html.match(pattern)
  if (!matches || matches.length !== 1) {
    console.error(`prerender: expected exactly one ${label} in the built HTML, found ${matches ? matches.length : 0}`)
    process.exit(1)
  }
  return html.replace(pattern, replacement)
}

const today = new Date().toISOString().slice(0, 10)
const written = []

for (const route of ROUTES) {
  // GitHub Pages serves a directory as /council/ and 301s /council to it, so the
  // indexable URL - and therefore the canonical and og:url - carries the slash.
  const url = ORIGIN + servedPath(route.path)
  let html = shell
  html = swapOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(route.title)}</title>`, '<title>')
  html = swapOnce(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
    'canonical link',
  )
  html = swapOnce(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`,
    'og:url',
  )
  html = swapOnce(
    html,
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    'og:title',
  )
  html = swapOnce(
    html,
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    'twitter:title',
  )

  // Verify the page we are about to write is actually distinct and correct.
  if (html === shell && route.path !== '/') {
    console.error(`prerender: ${route.path} did not change - meta tags were not found`)
    process.exit(1)
  }
  if (!html.includes(`<link rel="canonical" href="${url}" />`)) {
    console.error(`prerender: ${route.path} is missing its canonical`)
    process.exit(1)
  }
  if (!html.includes(`<meta name="description" content="${DESCRIPTION}"`)) {
    console.error(`prerender: ${route.path} lost the shared description`)
    process.exit(1)
  }

  // Every page must expose every section as a real link, or sitelinks have
  // nothing to be built from.
  html = swapOnce(html, /<\/head>/, `${sitelinksHeadHtml(route)}</head>`, 'closing </head>')
  html = swapOnce(html, /<\/body>/, `${NAV_NAV}\n</body>`, 'closing </body>')
  for (const target of ROUTES) {
    if (!html.includes(`href="${escapeAttr(servedPath(target.path))}"`)) {
      console.error(`prerender: ${route.path} does not link to ${target.path}`)
      process.exit(1)
    }
  }
  for (const t of relatedFor(route.path)) {
    if (!html.includes(`>${escapeAttr(t.label)}</a>`)) {
      console.error(`prerender: ${route.path} is missing its contextual link to ${t.path}`)
      process.exit(1)
    }
  }

  // Enrich the JSON-LD with a page-level WebPage + BreadcrumbList.
  html = enrichJsonLd(html, route, url)

  // The rewritten schema must still be valid JSON and describe this URL.
  const ld = JSON.parse(html.match(LD_RE)[1])
  const page = ld['@graph'].find((n) => n['@type'] === 'WebPage' && n.url === url)
  if (route.path !== '/') {
    if (!page) {
      console.error(`prerender: ${route.path} lost its WebPage entity`)
      process.exit(1)
    }
    if (page.description !== route.blurb) {
      console.error(`prerender: ${route.path} lost its own WebPage description`)
      process.exit(1)
    }
  } else {
    // The homepage only has WebSite + Organization, which is the correct shape
    // for a site-level entity.
    if (!ld['@graph'].some((n) => n['@type'] === 'WebSite')) {
      console.error(`prerender: / lost its WebSite entity`)
      process.exit(1)
    }
  }

  const outDir = route.path === '/' ? dist : join(dist, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  written.push(route)
}

// Unknown paths: serve the app so a mistyped link lands on the homepage route
// (the status will be 404 - that is GitHub Pages, and is honest).
copyFileSync(shellPath, join(dist, '404.html'))

// Sitemap generated from the same table that produced the HTML files.
const urls = written
  .map(
    (r) => `  <url>
    <loc>${ORIGIN}${servedPath(r.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
)

console.log(`prerender ok - ${written.length} routes, one description, explicit sitelinks in <head> + sr-only nav, sitemap regenerated (${today})`)

/** Enrich the JSON-LD with a page-level WebPage + BreadcrumbList, so every
 *  URL carries its own identity alongside the site-level WebSite. Without it
 *  the ten routed pages are indistinguishable in the schema. */
function enrichJsonLd(html, route, url) {
  const match = html.match(LD_RE)
  if (!match) {
    console.error('prerender: no JSON-LD block found in the built HTML')
    process.exit(1)
  }
  const doc = JSON.parse(match[1])
  const graph = doc['@graph'].filter(
    (n) => !(n['@type'] === 'WebPage' && n.url === url) && !(n['@type'] === 'BreadcrumbList' && n['@id'] === `${url}#breadcrumb`),
  )
  const name = route.title.split(' | ')[0]
  graph.push({
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.blurb,
    isPartOf: { '@id': `${ORIGIN}/#website` },
    about: { '@id': `${ORIGIN}/#organization` },
    inLanguage: 'en-AE',
    breadcrumb: { '@id': `${url}#breadcrumb` },
  })
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement:
      route.path === '/'
        ? [{ '@type': 'ListItem', position: 1, name, item: url }]
        : [
            { '@type': 'ListItem', position: 1, name: 'DS Pulse', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name, item: url },
          ],
  })
  doc['@graph'] = graph
  const block = `<script type="application/ld+json">\n${JSON.stringify(doc, null, 2)}\n    </script>`
  return html.replace(LD_RE, () => block)
}
