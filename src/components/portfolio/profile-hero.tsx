import { Building2, CalendarDays, FolderGit2, MapPin, Users } from "lucide-react";
import type { Profile } from "@/domain/github/types";
import { formatDate, formatNumber } from "@/lib/format";
import { SocialButtons } from "./social-buttons";

interface Fact {
  icon: typeof MapPin;
  label: string;
  value: string;
}

export function ProfileHero({ profile }: { profile: Profile }) {
  const facts: Fact[] = [
    profile.location && { icon: MapPin, label: "Ubicación", value: profile.location },
    profile.company && { icon: Building2, label: "Empresa", value: profile.company },
    {
      icon: FolderGit2,
      label: "Repositorios públicos",
      value: formatNumber(profile.publicRepos),
    },
    {
      icon: Users,
      label: "Seguidores",
      value: `${formatNumber(profile.followers)} · sigue a ${formatNumber(profile.following)}`,
    },
    { icon: CalendarDays, label: "En GitHub desde", value: formatDate(profile.createdAt) },
  ].filter(Boolean) as Fact[];

  return (
    <section
      id="perfil"
      aria-labelledby="perfil-title"
      className="skeu-surface rise-in rounded-4xl p-6 sm:p-10"
    >
      <div className="grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
        <div className="skeu-surface mx-auto rounded-full p-2 md:mx-0">
          <img
            src={profile.avatarUrl}
            alt={`Foto de perfil de ${profile.name}`}
            width={168}
            height={168}
            loading="eager"
            decoding="async"
            className="size-36 rounded-full object-cover sm:size-42"
          />
        </div>

        <div className="min-w-0 space-y-5 text-center md:text-left">
          <div className="space-y-2">
            <span className="skeu-chip">Portafolio sincronizado con GitHub</span>
            <h1 id="perfil-title" className="text-4xl font-black sm:text-5xl">
              {profile.name}
            </h1>
            <p className="font-mono text-sm text-muted-foreground">@{profile.login}</p>
          </div>

          {profile.bio && (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:mx-0">
              {profile.bio}
            </p>
          )}

          <dl className="grid gap-3 sm:grid-cols-2">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="skeu-inset flex items-center gap-3 rounded-xl px-4 py-3 text-left"
              >
                <fact.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
                    {fact.label}
                  </dt>
                  <dd className="truncate text-sm font-semibold">{fact.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <SocialButtons
            links={[
              ...profile.socials.filter((link) => link.kind !== "email"),
              {
                kind: "email" as const,
                label: "Gmail",
                url: "https://mail.google.com/mail/?view=cm&fs=1&to=santiago.nieto09@gmail.com",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
