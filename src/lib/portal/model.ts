export type PortalSection =
  'overview' | 'performance' | 'work' | 'reports' | 'workspace';
export interface PortalMetric {
  key: string;
  label: string;
  value: number;
  previous: number;
  unit: 'number' | 'percent';
}
export interface PortalSnapshot {
  periodDays: number;
  periodStart: string;
  periodEnd: string;
  updatedAt: string;
  metrics: PortalMetric[];
  daily: { date: string; visits: number; previous: number }[];
  channels: { name: string; visits: number; color: string }[];
  tasks: {
    id: string;
    title: string;
    category: string;
    status: 'planned' | 'active' | 'complete';
    dueDate: string;
  }[];
}
export interface PortalWorkspace {
  id: string;
  name: string;
  website: string;
}

export function needsPortalPasswordSetup(
  hash: string,
  search: string,
  savedIntent: string | null,
): boolean {
  const type = new URLSearchParams(hash.replace(/^#/, '')).get('type');
  return (
    type === 'invite' ||
    type === 'recovery' ||
    new URLSearchParams(search).get('action') === 'set-password' ||
    savedIntent === 'pending'
  );
}

export function resolvePortalConfig(url: unknown, key: unknown) {
  if (!url && !key) return null;
  if (typeof url !== 'string' || typeof key !== 'string')
    throw new Error('Both public portal settings are required.');
  const parsed = new URL(url);
  if (
    parsed.protocol !== 'https:' ||
    !/^[a-z0-9-]+\.supabase\.co$/.test(parsed.hostname) ||
    parsed.port ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== '/'
  ) {
    throw new Error('Use the HTTPS project URL from your Supabase dashboard.');
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]{16,}$/.test(key))
    throw new Error(
      'Only a Supabase publishable key may be used by the portal.',
    );
  return { url: parsed.origin, key };
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid workspace data.');
  return value as Record<string, unknown>;
}
function text(value: unknown, limit = 200): string {
  if (typeof value !== 'string' || !value.trim() || value.length > limit)
    throw new Error('Invalid workspace text.');
  return value;
}
function number(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1e12
  )
    throw new Error('Invalid workspace measure.');
  return value;
}
function date(value: unknown): string {
  const result = text(value, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(result) ||
    new Date(result).toISOString().slice(0, 10) !== result
  )
    throw new Error('Invalid workspace date.');
  return result;
}
function rows(value: unknown, maximum: number): Record<string, unknown>[] {
  if (!Array.isArray(value) || value.length > maximum)
    throw new Error('Invalid workspace collection.');
  return value.map(record);
}
export function parseWorkspace(value: unknown): PortalWorkspace {
  const input = record(value);
  const website = new URL(text(input.website, 200));
  if (website.protocol !== 'https:' || website.username || website.password)
    throw new Error('Invalid website address.');
  return {
    id: text(input.id, 80),
    name: text(input.name, 120),
    website: website.origin,
  };
}
export function parseSnapshot(value: unknown): PortalSnapshot {
  const input = record(value);
  const periodDays = number(input.periodDays);
  if (![7, 28, 90].includes(periodDays))
    throw new Error('Unsupported reporting period.');
  const daily = rows(input.daily, 90).map((item) => ({
    date: date(item.date),
    visits: number(item.visits),
    previous: number(item.previous),
  }));
  if (
    daily.length !== periodDays ||
    daily.some(
      (item, index) => index > 0 && item.date <= daily[index - 1]!.date,
    )
  )
    throw new Error('Incomplete reporting period.');
  const periodStart = date(input.periodStart);
  const periodEnd = date(input.periodEnd);
  if (
    (Date.parse(periodEnd) - Date.parse(periodStart)) / 86_400_000 + 1 !==
    periodDays
  )
    throw new Error('Reporting period contains missing dates.');
  if (daily[0]?.date !== periodStart || daily.at(-1)?.date !== periodEnd)
    throw new Error('Reporting dates do not match.');
  return {
    periodDays,
    periodStart,
    periodEnd,
    updatedAt: date(input.updatedAt),
    daily,
    metrics: rows(input.metrics, 8).map((item) => {
      if (item.unit !== 'number' && item.unit !== 'percent')
        throw new Error('Invalid measure unit.');
      return {
        key: text(item.key, 40),
        label: text(item.label, 60),
        value: number(item.value),
        previous: number(item.previous),
        unit: item.unit,
      };
    }),
    channels: rows(input.channels, 8).map((item) => {
      const color = text(item.color, 7);
      if (!/^#[a-fA-F0-9]{6}$/.test(color))
        throw new Error('Invalid chart color.');
      return { name: text(item.name, 60), visits: number(item.visits), color };
    }),
    tasks: rows(input.tasks, 100).map((item) => {
      if (!['planned', 'active', 'complete'].includes(String(item.status)))
        throw new Error('Invalid work status.');
      return {
        id: text(item.id, 80),
        title: text(item.title, 160),
        category: text(item.category, 60),
        status: item.status as 'planned' | 'active' | 'complete',
        dueDate: date(item.dueDate),
      };
    }),
  };
}
export function percentageChange(
  current: number,
  previous: number,
): number | null {
  return previous === 0 ? null : ((current - previous) / previous) * 100;
}
export function csvCell(value: string | number): string {
  const text = String(value);
  const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
