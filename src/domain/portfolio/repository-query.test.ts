import { describe, expect, it } from "vitest";
import type { Repository } from "@/domain/github/types";
import {
  applyQuery,
  collectLanguages,
  collectTechnologies,
  defaultQuery,
  type RepositoryQuery,
} from "@/domain/portfolio/repository-query";

function makeRepo(partial: Partial<Repository> & { name: string }): Repository {
  return {
    id: 1,
    description: null,
    htmlUrl: `https://github.com/owner/${partial.name}`,
    homepage: null,
    language: null,
    languages: {},
    technologies: [],
    stars: 0,
    forks: 0,
    watchers: 0,
    openIssues: 0,
    archived: false,
    visibility: "public",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    pushedAt: "2023-01-01T00:00:00Z",
    topics: [],
    hasPages: false,
    license: null,
    release: null,
    ...partial,
  };
}

const repos: Repository[] = [
  makeRepo({
    name: "api-rest-java",
    description: "API REST con Spring Boot",
    languages: { Java: 100, Dockerfile: 10 },
    technologies: ["Spring Boot", "Docker"],
    topics: ["api-rest"],
    pushedAt: "2024-05-01T00:00:00Z",
  }),
  makeRepo({
    name: "app-flutter",
    description: "App móvil",
    languages: { Dart: 200 },
    technologies: ["Flutter"],
    stars: 42,
    pushedAt: "2024-06-01T00:00:00Z",
  }),
  makeRepo({
    name: "legacy",
    description: "Proyecto archivado",
    languages: { Python: 300 },
    technologies: [],
    archived: true,
    pushedAt: "2022-01-01T00:00:00Z",
  }),
];

function query(patch: Partial<RepositoryQuery>): RepositoryQuery {
  return { ...defaultQuery, ...patch };
}

describe("applyQuery", () => {
  it("devuelve todos los repositorios sin filtros", () => {
    expect(applyQuery(repos, defaultQuery)).toHaveLength(3);
  });

  it("filtra por término de búsqueda en nombre, descripción y tecnologías", () => {
    expect(applyQuery(repos, query({ search: "spring" })).map((r) => r.name)).toEqual([
      "api-rest-java",
    ]);
    expect(applyQuery(repos, query({ search: "flutter" })).map((r) => r.name)).toEqual([
      "app-flutter",
    ]);
    expect(applyQuery(repos, query({ search: "API REST" })).map((r) => r.name)).toEqual([
      "api-rest-java",
    ]);
  });

  it("filtra por lenguaje y tecnología", () => {
    expect(applyQuery(repos, query({ language: "Dart" })).map((r) => r.name)).toEqual([
      "app-flutter",
    ]);
    expect(applyQuery(repos, query({ technology: "Spring Boot" })).map((r) => r.name)).toEqual([
      "api-rest-java",
    ]);
  });

  it("filtra por repositorios archivados y activos", () => {
    expect(applyQuery(repos, query({ onlyArchived: true })).map((r) => r.name)).toEqual(["legacy"]);
    expect(applyQuery(repos, query({ onlyActive: true })).map((r) => r.name)).toHaveLength(2);
  });

  it("ordena por fecha de actualización descendente por defecto", () => {
    expect(applyQuery(repos, defaultQuery).map((r) => r.name)).toEqual([
      "app-flutter",
      "api-rest-java",
      "legacy",
    ]);
  });

  it("ordena por estrellas", () => {
    expect(applyQuery(repos, query({ sort: "stars" })).map((r) => r.name)).toEqual([
      "app-flutter",
      "api-rest-java",
      "legacy",
    ]);
  });

  it("ordena por nombre ascendente", () => {
    expect(applyQuery(repos, query({ sort: "name", direction: "asc" })).map((r) => r.name)).toEqual(
      ["api-rest-java", "app-flutter", "legacy"],
    );
  });
});

describe("collectLanguages / collectTechnologies", () => {
  it("recolecta lenguajes únicos ordenados", () => {
    expect(collectLanguages(repos)).toEqual(["Dart", "Dockerfile", "Java", "Python"]);
  });

  it("recolecta tecnologías que no son lenguajes crudos", () => {
    expect(collectTechnologies(repos)).toEqual(["Docker", "Flutter", "Spring Boot"]);
  });
});
