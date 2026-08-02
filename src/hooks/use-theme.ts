import { useCallback, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "portfolio-theme";

// La clase inicial la aplica un script inline en el <head> (ver __root.tsx),
// así el estado se inicializa en cliente con lo que ya pintó el navegador.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );

  const toggle = useCallback(() => {
    const next: Theme =
      document.documentElement.classList.contains("dark") ? "light" : "dark";

    const apply = () => {
      document.documentElement.classList.toggle("dark", next === "dark");
      window.localStorage.setItem(STORAGE_KEY, next);
      setTheme(next);
    };

    const startViewTransition = (
      document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      }
    ).startViewTransition;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!startViewTransition || reduced) {
      apply();
      return;
    }

    document.documentElement.dataset.themeSweep = next === "dark" ? "to-dark" : "to-light";
    const transition = startViewTransition.call(document, apply);
    transition.finished.finally(() => {
      delete document.documentElement.dataset.themeSweep;
    });
  }, []);

  return { theme, toggle };
}
