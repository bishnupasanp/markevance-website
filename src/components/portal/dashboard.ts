import { sampleSnapshot, sampleWorkspace } from '../../data/portal-demo.ts';
import {
  loadClientWorkspace,
  portalClient,
  portalSessionKey,
} from '../../lib/portal/client.ts';
import {
  csvCell,
  percentageChange,
  type PortalSection,
  type PortalSnapshot,
  type PortalWorkspace,
} from '../../lib/portal/model.ts';

const demo = new URLSearchParams(location.search).get('demo') === '1';
const main = document.querySelector<HTMLElement>('#portal-main')!;
const content = document.querySelector<HTMLElement>('[data-portal-content]')!;
const status = document.querySelector<HTMLElement>('[data-portal-status]')!;
const period = document.querySelector<HTMLSelectElement>('#portal-period')!;
const taskFilter =
  document.querySelector<HTMLSelectElement>('[data-task-filter]')!;
const daySlider = document.querySelector<HTMLInputElement>('#chart-day')!;
const sectionCopy: Record<PortalSection, [string, string, string]> = {
  overview: [
    'Overview',
    'Your website, in focus.',
    'A shared view of performance, progress and what comes next.',
  ],
  performance: [
    'Website performance',
    'Understand the momentum.',
    'Explore your visits, acquisition channels and enquiries.',
  ],
  work: [
    'Work & progress',
    'See the work behind the growth.',
    'Follow the priorities, the progress and the next handoff.',
  ],
  reports: [
    'Reports',
    'A clearer conversation about results.',
    'Take your reporting period into the next business review.',
  ],
  workspace: [
    'Workspace',
    'Everything in its right place.',
    'Your business, reporting sources and account access.',
  ],
};
let workspace: PortalWorkspace | null = null;
let snapshot: PortalSnapshot | null = null;
let loadVersion = 0;

function write(selector: string, value: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.textContent = value;
  });
}
function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] {
  const result = document.createElement(tag);
  result.className = className;
  result.textContent = text;
  return result;
}
function svgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Record<string, string>,
): SVGElementTagNameMap[K] {
  const result = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [name, value] of Object.entries(attributes))
    result.setAttribute(name, value);
  return result;
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
function formatNumber(value: number) {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(
    value,
  );
}
function changeLabel(value: number | null) {
  return value === null
    ? 'No previous baseline'
    : `${value >= 0 ? '+' : ''}${value.toFixed(1)}% vs previous period`;
}

function setSection(section: PortalSection) {
  const [label, title, intro] = sectionCopy[section];
  write('[data-section-breadcrumb]', label);
  write('[data-section-title]', title);
  write('[data-section-intro]', intro);
  document
    .querySelectorAll<HTMLButtonElement>('[data-section]')
    .forEach((button) => {
      if (button.dataset.section === section)
        button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  document.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
    panel.hidden = !panel.dataset.panel?.split(' ').includes(section);
  });
  history.replaceState(
    null,
    '',
    `${location.pathname}${location.search}#${section}`,
  );
}
for (const button of document.querySelectorAll<HTMLButtonElement>(
  '[data-section]',
)) {
  button.addEventListener('click', () =>
    setSection(button.dataset.section as PortalSection),
  );
}
document
  .querySelector('[data-go-work]')
  ?.addEventListener('click', () => setSection('work'));
const initialSection = location.hash.slice(1);
setSection(
  Object.hasOwn(sectionCopy, initialSection)
    ? (initialSection as PortalSection)
    : 'overview',
);

