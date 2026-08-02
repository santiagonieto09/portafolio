/**
 * Pure domain rule: infer frameworks / libraries / tools for a repository
 * from signals GitHub already exposes (languages, topics, name, description).
 *
 * Open/Closed: add a new rule to RULES, never modify the detector.
 */

export interface TechRule {
  tech: string;
  /** Language names that imply this technology. */
  languages?: string[];
  /** Case-insensitive keywords matched against name + description + topics. */
  keywords?: string[];
}

const RULES: TechRule[] = [
  { tech: "Spring Boot", keywords: ["spring boot", "springboot", "spring-boot", "spring"] },
  { tech: "Spring Security", keywords: ["spring security", "spring-security", "jwt"] },
  { tech: "Spring Cloud", keywords: ["eureka", "spring cloud", "gateway", "microservi"] },
  { tech: "JPA / Hibernate", keywords: ["jpa", "hibernate"] },
  { tech: "Maven", languages: ["Java"] },
  { tech: "Angular", keywords: ["angular"] },
  { tech: "React", keywords: ["react", "next.js", "nextjs"] },
  { tech: "Flutter", keywords: ["flutter"], languages: ["Dart"] },
  { tech: "Django", keywords: ["django"] },
  { tech: "Jinja", languages: ["Jinja"] },
  { tech: "Symfony", keywords: ["symfony"] },
  { tech: "Laravel", keywords: ["laravel", "blade"] },
  { tech: "FastAPI", keywords: ["fastapi"] },
  { tech: "Node.js", keywords: ["node", "express", "nest"] },
  { tech: "Docker", keywords: ["docker", "contenedor"], languages: ["Dockerfile"] },
  { tech: "PostgreSQL", keywords: ["postgres", "postgresql"] },
  { tech: "MySQL", keywords: ["mysql", "mariadb"] },
  { tech: "MongoDB", keywords: ["mongo"] },
  { tech: "REST API", keywords: ["api rest", "rest api", "api-rest", "restful"] },
  { tech: "GraphQL", keywords: ["graphql"] },
  { tech: "IA / RAG", keywords: ["rag", "llm", " ia ", "asistente de ia", "openai", "embedding"] },
  { tech: "Tailwind CSS", keywords: ["tailwind"] },
  { tech: "Vercel", keywords: ["vercel"] },
  { tech: "RPC / RMI", keywords: ["rpc", "rmi", "distribuid"] },
  { tech: "Android", keywords: ["android"] },
];

export function detectTechnologies(input: {
  name: string;
  description: string | null;
  topics: string[];
  languages: string[];
  homepage: string | null;
}): string[] {
  const haystack = [
    input.name.replace(/[-_]/g, " "),
    input.description ?? "",
    input.topics.join(" "),
    input.homepage ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const found = new Set<string>(input.languages);

  for (const rule of RULES) {
    const byLanguage = rule.languages?.some((l) => input.languages.includes(l)) ?? false;
    const byKeyword = rule.keywords?.some((k) => haystack.includes(k)) ?? false;
    if (byLanguage || byKeyword) found.add(rule.tech);
  }

  return [...found];
}

/** Technologies that are not raw programming languages. */
export function frameworksOnly(technologies: string[], languages: string[]): string[] {
  return technologies.filter((t) => !languages.includes(t));
}
