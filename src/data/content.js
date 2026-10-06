import logoUrl from '../assets/logo.png'
import { ROUTES } from '../site.js'

export const LOGO = logoUrl

const CDN = 'https://media.base44.com/images/public/6a9d1eb10b66aa6d58818301'
const src = (file, w, h, q = 80) =>
  `${CDN}/${file}/v1/fill/w_${w},h_${h},q_${q},usm_0.66_1.00_0.01,enc_webp,quality_auto/${file}.webp`

// Two rules keep these photos correct and light:
//  1. Every width is requested at the photo's NATIVE aspect ratio. base44's
//     `fill/...al_c` transform centre-crops to the requested box, so asking for
//     a portrait box turned these landscape photos into zoomed-in slices.
//  2. Each photo is offered at several widths via srcSet, so a phone downloads
//     ~58 KB instead of the 274 KB full-size file. The frames in Home.jsx use
//     matching `aspect-*` classes so the image is still displayed uncropped.
export const IMG = {
  hero: src('b297102f1_skl.jpg', 1500, 1000, 90),
  heroSrcSet: [src('b297102f1_skl.jpg', 800, 533), src('b297102f1_skl.jpg', 1200, 800), src('b297102f1_skl.jpg', 1500, 1000, 90)]
    .map((u, i) => `${u} ${[800, 1200, 1500][i]}w`)
    .join(', '),
  about: src('afb4cd38f_DS-small.jpg', 1260, 900, 90),
  aboutSrcSet: [src('afb4cd38f_DS-small.jpg', 600, 429), src('afb4cd38f_DS-small.jpg', 900, 643), src('afb4cd38f_DS-small.jpg', 1260, 900, 90)]
    .map((u, i) => `${u} ${[600, 900, 1260][i]}w`)
    .join(', '),
  heroAlt: '/hero-alt.jpg',
  heroAltSrcSet: [
    '/hero-alt.jpg?w=400&h=1404&q=80',
    '/hero-alt.jpg?w=800&h=2800&q=80',
    '/hero-alt.jpg?w=1200&h=4200&q=80',
  ]
    .map((u, i) => `${u} ${[400, 800, 1200][i]}w`)
    .join(', '),
}

// Both lists come from the route table in site.js rather than being written out
// here, so a link can never point at a page whose name has drifted away from
// its <title>.
//
// The header uses the short navLabel because the bar is already crowded. The
// footer uses each section's full label - the exact words that page uses as its
// title - because that is the wording Google is most likely to reuse when it
// shows a sitelink.
export const navLinks = ROUTES.filter((r) => r.nav).map((r) => ({ label: r.navLabel, href: r.path }))

export const footerLinks = ROUTES.map((r) => ({ label: r.label, href: r.path }))

export const stats = [
  { value: '3', label: 'Years 9–11', sub: 'Secondary Representation' },
  { value: '100%', label: 'Student Voice', sub: 'Ideas, feedback & advocacy' },
  { value: '5', label: 'Initiatives', sub: 'Projects & campaigns' },
  { value: '66', label: 'Council Members', sub: 'Elected & appointed' },
]

export const homeInitiatives = [
  { status: 'In Progress', cat: 'Events', title: 'A Legacy of 50', desc: 'Exhibition- Memory Wall ' },
  { status: 'Planning', cat: 'Student Voice', title: 'Tiny Wins, Big Impact', desc: 'Sticky note boards on every floor for sharing wins, whether big or small + QR code for students' },
  { status: 'Planning', cat: 'Events', title: 'Student Leadership Summit', desc: 'School event- Workshops from actual Leadership from the field. Ideas into initiatives' },
]

export const initiatives = [
  { featured: true, status: 'Planning', cat: 'Events', title: 'A Legacy of 50', desc: 'Exhibition- Memory Wall', date: '15 January 2027', lead: 'Zunaira Zaki' },
  { featured: true, status: 'Planning', cat: 'Student Voice', title: 'Tiny Wins, Big Impact', desc: 'Sticky note boards on every floor for sharing wins, whether big or small + QR code for students', date: '10 October 2026', lead: 'Samah Noora' },
  { featured: true, status: 'In Progress', cat: 'Events', title: 'Student Leadership Summit', desc: 'School event- Workshops from actual Leadership from the field. Ideas into initiatives', date: '', lead: 'Clive Tauro' },
  { featured: true, status: 'In Progress', cat: 'Community', title: 'Unsung Pillars', desc: 'School support staff documentary', date: '', lead: 'Prajwal Prakash' },
  { featured: true, status: 'Planning', cat: 'Wellbeing', title: 'Beneath the Surface', desc: '1- Real Stories 2- Letter to Peers 3- The Mask we wear', date: '', lead: 'Taibah Toofail' },
]

export const initiativeCategories = ['All', 'Student Voice', 'Community', 'Sustainability', 'Academic', 'Wellbeing', 'Events', 'Charity']

export const pillars = [
  { title: 'Student Representation', desc: 'Ensuring every year group has a voice in school decisions.' },
  { title: 'Leadership Development', desc: 'Building the skills, confidence and responsibility of student leaders.' },
  { title: 'School Initiatives', desc: 'Leading projects that improve daily school life.' },
  { title: 'Community Outreach', desc: 'Connecting the Council with the wider Dubai community.' },
  { title: 'Environmental Projects', desc: 'Championing sustainability across our campus.' },
  { title: 'Events & Activities', desc: 'Organising campaigns, competitions and celebrations.' },
  { title: 'Clubs & Extracurriculars', desc: 'Expanding opportunities beyond the classroom.' },
  { title: 'Listening to Feedback', desc: 'Acting on student suggestions through the Student Voice system.' },
]

