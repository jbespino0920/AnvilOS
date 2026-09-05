/*
App Name: CWL Hardware
App Client: CWL Hardware
Author: James Bryant D. Espino
URL: https://github.com/Jamespino20
Last Update Date: September 5, 2026
*/

// Helpers for recovering from stale-deployment server action mismatches.
// Server action IDs are content-hashed per build. After Hostinger deploys a
// new version, tabs holding the old build call action IDs the new server no
// longer knows ("was not found on the server"). The fix is a fresh reload.

export function isStaleActionError(err: unknown): boolean {
  const msg =
    err instanceof Error ? err.message : String((err as any)?.message ?? err ?? "");
  return (
    msg.includes("was not found on the server") ||
    msg.includes("Failed to find Server Action") ||
    msg.includes("failed-to-find-server-action")
  );
}

const RELOAD_KEY = "anvilos-reloaded-at";
const RELOAD_THROTTLE_MS = 60000;

export function reloadForNewDeployment(): void {
  if (typeof window === "undefined") return;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_THROTTLE_MS) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return;
  }
  window.location.reload();
}
