/**
 * Convierte la URL de un repositorio de GitHub en su URL de documentación
 * indexada en DeepWiki, conservando propietario y nombre del repositorio.
 *
 * https://github.com/owner/repo -> https://deepwiki.com/owner/repo
 *
 * Devuelve null cuando la URL no es un repositorio de GitHub válido.
 */
export function docsUrlFor(repositoryUrl: string | null | undefined): string | null {
  if (!repositoryUrl) return null;

  let parsed: URL;
  try {
    parsed = new URL(repositoryUrl);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "github.com") return null;

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length < 2) return null;

  const [owner, repo] = segments;
  return `https://deepwiki.com/${owner}/${repo.replace(/\.git$/, "")}`;
}
