/**
 * Infrastructure layer — the only module that knows the GitHub REST API exists.
 * Server-only (filename guard keeps it out of client bundles).
 */
import type {
  ActivityItem,
  LanguageSlice,
  PortfolioSnapshot,
  Profile,
  ReleaseInfo,
  Repository,
  SocialLink,
} from "@/domain/github/types";
import { languageColor } from "@/domain/github/language-colors";
import { detectTechnologies } from "@/domain/github/technology-detection";
import type {
  GitHubEvent,
  GitHubLanguages,
  GitHubRelease,
  GitHubRepo,
  GitHubSocialAccount,
  GitHubUser,
} from "./github-api-types";
import {
  readSnapshot,
  readSnapshotOrStale,
  writeSnapshot,
  invalidateSnapshot,
} from "./snapshot-cache";

const API = "https://api.github.com";
const CONCURRENCY = 3;

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_API_KEY;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get<T>(path: string, attempts = 3): Promise<T | null> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await fetch(`${API}${path}`, { headers: headers() });
      if (res.ok) return (await res.json()) as T;
      // 403/429 = rate limit, 5xx = transient: retry with backoff.
      if (res.status !== 403 && res.status !== 429 && res.status < 500) return null;
    } catch {
      // network hiccup: retry
    }
    if (attempt < attempts - 1) await sleep(500 * 2 ** attempt);
  }
  return null;
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (index < items.length) {
        const current = index++;
        out[current] = await fn(items[current]);
      }
    }),
  );
  return out;
}

const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

/** Keeps only http(s) URLs; anything else (javascript:, data:, …) is dropped. */
function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withScheme);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function socialsFrom(user: GitHubUser, extra: GitHubSocialAccount[]): SocialLink[] {
  const links: SocialLink[] = [{ kind: "github", label: "GitHub", url: user.html_url }];
  const push = (url: string) => {
    const u = safeExternalUrl(url);
    if (!u) return;
    const host = u.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
    const map: Array<[RegExp, SocialLink["kind"], string]> = [
      [/linkedin\./, "linkedin", "LinkedIn"],
      [/(twitter|x)\.com/, "x", "X (Twitter)"],
      [/instagram\./, "instagram", "Instagram"],
      [/facebook\./, "facebook", "Facebook"],
      [/youtube\.|youtu\.be/, "youtube", "YouTube"],
      [/(medium|dev\.to|hashnode|blog)/, "blog", "Blog"],
    ];
    const hit = map.find(([re]) => re.test(host));
    links.push(
      hit
        ? { kind: hit[1], label: hit[2], url: u }
        : { kind: "website", label: "Sitio web", url: u },
    );
  };

  if (user.blog) push(user.blog);
  if (user.twitter_username) push(`https://x.com/${user.twitter_username}`);
  for (const account of extra) push(account.url);
  if (user.email) {
    links.push({ kind: "email", label: "Email", url: `mailto:${user.email}` });
  }

  const seen = new Set<string>();
  return links.filter((l) => (seen.has(l.url) ? false : (seen.add(l.url), true)));
}

function branchFrom(event: GitHubEvent): string | null {
  const ref = event.payload?.ref;
  if (event.type === "PushEvent" && ref) return ref.replace(/^refs\/heads\//, "");
  if (event.type === "CreateEvent" && event.payload?.ref_type === "branch" && ref) return ref;
  if (event.type === "PullRequestEvent") return event.payload?.pull_request?.base?.ref ?? null;
  return null;
}

async function buildRepository(raw: GitHubRepo): Promise<Repository> {
  // Fail fast (attempts=1): si GitHub limita la tasa en estas llamadas por repo,
  // se degrada a los datos básicos en lugar de encadenar reintentos lentos.
  const [languagesRaw, releaseRaw] = await Promise.all([
    get<GitHubLanguages>(`/repos/${raw.full_name}/languages`, 1),
    get<GitHubRelease>(`/repos/${raw.full_name}/releases/latest`, 1),
  ]);

  const languages = languagesRaw ?? (raw.language ? { [raw.language]: 1 } : {});
  const technologies = detectTechnologies({
    name: raw.name,
    description: raw.description,
    topics: raw.topics ?? [],
    languages: Object.keys(languages),
    homepage: raw.homepage,
  });

  const release: ReleaseInfo | null = releaseRaw
    ? {
        name: releaseRaw.name || releaseRaw.tag_name,
        tag: releaseRaw.tag_name,
        publishedAt: releaseRaw.published_at ?? null,
        url: releaseRaw.html_url,
      }
    : null;

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? null,
    htmlUrl: raw.html_url,
    homepage: safeExternalUrl(raw.homepage),
    language: raw.language ?? null,
    languages,
    technologies,
    stars: raw.stargazers_count ?? 0,
    forks: raw.forks_count ?? 0,
    watchers: raw.watchers_count ?? 0,
    openIssues: raw.open_issues_count ?? 0,
    archived: Boolean(raw.archived),
    visibility: raw.visibility ?? "public",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at ?? raw.updated_at,
    topics: raw.topics ?? [],
    hasPages: Boolean(raw.has_pages),
    license: raw.license?.spdx_id ?? null,
    release,
  };
}

