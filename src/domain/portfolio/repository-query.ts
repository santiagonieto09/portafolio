/** Pure domain rules for searching, filtering and sorting repositories. */
import type { Repository } from "@/domain/github/types";
import { docsUrlFor } from "@/lib/docs-url";

export type SortKey = "updated" | "created" | "stars" | "name";
export type SortDirection = "desc" | "asc";

export interface RepositoryQuery {
  search: string;
  language: string | null;
  technology: string | null;
  onlyWithRelease: boolean;
  onlyWithSite: boolean;
  onlyWithDocs: boolean;
  onlyArchived: boolean;
  onlyActive: boolean;
  sort: SortKey;
  direction: SortDirection;
}

export const defaultQuery: RepositoryQuery = {
  search: "",
  language: null,
  technology: null,
  onlyWithRelease: false,
  onlyWithSite: false,
  onlyWithDocs: false,
  onlyArchived: false,
  onlyActive: false,
  sort: "updated",
  direction: "desc",
};

function matchesSearch(repo: Repository, term: string): boolean {
  if (!term) return true;
  const q = term.toLowerCase();
  return (
    repo.name.toLowerCase().includes(q) ||
    (repo.description ?? "").toLowerCase().includes(q) ||
    repo.technologies.some((t) => t.toLowerCase().includes(q)) ||
    Object.keys(repo.languages).some((l) => l.toLowerCase().includes(q)) ||
    repo.topics.some((t) => t.toLowerCase().includes(q))
  );
}

export function applyQuery(repos: Repository[], query: RepositoryQuery): Repository[] {
  const filtered = repos.filter((repo) => {
    if (!matchesSearch(repo, query.search)) return false;
    if (query.language && !Object.keys(repo.languages).includes(query.language)) return false;
    if (query.technology && !repo.technologies.includes(query.technology)) return false;
    if (query.onlyWithRelease && !repo.release) return false;
    if (query.onlyWithSite && !repo.homepage) return false;
    if (query.onlyWithDocs && !docsUrlFor(repo.htmlUrl)) return false;
    if (query.onlyArchived && !repo.archived) return false;
    if (query.onlyActive && repo.archived) return false;
    return true;
  });

  // Comparators are expressed as "descending" (most relevant first).
  const sorters: Record<SortKey, (a: Repository, b: Repository) => number> = {
    updated: (a, b) => +new Date(b.pushedAt) - +new Date(a.pushedAt),
    created: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    stars: (a, b) => b.stars - a.stars,
    name: (a, b) => b.name.localeCompare(a.name),
  };

  const factor = query.direction === "asc" ? -1 : 1;
  return [...filtered].sort((a, b) => sorters[query.sort](a, b) * factor);
}

export function collectLanguages(repos: Repository[]): string[] {
  return [...new Set(repos.flatMap((r) => Object.keys(r.languages)))].sort();
}

export function collectTechnologies(repos: Repository[]): string[] {
  const languages = new Set(collectLanguages(repos));
  return [...new Set(repos.flatMap((r) => r.technologies))].filter((t) => !languages.has(t)).sort();
}
