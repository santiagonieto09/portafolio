import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return DATE_FORMATTER.format(parseISO(iso)).replace(/\./g, "");
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: es });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO").format(value);
}
