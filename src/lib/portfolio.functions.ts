import { createServerFn } from "@tanstack/react-start";
import { GITHUB_USERNAME } from "./constants";

export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPortfolio } = await import("@/infrastructure/github/github-api.server");
  return fetchPortfolio(GITHUB_USERNAME);
});