export const leadershipMessages = [
  {
    quote: 'Our Student Council embodies the values we hold dear — responsibility, integrity and a genuine desire to serve others. I am proud of the leadership our students show every day, and I encourage every voice to be heard through this Council.',
    name: 'Ms. Sapna Chagrani', role: 'Head of School',
  },
  {
    quote: 'Watching the Council grow in confidence and capability has been a privilege. This platform is your space to lead, to listen and to make a lasting difference across our school community.',
    name: 'Mr. Tabrez Mandviwala', role: 'Council Lead Staff',
  },
  {
    quote: "Leadership is not a title but a commitment to others. The Council's work this year reflects the care, creativity and courage of our students — and I look forward to all we will achieve together.",
    name: 'Mr. Huzefa Attaree', role: 'Council Lead Staff',
  },
]

export const councilPhilosophy = `We are the architects of our school culture. Built on the enduring belief that every student has a role in the survival and success of the community, our Student Council operates on transparency, accountability, and collective action. We recognize the unique challenges of our generation—from digital noise to social disconnect—and we counter them with structured engagement. When we wear our badges, we commit to a simple promise: We are here to serve, to measure our impact, and to leave this campus better than we found it.`

export const circlePhrases = {
  'Core Team': 'The best way to find yourself is to lose yourself in the service of others.',
  'House Leadership': 'Every race teaches resilience, every game builds character, every teammate makes us stronger.',
  'Well-being Leadership': "Wellbeing isn't about avoiding challenges. It's about becoming strong enough to face them without losing who you are.",
  'Departmental Leadership': 'Different perspectives may lead us in different directions, but good teamwork brings those ideas together.',
  'Sports Council': "Winning isn't your job, wanting to win is.",
}

export const upcomingEvents = [
  { day: '1', month: 'OCT', type: 'Awareness Day', title: 'Breast Cancer Awareness Week', location: '', org: '', desc: '' },
  { day: '6', month: 'OCT', type: 'Council Event', title: 'Secondary Student Council Investiture Ceremony 2026-2027', location: 'School Auditorium', org: 'Secondary Student Council', desc: 'Chief Guest: Dubai Police with their Marching Band.' },
  { day: '10', month: 'OCT', type: 'Awareness Day', title: 'Mental Health Awareness Week', location: '', org: '', desc: '' },
]

export const newsArticles = [
  {
    id: 1,
    cat: 'Announcement',
    title: 'Welcome to the 2026–27 Student Council Website',
    excerpt: "Hello Everyone! I am the IT Coordinator for this year, and I am looking forward to work with you guys, especially in this special 50th student council.",
    date: '1 September 2026',
    author: 'Burhanuddin',
    featured: true,
    body: [
      "Hello Everyone! I am the IT Coordinator for this year, and I am looking forward to work with you guys, especially in this special 50th student council.",
      'I am really excited to see what this year brings. :)',
      'We Don\'t Just Represent. We Deliver.',
    ],
  },
]

export const newsCategories = ['All', 'Announcement', 'Project Update', 'Event Recap', 'Achievement', 'Campaign', 'Student Opportunity']

export const clubs = [
  { cat: 'Academic', name: 'Financial Literacy', desc: 'To equip students with knowledge in money management, investing, and personal finance to build long-term wealth and responsible economic habits.', icon: 'CurrencyDollar', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Creative', name: 'Made by Scholars', desc: 'Develop skills to create items.', icon: 'Palette', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Academic', name: 'Marketing and Branding', desc: 'To introduce students to the principles of modern marketing, consumer psychology, and how to build a compelling personal or business brand.', icon: 'PenTool', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Sports', name: 'Martial Arts', desc: 'To foster physical fitness, self-discipline, respect, and self-defense skills through a structured, non-contact/light-contact martial arts curriculum.', icon: 'Dumbbell', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Technology', name: 'MindCraft', desc: 'Build, and play Minecraft: Education while learning engineering and coding skills.', icon: 'Cpu', schedule: 'Tuesdays, Thursdays', location: '-', leads: 'Amit, Arjun, Burhanuddin', join: '-' },
  { cat: 'Leadership', name: 'Podcast (Photography and Editing)', desc: 'To teach students technical and creative skills required to produce, edit, and market high-quality digital media, combining audio storytelling with visual branding.', icon: 'Mic', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Leadership', name: 'Public Speaking', desc: 'Learn how to conquer stage fright and be able to confidently speak in front of anyone!', icon: 'Users', schedule: '-', location: '-', leads: '-', join: '-' },
]

export const clubCategories = ['All', 'Academic', 'Sports', 'Creative', 'Technology', 'Community', 'Culture', 'Leadership']

export const yearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11']

export const voiceCategories = ['Academic', 'Facilities', 'Events', 'Clubs', 'Wellbeing', 'Sustainability', 'Student Life', 'Other']

export const voicePriorities = ['Low', 'Medium', 'High', 'Urgent']

export const ideasBoard = [
  { cat: 'Events', title: 'More student-led competitions', status: 'Completed', desc: 'The Inter-House Debate Competition has been scheduled for November, with more competitions planned.' },
]
