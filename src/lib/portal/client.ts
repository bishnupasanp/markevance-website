import { createClient } from '@supabase/supabase-js';
import { parseSnapshot, parseWorkspace, resolvePortalConfig } from './model.ts';

const config = resolvePortalConfig(
  import.meta.env.PUBLIC_PORTAL_SUPABASE_URL,
  import.meta.env.PUBLIC_PORTAL_SUPABASE_PUBLISHABLE_KEY,
);
export const portalSessionKey = 'markevance-portal-session';
export const portalClient = config
  ? createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.sessionStorage,
        storageKey: portalSessionKey,
      },
    })
  : null;

// Persist only within this tab. The SDK handles token expiry and refresh.
// Customer authorization is enforced by database RLS on every request.
export async function loadClientWorkspace(periodDays: number) {
  if (!portalClient)
    throw new Error('The client portal is awaiting account setup.');
  const { data: identity, error: identityError } =
    await portalClient.auth.getUser();
  if (identityError || !identity.user)
    throw new Error('Please sign in to view your workspace.');
  const { data: membership, error: membershipError } = await portalClient
    .from('portal_memberships')
    .select('client_id')
    .eq('user_id', identity.user.id)
    .limit(1)
    .maybeSingle();
  if (membershipError)
    throw new Error('We could not load your workspace. Please try again.');
  if (!membership)
    throw new Error(
      'Your account is awaiting workspace assignment. Please contact Markevance.',
    );
  const { data: workspace, error: workspaceError } = await portalClient
    .from('portal_clients')
    .select('id,name,website')
    .eq('id', membership.client_id)
    .single();
  if (workspaceError) throw new Error('Your workspace could not be loaded.');
  const { data: snapshot, error: snapshotError } = await portalClient
    .from('portal_snapshots')
    .select('snapshot')
    .eq('client_id', membership.client_id)
    .eq('period_days', periodDays)
    .maybeSingle();
  if (snapshotError)
    throw new Error('Your reporting data could not be loaded.');
  if (!snapshot)
    throw new Error('This reporting period is awaiting its first update.');
  const reporting = parseSnapshot(snapshot.snapshot);
  if (reporting.periodDays !== periodDays)
    throw new Error('The reporting dates need review by your Markevance team.');
  return {
    workspace: parseWorkspace(workspace),
    snapshot: reporting,
  };
}
