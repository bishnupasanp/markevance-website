import assert from 'node:assert/strict';

export function assertSafeBuildPath(value: string): void {
  const path = value.replaceAll('\\', '/');
  const parts = path.split('/');
  assert.ok(
    !parts.some(
      (part, index) =>
        part.startsWith('.') &&
        !(parts.length === 1 && part === '.htaccess') &&
        !(index === 0 && part === '.well-known'),
    ) &&
      !parts.some((part) =>
        /^(?:src|server|node_modules|docs|sources|tests|scripts|output|tmp|coverage)$/i.test(
          part,
        ),
      ) &&
      !/\.(?:php\d*|phtml|phar|ts|tsx|astro|md|mdx|map|pem|key|p12|pfx|sql|sqlite3?|db|bak|backup|old|orig|log|ini|ya?ml|zip|tar|gz|7z)$/i.test(
        path,
      ) &&
      !/(?:^|\/)(?:package(?:-lock)?\.json|tsconfig\.json|.*(?:credentials|service-account).*\.json)$/i.test(
        path,
      ),
    `Private, executable or source artifact in static output: ${path}`,
  );
}

export function assertSafeBuildText(value: string, path: string): void {
  // High-confidence indicators only. Never echo a matched credential into logs.
  assert.ok(
    !/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-proj-[A-Za-z0-9_-]{30,}|AIza[0-9A-Za-z_-]{35}/.test(
      value,
    ) &&
      !/(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?)\:\/\/[^\s/]+:[^\s/]+@/i.test(
        value,
      ) &&
      !/iam\.gserviceaccount\.com|"private_key"\s*:/.test(value),
    `Potential credential or private integration identifier in static output: ${path}`,
  );
}

export function assertPageCsp(html: string, path: string): void {
  const meta = html.match(
    /<meta\b[^>]*http-equiv="content-security-policy"[^>]*>/i,
  )?.[0];
  assert.ok(meta, `${path}: missing CSP`);
  const policy = meta
    .match(/\bcontent="([^"]+)"/i)?.[1]
    ?.replace(/&#(?:39|x27);/gi, "'");
  assert.ok(policy, `${path}: empty CSP`);
  for (const directive of [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "connect-src 'none'",
    'form-action https://formspree.io',
    "frame-src 'none'",
    "script-src-attr 'none'",
  ])
    assert.ok(
      policy.split(';').some((part) => part.trim() === directive),
      `${path}: missing ${directive}`,
    );
  const scripts = policy.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1];
  assert.ok(scripts, `${path}: missing script policy`);
  assert.ok(scripts.includes("'self'"), `${path}: missing local script source`);
  assert.ok(
    !/unsafe-inline|unsafe-eval|https?:|\*/.test(scripts),
    `${path}: unsafe script policy`,
  );
  // Astro inserts its policy before bundled resources. Earlier metadata and
  // inert JSON-LD are allowed, but executable scripts/styles/preloads are not.
  const beforePolicy = html
    .slice(0, html.indexOf(meta))
    .replace(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
      '',
    );
  assert.ok(
    !/<(?:script|style)\b|<link\b[^>]*rel="(?:stylesheet|preload|modulepreload)"/i.test(
      beforePolicy,
    ),
    `${path}: CSP must precede executable resources`,
  );
  assert.ok(!/\son[a-z]+\s*=/i.test(html), `${path}: inline event handler`);
  assert.ok(
    !/(?:href|src|action)\s*=\s*["']\s*(?:javascript|vbscript):/i.test(html),
    `${path}: executable URL`,
  );
}
