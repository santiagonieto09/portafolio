import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  BookOpen,
  Check,
  Archive,
  CircleDot,
  Globe,
  Rocket,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type {
  RepositoryQuery,
  SortDirection,
  SortKey,
} from "@/domain/portfolio/repository-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "updated", label: "Actualización" },
  { key: "created", label: "Creación" },
  { key: "stars", label: "Estrellas" },
  { key: "name", label: "Nombre" },
];

const DIRECTIONS: Array<{ key: SortDirection; label: string }> = [
  { key: "desc", label: "Descendente" },
  { key: "asc", label: "Ascendente" },
];

const ALL = "__all__";

interface Props {
  query: RepositoryQuery;
  onChange: (patch: Partial<RepositoryQuery>) => void;
  languages: string[];
  technologies: string[];
  resultCount: number;
}

const controlClass =
  "skeu-inset h-10 cursor-pointer rounded-xl border-0 px-3 text-sm shadow-none focus:ring-0";
const contentClass = "skeu-surface rounded-xl border-0";
const itemClass =
  "cursor-pointer rounded-lg text-sm transition-colors focus:bg-primary/15 data-[state=checked]:font-semibold";

export function RepositoryFilters({
  query,
  onChange,
  languages,
  technologies,
  resultCount,
}: Props) {
  const features = [
    { key: "onlyWithRelease" as const, label: "Tiene release", icon: Rocket },
    { key: "onlyWithDocs" as const, label: "Tiene documentación", icon: BookOpen },
    { key: "onlyWithSite" as const, label: "Tiene sitio web", icon: Globe },
    { key: "onlyActive" as const, label: "Proyecto activo", icon: CircleDot },
    { key: "onlyArchived" as const, label: "Proyecto archivado", icon: Archive },
  ];

  const activeFeatures = features.filter((feature) => query[feature.key]).length;

  return (
    <div className="skeu-surface space-y-4 rounded-3xl p-4 sm:p-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="repo-search" className="sr-only">
          Buscar por nombre, tecnología, lenguaje o descripción
        </label>
        <input
          id="repo-search"
          type="search"
          value={query.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Buscar por nombre, tecnología, lenguaje o descripción…"
          className="skeu-inset h-10 w-full rounded-xl pr-4 pl-9 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={query.sort}
          onValueChange={(value) => onChange({ sort: value as SortKey })}
        >
          <SelectTrigger className={`${controlClass} w-auto min-w-[9.5rem]`} aria-label="Ordenar proyectos">
            <SlidersHorizontal className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={contentClass}>
            {SORTS.map((sort) => (
              <SelectItem key={sort.key} value={sort.key} className={itemClass}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={query.direction}
          onValueChange={(value) => onChange({ direction: value as SortDirection })}
        >
          <SelectTrigger className={`${controlClass} w-auto min-w-[9.5rem]`} aria-label="Dirección del orden">
            {query.direction === "asc" ? (
              <ArrowUpWideNarrow className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ArrowDownWideNarrow className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            )}
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={contentClass}>
            {DIRECTIONS.map((direction) => (
              <SelectItem key={direction.key} value={direction.key} className={itemClass}>
                {direction.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {languages.length > 0 && (
          <Select
            value={query.language ?? ALL}
            onValueChange={(value) => onChange({ language: value === ALL ? null : value })}
          >
            <SelectTrigger className={`${controlClass} w-auto min-w-[8.5rem] max-w-[13rem]`} aria-label="Filtrar por lenguaje">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={contentClass}>
              <SelectItem value={ALL} className={itemClass}>
                Lenguaje
              </SelectItem>
              {languages.map((language) => (
                <SelectItem key={language} value={language} className={itemClass}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {technologies.length > 0 && (
          <Select
            value={query.technology ?? ALL}
            onValueChange={(value) => onChange({ technology: value === ALL ? null : value })}
          >
            <SelectTrigger className={`${controlClass} w-auto min-w-[9rem] max-w-[13rem]`} aria-label="Filtrar por framework">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={contentClass}>
              <SelectItem value={ALL} className={itemClass}>
                Framework
              </SelectItem>
              {technologies.map((tech) => (
                <SelectItem key={tech} value={tech} className={itemClass}>
                  {tech}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`${controlClass} inline-flex items-center gap-2 whitespace-nowrap outline-none`}
              aria-label="Filtrar por características"
            >
              <Check className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              Características
              {activeFeatures > 0 && (
                <span className="skeu-chip px-1.5 py-0 text-[0.65rem]">{activeFeatures}</span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={`${contentClass} w-56`}>
            <DropdownMenuLabel className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
              Características
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {features.map((feature) => (
              <DropdownMenuCheckboxItem
                key={feature.key}
                checked={query[feature.key]}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={(checked) => onChange({ [feature.key]: checked })}
                className={itemClass}
              >
                <feature.icon className="mr-2 size-3.5 text-muted-foreground" aria-hidden="true" />
                {feature.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <p aria-live="polite" className="ml-auto text-xs text-muted-foreground">
          {resultCount} proyecto{resultCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