function renderMetrics(data: PortalSnapshot) {
  const container = document.querySelector('[data-metrics]')!;
  const report = document.querySelector('[data-report-metrics]')!;
  container.replaceChildren();
  report.replaceChildren();
  for (const metric of data.metrics) {
    const card = element('article', 'portal-metric');
    const value = `${formatNumber(metric.value)}${metric.unit === 'percent' ? '%' : ''}`;
    const change =
      metric.unit === 'percent'
        ? `${metric.value - metric.previous >= 0 ? '+' : ''}${(metric.value - metric.previous).toFixed(2)} percentage points`
        : changeLabel(percentageChange(metric.value, metric.previous));
    card.append(
      element('h2', '', metric.label),
      element('strong', 'portal-metric-value', value),
      element('span', 'portal-metric-change', change),
    );
    container.append(card);
    const reportRow = element('p');
    reportRow.append(
      element('span', '', metric.label),
      element('strong', '', value),
    );
    report.append(reportRow);
  }
}
function renderChart(data: PortalSnapshot) {
  const width = 620;
  const height = 220;
  const maximum = Math.max(
    1,
    ...data.daily.flatMap((day) => [day.visits, day.previous]),
  );
  const x = (index: number) =>
    42 + index * ((width - 56) / (data.daily.length - 1));
  const y = (value: number) => 16 + (1 - value / maximum) * (height - 50);
  const graph = svgElement('svg', {
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `Daily website visits from ${data.periodStart} to ${data.periodEnd}, compared with the previous period. Use the day control below for exact values.`,
  });
  for (let index = 0; index < 4; index++) {
    const value = (maximum * index) / 3;
    graph.append(
      svgElement('line', {
        x1: '42',
        x2: String(width - 14),
        y1: String(y(value)),
        y2: String(y(value)),
        class: 'chart-gridline',
      }),
    );
    const label = svgElement('text', {
      x: '31',
      y: String(y(value) + 4),
      'text-anchor': 'end',
      class: 'chart-axis',
    });
    label.textContent = formatNumber(Math.round(value));
    graph.append(label);
  }
  const current = data.daily
    .map((day, index) => `${x(index)},${y(day.visits)}`)
    .join(' ');
  const previous = data.daily
    .map((day, index) => `${x(index)},${y(day.previous)}`)
    .join(' ');
  graph.append(
    svgElement('polygon', {
      points: `42,${height - 34} ${current} ${width - 14},${height - 34}`,
      class: 'chart-area',
    }),
  );
  graph.append(
    svgElement('polyline', { points: previous, class: 'chart-line-previous' }),
  );
  graph.append(
    svgElement('polyline', { points: current, class: 'chart-line-current' }),
  );
  for (const index of [
    0,
    Math.floor(data.daily.length / 2),
    data.daily.length - 1,
  ]) {
    const label = svgElement('text', {
      x: String(x(index)),
      y: String(height - 7),
      'text-anchor':
        index === 0
          ? 'start'
          : index === data.daily.length - 1
            ? 'end'
            : 'middle',
      class: 'chart-axis',
    });
    label.textContent = formatDate(data.daily[index]!.date);
    graph.append(label);
  }
  document.querySelector('[data-chart]')!.replaceChildren(graph);
  const total = data.daily.reduce((sum, day) => sum + day.visits, 0);
  const previousTotal = data.daily.reduce((sum, day) => sum + day.previous, 0);
  write('[data-visit-total]', formatNumber(total));
  write(
    '[data-visit-change]',
    changeLabel(percentageChange(total, previousTotal)),
  );
  daySlider.max = String(data.daily.length - 1);
  daySlider.value = daySlider.max;
  updateDay();
}
function updateDay() {
  const day = snapshot?.daily[Number(daySlider.value)];
  if (day)
    write(
      '[data-day-value]',
      `${formatDate(day.date)} · ${formatNumber(day.visits)} visits · ${formatNumber(day.previous)} previously`,
    );
}
daySlider.addEventListener('input', updateDay);

