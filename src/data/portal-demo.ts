import type { PortalSnapshot, PortalWorkspace } from '../lib/portal/model.ts';

export const sampleWorkspace: PortalWorkspace = {
  id: 'sample-workspace',
  name: 'Northstar Software',
  website: 'https://northstar.example',
};
export function sampleSnapshot(periodDays: number): PortalSnapshot {
  const daily = Array.from({ length: periodDays }, (_, index) => {
    const date = new Date('2026-11-08T00:00:00Z');
    date.setUTCDate(date.getUTCDate() - periodDays + index + 1);
    const visits = Math.round(
      300 +
        (index / periodDays) * 200 +
        Math.sin(index * 1.4) * 80 +
        (index % 7 === 0 ? 140 : 0),
    );
    return {
      date: date.toISOString().slice(0, 10),
      visits,
      previous: Math.round(visits * (0.68 + (index % 5) * 0.04)),
    };
  });
  const visits = daily.reduce((sum, item) => sum + item.visits, 0);
  const previous = daily.reduce((sum, item) => sum + item.previous, 0);
  const enquiries = Math.round(visits * 0.008);
  return {
    periodDays,
    periodStart: daily[0]!.date,
    periodEnd: daily.at(-1)!.date,
    updatedAt: '2026-11-08',
    daily,
    metrics: [
      {
        key: 'visits',
        label: 'Website visits',
        value: visits,
        previous,
        unit: 'number',
      },
      {
        key: 'search',
        label: 'Search clicks',
        value: Math.round(visits * 0.46),
        previous: Math.round(previous * 0.43),
        unit: 'number',
      },
      {
        key: 'enquiries',
        label: 'Website enquiries',
        value: enquiries,
        previous: Math.round(enquiries * 0.84),
        unit: 'number',
      },
      {
        key: 'conversion',
        label: 'Enquiry rate',
        value: Number(((enquiries / visits) * 100).toFixed(2)),
        previous: 0.67,
        unit: 'percent',
      },
    ],
    channels: [
      {
        name: 'Organic search',
        visits: Math.round(visits * 0.46),
        color: '#1d63ed',
      },
      { name: 'Direct', visits: Math.round(visits * 0.26), color: '#8aa8ee' },
      {
        name: 'Paid search',
        visits: Math.round(visits * 0.18),
        color: '#c5a880',
      },
      {
        name: 'Referral & social',
        visits:
          visits -
          Math.round(visits * 0.46) -
          Math.round(visits * 0.26) -
          Math.round(visits * 0.18),
        color: '#263246',
      },
    ],
    tasks: [
      {
        id: '1',
        title: 'Refresh the product landing page',
        category: 'Website & conversion',
        status: 'active',
        dueDate: '2026-11-12',
      },
      {
        id: '2',
        title: 'Publish the comparison guide',
        category: 'Search & content',
        status: 'active',
        dueDate: '2026-11-15',
      },
      {
        id: '3',
        title: 'Review enquiry quality with sales',
        category: 'Measurement',
        status: 'planned',
        dueDate: '2026-11-18',
      },
      {
        id: '4',
        title: 'Improve mobile navigation',
        category: 'Website & conversion',
        status: 'complete',
        dueDate: '2026-11-06',
      },
      {
        id: '5',
        title: 'Connect the consultation journey',
        category: 'Measurement',
        status: 'complete',
        dueDate: '2026-11-04',
      },
      {
        id: '6',
        title: 'Research priority search topics',
        category: 'Search & content',
        status: 'complete',
        dueDate: '2026-11-02',
      },
    ],
  };
}
