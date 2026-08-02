import { Activity, ExternalLink } from "lucide-react";
import type { ActivityItem } from "@/domain/github/types";
import { formatRelative } from "@/lib/format";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="actividad" aria-labelledby="activity-title" className="skeu-surface rounded-4xl p-6">
      <h2 id="activity-title" className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
        <Activity className="size-6 text-accent" aria-hidden="true" />
        Actividad reciente
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Contribuciones públicas obtenidas del feed de eventos de GitHub.
      </p>

      <ol className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="skeu-inset rounded-xl px-4 py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.summary}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {item.repoName}
                  {item.branch ? `/${item.branch}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <time
                  dateTime={item.createdAt}
                  className="hidden text-xs text-muted-foreground sm:inline"
                >
                  {formatRelative(item.createdAt)}
                </time>
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skeu-btn cursor-pointer px-2 py-2"
                  aria-label={
                    item.branch
                      ? `Ver los commits de la rama ${item.branch} en ${item.repoName}`
                      : `Abrir el repositorio ${item.repoName} en GitHub`
                  }
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
