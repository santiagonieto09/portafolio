import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const SECTIONS = [
  { href: "#perfil", label: "Perfil" },
  { href: "#estadisticas", label: "Estadísticas" },
  { href: "#lenguajes", label: "Lenguajes" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#actividad", label: "Actividad" },
];

export function SiteHeader({ name }: { name: string }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <a
          href="#contenido"
          className="skeu-btn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4"
        >
          Saltar al contenido
        </a>

        <a href="#perfil" className="skeu-btn shrink-0 font-display font-black">
          {name.split(" ")[0]}
          <span className="text-primary">.dev</span>
        </a>

        <nav aria-label="Navegación principal" className="hidden flex-1 lg:block">
          <ul className="flex justify-center gap-2">
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <a href={section.href} className="skeu-btn text-xs">
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={toggle}
          className="skeu-btn ml-auto shrink-0 lg:ml-0"
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {theme === "dark" ? (
            <Sun className="size-4" aria-hidden="true" />
          ) : (
            <Moon className="size-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{theme === "dark" ? "Claro" : "Oscuro"}</span>
        </button>
      </div>
    </header>
  );
}
