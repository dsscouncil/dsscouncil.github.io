#!/usr/bin/env bun
// One description, everywhere.
//
// The site used to ship four different description strings (meta, Open Graph,
// Twitter card, web app manifest), so Google, WhatsApp and X each quoted a
// different sentence for the same link. This fails the build if they drift
// apart again, or if the text grows past the snippet budget.
//
//   bun run check:meta

import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const manifest = JSON.parse(readFileSync(join(root, 'public/manifest.webmanifest'), 'utf8'))

/** Google's snippet budget; anything longer gets truncated mid-sentence. */
const MAX_DESCRIPTION = 160

const attr = (pattern) => {
  const m = html.match(pattern)
  if (!m) throw new Error(`could not find ${pattern} in index.html`)
  return m[1].trim()
}

const title = attr(/<title>([^<]*)<\/title>/)
const fields = {
  'meta[name=description]': attr(/<meta name="description" content="([^"]*)"/),
  'og:description': attr(/<meta property="og:description" content="([^"]*)"/),
  'twitter:description': attr(/<meta name="twitter:description" content="([^"]*)"/),
  'manifest.webmanifest': manifest.description,
}
const titles = {
  '<title>': title,
  'og:title': attr(/<meta property="og:title" content="([^"]*)"/),
  'twitter:title': attr(/<meta name="twitter:title" content="([^"]*)"/),
}

const errors = []
const expected = fields['meta[name=description]']

for (const [field, value] of Object.entries(fields)) {
  if (value !== expected) {
    errors.push(`  ${field}\n    got: "${value}"\n    want: "${expected}"`)
  }
}
for (const [field, value] of Object.entries(titles)) {
  if (value !== title) errors.push(`  ${field} is "${value}", expected "${title}"`)
}

const length = [...expected].length
if (length > MAX_DESCRIPTION) {
  errors.push(`  description is ${length} chars, over the ${MAX_DESCRIPTION} char budget`)
}
if (!expected) errors.push('  description is empty')

// The share card is what WhatsApp, LinkedIn and X render. A dangling og:image
// is invisible in review and obvious in a link preview, so assert the file is
// actually in the build output's public folder and that both cards agree.
const ogImage = attr(/<meta property="og:image" content="([^"]*)"/)
const twitterImage = attr(/<meta name="twitter:image" content="([^"]*)"/)
if (ogImage !== twitterImage) {
  errors.push(`  twitter:image is "${twitterImage}", expected "${ogImage}"`)
}
const imagePath = new URL(ogImage).pathname.replace(/^\//, '')
try {
  const bytes = statSync(join(root, 'public', imagePath)).size
  if (bytes < 5_000) errors.push(`  og:image ${imagePath} is only ${bytes} bytes - looks like a placeholder`)
} catch {
  errors.push(`  og:image ${imagePath} does not exist in public/`)
}

if (errors.length) {
  console.error('meta check failed:\n' + errors.join('\n'))
  process.exit(1)
}

console.log(`meta check ok - ${length}/${MAX_DESCRIPTION} chars, identical in ${Object.keys(fields).length} places, og:image present:`)
console.log(`  "${expected}"`)
