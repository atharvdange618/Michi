import type { RouteMatch, LoaderContext } from "./types";

function hasChanged(prev: RouteMatch | undefined, next: RouteMatch): boolean {
  if (!prev) return true;
  if (prev.routeId !== next.routeId) return true;
  const prevKeys = Object.keys(prev.params);
  const nextKeys = Object.keys(next.params);
  if (prevKeys.length !== nextKeys.length) return true;
  return prevKeys.some((k) => prev.params[k] !== next.params[k]);
}

export async function runLoaders(
  pendingMatches: RouteMatch[],
  previousMatches: RouteMatch[],
): Promise<RouteMatch[]> {
  return Promise.all(
    pendingMatches.map(async (match, index) => {
      const prev = previousMatches[index];

      if (!hasChanged(prev, match)) {
        return { ...match, loaderData: prev!.loaderData };
      }

      if (!match.loader) return match;

      const ctx: LoaderContext = {
        params: match.params,
        search: {},
      };

      const loaderData = await match.loader(ctx);

      return { ...match, loaderData };
    }),
  );
}
