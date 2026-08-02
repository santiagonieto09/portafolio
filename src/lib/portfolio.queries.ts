import { queryOptions } from "@tanstack/react-query";
import { getPortfolio } from "./portfolio.functions";

export const portfolioQueryOptions = () =>
  queryOptions({
    queryKey: ["portfolio"],
    queryFn: () => getPortfolio(),
    staleTime: 1000 * 60 * 60, // una hora en el cliente
    gcTime: 1000 * 60 * 60 * 24,
  });
