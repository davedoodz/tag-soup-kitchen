#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const SOURCE = (() => {
  const sourceArg = arg('source') || process.env.HTML_LAB_SOURCE;
  return path.resolve(ROOT, sourceArg || '../final-portfolio');
})();

const OUTPUT = path.resolve(arg('out') || ROOT);
const SKIP_DIRS = new Set(['.git', 'node_modules', '.vite', '.obsidian', 'dist']);
const EXCLUDED_ROOT_HTML = new Set(['index.html']);
const CONFIG_PATH = path.join(SOURCE, 'scripts', 'sites.config.mjs');

const NAME = 'Tag Soup Kitchen';
const TITLE = 'Tag Soup Kitchen (a.k.a. HTML Lab)';
const SUBTITLE = 'A minimalist long-term archive of every HTML surface.';

const LEDGER_PATH = path.join(OUTPUT, 'archive-ledger.json');
const INDEX_PATH = path.join(OUTPUT, 'index.html');

function arg(name) {
  const equals = process.argv.find((item) => item.startsWith(`--${name}=`));
  if (equals) return equals.slice(name.length + 3);

  const found = process.argv.indexOf(`--${name}`);
  if (found === -1) return undefined;

  const next = process.argv[found + 1];
  if (next && !next.startsWith('--')) return next;

  return true;
}

const toPosix = (p) => p.split(path.sep).join('/');

function normalizeDocument(doc) {
  return toPosix(doc).replace(/^\/+/, '');
}

function hashContent(buffer) {
  return createHash('sha1').update(buffer).digest('hex');
}

function fileToDate(stat) {
  return new Date(stat.mtimeMs).toISOString();
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseTitleAndDescription(html) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || 'Untitled HTML').trim();
  const descriptionAttr =
    html.match(/<meta\s+[^>]*name=["']description["'][^>]*>/i);

  let description = null;
  if (descriptionAttr) {
    const contentMatch = descriptionAttr[0].match(/content=["']([^"']*)["']/i);
    description = contentMatch ? contentMatch[1] : null;
  }

  if (!description) {
    description = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);
  }

  return {
    title: title || 'Untitled HTML',
    description,
  };
}

function firstGitCommitDateIso(sourceRoot, relPath) {
  try {
    const out = execSync(
      ['git', '-C', sourceRoot, 'log', '--format=%ct', '--reverse', '--', relPath],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );

    const lines = String(out).trim().split('\n').filter(Boolean);
    if (!lines.length) return null;

    const seconds = Number(lines[0]);
    if (!Number.isFinite(seconds)) return null;

    return new Date(seconds * 1000).toISOString();
  } catch {
    return null;
  }
}

async function readConfigMap() {
  if (!(await pathExists(CONFIG_PATH))) {
    return { live: new Map(), archive: new Map() };
  }

  const siteConfig = await import(pathToFileURL(CONFIG_PATH).href);
  const live = new Map();
  const archive = new Map();

  const add = (entry, target) => {
    if (!entry?.document) return;

    const normalized = normalizeDocument(entry.document);
    const key = normalized.startsWith('public/') ? normalized.replace(/^public\//, '') : normalized;
    (target === 'archive' ? archive : live).set(key, {
      title: entry.title || null,
      description: entry.description || null,
      port: entry.port || null,
    });
  };

  for (const item of siteConfig.sites || []) add(item, 'live');
  for (const item of siteConfig.archiveSites || []) add(item, 'archive');

  return { live, archive };
}

async function walkHtmlFiles(baseDir) {
  const queue = [baseDir];
  const discovered = [];

  while (queue.length) {
    const dir = queue.pop();
    const name = path.basename(dir);
    if (name.startsWith('.') || SKIP_DIRS.has(name)) {
      continue;
    }

    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        queue.push(full);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!entry.name.toLowerCase().endsWith('.html')) continue;

      const rel = toPosix(path.relative(SOURCE, full));
      if (!rel.includes('/') && EXCLUDED_ROOT_HTML.has(rel)) continue;

      const top = rel.includes('/') ? rel.split('/')[0] : rel;
      if (top !== 'public' && top.startsWith('public')) continue;

      discovered.push(full);
    }
  }

  return discovered.sort((a, b) => toPosix(path.relative(SOURCE, a)).localeCompare(toPosix(path.relative(SOURCE, b))));
}

