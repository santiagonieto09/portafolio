import { describe, expect, it } from "vitest";
import { detectTechnologies, frameworksOnly } from "@/domain/github/technology-detection";

function detect(input: {
  name?: string;
  description?: string | null;
  topics?: string[];
  languages?: string[];
  homepage?: string | null;
}) {
  return detectTechnologies({
    name: input.name ?? "",
    description: input.description ?? null,
    topics: input.topics ?? [],
    languages: input.languages ?? [],
    homepage: input.homepage ?? null,
  });
}

describe("detectTechnologies", () => {
  it("detecta Spring Boot por palabras clave en la descripción", () => {
    const techs = detect({ description: "Microservicio con Spring Boot y JWT" });
    expect(techs).toContain("Spring Boot");
  });

  it("detecta Flutter por el lenguaje Dart", () => {
    const techs = detect({ languages: ["Dart"] });
    expect(techs).toContain("Flutter");
  });

  it("detecta Docker por el lenguaje Dockerfile", () => {
    const techs = detect({ languages: ["Dockerfile"] });
    expect(techs).toContain("Docker");
  });

  it("detecta Angular en el nombre del repositorio", () => {
    const techs = detect({ name: "web-angular-admin" });
    expect(techs).toContain("Angular");
  });

  it("detecta PostgreSQL en los topics", () => {
    const techs = detect({ topics: ["postgresql", "api"] });
    expect(techs).toContain("PostgreSQL");
  });

  it("incluye los lenguajes crudos como tecnologías", () => {
    const techs = detect({ languages: ["Java", "Python"] });
    expect(techs).toEqual(expect.arrayContaining(["Java", "Python"]));
  });

  it("no detecta nada sin señales", () => {
    expect(detect({ description: "Proyecto sin contexto" })).toEqual([]);
  });
});

describe("frameworksOnly", () => {
  it("descarta lenguajes y conserva frameworks", () => {
    expect(frameworksOnly(["Java", "Spring Boot", "Docker"], ["Java"])).toEqual([
      "Spring Boot",
      "Docker",
    ]);
  });
});
