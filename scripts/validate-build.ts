import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import {
  assertPageCsp,
  assertSafeBuildPath,
  assertSafeBuildText,
} from './build-security.ts';
import { routes } from '../src/data/routes.ts';
import { canonicalURL } from '../src/lib/seo.ts';
import { hasIndexablePages } from '../src/lib/sitemap.ts';
import { resolveFormspreeEndpoint } from '../src/lib/formspree.ts';

const dist = join(process.cwd(), 'dist');
assert.ok((await stat(dist)).isDirectory(), 'Build dist/ first.');
const outputFiles: string[] = [];
async function collect(directory: string): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    assert.ok(
      !entry.isSymbolicLink(),
      'Static output must not contain symlinks.',
    );
    assertSafeBuildPath(relative(dist, path));
    if (entry.isDirectory()) await collect(path);
    else outputFiles.push(path);
  }
}
await collect(dist);
for (const file of outputFiles) {
  if (/\.(?:html|js|css|json|xml|txt|svg)$|[\\/]\.htaccess$/i.test(file)) {
    const text = await readFile(file, 'utf8');
    assertSafeBuildText(text, relative(dist, file));
    if (file.endsWith('.html')) assertPageCsp(text, relative(dist, file));
  }
}
const apacheConfig = await readFile(join(dist, '.htaccess'), 'utf8');
for (const header of [
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Content-Security-Policy',
  'Strict-Transport-Security',
])
  assert.ok(
    apacheConfig.includes(`Header always set ${header} `),
    `Missing Apache header: ${header}`,
  );
let linkCount = 0;
const pageTitles = new Set<string>();
const pageDescriptions = new Set<string>();
for (const route of routes) {
  const file = join(dist, route.path, 'index.html');
  const html = await readFile(file, 'utf8');
  assert.equal(
    html.match(/<h1(?:\s|>)/g)?.length,
    1,
    `${route.path}: expected one h1`,
  );
  assert.ok(
    html.includes(`rel="canonical" href="${canonicalURL(route.path)}"`),
    `${route.path}: canonical missing`,
  );
  assert.ok(
    html.includes(`content="${route.indexable ? 'index' : 'noindex'}, follow"`),
    `${route.path}: wrong indexing policy`,
  );
  assert.ok(
    !(
      /MarkeVance/.test(html) ||
      /vita?grow|gtag\(|googletagmanager|hubspot|hs-scripts\.com/i.test(html)
    ),
    `${route.path}: wrong brand, tracking or unconnected form`,
  );
  const forms = [...html.matchAll(/<form\b[^>]*>/g)];
  for (const [form] of forms) {
    assert.equal(
      route.path,
      '/book-consultation/',
      'Only consultation has an active form.',
    );
    assert.ok(
      resolveFormspreeEndpoint(form.match(/\baction="([^"]+)"/)?.[1]),
      'Unapproved form destination.',
    );
    assert.match(form, /method="POST"/i);
  }
  if (route.path !== '/book-consultation/')
    assert.ok(
      !/type="submit"/i.test(html),
      'Unexpected enabled submission control.',
    );
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  assert.ok(
    title && !pageTitles.has(title),
    `${route.path}: missing or duplicate title`,
  );
  assert.ok(
    description && !pageDescriptions.has(description),
    `${route.path}: missing or duplicate description`,
  );
  pageTitles.add(title);
  pageDescriptions.add(description);
  assert.ok(
    !/Internal Phase 2|Internal structural placeholder|Internal legal-page placeholder|14 qualified opportunities/.test(
      html,
    ),
    `${route.path}: internal or unsupported content entered the build`,
  );
  for (const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)"/g)) {
    const target = match[1];
    assert.ok(target);
    const localFile = target.endsWith('/')
      ? join(dist, target, 'index.html')
      : join(dist, target);
    await stat(localFile).catch(() => {
      throw new Error(`${route.path}: missing target ${target}`);
    });
    linkCount += 1;
  }
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    assert.ok(match[1]);
    JSON.parse(match[1]);
  }
}
const notFound = await readFile(join(dist, '404.html'), 'utf8');
assert.ok(notFound.includes('Page not found'));
assert.ok(
  !/hubspot|hs-scripts\.com/i.test(notFound),
  '404 page: third-party visitor tracking must remain inactive',
);
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
if (hasIndexablePages) {
  assert.ok(
    robots.includes('Sitemap: https://markevance.com/sitemap-index.xml'),
  );
  const sitemap = await readFile(join(dist, 'sitemap-0.xml'), 'utf8');
  const sitemapURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    sitemapURLs.slice().sort(),
    routes
      .filter((route) => route.indexable)
      .map((route) => canonicalURL(route.path))
      .sort(),
    'Sitemap must contain exactly the launch-ready canonical routes.',
  );
  assert.ok(
    (await readFile(join(dist, 'sitemap-index.xml'), 'utf8')).includes(
      'sitemap-0.xml',
    ),
  );
} else {
  assert.ok(
    !robots.includes('Sitemap:'),
    'Do not advertise a nonexistent sitemap.',
  );
  assert.ok(
    !outputFiles.some((file) => /sitemap.*\.xml$/.test(file)),
    'No preview URLs should enter a sitemap.',
  );
}
assert.ok(
  !outputFiles.some((file) =>
    /[\\/]insights[\\/]the-mechanics-of-b2b-lead-generation-in-nepal[\\/]|[\\/]case-studies[\\/]regional-software-provider-growth[\\/]/.test(
      file,
    ),
  ),
  'Owner-review drafts must not generate public detail routes.',
);
console.log(
  `Static build verified: ${routes.length} registered pages + 404, ${linkCount} internal links/assets, canonicals, noindex, JSON-LD, robots and sitemap.`,
);
console.log(
  `Files: ${outputFiles.length}; static bytes: ${(await Promise.all(outputFiles.map((file) => stat(file)))).reduce((total, file) => total + file.size, 0)}.`,
);