async function copyRecursive(sourceDir, destinationDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  await fs.mkdir(destinationDir, { recursive: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const from = path.join(sourceDir, entry.name);
    const to = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      await copyRecursive(from, to);
      continue;
    }

    if (!entry.isFile()) continue;
    await fs.copyFile(from, to);
  }
}

function stateAndMeta(targetPath, meta, siteMap) {
  if (siteMap.archive.has(targetPath)) {
    const cfg = siteMap.archive.get(targetPath);
    return {
      state: 'archive',
      title: cfg.title || meta.title,
      description: cfg.description || meta.description,
      port: cfg.port,
    };
  }

  if (siteMap.live.has(targetPath)) {
    const cfg = siteMap.live.get(targetPath);
    return {
      state: 'live',
      title: cfg.title || meta.title,
      description: cfg.description || meta.description,
      port: cfg.port,
    };
  }

  return {
    state: 'standalone',
    title: meta.title,
    description: meta.description,
    port: null,
  };
}

function sequenceCompare(a, b) {
  const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
  const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;

  if (seqA !== seqB) return seqA - seqB;

  if (a.path === b.path) return 0;
  return a.path.localeCompare(b.path);
}

async function writeIndex(entries) {
  const rows = entries
    .map((entry) => {
      const badgeClass =
        entry.state === 'live'
          ? 'badge-live'
          : entry.state === 'archive'
          ? 'badge-archive'
          : 'badge';

      const source = entry.sourcePath;
      return `
        <tr>
          <td>${String(entry.sequence).padStart(4, '0')}</td>
          <td><time datetime="${entry.createdAt}">${(entry.createdAt || '').slice(0, 10)}</time></td>
          <td><span class="badge ${badgeClass}">${entry.state}</span></td>
          <td><a href="./${entry.path}">${entry.path}</a></td>
          <td>${escapeHtml(entry.title)}</td>
          <td>${escapeHtml(entry.description || '')}</td>
          <td><span class="muted">${escapeHtml(source)}</span></td>
          <td>${entry.port ? `<code>${entry.port}</code>` : '-'}</td>
        </tr>`;
    })
    .join('\n');

  const output = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(NAME)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f7f8;
        --line: #d8dde3;
        --text: #17191e;
        --muted: #60636b;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
        background: var(--bg);
        color: var(--text);
      }
      .wrap {
        margin: 0 auto;
        max-width: 1100px;
        padding: 20px;
      }
      h1 { margin: 0; }
      .muted { color: var(--muted); }
      table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid var(--line);
      }
      th,
      td {
        border-bottom: 1px solid var(--line);
        text-align: left;
        vertical-align: top;
        padding: 10px 8px;
      }
      th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: #eaf0f8;
      }
      thead th { font-weight: 700; }
      a { color: #1f56d6; }
      .badge {
        border: 1px solid #cfd5de;
        border-radius: 999px;
        padding: 2px 6px;
        white-space: nowrap;
        font-size: 11px;
        text-transform: uppercase;
      }
      .badge-live { background: #eaf8ee; color: #0e5f29; border-color: #b7dfbf; }
      .badge-archive { background: #fff6e7; color: #7a4a00; border-color: #f0d4a7; }
      .meta {
        margin: 8px 0 16px;
        display: grid;
        gap: 4px;
      }
      .footer {
        margin-top: 16px;
        color: var(--muted);
      }
      code {
        font-size: 12px;
        background: #edf2f9;
        border-radius: 4px;
        padding: 1px 5px;
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <h1>${escapeHtml(TITLE)}</h1>
      <p class="muted">${escapeHtml(SUBTITLE)}</p>
      <p class="meta">
        <span>Entries: <strong>${entries.length}</strong></span>
        <span>Generated at: <strong>${new Date().toISOString()}</strong></span>
        <span>Source: <strong>${escapeHtml(path.relative(OUTPUT, SOURCE) || SOURCE)}</strong></span>
      </p>
      <table>
        <thead>
          <tr>
            <th>Seq</th>
            <th>Created</th>
            <th>State</th>
            <th>Path</th>
            <th>Title</th>
            <th>Description</th>
            <th>Source</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
      <p class="footer">Ledger file: <a href="./archive-ledger.json">archive-ledger.json</a></p>
    </main>
  </body>
</html>
`;

  await fs.writeFile(INDEX_PATH, output, 'utf8');
}

async function writeLedger(entries) {
  const payload = {
    generatedAt: new Date().toISOString(),
    repository: NAME,
    sourceRoot: path.relative(OUTPUT, SOURCE),
    entries,
  };

  await fs.writeFile(LEDGER_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  if (!(await pathExists(SOURCE))) {
    throw new Error(`Source path does not exist: ${SOURCE}`);
  }

  const sourcePublic = path.join(SOURCE, 'public');
  if (!(await pathExists(sourcePublic))) {
    throw new Error(`Expected ${sourcePublic} to exist.`);
  }

  const htmlFiles = await walkHtmlFiles(SOURCE);
  const existing = await fs
    .readFile(LEDGER_PATH, 'utf8')
    .then((raw) => JSON.parse(raw).entries || [])
    .catch(() => []);

  const existingByPath = new Map(existing.map((entry) => [entry.path, entry]));
  const siteMap = await readConfigMap();

  await copyRecursive(sourcePublic, OUTPUT);

  const discovered = [];

  for (const sourceFile of htmlFiles) {
    const sourceRel = toPosix(path.relative(SOURCE, sourceFile));
    const targetRel = sourceRel.startsWith('public/') ? sourceRel.slice('public/'.length) : sourceRel;

    const rawText = await fs.readFile(sourceFile, 'utf8');
    const rawBytes = await fs.readFile(sourceFile);
    const stats = await fs.stat(sourceFile);

    const parsed = parseTitleAndDescription(rawText);
    const meta = stateAndMeta(targetRel, parsed, siteMap);

    const createdAt =
      existingByPath.get(targetRel)?.createdAt ||
      firstGitCommitDateIso(SOURCE, sourceRel) ||
      fileToDate(stats);

    discovered.push({
      path: targetRel,
      sourcePath: sourceRel,
      createdAt,
      updatedAt: fileToDate(stats),
      size: stats.size,
      sourceHash: hashContent(rawBytes),
      title: meta.title,
      description: meta.description,
      state: meta.state,
      port: meta.port,
      sequence: existingByPath.get(targetRel)?.sequence || null,
    });

    if (!sourceRel.startsWith('public/')) {
      await fs.copyFile(sourceFile, path.join(OUTPUT, targetRel));
    }
  }

  const stale = [];
  for (const old of existing) {
    if (!discovered.some((entry) => entry.path === old.path)) {
      stale.push({
        ...old,
        inSource: false,
        updatedAt: old.updatedAt || fileToDate({ mtimeMs: Date.now() }),
        state: old.state || 'orphaned',
      });
    }
  }

  let nextSequence = Math.max(0, ...discovered.map((entry) => entry.sequence || 0), ...existing.map((entry) => entry.sequence || 0));

  const newEntries = discovered
    .filter((entry) => entry.sequence == null)
    .sort((a, b) => {
      if (a.createdAt === b.createdAt) return a.sourcePath.localeCompare(b.sourcePath);
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    .map((entry) => ({
      ...entry,
      sequence: (nextSequence += 1),
      inSource: true,
    }));

  const kept = new Map();

  for (const entry of discovered) {
    if (entry.sequence == null) {
      const rebuilt = newEntries.find((item) => item.path === entry.path);
      kept.set(entry.path, { ...entry, ...rebuilt, inSource: true });
      continue;
    }
    kept.set(entry.path, {
      ...existingByPath.get(entry.path),
      ...entry,
      sequence: entry.sequence,
      inSource: true,
    });
  }

  for (const old of stale) {
    kept.set(old.path, {
      ...old,
      inSource: false,
      state: old.state || 'orphaned',
    });
  }

  const entries = Array.from(kept.values()).sort(sequenceCompare);

  await writeIndex(entries);
  await writeLedger(entries);

  console.log(`TagSoupKitchen synced ${entries.length} entries from ${SOURCE}.`);
}

await main();
