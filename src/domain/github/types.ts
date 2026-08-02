/**
 * Domain layer — framework-agnostic contracts for the portfolio.
 * No React, no fetch, no GitHub SDK details here.
 */

export interface SocialLink {
  kind:
    | "github"
    | "linkedin"
    | "x"
    | "instagram"
    | "facebook"
    | "youtube"
    | "website"
    | "blog"
    | "email";
  label: string;
  url: string;
}

export interface Profile {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  email: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  htmlUrl: string;
  socials: SocialLink[];
}

export interface ReleaseInfo {
  name: string;
  tag: string;
  publishedAt: string | null;
  url: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  languages: Record<string, number>;
  technologies: string[];
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  archived: boolean;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  hasPages: boolean;
  license: string | null;
  release: ReleaseInfo | null;
}

export interface LanguageSlice {
  name: string;
  bytes: number;
  percentage: number;
  repoCount: number;
  color: string;
}

export interface PortfolioStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalReleases: number;
  activeRepos: number;
  archivedRepos: number;
  languages: LanguageSlice[];
  lastSyncedAt: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  branch: string | null;
  createdAt: string;
  summary: string;
}

export interface PortfolioSnapshot {
  profile: Profile;
  repositories: Repository[];
  stats: PortfolioStats;
  activity: ActivityItem[];
  degraded: boolean;
}
