/**
 * Cache del snapshot del portafolio.
 *
 * En Cloudflare Workers cada aislado tiene memoria propia, así que un simple
 * cache en memoria se rellena de nuevo en cada arranque en frío. Este módulo
 * combina la Cache API de Cloudflare (compartida por datacenter) con un
 * fallback en memoria para entornos sin ella (dev, Node, etc.).
 */
import type { PortfolioSnapshot } from "@/domain/github/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_URL = "https://portfolio.internal/snapshot";

let memory: { at: number; value: PortfolioSnapshot } | null = null;

type CacheLike = {
  match: (request: Request | string) => Promise<Response | undefined>;
  put: (request: Request | string, response: Response) => Promise<void>;
  delete?: (request: Request | string) => Promise<boolean>;
};

function defaultCache(): CacheLike | null {
  return (globalThis as { caches?: { default?: CacheLike } }).caches?.default ?? null;
}

async function readFromCacheApi(): Promise<PortfolioSnapshot | null> {
  const cache = defaultCache();
  if (!cache) return null;
  try {
    const response = await cache.match(CACHE_URL);
    if (!response) return null;
    const syncedAt = Number(response.headers.get("x-snapshot-at") ?? 0);
    if (!syncedAt || Date.now() - syncedAt > WEEK_MS) return null;
    return (await response.json()) as PortfolioSnapshot;
  } catch {
    return null;
  }
}

/** Snapshot fresco (dentro de la ventana de sincronización) o null. */
export async function readSnapshot(): Promise<PortfolioSnapshot | null> {
  if (memory && Date.now() - memory.at < WEEK_MS) return memory.value;
  const fromCache = await readFromCacheApi();
  if (fromCache) memory = { at: Date.now(), value: fromCache };
  return fromCache;
}

/** Snapshot fresco o, si GitHub falla, el último conocido aunque esté vencido. */
export async function readSnapshotOrStale(): Promise<PortfolioSnapshot | null> {
  return (await readSnapshot()) ?? memory?.value ?? null;
}

export async function writeSnapshot(value: PortfolioSnapshot): Promise<void> {
  memory = { at: Date.now(), value };
  const cache = defaultCache();
  if (!cache) return;
  try {
    await cache.put(
      CACHE_URL,
      new Response(JSON.stringify(value), {
        headers: {
          "content-type": "application/json",
          "cache-control": `public, max-age=${Math.floor(WEEK_MS / 1000)}`,
          "x-snapshot-at": String(Date.now()),
        },
      }),
    );
  } catch {
    // La caché externa no está disponible: la memoria ya guardó el valor.
  }
}

/** Fuerza a que la siguiente lectura re-consulte la API de GitHub. */
export function invalidateSnapshot(): void {
  memory = null;
  const cache = defaultCache();
  if (cache?.delete) void cache.delete(CACHE_URL).catch(() => {});
}