function renderChannels(data: PortalSnapshot) {
  const total = data.channels.reduce((sum, channel) => sum + channel.visits, 0);
  const graph = svgElement('svg', {
    viewBox: '0 0 180 180',
    role: 'img',
    'aria-label':
      'Share of website visits by acquisition channel. Exact figures are listed below.',
  });
  graph.append(
    svgElement('circle', { cx: '90', cy: '90', r: '65', class: 'donut-base' }),
  );
  let offset = 0;
  const list = document.querySelector('[data-channels]')!;
  list.replaceChildren();
  for (const channel of data.channels) {
    const percentage = total === 0 ? 0 : (channel.visits / total) * 100;
    const ring = svgElement('circle', {
      cx: '90',
      cy: '90',
      r: '65',
      pathLength: '100',
      stroke: channel.color,
      'stroke-dasharray': `${percentage} ${100 - percentage}`,
      'stroke-dashoffset': String(-offset),
      class: 'donut-segment',
    });
    graph.append(ring);
    offset += percentage;
    const row = element('div', 'portal-channel-row');
    const dot = element('i');
    dot.style.backgroundColor = channel.color;
    const name = element('span');
    name.append(dot, document.createTextNode(channel.name));
    row.append(name, element('strong', '', `${percentage.toFixed(0)}%`));
    list.append(row);
  }
  const center = svgElement('text', {
    x: '90',
    y: '90',
    'text-anchor': 'middle',
    class: 'donut-number',
  });
  center.textContent = formatNumber(total);
  const label = svgElement('text', {
    x: '90',
    y: '111',
    'text-anchor': 'middle',
    class: 'donut-label',
  });
  label.textContent = 'total visits';
  graph.append(center, label);
  document.querySelector('[data-donut]')!.replaceChildren(graph);
}
function renderTasks() {
  if (!snapshot) return;
  const list = document.querySelector('[data-tasks]')!;
  const summary = document.querySelector('[data-work-summary]')!;
  summary.replaceChildren();
  const labels = {
    active: 'In progress',
    complete: 'Completed',
    planned: 'Up next',
  };
  for (const status of ['active', 'complete', 'planned'] as const) {
    const count = snapshot.tasks.filter(
      (task) => task.status === status,
    ).length;
    const item = element('span', `work-summary-${status}`);
    item.append(
      element('strong', '', String(count)),
      document.createTextNode(` ${labels[status]}`),
    );
    summary.append(item);
  }
  list.replaceChildren();
  const tasks = snapshot.tasks.filter(
    (task) => taskFilter.value === 'all' || task.status === taskFilter.value,
  );
  for (const task of tasks) {
    const row = element('article', 'portal-task-row');
    const marker = element(
      'span',
      `task-marker task-marker-${task.status}`,
      task.status === 'complete' ? '✓' : task.status === 'active' ? '◔' : '○',
    );
    marker.setAttribute('aria-hidden', 'true');
    const copy = element('div', 'task-copy');
    copy.append(
      element('h3', '', task.title),
      element('span', '', task.category),
    );
    row.append(
      marker,
      copy,
      element(
        'span',
        `portal-task-status task-status-${task.status}`,
        labels[task.status],
      ),
      element('time', 'task-date', formatDate(task.dueDate)),
    );
    row.querySelector('time')!.dateTime = task.dueDate;
    list.append(row);
  }
  if (tasks.length === 0)
    list.append(
      element('p', 'portal-muted', 'No work items match this filter.'),
    );
}
taskFilter.addEventListener('change', renderTasks);

