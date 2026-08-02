import { Archive, GitFork, Rocket, Star, Zap, FolderGit2 } from "lucide-react";
import type { PortfolioStats } from "@/domain/github/types";
import { formatNumber, formatRelative } from "@/lib/format";

export function StatsGrid({ stats }: { stats: PortfolioStats }) {
  const items = [
    { icon: FolderGit2, label: "Repositorios", value: stats.totalRepos },
    { icon: Star, label: "Estrellas", value: stats.totalStars },
    { icon: GitFork, label: "Forks", value: stats.totalForks },
    { icon: Rocket, label: "Con release", value: stats.totalReleases },
    { icon: Zap, label: "Activos", value: stats.activeRepos },
    { icon: Archive, label: "Archivados", value: stats.archivedRepos },
  ];

  return (
    <section id="estadisticas" aria-labelledby="stats-title" className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 id="stats-title" className="text-2xl font-bold sm:text-3xl">
            Estadísticas del perfil
          </h2>
          <p className="text-sm text-muted-foreground">
            Calculadas en vivo desde la API pública de GitHub.
          </p>
        </div>
        <span className="skeu-chip shrink-0">
          Sincronizado {formatRelative(stats.lastSyncedAt)}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="skeu-card p-4 text-center">
            <item.icon className="mx-auto size-5 text-primary" aria-hidden="true" />
            <dd className="mt-2 text-2xl font-black tabular-nums">{formatNumber(item.value)}</dd>
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
