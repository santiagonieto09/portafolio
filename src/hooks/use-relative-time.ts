import { useEffect, useState } from "react";
import { formatRelative } from "@/lib/format";

/**
 * Tiempo relativo seguro para hidratación.
 *
 * `formatDistanceToNow` se evalúa con `Date.now()`, así que servidor y cliente
 * pueden producir textos distintos si cruzan el límite de un minuto entre el
 * SSR y la hidratación. Este hook devuelve "" hasta el montaje en cliente y
 * solo entonces calcula el texto, garantizando que SSR y primera render
 * coincidan.
 */
export function useRelativeTime(iso: string | null | undefined): string {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return "";
  return formatRelative(iso);
}
