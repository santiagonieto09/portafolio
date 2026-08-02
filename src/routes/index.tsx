import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Github, Mail } from "lucide-react";

import { portfolioQueryOptions } from "@/lib/portfolio.queries";
import { CONTACT_EMAIL, GITHUB_PROFILE_URL, GITHUB_USERNAME } from "@/lib/constants";
import { ProfileHero } from "@/components/portfolio/profile-hero";
import { StatsGrid } from "@/components/portfolio/stats-grid";
import { LanguageChart } from "@/components/portfolio/language-chart";
import { RepositoryExplorer } from "@/components/portfolio/repository-explorer";
import { ActivityFeed } from "@/components/portfolio/activity-feed";
import { SiteHeader } from "@/components/portfolio/site-header";
const TITLE = "Santiago Nieto — Portafolio de desarrollo de software";
const DESCRIPTION =
  "Portafolio profesional de Santiago Nieto: proyectos, tecnologías, releases y estadísticas sincronizadas automáticamente desde GitHub.";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(portfolioQueryOptions());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Santiago Nieto" },
      {
        name: "keywords",
        content:
          "Santiago Nieto, portafolio, desarrollador de software, Java, Spring Boot, Flutter, Angular, GitHub",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      {
        property: "og:image",
        content: "https://avatars.githubusercontent.com/u/91501165?v=4",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      {
        name: "twitter:image",
        content: "https://avatars.githubusercontent.com/u/91501165?v=4",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Santiago Nieto",
          alternateName: GITHUB_USERNAME,
          jobTitle: "Desarrollador de software",
          address: { "@type": "PostalAddress", addressCountry: "CO" },
          image: "https://avatars.githubusercontent.com/u/91501165?v=4",
          sameAs: [GITHUB_PROFILE_URL],
          knowsAbout: ["Java", "Spring Boot", "Flutter", "Angular", "Python", "TypeScript"],
        }),
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data } = useSuspenseQuery(portfolioQueryOptions());
  const { profile, repositories, stats, activity } = data;

  return (
    <div className="min-h-screen">
      <SiteHeader name={profile.name} />

      <main id="contenido" className="mx-auto max-w-6xl space-y-14 px-4 pt-4 pb-20">
        <ProfileHero profile={profile} />
        <StatsGrid stats={stats} />
        <LanguageChart languages={stats.languages} />
        <RepositoryExplorer repositories={repositories} />
        <ActivityFeed items={activity} />
      </main>

      <footer className="px-4 pb-10">
        <div className="skeu-surface mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-3xl px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="space-y-1">
            <p className="font-display text-sm font-bold">
              © {new Date().getUTCFullYear()} {profile.name}
            </p>
            <p className="text-xs text-muted-foreground">Todos los derechos reservados.</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="skeu-btn text-xs"
              aria-label="Escribir un correo a Santiago Nieto"
            >
              <Mail className="size-4" aria-hidden="true" />
              Contacto
            </a>
            <a
              href={profile.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="skeu-btn text-xs"
              aria-label="Abrir el perfil de GitHub"
            >
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
