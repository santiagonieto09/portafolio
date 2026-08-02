import { describe, expect, it } from "vitest";
import { languageColor } from "@/domain/github/language-colors";

describe("languageColor", () => {
  it("devuelve el color oficial para lenguajes conocidos", () => {
    expect(languageColor("Java")).toBe("#b07219");
    expect(languageColor("TypeScript")).toBe("#3178c6");
    expect(languageColor("Python")).toBe("#3572A5");
  });

  it("devuelve un color determinista para lenguajes desconocidos", () => {
    const first = languageColor("LenguajeInexistente");
    const second = languageColor("LenguajeInexistente");
    expect(first).toBe(second);
    expect(first).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("usa la misma entrada y salida siempre", () => {
    expect(languageColor("Java")).toBe(languageColor("Java"));
  });
});
