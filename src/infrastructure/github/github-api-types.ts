/**
 * Tipos de las respuestas de la API REST de GitHub (solo los campos que se usan).
 * Viven en infraestructura porque son contratos del proveedor, no del dominio.
 */

export type GitHubLanguages = Record<string, number>;

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  email: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  twitter_username: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  archived: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  topics: string[];
  has_pages: boolean;
  license: { spdx_id: string } | null;
  fork: boolean;
}

export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
}

export interface GitHubEventPayload {
  ref?: string;
  ref_type?: string;
  commits?: unknown[];
  release?: { tag_name?: string };
  pull_request?: { base?: { ref?: string } };
  action?: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string } | null;
  payload: GitHubEventPayload | null;
}

export interface GitHubSocialAccount {
  url: string;
}
