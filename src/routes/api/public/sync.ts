/**
 * Endpoint protegido de sincronización semanal.
 * Requiere el secreto compartido CRON_SECRET (header `x-cron-secret`
 * o `Authorization: Bearer <secreto>`).
 * Programar con GitHub Actions / Vercel Cron:
 *   0 6 * * 1  ->  POST /api/public/sync  (con el header del secreto)
 */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { GITHUB_USERNAME } from "@/lib/constants";

/** Intervalo mínimo entre sincronizaciones forzadas. */
const MIN_SYNC_INTERVAL_MS = 10 * 60 * 1000;
let lastForcedSyncAt = 0;

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/public/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = (body: unknown, status = 200) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });

        const expected = process.env.CRON_SECRET;
        if (!expected) return json({ ok: false, error: "unavailable" }, 503);

        const header = request.headers.get("x-cron-secret");
        const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const provided = header ?? bearer ?? "";
        if (!safeEqual(provided, expected)) {
          return json({ ok: false, error: "unauthorized" }, 401);
        }

        const now = Date.now();
        if (now - lastForcedSyncAt < MIN_SYNC_INTERVAL_MS) {
          return json({ ok: false, error: "too_soon" }, 429);
        }
        lastForcedSyncAt = now;

        const { fetchPortfolio, invalidatePortfolioCache } =
          await import("@/infrastructure/github/github-api.server");
        invalidatePortfolioCache();
        const snapshot = await fetchPortfolio(GITHUB_USERNAME);

        return json({
          ok: true,
          syncedAt: snapshot.stats.lastSyncedAt,
          repositories: snapshot.stats.totalRepos,
          releases: snapshot.stats.totalReleases,
        });
      },
    },
  },
});
