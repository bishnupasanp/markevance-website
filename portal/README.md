# Client portal setup

The first version includes sign-in, password recovery, workspace membership,
performance charts, delivery progress, period selection, and CSV exports. The
sample workspace contains synthetic data for `northstar.example` and is visibly
labelled throughout. Customer data loads only after Supabase verifies the user
and database row-level policies authorize their assigned client.

## Local preview

Run the existing Astro development server with `npm run dev`. Open
`/client-portal/` for sign-in or `/client-portal/dashboard/?demo=1` for the sample.
Sign-in is disabled until both public Supabase settings are configured. A normal
dashboard request shows an account/setup message and never falls back to sample
data. Public markup contains the interface shell and synthetic sample fixture.

## Enable customer accounts

1. Create or select a Supabase project and apply `portal/schema.sql` in its SQL
   editor. Disable public signup in Auth settings. Set the password policy to at
   least 12 characters and enable available password and rate-limit protections.
2. Set the production Site URL to `https://markevance.com/client-portal/` and allow the exact
   redirect `https://markevance.com/client-portal/`. Add the corresponding local
   URL while testing. Review the project's authentication email delivery before
   inviting customers. Hosting email and DNS settings are separate configuration.
3. Copy the project's HTTPS URL and **publishable** key into local `.env` using
   the variables in `.env.example`. The build deliberately rejects secret keys
   and legacy JWT-shaped keys. Rebuild after configuring the public values.
4. Invite a customer through Supabase Auth. Create their row in `portal_clients`
   and link the Auth user UUID to that client's UUID in `portal_memberships`.
   The initial version displays the first membership returned for an account.
5. Publish a validated `PortalSnapshot` JSON object to `portal_snapshots`, keyed
   by that client and a 7-, 28-, or 90-day period. The TypeScript shape and runtime
   validation live in `src/lib/portal/model.ts`. `src/data/portal-demo.ts` shows
   the expected structure. Sample values are never imported into real accounts.

GA4, Search Console, CRM, uptime, and CMS connectors require their own authorized
data pipelines. This version reads owner-published reporting snapshots. It does
not automatically collect analytics or change customer websites. Integration
statuses currently identify these sources as awaiting connection.

## Verification before customer launch

- Run Astro, existing tests, portal regression tests, formatting, and build checks.
- Verify signup is disabled and an unassigned user gets an empty access state.
- With two real test users assigned to different clients, request each other's
  client and snapshot IDs directly through Supabase. Both requests must return no
  rows. Anonymous reads and authenticated inserts/updates/deletes must be denied.
- Test invite and recovery links, invalid credentials, session expiry, sign-out,
  browser back navigation, and storage isolation in a real configured project.
- Connect approved data sources and confirm dates, attribution, and totals with
  source reports. Review privacy information before inviting real clients.

Sessions use tab-scoped sessionStorage through the supported Supabase client.
Client rows render as text and numeric chart primitives. Only the portal pages
allow connections to the configured project. Marketing pages keep their existing
connection and form policies. Private service keys never belong in this codebase.

Account invitations, password recovery and reporting should be exercised with
the intended client accounts before customer use.

The connected production project is `markevance` (`wnmsdnlxqdvkbaahnmms`) in
Singapore. Its portal tables and policies are applied. Anonymous access and
client writes are denied, and a rolled-back two-account database check verified
workspace isolation and the empty state for unassigned accounts. Production and
local portal redirects are configured. Account invitations and published client
reports are managed separately from the website build.
