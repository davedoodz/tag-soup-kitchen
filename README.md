<pre>
   ┌───┐┌───┐┌───┐   ┌─┐┌─┐┌─┐┌─┐
   │&lt;t&gt;││&lt;a&gt;││&lt;g&gt;│   │s││o││u││p│
   └───┘└───┘└───┘   └─┘└─┘└─┘└─┘
        ░░░░░░░░░░░░░░░░░░░░░░
        ░  K I T C H E N  ░
        ░░░░░░░░░░░░░░░░░░░░░░
   stir ⟶ simmer ⟶ serve ⟶ archive
</pre>

# Tag Soup Kitchen

A minimalist long-term archive of every HTML surface I've ever shipped — design explorations, UX prototypes, motion studies, and finished project snapshots, all kept as plain, self-contained HTML files so they still render in ten years with zero dependencies.

## What it is

Most of my design work starts as a throwaway HTML prototype: a hover state, a masonry layout, a card animation, a whole case-study page. Those files are too useful to delete and too scattered to find later. This repo is where they go to live — pulled from source projects, hashed, timestamped, and indexed so I can always find "that one distance widget I built in August."

It's not a framework or a product. It's a kitchen pantry: everything labeled, nothing thrown out.

## Highlights

- **`index.html` / `hub.html`** — a searchable table of every archived surface, with live vs. archived status, descriptions, and direct links.
- **`archive-ledger.json`** — the source of truth. Each entry records its path, title, description, content hash, size, and state (`live` or `archived`), so changes are traceable over time.
- **Exploration folders** (`designs/`, `masonry/`, `combinations/`, `variants/`) — numbered series of layout experiments, each with its own `index.html` so a whole study can be browsed as a set.
- **One-off studies** at the root (`scroll-ring.html`, `flip-band.html`, `micro-interactions.html`, `name-tokens.html`, and more) — individual UI mechanics explored in isolation.
- **`shared/`** — the CSS and JS design tokens (AColorBright, Harbour, Hifi) that recur across the archived surfaces, kept here so old files still look right.
- **`archive/`** — fully retired studies, frozen as-is under dated folder names.

## Stack

Plain HTML/CSS/JS throughout — no build step is required to view anything. The only tooling is a small pair of Node scripts (zero dependencies) that sync new surfaces in from source projects and serve the archive locally.

## Run locally

```bash
npm run serve   # serves the archive at http://localhost:4230
npm run sync    # pulls new HTML surfaces in from a source project and rebuilds the ledger + index
```

`sync` reads from `../final-portfolio` by default; point it elsewhere with `--source=<path>` or the `HTML_LAB_SOURCE` env var.

## Map

```text
.
├── index.html / hub.html     # the archive's own browsable index
├── archive-ledger.json       # generated metadata for every entry
├── scripts/                  # build-archive.mjs (sync) and serve.mjs (local server)
├── shared/                   # shared CSS/JS tokens used across archived files
├── designs/ masonry/
│   combinations/ variants/   # numbered exploration series, each with its own index
├── assets/final-projects/    # per-project asset snapshots
└── archive/                  # retired studies, frozen under dated folders
```

## Why keep it

Design work is easy to lose once a project ships and the branch gets deleted. This is the backstage room where the prototypes stay reachable — for re-use, for comparison, and for remembering how an idea actually got to where it ended up.
