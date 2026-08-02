import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "portfolio-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const preferred: Theme =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(preferred);
    document.documentElement.classList.toggle("dark", preferred === "dark");
  }, []);

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
