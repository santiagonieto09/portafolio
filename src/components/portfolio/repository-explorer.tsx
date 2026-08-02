import { useMemo, useState } from "react";
import type { Repository } from "@/domain/github/types";
import {
  applyQuery,
  collectLanguages,
  collectTechnologies,
  defaultQuery,
  type RepositoryQuery,
} from "@/domain/portfolio/repository-query";
import { RepositoryCard } from "./repository-card";
import { RepositoryFilters } from "./repository-filters";

export function RepositoryExplorer({ repositories }: { repositories: Repository[] }) {
  const [query, setQuery] = useState<RepositoryQuery>(defaultQuery);

  const languages = useMemo(() => collectLanguages(repositories), [repositories]);
  const technologies = useMemo(() => collectTechnologies(repositories), [repositories]);
  const visible = useMemo(() => applyQuery(repositories, query), [repositories, query]);

  const patch = (next: Partial<RepositoryQuery>) =>
    setQuery((current) => ({ ...current, ...next }));

  return (
    <section id="proyectos" aria-labelledby="projects-title" className="space-y-5">
      <div>
        <h2 id="projects-title" className="text-2xl font-bold sm:text-3xl">
          Proyectos
        </h2>
        <p className="text-sm text-muted-foreground">
          Todos los repositorios públicos, con tecnologías, releases y paquetes detectados
          automáticamente.
        </p>
      </div>

      <RepositoryFilters
        query={query}
        onChange={patch}
        languages={languages}
        technologies={technologies}
        resultCount={visible.length}
      />

      {visible.length === 0 ? (
        <p className="skeu-inset rounded-2xl p-8 text-center text-sm text-muted-foreground">
          No hay proyectos que coincidan con la búsqueda.
        </p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((repo) => (
            <li key={repo.id} className="h-full">
              <RepositoryCard repo={repo} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
