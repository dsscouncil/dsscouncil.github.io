export const LOGO = 'https://media.base44.com/images/public/6a9d1eb10b66aa6d58818301/2054256fd_801882105_18332527324286859_8997879390325782521_n__1_.jpg/v1/fit/w_112,h_112,q_90,usm_0.66_1.00_0.01,enc_webp,quality_auto/2054256fd_801882105_18332527324286859_8997879390325782521_n.webp'

export const IMG = {
  hero: 'https://media.base44.com/images/public/6a9d1eb10b66aa6d58818301/b297102f1_skl.jpg/v1/fill/w_822,h_1260,al_c,q_90,usm_0.66_1.00_0.01,enc_webp,quality_auto/b297102f1_skl.webp',
  about: 'https://media.base44.com/images/public/6a9d1eb10b66aa6d58818301/afb4cd38f_DS-small.jpg/v1/fill/w_822,h_1140,al_c,q_90,usm_0.66_1.00_0.01,enc_webp,quality_auto/afb4cd38f_DS-small.webp',
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Our Council', href: '/council' },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'Events', href: '/events' },
  { label: 'Student Voice', href: '/student-voice' },
  { label: 'Clubs', href: '/clubs' },
  { label: 'Contact', href: '/contact' },
]

export const footerLinks = [...navLinks, { label: 'News', href: '/news' }, { label: 'Documents', href: '/documents' }]

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
    excerpt: "Hello Everyone! My name is Burhanuddin and I am the IT Coordinator for this year as well as this website's author! I am looking forward to s",
    date: '1 September 2026',
    author: 'Burhanuddin',
    featured: true,
    body: [
      "Hello Everyone! My name is Burhanuddin and I am the IT Coordinator for this year as well as this website's author! I am looking forward to serve you guys especially in this special 50th student council.",
      'I am really excited to see what this year brings. :)',
      'By the Students. From the Students. For the Students.',
    ],
  },
]

export const newsCategories = ['All', 'Announcement', 'Project Update', 'Event Recap', 'Achievement', 'Campaign', 'Student Opportunity']

export const clubs = [
  { cat: 'Academic', name: 'Financial Literacy', desc: 'To equip students with knowledge in money management, investing, and personal finance to build long-term wealth and responsible economic habits.', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Creative', name: 'Made by Scholars', desc: 'Develop skills to create items.', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Academic', name: 'Marketing and Branding', desc: 'To introduce students to the principles of modern marketing, consumer psychology, and how to build a compelling personal or business brand.', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Sports', name: 'Martial Arts', desc: 'To foster physical fitness, self-discipline, respect, and self-defense skills through a structured, non-contact/light-contact martial arts curriculum.', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Technology', name: 'MindCraft', desc: 'Build, and play Minecraft: Education while learning engineering and coding skills.', schedule: 'Tuesdays, Thursdays', location: '-', leads: 'Amit, Arjun, Burhanuddin', join: '-' },
  { cat: 'Leadership', name: 'Podcast (Photography and Editing)', desc: 'To teach students technical and creative skills required to produce, edit, and market high-quality digital media, combining audio storytelling with visual branding.', schedule: '-', location: '-', leads: '-', join: '-' },
  { cat: 'Leadership', name: 'Public Speaking', desc: 'Learn how to conquer stage fright and be able to confidently speak in front of anyone!', schedule: '-', location: '-', leads: '-', join: '-' },
]

export const clubCategories = ['All', 'Academic', 'Sports', 'Creative', 'Technology', 'Community', 'Culture', 'Leadership']

export const yearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11']

export const voiceCategories = ['Academic', 'Facilities', 'Events', 'Clubs', 'Wellbeing', 'Sustainability', 'Student Life', 'Other']

export const voicePriorities = ['Low', 'Medium', 'High', 'Urgent']

export const ideasBoard = [
  { cat: 'Events', title: 'More student-led competitions', status: 'Completed', desc: 'The Inter-House Debate Competition has been scheduled for November, with more competitions planned.' },
]
