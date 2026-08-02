import { createServerFn } from "@tanstack/react-start";

export const GITHUB_USERNAME = "santiagonieto09";

export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPortfolio } = await import("@/infrastructure/github/github-api.server");
  return fetchPortfolio(GITHUB_USERNAME);
});
