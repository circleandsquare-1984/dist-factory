export const FILMS = [
  {
    id: 'htbal',
    title: 'How to Build a Library',
    year: 2025,
    directors: 'Maia Lekow & Christopher King',
    logline: 'Two tenacious Nairobi women work to transform a once whites-only library into a vibrant cultural hub.',
    themes: ['decolonisation', 'African history', "women's leadership", 'public knowledge', 'urban Africa', 'colonial legacy'],
    regions: ['North America', 'UK & Europe', 'Africa', 'Australia'],
    awards: ['Golden Alexander — Thessaloniki IDF 2025', 'Honorable Mention — SFIFF 2025', 'Amnesty International Award — Human Rights FF Lugano 2025'],
    festivals: ['Sundance 2025', 'CPH:DOX', 'Sheffield DocFest', 'Sydney Film Festival', 'True/False', 'DOK.fest München'],
    salesAgent: 'Autlook Filmsales',
    broadcaster: 'PBS POV Season 39',
    status: 'active',
    color: '#EF9F27',
  },
  {
    id: 'the-letter',
    title: 'The Letter',
    year: 2021,
    directors: 'Maia Lekow & Christopher King',
    logline: 'An exploration of inter-generational conflict in coastal Kenya.',
    themes: ['Kenya', 'family', 'land rights', 'coastal Africa', 'tradition vs modernity'],
    regions: ['Africa', 'Europe'],
    awards: [],
    festivals: ['IDFA', 'DOC NYC', 'AFI Docs', 'FESPACO'],
    salesAgent: 'Autlook Filmsales',
    broadcaster: null,
    status: 'idle',
    color: '#7F77DD',
  }
]

export const PIPELINE_DEFS = [
  {
    id: 'edu', label: 'Educational Sales', shortLabel: 'edu sales',
    color: '#EF9F27', dimColor: '#854F0B',
    nodes: [
      { id: 'film-brief',     title: 'Film Brief',        icon: 'file-text',       engine: 'claude', type: 'input',    description: 'Source of truth. Extracts structured film profile from press kit.' },
      { id: 'auto-configure', title: 'Auto-Configure',    icon: 'settings',        engine: 'claude', type: 'process',  description: 'Reads film profile and sets search parameters for all downstream nodes.' },
      { id: 'lead-scraper',   title: 'Lead Scraper',      icon: 'world-search',    engine: 'claude', type: 'process',  description: 'Searches for universities, professors, student orgs relevant to film themes.' },
      { id: 'deduplicator',   title: 'Deduplicator',      icon: 'copy-off',        engine: 'claude', type: 'process',  description: 'Cross-references against sent log to remove already-contacted leads.' },
      { id: 'email-drafter',  title: 'Email Drafter',     icon: 'mail',            engine: 'claude', type: 'process',  description: 'Writes tailored outreach emails per contact type and institution.' },
      { id: 'approval-queue', title: 'Approval Queue',    icon: 'user-check',      engine: 'human',  type: 'approval', description: 'You review, edit, and send. Nothing goes out without your sign-off.' },
      { id: 'sent-log',       title: 'Sent Log',          icon: 'database',        engine: 'human',  type: 'output',   description: 'Permanent record of all outreach. Feeds back to deduplicator.' },
    ]
  },
  {
    id: 'pr', label: 'PR & Publicity', shortLabel: 'pr & press',
    color: '#7F77DD', dimColor: '#534AB7',
    nodes: [
      { id: 'film-brief',     title: 'Film Brief',          icon: 'file-text',  engine: 'claude', type: 'input',    description: 'Shared film profile — themes, quotes, awards, key press hooks.' },
      { id: 'press-list',     title: 'Press List Builder',  icon: 'news',       engine: 'claude', type: 'process',  description: 'Finds journalists and outlets covering African cinema, decolonisation, documentary.' },
      { id: 'pitch-drafter',  title: 'Pitch Drafter',       icon: 'pencil',     engine: 'claude', type: 'process',  description: 'Writes tailored pitches per outlet and beat.' },
      { id: 'followup',       title: 'Follow-up Scheduler', icon: 'clock',      engine: 'claude', type: 'process',  description: 'Queues follow-ups after 5 days for non-replies.' },
      { id: 'approval-queue', title: 'Approval Queue',      icon: 'user-check', engine: 'human',  type: 'approval', description: 'You review and send all pitches.' },
      { id: 'coverage-log',   title: 'Coverage Log',        icon: 'chart-bar',  engine: 'human',  type: 'output',   description: 'Tracks pickups, clips, and press coverage.' },
    ]
  },
  {
    id: 'impact', label: 'Impact & Outreach', shortLabel: 'impact',
    color: '#1D9E75', dimColor: '#0F6E56',
    nodes: [
      { id: 'film-brief',      title: 'Film Brief',        icon: 'file-text',          engine: 'claude', type: 'input',    description: 'Film profile with themes, partner types, and target regions.' },
      { id: 'partner-finder',  title: 'Partner Finder',    icon: 'building-community', engine: 'claude', type: 'process',  description: 'Finds NGOs, cultural orgs, and venues aligned with film themes.' },
      { id: 'screening-draft', title: 'Screening Enquiry', icon: 'movie',              engine: 'claude', type: 'process',  description: 'Drafts screening enquiry emails per partner type.' },
      { id: 'event-tracker',   title: 'Event Tracker',     icon: 'calendar',           engine: 'human',  type: 'process',  description: 'Tracks confirmed, pending, and completed screenings.' },
      { id: 'approval-queue',  title: 'Approval Queue',    icon: 'user-check',         engine: 'human',  type: 'approval', description: 'You review and send all outreach.' },
      { id: 'impact-report',   title: 'Impact Report',     icon: 'chart-bar',          engine: 'claude', type: 'output',   description: 'Generates reach, audience, and press summaries per film.' },
    ]
  },
  {
    id: 'grants', label: 'Grants & Fundraising', shortLabel: 'grants',
    color: '#D4537E', dimColor: '#993556',
    nodes: [
      { id: 'film-brief',      title: 'Film Brief',        icon: 'file-text',         engine: 'claude', type: 'input',    description: 'Film profile including budget stage, themes, and eligibility signals.' },
      { id: 'grant-finder',    title: 'Grant Finder',      icon: 'search',            engine: 'claude', type: 'process',  description: 'Finds open grants from foundations, funds, and government bodies.' },
      { id: 'loi-drafter',     title: 'LOI Drafter',       icon: 'file-description',  engine: 'claude', type: 'process',  description: 'Writes letters of inquiry tailored per funder.' },
      { id: 'deadline-tracker',title: 'Deadline Tracker',  icon: 'clock-exclamation', engine: 'human',  type: 'process',  description: 'Tracks application deadlines and sends reminders.' },
      { id: 'approval-queue',  title: 'Approval Queue',    icon: 'user-check',        engine: 'human',  type: 'approval', description: 'You review and submit all applications.' },
      { id: 'awards-log',      title: 'Awards Log',        icon: 'trophy',            engine: 'human',  type: 'output',   description: 'Tracks received, pending, and declined grants.' },
    ]
  },
  {
    id: 'commercial', label: 'Commercial Sales', shortLabel: 'commercial',
    color: '#378ADD', dimColor: '#185FA5',
    nodes: [
      { id: 'film-brief',    title: 'Film Brief',         icon: 'file-text',       engine: 'claude', type: 'input',    description: 'Film profile with rights available, territory history, and format details.' },
      { id: 'dist-finder',   title: 'Distributor Finder', icon: 'building-store',  engine: 'claude', type: 'process',  description: 'Finds distributors, broadcasters, and platforms by territory.' },
      { id: 'deal-pitch',    title: 'Deal Pitch',         icon: 'receipt',         engine: 'claude', type: 'process',  description: 'Drafts tailored pitches per territory and platform type.' },
      { id: 'deal-tracker',  title: 'Deal Tracker',       icon: 'file-invoice',    engine: 'human',  type: 'process',  description: 'Tracks negotiation status, signed deals, and live agreements.' },
      { id: 'approval-queue',title: 'Approval Queue',     icon: 'user-check',      engine: 'human',  type: 'approval', description: 'You review and send all pitches.' },
      { id: 'revenue-log',   title: 'Revenue Log',        icon: 'currency-dollar', engine: 'human',  type: 'output',   description: 'Tracks royalties, advances, and revenue splits per film.' },
    ]
  }
]