function renderWorkspace() {
  if (!workspace || !snapshot) return;
  const { name, website } = workspace;
  write(
    '[data-company-name], [data-detail-company], [data-report-company]',
    name,
  );
  write('[data-company-domain]', new URL(website).hostname);
  write('[data-detail-website]', website);
  write(
    '[data-company-initial], [data-avatar]',
    name.slice(0, 1).toUpperCase(),
  );
  const dates = `${formatDate(snapshot.periodStart)} – ${formatDate(snapshot.periodEnd)}, ${snapshot.periodEnd.slice(0, 4)}`;
  write('[data-date-label], [data-report-period]', dates);
  write(
    '[data-detail-updated]',
    `${formatDate(snapshot.updatedAt)}, ${snapshot.updatedAt.slice(0, 4)}`,
  );
  write(
    '[data-updated-label]',
    `${demo ? 'Illustrative snapshot' : 'Reporting updated'} · ${formatDate(snapshot.updatedAt)}, ${snapshot.updatedAt.slice(0, 4)}`,
  );
  write(
    '[data-account-type], [data-detail-access]',
    demo ? 'Sample workspace' : 'Client account',
  );
  write(
    '[data-delivery-source]',
    demo ? 'Sample activity' : 'Published updates',
  );
  write(
    '[data-active-count]',
    String(snapshot.tasks.filter((task) => task.status === 'active').length),
  );
  const nextTask =
    snapshot.tasks.find((task) => task.status === 'active') ??
    snapshot.tasks.find((task) => task.status === 'planned');
  write(
    '[data-next-title]',
    nextTask?.title ?? 'A clear view of your next priorities.',
  );
  write(
    '[data-next-copy]',
    nextTask
      ? `${nextTask.category} · Review the work plan for the latest published status and next steps.`
      : 'Your team’s next work items will appear when they are published.',
  );
  const table = document.querySelector('[data-daily-rows]')!;
  table.replaceChildren();
  for (const day of snapshot.daily.slice().reverse()) {
    const row = element('tr');
    const change = percentageChange(day.visits, day.previous);
    for (const cell of [
      formatDate(day.date),
      formatNumber(day.visits),
      formatNumber(day.previous),
      change === null
        ? 'No baseline'
        : `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    ])
      row.append(element('td', '', cell));
    table.append(row);
  }
}
async function load() {
  const version = ++loadVersion;
  main.setAttribute('aria-busy', 'true');
  content.hidden = true;
  status.hidden = false;
  status.textContent = 'Loading your workspace…';
  period.disabled = true;
  try {
    const result = demo
      ? {
          workspace: sampleWorkspace,
          snapshot: sampleSnapshot(Number(period.value)),
        }
      : await loadClientWorkspace(Number(period.value));
    if (version !== loadVersion) return;
    workspace = result.workspace;
    snapshot = result.snapshot;
    renderMetrics(snapshot);
    renderChart(snapshot);
    renderChannels(snapshot);
    renderTasks();
    renderWorkspace();
    content.hidden = false;
    status.hidden = true;
    period.disabled = false;
  } catch (error) {
    if (version !== loadVersion) return;
    workspace = null;
    snapshot = null;
    status.textContent =
      error instanceof Error
        ? error.message
        : 'Your workspace is temporarily unavailable.';
    status.append(document.createTextNode(' '));
    const link = element('a', '', 'Return to sign in');
    link.href = '/client-portal/';
    status.append(link);
    // The period selector remains usable for an account with a missing period.
    period.disabled = !portalClient;
  } finally {
    if (version === loadVersion) main.setAttribute('aria-busy', 'false');
  }
}
period.addEventListener('change', load);
document.querySelector<HTMLElement>('[data-sample-banner]')!.hidden = !demo;
write('[data-signout] span', demo ? 'Exit sample workspace' : 'Sign out');
document
  .querySelector('[data-signout]')
  ?.addEventListener('click', async () => {
    ++loadVersion;
    content.hidden = true;
    snapshot = null;
    workspace = null;
    try {
      if (!demo && portalClient)
        await portalClient.auth.signOut({ scope: 'local' });
    } finally {
      if (!demo) {
        for (const key of [
          portalSessionKey,
          `${portalSessionKey}-user`,
          `${portalSessionKey}-code-verifier`,
        ])
          sessionStorage.removeItem(key);
      }
      location.replace('/client-portal/');
    }
  });
portalClient?.auth.onAuthStateChange((event) => {
  if (!demo && event === 'SIGNED_OUT') {
    ++loadVersion;
    content.hidden = true;
    snapshot = null;
    workspace = null;
    location.replace('/client-portal/');
  }
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted && !demo) location.reload();
});
for (const button of document.querySelectorAll<HTMLButtonElement>(
  '[data-export]',
)) {
  button.addEventListener('click', () => {
    if (!workspace || !snapshot) return;
    const rows = [
      ['Markevance website report', demo ? 'SAMPLE DATA' : 'Client reporting'],
      ['Business', workspace.name],
      ['Website', workspace.website],
      ['Reporting period', `${snapshot.periodStart} to ${snapshot.periodEnd}`],
      ['Date', 'Visits', 'Previous period visits'],
      ...snapshot.daily.map((day) => [day.date, day.visits, day.previous]),
    ];
    const blob = new Blob(
      [rows.map((row) => row.map(csvCell).join(',')).join('\r\n')],
      { type: 'text/csv;charset=utf-8' },
    );
    const url = URL.createObjectURL(blob);
    const link = element('a');
    link.href = url;
    link.download = `markevance-${demo ? 'sample-' : ''}website-report-${snapshot.periodEnd}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
void load();
