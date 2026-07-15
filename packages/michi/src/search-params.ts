import type { RouteMatch } from "./types";

export type SearchValidators = Map<string, (raw: Record<string, string>) => unknown>;

export function parseSearchParams(search: string): Record<string, string> {
  const stripped = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(stripped);
  const result: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    // Duplicate keys keep the last value (e.g., ?tag=a&tag=b → { tag: "b" }).
    // For array params, use a delimiter: ?tag=a,b and split in validateSearch.
    result[key] = value;
  }
  return result;
}

export function serializeSearchParams(search: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    // undefined/null means "omit this key" - this is how navigate()'s
    // merge patch deletes a param: spread it as undefined, it disappears here
    if (value === undefined || value === null) continue;

    if (typeof value === "object") {
      console.warn(
        `Michi: search param "${key}" is an object and will be serialized as "[object Object]". ` +
          `Use primitive values (string, number, boolean) in search params.`,
      );
    }
    params.set(key, String(value));
  }

  const str = params.toString();
  return str ? `?${str}` : "";
}

// Attaches validated search to every match. Deliberately NOT cached like
// loaders are - validateSearch is synchronous and cheap (parsing an object
// you already have, not a network call), so there's no waterfall to avoid
// by skipping it. It reruns on every navigation, which is also what keeps
// RouteErrorBoundary's displayed error always accurate without needing any
// special cache-invalidation of its own.
export function applySearch(
  matches: RouteMatch[],
  rawSearch: Record<string, string>,
  validators?: SearchValidators,
): RouteMatch[] {
  return matches.map((match) => {
    const validate = validators?.get(match.routeId);
    if (!validate) {
      return { ...match, rawSearch, search: rawSearch };
    }
    try {
      return { ...match, rawSearch, search: validate(rawSearch) };
    } catch (error) {
      return { ...match, rawSearch, search: undefined, error };
    }
  });
}