export const INITIAL_STATUSES = {
  htbal: {
    edu:        { 'film-brief': 'done', 'auto-configure': 'done', 'lead-scraper': 'running', 'deduplicator': 'waiting', 'email-drafter': 'idle', 'approval-queue': 'idle', 'sent-log': 'idle' },
    pr:         { 'film-brief': 'done', 'press-list': 'running', 'pitch-drafter': 'idle', 'followup': 'idle', 'approval-queue': 'idle', 'coverage-log': 'idle' },
    impact:     { 'film-brief': 'done', 'partner-finder': 'idle', 'screening-draft': 'idle', 'event-tracker': 'idle', 'approval-queue': 'idle', 'impact-report': 'idle' },
    grants:     { 'film-brief': 'done', 'grant-finder': 'idle', 'loi-drafter': 'idle', 'deadline-tracker': 'idle', 'approval-queue': 'idle', 'awards-log': 'idle' },
    commercial: { 'film-brief': 'done', 'dist-finder': 'idle', 'deal-pitch': 'idle', 'deal-tracker': 'idle', 'approval-queue': 'idle', 'revenue-log': 'idle' },
  },
  'the-letter': {
    edu:        { 'film-brief': 'idle', 'auto-configure': 'idle', 'lead-scraper': 'idle', 'deduplicator': 'idle', 'email-drafter': 'idle', 'approval-queue': 'idle', 'sent-log': 'idle' },
    pr:         { 'film-brief': 'idle', 'press-list': 'idle', 'pitch-drafter': 'idle', 'followup': 'idle', 'approval-queue': 'idle', 'coverage-log': 'idle' },
    impact:     { 'film-brief': 'idle', 'partner-finder': 'idle', 'screening-draft': 'idle', 'event-tracker': 'idle', 'approval-queue': 'idle', 'impact-report': 'idle' },
    grants:     { 'film-brief': 'idle', 'grant-finder': 'idle', 'loi-drafter': 'idle', 'deadline-tracker': 'idle', 'awards-log': 'idle', 'approval-queue': 'idle' },
    commercial: { 'film-brief': 'idle', 'dist-finder': 'idle', 'deal-pitch': 'idle', 'deal-tracker': 'idle', 'approval-queue': 'idle', 'revenue-log': 'idle' },
  }
}
