import type { LoaderContext, RouteMatch } from "./types";

function hasChanged(prev: RouteMatch | undefined, next: RouteMatch): boolean {
  if (!prev) return true;
  if (prev.routeId !== next.routeId) return true;
  if (JSON.stringify(prev.params) !== JSON.stringify(next.params)) return true;
  return false;
}

export async function runLoaders(
  pendingMatches: RouteMatch[],
  previousMatches: RouteMatch[],
): Promise<RouteMatch[]> {
  return Promise.all(
    pendingMatches.map(async (match, index) => {
      const prev = previousMatches[index];

      if (!hasChanged(prev, match) && !prev!.error) {
        return { ...match, loaderData: prev!.loaderData, error: undefined };
      }

      if (!match.loader) return { ...match, error: undefined };

      try {
        const ctx: LoaderContext = {
          params: match.params,
          search: {}, // TODO: Slice 7 - parse from location.search using validateSearch
        };

        const loaderData = await match.loader(ctx);

        return { ...match, loaderData, error: undefined };
      } catch (error) {
        return { ...match, loaderData: undefined, error };
      }
    }),
  );
}
