import { useState } from "react";
import {
  Archive,
  BookOpen,
  CalendarPlus,
  ExternalLink,
  GitFork,
  Github,
  History,
  Rocket,
  Star,
} from "lucide-react";
import type { Repository } from "@/domain/github/types";
import { languageColor } from "@/domain/github/language-colors";
import { formatDate, formatRelative } from "@/lib/format";
import { docsUrlFor } from "@/lib/docs-url";

export function RepositoryCard({ repo }: { repo: Repository }) {
  const languages = Object.keys(repo.languages);
  const [expanded, setExpanded] = useState(false);
  const docsUrl = docsUrlFor(repo.htmlUrl);
  const description = repo.description ?? "Sin descripción publicada en GitHub.";
  const isLong = description.length > 110;

  return (
    <article
      className="skeu-card flex h-full flex-col gap-4 p-5"
      aria-labelledby={`repo-${repo.id}-title`}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 id={`repo-${repo.id}-title`} className="truncate text-lg font-bold">
            {repo.name}
          </h3>
          <p
            id={`repo-${repo.id}-description`}
            className={`text-sm text-muted-foreground ${expanded ? "" : "line-clamp-2"}`}
          >
            {description}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-controls={`repo-${repo.id}-description`}
              className="mt-1 cursor-pointer text-xs font-semibold text-accent underline-offset-2 hover:underline"
            >
              {expanded ? "Ver menos" : "Ver más..."}
            </button>
          )}
        </div>
        <span
          className={`skeu-chip shrink-0 ${repo.archived ? "" : "text-accent"}`}
          title={repo.archived ? "Repositorio archivado" : "Repositorio activo"}
        >
          {repo.archived ? (
            <Archive className="size-3" aria-hidden="true" />
          ) : (
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          )}
          {repo.archived ? "Archivado" : "Activo"}
        </span>
      </header>

      {repo.technologies.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologías detectadas">
          {repo.technologies.slice(0, 8).map((tech) => (
            <li key={tech} className="skeu-chip">
              {languages.includes(tech) && (
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ backgroundColor: languageColor(tech) }}
                />
              )}
              {tech}
            </li>
          ))}
        </ul>
      )}

      <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarPlus className="size-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Creado</dt>
          <dd className="truncate">Creado {formatDate(repo.createdAt)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <History className="size-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Última actualización</dt>
          <dd className="truncate">Actualizado {formatRelative(repo.pushedAt)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="size-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Estrellas</dt>
          <dd>{repo.stars}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <GitFork className="size-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Forks</dt>
          <dd>
            {repo.forks} · {repo.visibility}
          </dd>
        </div>
      </dl>

      {repo.release && (
        <div className="skeu-inset rounded-xl px-3 py-2 text-xs">
          <p className="flex items-center gap-1.5 font-semibold text-foreground">
            <Rocket className="size-3.5 text-accent" aria-hidden="true" />
            {repo.release.name}
            <span className="font-mono text-muted-foreground">({repo.release.tag})</span>
          </p>
          <p className="text-muted-foreground">
            Publicado el {formatDate(repo.release.publishedAt)}
          </p>
        </div>
      )}


      <footer className="mt-auto flex flex-wrap gap-2 pt-1">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="skeu-btn skeu-btn-primary"
          aria-label={`Abrir el repositorio ${repo.name} en GitHub`}
        >
          <Github className="size-4" aria-hidden="true" />
          Repositorio
        </a>
        {docsUrl && (
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="skeu-btn"
            aria-label={`Ver la documentación de ${repo.name} en DeepWiki`}
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Docs
          </a>
        )}
        {repo.release && (
          <a
            href={repo.release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="skeu-btn skeu-btn-accent"
            aria-label={`Ver el release ${repo.release.tag} de ${repo.name}`}
          >
            <Rocket className="size-4" aria-hidden="true" />
            Ver release
          </a>
        )}
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="skeu-btn"
            aria-label={`Abrir el sitio web de ${repo.name}`}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Sitio web
          </a>
        )}
      </footer>
    </article>
  );
}
