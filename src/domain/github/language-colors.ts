/** Official-ish GitHub linguist colors, with a deterministic fallback. */
const COLORS: Record<string, string> = {
  Java: "#b07219",
  Dart: "#00B4AB",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Makefile: "#427819",
  Batchfile: "#C1F12E",
  Jinja: "#a52a22",
  Handlebars: "#f7931e",
  Blade: "#f7523f",
  Twig: "#c1d026",
  SQL: "#e38c00",
  Objective_C: "#438eff",
};

const FALLBACK = ["#6e7781", "#8250df", "#0969da", "#1a7f37", "#bf8700", "#cf222e", "#bc4c00"];

export function languageColor(name: string): string {
  if (COLORS[name]) return COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return FALLBACK[hash % FALLBACK.length];
}