function computeLanguages(repos: Repository[]): LanguageSlice[] {
  const bytes = new Map<string, number>();
  const counts = new Map<string, number>();
  for (const repo of repos) {
    for (const [name, size] of Object.entries(repo.languages)) {
      bytes.set(name, (bytes.get(name) ?? 0) + size);
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  const total = [...bytes.values()].reduce((a, b) => a + b, 0) || 1;
  return [...bytes.entries()]
    .map(([name, size]) => ({
      name,
      bytes: size,
      percentage: Math.round((size / total) * 1000) / 10,
      repoCount: counts.get(name) ?? 0,
      color: languageColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
}

function describeEvent(event: GitHubEvent): string {
  switch (event.type) {
    case "PushEvent":
      return `${event.payload?.commits?.length ?? 1} commit(s) publicados`;
    case "CreateEvent":
      return `Creó ${event.payload?.ref_type ?? "un recurso"}`;
    case "ReleaseEvent":
      return `Publicó el release ${event.payload?.release?.tag_name ?? ""}`.trim();
    case "WatchEvent":
      return "Marcó el repositorio con una estrella";
    case "ForkEvent":
      return "Hizo un fork del repositorio";
    case "PullRequestEvent":
      return `Pull request ${event.payload?.action ?? "actualizado"}`;
    case "IssuesEvent":
      return `Issue ${event.payload?.action ?? "actualizado"}`;
    default:
      return event.type.replace(/Event$/, "") ?? "Actividad";
  }
}

function degradedSnapshot(username: string): PortfolioSnapshot {
  return {
    profile: {
      login: username,
      name: username,
      avatarUrl: `https://avatars.githubusercontent.com/${username}`,
      bio: null,
      location: null,
      company: null,
      blog: null,
      email: null,
      publicRepos: 0,
      followers: 0,
      following: 0,
      createdAt: new Date().toISOString(),
      htmlUrl: `https://github.com/${username}`,
      socials: [{ kind: "github", label: "GitHub", url: `https://github.com/${username}` }],
    },
    repositories: [],
    activity: [],
    degraded: true,
    stats: {
      totalRepos: 0,
      totalStars: 0,
      totalForks: 0,
      totalReleases: 0,
      activeRepos: 0,
      archivedRepos: 0,
      languages: [],
      lastSyncedAt: new Date().toISOString(),
    },
  };
}

export async function fetchPortfolio(username: string): Promise<PortfolioSnapshot> {
  const cached = await readSnapshot();
  if (cached) return cached;

  const [user, reposRaw, socialRaw, eventsRaw] = await Promise.all([
    get<GitHubUser>(`/users/${username}`),
    get<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`),
    get<GitHubSocialAccount[]>(`/users/${username}/social_accounts`),
    get<GitHubEvent[]>(`/users/${username}/events/public?per_page=30`),
  ]);

  if (!user) {
    // GitHub no respondió (normalmente límite de peticiones): servimos el último
    // snapshot conocido o un estado degradado, nunca un error que rompa la página.
    const stale = await readSnapshotOrStale();
    if (stale) return stale;
    return degradedSnapshot(username);
  }

  const rawRepos = (reposRaw ?? []).filter((r) => !r.fork);
  const repositories = await mapLimit(rawRepos, CONCURRENCY, buildRepository);

  const profile: Profile = {
    login: user.login,
    name: user.name ?? user.login,
    avatarUrl: user.avatar_url,
    bio: user.bio ?? null,
    location: user.location ?? null,
    company: user.company ?? null,
    blog: user.blog ? String(user.blog) : null,
    email: user.email ?? null,
    publicRepos: user.public_repos ?? repositories.length,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    createdAt: user.created_at,
    htmlUrl: user.html_url,
    socials: socialsFrom(user, socialRaw ?? []),
  };

  const activity: ActivityItem[] = (eventsRaw ?? []).slice(0, 8).map((event) => {
    const repoName = event.repo?.name ?? "";
    const branch = branchFrom(event);
    return {
      id: event.id,
      type: event.type,
      repoName,
      repoUrl: branch
        ? `https://github.com/${repoName}/commits/${branch}`
        : `https://github.com/${repoName}`,
      branch,
      createdAt: event.created_at,
      summary: describeEvent(event),
    };
  });

  const snapshot: PortfolioSnapshot = {
    profile,
    repositories,
    activity,
    degraded: reposRaw === null,
    stats: {
      totalRepos: repositories.length,
      totalStars: repositories.reduce((a, r) => a + r.stars, 0),
      totalForks: repositories.reduce((a, r) => a + r.forks, 0),
      totalReleases: repositories.filter((r) => r.release).length,
      activeRepos: repositories.filter((r) => !r.archived).length,
      archivedRepos: repositories.filter((r) => r.archived).length,
      languages: computeLanguages(repositories),
      lastSyncedAt: new Date().toISOString(),
    },
  };

  if (!snapshot.degraded) await writeSnapshot(snapshot);
  return snapshot;
}

/** Forces the weekly sync to refetch on the next read. */
export function invalidatePortfolioCache() {
  invalidateSnapshot();
}
