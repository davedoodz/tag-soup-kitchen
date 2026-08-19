// One archive, read by every high-fidelity surface in /public/designs.
// Plain script so a surface works unchanged on its own port, under the shared root, and on file://.

window.PORTFOLIO_PROJECTS = [
  {
    id: 'ledger',
    title: 'Ledger',
    subtitle: 'Payments console',
    category: 'Product',
    year: '2026',
    client: 'Ledger Financial',
    role: 'Lead product design',
    team: '6 people',
    duration: '14 weeks',
    tone: 'ink',
    ratio: '4 / 3',
    lead: 'A payments console for treasury teams moving eight figures a day, where a misread row costs more than a redesign.',
    problem:
      'Operators reconciled transfers across four tools and a spreadsheet. Every high-value release needed a second person to confirm what the screen already claimed.',
    approach:
      'One ledger view with the money always in the same lane, states written in words rather than colour, and an approval trail attached to the row instead of an inbox.',
    outcome:
      'Reconciliation moved inside the product. Dual approval became a two-click step on the row being released.',
    metrics: [
      { label: 'Time to release', value: '9 min → 40 s' },
      { label: 'Tools in the flow', value: '4 → 1' },
      { label: 'Support tickets', value: '−62%' },
    ],
  },
  {
    id: 'northbound',
    title: 'Northbound',
    subtitle: 'Identity system',
    category: 'Branding',
    year: '2026',
    client: 'Northbound Travel Studio',
    role: 'Creative direction',
    team: '4 people',
    duration: '11 weeks',
    tone: 'graphite',
    ratio: '1 / 1',
    lead: 'An identity for a travel studio that sells restraint: no sunsets, no exclamation marks, one grid that holds a decade of itineraries.',
    problem:
      'The studio published in six formats a week and redrew the logotype for each one. Nothing looked wrong, and nothing looked related.',
    approach:
      'A single wordmark at one weight, a fixed caption grid, and a photography rule that admits only available light. The system is a set of refusals.',
    outcome:
      'Itineraries, guides, and print all set from the same eight rules, applied in-house without a designer in the loop.',
    metrics: [
      { label: 'Logotype variants', value: '11 → 1' },
      { label: 'Layout time', value: '−45%' },
      { label: 'In-house adoption', value: '100%' },
    ],
  },
  {
    id: 'atlas',
    title: 'Atlas',
    subtitle: 'Research library',
    category: 'Web',
    year: '2026',
    client: 'Atlas Institute',
    role: 'Product design, front end',
    team: '5 people',
    duration: '9 weeks',
    tone: 'mist',
    ratio: '16 / 9',
    lead: 'Thirty years of field research, published as one searchable library that behaves the same on a laptop in a library and a phone in a field.',
    problem:
      'Papers lived in a download folder behind a login. Citations pointed at PDFs that had been re-uploaded three times under different names.',
    approach:
      'Stable URLs per study, a filter set built from the institute’s own vocabulary, and a reading view that keeps figures beside the paragraph that argues them.',
    outcome:
      'Every study now has one address. External citations resolve, and the archive is read more than it is downloaded.',
    metrics: [
      { label: 'Studies published', value: '1,284' },
      { label: 'Broken citations', value: '0' },
      { label: 'Read vs download', value: '3.1×' },
    ],
  },
  {
    id: 'signal',
    title: 'Signal',
    subtitle: 'Broadcast titles',
    category: 'Motion',
    year: '2025',
    client: 'Signal Public Radio',
    role: 'Motion design',
    team: '3 people',
    duration: '7 weeks',
    tone: 'charcoal',
    ratio: '16 / 9',
    lead: 'A title system for a radio newsroom that had to become watchable overnight, built from the waveform the studio already produced.',
    problem:
      'Video segments were assembled per episode by whoever was free. Type jumped size between stories and lower thirds covered the speaker.',
    approach:
      'Six timed states driven by audio amplitude, one type size per role, and a safe lane that no element may enter.',
    outcome:
      'Editors assemble titles from presets in minutes, and the newsroom reads as one channel across every clip.',
    metrics: [
      { label: 'Assembly time', value: '35 min → 6 min' },
      { label: 'Title presets', value: '6' },
      { label: 'Episodes shipped', value: '240+' },
    ],
  },
  {
    id: 'foundry',
    title: 'Foundry',
    subtitle: 'Procedural forms',
    category: '3D',
    year: '2025',
    client: 'Self-directed',
    role: 'Direction, technical art',
    team: 'Solo',
    duration: '6 weeks',
    tone: 'graphite',
    ratio: '3 / 2',
    lead: 'A tactile series of cast forms where the imperfection is the subject: pressure, seams, and the marks a mould leaves behind.',
    problem:
      'Procedural work tends to look frictionless. Renders read as software rather than as objects that were made by something.',
    approach:
      'Every form starts from a physical constraint — pour direction, cooling, release angle — and the seam is kept rather than cleaned.',
    outcome:
      'A twelve-piece series and a reusable shader kit, now the base for the studio’s material studies.',
    metrics: [
      { label: 'Forms in series', value: '12' },
      { label: 'Shader kit reuse', value: '4 projects' },
      { label: 'Render time', value: '−38%' },
    ],
  },
  {
    id: 'quarter',
    title: 'Quarter',
    subtitle: 'Annual report',
    category: 'Print',
    year: '2025',
    client: 'Quarter Housing Trust',
    role: 'Editorial design',
    team: '4 people',
    duration: '10 weeks',
    tone: 'fog',
    ratio: '3 / 4',
    lead: 'A 96-page report for a housing trust, set so that the numbers a tenant cares about arrive before the numbers a board cares about.',
    problem:
      'The previous report opened with governance and buried repair times on page 71. Tenants stopped reading it, and the trust knew.',
    approach:
      'Two reading paths through one book: a tenant path in large type at the front, a financial path in tabular figures at the back, one index binding them.',
    outcome:
      'The trust prints one document for both audiences, and the tenant section is now excerpted as a standalone leaflet.',
    metrics: [
      { label: 'Pages', value: '96' },
      { label: 'Reading paths', value: '2' },
      { label: 'Leaflet reprints', value: '18,000' },
    ],
  },
  {
    id: 'meridian',
    title: 'Meridian',
    subtitle: 'Editorial illustration',
    category: 'Illustration',
    year: '2025',
    client: 'Meridian Magazine',
    role: 'Illustration, art direction',
    team: '2 people',
    duration: 'Ongoing',
    tone: 'mist',
    ratio: '4 / 5',
    lead: 'A monthly commission drawing infrastructure stories — water, freight, grid — as line work that survives a newsprint press.',
    problem:
      'Full-tone illustration turned to mud on the magazine’s uncoated stock, and each artist solved the press differently.',
    approach:
      'A fixed line weight, one hatch pattern per subject family, and proofs pulled on the real stock before the drawing is finished.',
    outcome:
      'Sixteen covers into the commission, the drawings hold on press and read as one hand.',
    metrics: [
      { label: 'Covers delivered', value: '16' },
      { label: 'Press rejections', value: '0' },
      { label: 'Hatch families', value: '5' },
    ],
  },
  {
    id: 'harbour',
    title: 'Harbour',
    subtitle: 'Booking flow',
    category: 'Product',
    year: '2024',
    client: 'Harbour Ferries',
    role: 'Design lead',
    team: '7 people',
    duration: '16 weeks',
    tone: 'graphite',
    ratio: '4 / 3',
    lead: 'A mobile-first ferry booking flow that keeps availability, price, and the trade-off between them on the same screen.',
    problem:
      'Travellers picked a sailing, then discovered the price, then went back. A third of sessions ended on the calendar.',
    approach:
      'Price sits in the calendar cell. Sold-out sailings stay visible with the next available one named. The basket never hides what changed.',
    outcome:
      'Booking became a single pass. Calendar abandonment fell by more than half in the first quarter after launch.',
    metrics: [
      { label: 'Calendar drop-off', value: '−54%' },
      { label: 'Steps to book', value: '7 → 3' },
      { label: 'Mobile conversion', value: '+21%' },
    ],
  },
  {
    id: 'cadence',
    title: 'Cadence',
    subtitle: 'Scheduling tool',
    category: 'Product',
    year: '2024',
    client: 'Cadence Clinics',
    role: 'Product design',
    team: '5 people',
    duration: '12 weeks',
    tone: 'ink',
    ratio: '16 / 10',
    lead: 'Rota software for clinics where a swapped shift is a clinical event, not a calendar entry.',
    problem:
      'Coordinators ran the rota in a spreadsheet because the product could not express “this nurse, but only until three”.',
    approach:
      'Constraints are first-class: cover rules, competency, and hard stops are written into the grid and checked as it is edited.',
    outcome:
      'Clinics publish a fortnight in one sitting, and the spreadsheet is gone from the handover.',
    metrics: [
      { label: 'Rota build time', value: '5 h → 50 min' },
      { label: 'Cover breaches', value: '−78%' },
      { label: 'Clinics live', value: '34' },
    ],
  },
  {
    id: 'solstice',
    title: 'Solstice',
    subtitle: 'Festival sequence',
    category: 'Motion',
    year: '2024',
    client: 'Solstice Festival',
    role: 'Motion, stage design',
    team: '6 people',
    duration: '8 weeks',
    tone: 'charcoal',
    ratio: '21 / 9',
    lead: 'A stage sequence timed to a single day of light, run live from a desk at the back of the field.',
    problem:
      'The festival’s screens showed a loop that ignored the sky behind them. By dusk the content was invisible.',
    approach:
      'Contrast, density, and type size step through five states tied to sun position, with a manual override the operator can reach without looking.',
    outcome:
      'One sequence carried eleven hours of programming and stayed legible from the far fence at every hour.',
    metrics: [
      { label: 'Hours on screen', value: '11' },
      { label: 'Light states', value: '5' },
      { label: 'Operator overrides', value: '3' },
    ],
  },
  {
    id: 'terrace',
    title: 'Terrace',
    subtitle: 'Wayfinding',
    category: 'Branding',
    year: '2024',
    client: 'Terrace Market',
    role: 'Environmental design',
    team: '4 people',
    duration: '13 weeks',
    tone: 'fog',
    ratio: '1 / 1',
    lead: 'Signage for a covered market on three split levels, where the fastest route is rarely the obvious one.',
    problem:
      'Traders printed their own signs. Visitors navigated by asking, and the market’s own map contradicted the building.',
    approach:
      'A landmark per level, a strict two-word maximum per sign, and a trader plate that gives every stall the same voice.',
    outcome:
      'Ninety-two plates, one map, and a signage kit the market fabricates locally as stalls change hands.',
    metrics: [
      { label: 'Plates installed', value: '92' },
      { label: 'Wayfinding questions', value: '−61%' },
      { label: 'Fabrication', value: 'Local' },
    ],
  },
  {
    id: 'prism',
    title: 'Prism',
    subtitle: 'Charting suite',
    category: 'Web',
    year: '2023',
    client: 'Prism Analytics',
    role: 'Information design',
    team: '5 people',
    duration: '15 weeks',
    tone: 'charcoal',
    ratio: '3 / 2',
    lead: 'A charting suite that stays readable without colour, so an accessible chart is the default rather than a variant.',
    problem:
      'Every chart depended on hue. Screen-reader users received a canvas element, and printed decks lost the argument entirely.',
    approach:
      'Encode with position, shape, and label first; treat colour as reinforcement. Each chart ships a table view built from the same data.',
    outcome:
      'Nine chart types, all legible in greyscale and all navigable by keyboard and screen reader.',
    metrics: [
      { label: 'Chart types', value: '9' },
      { label: 'Greyscale legible', value: '100%' },
      { label: 'WCAG issues', value: '0 blocking' },
    ],
  },
]
