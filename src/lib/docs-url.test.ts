import { describe, expect, it } from "vitest";
import { docsUrlFor } from "@/lib/docs-url";

describe("docsUrlFor", () => {
  it("convierte una URL de GitHub en su URL de DeepWiki", () => {
    expect(docsUrlFor("https://github.com/owner/repo")).toBe("https://deepwiki.com/owner/repo");
  });

  it("preserva propietario y repo y quita .git", () => {
    expect(docsUrlFor("https://github.com/owner/repo.git")).toBe("https://deepwiki.com/owner/repo");
  });

  it("acepta www.github.com", () => {
    expect(docsUrlFor("https://www.github.com/owner/repo")).toBe("https://deepwiki.com/owner/repo");
  });

  it("devuelve null para URLs que no son de GitHub", () => {
    expect(docsUrlFor("https://example.com/owner/repo")).toBeNull();
    expect(docsUrlFor("https://gitlab.com/owner/repo")).toBeNull();
  });

  it("devuelve null para entradas vacías o inválidas", () => {
    expect(docsUrlFor(null)).toBeNull();
    expect(docsUrlFor("")).toBeNull();
    expect(docsUrlFor("no es una url")).toBeNull();
    expect(docsUrlFor("https://github.com/only-owner")).toBeNull();
  });
});
