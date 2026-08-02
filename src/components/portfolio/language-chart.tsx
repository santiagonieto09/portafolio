import type { LanguageSlice } from "@/domain/github/types";
import { formatNumber } from "@/lib/format";

const SIZE = 220;
const RADIUS = 88;
const STROKE = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LanguageChart({ languages }: { languages: LanguageSlice[] }) {
  if (languages.length === 0) return null;

  let offset = 0;
  const arcs = languages.map((lang) => {
    const length = (lang.percentage / 100) * CIRCUMFERENCE;
    const arc = { lang, dash: `${length} ${CIRCUMFERENCE - length}`, offset: -offset };
    offset += length;
    return arc;
  });

  const top = languages[0];

  return (
    <section id="lenguajes" aria-labelledby="lang-title" className="skeu-surface rounded-4xl p-6">
      <h2 id="lang-title" className="text-2xl font-bold sm:text-3xl">
        Lenguajes más utilizados
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Distribución por bytes de código en todos los repositorios públicos.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <figure className="mx-auto">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Gráfico de anillo de lenguajes. ${languages
              .map((l) => `${l.name} ${l.percentage}%`)
              .join(", ")}`}
          >
            <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth={STROKE}
              />
              {arcs.map(({ lang, dash, offset: dashOffset }) => (
                <circle
                  key={lang.name}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={lang.color}
                  strokeWidth={STROKE}
                  strokeDasharray={dash}
                  strokeDashoffset={dashOffset}
                />
              ))}
            </g>
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              className="fill-foreground font-display text-xl font-black"
            >
              {top.percentage}%
            </text>
            <text x="50%" y="58%" textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {top.name}
            </text>
          </svg>
          <figcaption className="sr-only">
            Distribución porcentual de lenguajes de programación.
          </figcaption>
        </figure>

        <ul className="space-y-3">
          {languages.map((lang) => (
            <li key={lang.name} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 font-semibold">
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="truncate">{lang.name}</span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {lang.percentage}% · {formatNumber(lang.repoCount)} repos
                </span>
              </div>
              <div className="skeu-inset h-3 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{
                    width: `${Math.max(lang.percentage, 1.5)}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
