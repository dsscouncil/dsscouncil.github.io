// Single source of truth for the public routes.
//
// Four consumers, one list:
//   - scripts/prerender.mjs bakes these titles into dist/<route>/index.html,
//     which is what a crawler reads.
//   - <PageTitle/> applies the same title on client-side navigation, so a tab
//     opened on /council and then navigated to /clubs is labelled correctly.
//   - data/content.js derives the header and footer navigation from it, so a
//     link can never point at a page whose name has drifted from its title.
//   - <SeeAlso/> reads each route's `related` list to render the in-body links
//     that give the site a real link graph rather than one nav repeated ten
//     times.
//
// `label` is deliberately the same wording as the first half of `title`: that
// is the anchor text Google is most likely to show as the sitelink label, so
// the footer links the whole site using exactly those words. `navLabel` is the
// shorter form used in the crowded header bar.
//
// The meta description is deliberately NOT here: one shared sentence lives in
// index.html and `bun run check:meta` guards it.

export const ROUTES = [
  {
    path: '/',
    label: 'DS Pulse',
    navLabel: 'Home',
    nav: true,
    title: 'DS Secondary Student Council | DS Pulse',
    blurb: 'The official student leadership platform for Dubai Scholars Secondary — what the Council is working on right now.',
    priority: '1.0',
    changefreq: 'daily',
    related: ['/council', '/clubs', '/news'],
  },
  {
    path: '/council',
    label: 'Meet the Council',
    navLabel: 'Our Council',
    nav: true,
    title: 'Meet the Council | Dubai Scholars Student Council',
    blurb: 'Every elected and appointed member of the Secondary Student Council, and what each of them is working on.',
    priority: '0.9',
    changefreq: 'weekly',
    related: ['/clubs', '/events', '/initiatives'],
  },
  {
    path: '/clubs',
    label: 'Clubs & Activities',
    navLabel: 'Clubs',
    nav: true,
    title: 'Clubs & Activities | Dubai Scholars Student Council',
    blurb: 'Clubs and extracurricular activities running across Dubai Scholars, with schedules and how to join each one.',
    priority: '0.9',
    changefreq: 'weekly',
    related: ['/council', '/events', '/documents'],
  },
  {
    path: '/events',
    label: 'Events',
    navLabel: 'Events',
    nav: true,
    title: 'Events | Dubai Scholars Secondary Student Council',
    blurb: 'Upcoming student-led events at Dubai Scholars, and a record of everything the Council has run so far.',
    priority: '0.9',
    changefreq: 'weekly',
    related: ['/news', '/initiatives', '/council'],
  },
  {
    path: '/news',
    label: 'News & Announcements',
    navLabel: 'News',
    nav: false,
    title: 'News & Announcements | DS Pulse',
    blurb: 'Announcements and write-ups from the Council, straight from the students running them.',
    priority: '0.9',
    changefreq: 'weekly',
    related: ['/events', '/council', '/initiatives'],
  },
  {
    path: '/initiatives',
    label: 'Initiatives',
    navLabel: 'Initiatives',
    nav: true,
    title: 'Initiatives | DS Pulse Student Council',
    blurb: 'The campaigns and projects the Council has committed to, with the student leading each one.',
    priority: '0.8',
    changefreq: 'monthly',
    related: ['/news', '/events', '/clubs'],
  },
  {
    path: '/about',
    label: 'About the Council',
    navLabel: 'About',
    nav: true,
    title: 'About the Council | DS Pulse',
    blurb: 'What DS Pulse is, how the Council is elected, and what it has promised the school.',
    priority: '0.8',
    changefreq: 'monthly',
    related: ['/council', '/initiatives', '/contact'],
  },
  {
    path: '/documents',
    label: 'Documents',
    navLabel: 'Documents',
    nav: false,
    title: 'Documents | DS Pulse Student Council',
    blurb: 'Constitution, policies and meeting minutes — everything the Council publishes, in one place.',
    priority: '0.7',
    changefreq: 'monthly',
    related: ['/clubs', '/events', '/about'],
  },
  {
    path: '/student-voice',
    label: 'Share Your Voice',
    navLabel: 'Student Voice',
    nav: true,
    title: 'Share Your Voice | DS Pulse',
    blurb: 'Share an idea, raise a concern, or see what other students have already put forward.',
    priority: '0.8',
    changefreq: 'monthly',
    related: ['/contact', '/initiatives', '/council'],
  },
  {
    path: '/contact',
    label: 'Contact',
    navLabel: 'Contact',
    nav: true,
    title: 'Contact | Dubai Scholars Secondary Student Council',
    blurb: 'Email the Council, find who to talk to about what, or send us a message.',
    priority: '0.8',
    changefreq: 'monthly',
    related: ['/about', '/student-voice', '/events'],
  },
]

export const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]))

/** The URL GitHub Pages actually serves for a route: directories get a slash. */
export const servedPath = (path) => (path === '/' ? '/' : path + '/')

export const ADMIN_TITLE = 'Council Admin | DS Pulse'

const TITLES = new Map(ROUTES.map((r) => [r.path, r.title]))

/** Title for a pathname, falling back to the homepage for unknown paths. */
export function titleFor(pathname) {
  if (!pathname) return TITLES.get('/')
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return TITLES.get(clean) || TITLES.get('/')
}

/** The sections a route links onward to, already resolved and de-duplicated. */
export function relatedFor(path) {
  const route = BY_PATH.get(path)
  if (!route) return []
  const seen = new Set([route.path])
  return (route.related || [])
    .map((p) => BY_PATH.get(p))
    .filter((r) => r && !seen.has(r.path))
}
