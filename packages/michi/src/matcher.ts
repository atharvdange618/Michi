import type { RouteDefinition, RouteMatch } from "./types";

type CompiledPattern = {
  regex: RegExp;
  paramNames: string[];
};

const patternCache = new Map<string, CompiledPattern>();

// layout route conventions:
// - __root: root layout, always matches, wraps everything
// - _*: pathless layout routes, wrap children without adding a path segment
function isLayoutRoute(path: string): boolean {
  return path.startsWith("_");
}

function compile(pattern: string): CompiledPattern {
  const cached = patternCache.get(pattern);
  if (cached) return cached;

  const paramNames: string[] = [];

  const regexString = pattern
    .split("/")
    .map((segment) => {
      if (segment.startsWith("$")) {
        paramNames.push(segment.slice(1));
        return "([^/]+)"; // match anything except a slash
      }

      if (segment === "*") {
        paramNames.push("*");
        return "(.*)"; // match everything including slashes
      }

      // static segment, escape regex special chars
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");

  const result: CompiledPattern = {
    regex: new RegExp(`^${regexString}$`),
    paramNames,
  };

  patternCache.set(pattern, result);
  return result;
}

export function matchRoute(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const { regex, paramNames } = compile(pattern);
  const match = path.match(regex);

  if (!match) return null;

  const params: Record<string, string> = {};

  // match[0] is the full string, params start at match[1]
  paramNames.forEach((name, i) => {
    params[name] = decodeURIComponent(match[i + 1]);
  });

  return params;
}

// walks the route tree and returns the matched branch as a flat array.
// matches[0] is always the root layout, matches[1] is the matched child, etc.
export function matchTree(
  routes: RouteDefinition[],
  pathname: string,
): RouteMatch[] {
  for (const route of routes) {
    // layout routes always match and wrap their children
    if (isLayoutRoute(route.path)) {
      const layoutMatch: RouteMatch = {
        routeId: route.path,
        params: {},
        loaderData: undefined,
        loader: route.loader,
        component: route.component,
        errorComponent: route.errorComponent,
      };

      if (route.children?.length) {
        const childMatches = matchTree(route.children, pathname);
        // __root always renders (it's the outermost shell). Other layout
        // routes should only contribute when a descendant actually matches
        // - otherwise we'd block sibling routes from being tried.
        if (childMatches.length > 0 || route.path === "__root") {
          return [layoutMatch, ...childMatches];
        }
        continue;
      }

      return [layoutMatch];
    }

    // regular route with children: acts as a layout for its children.
    // if no child matches, check if the route itself matches exactly.
    //
    // NOTE: a route with children can behave as BOTH a layout and a leaf.
    // When navigating to "/settings" with children ["/settings/profile"]:
    //   - No child matches → falls through to leaf match → returns [{/settings}]
    // When navigating to "/dashboard" with children ["/dashboard", "/dashboard/analytics"]:
    //   - Child "/dashboard" matches → parent becomes layout → returns [{/dashboard-layout}, {/dashboard-home}]
    //
    // This means the same route path can produce different match chains depending
    // on whether children exist and match. This is by design - it enables index
    // routes where the parent is both a layout and has a default child page.
    if (route.children?.length) {
      const childMatches = matchTree(route.children, pathname);
      if (childMatches.length > 0) {
        const layoutMatch: RouteMatch = {
          routeId: route.path,
          params: {},
          loaderData: undefined,
          loader: route.loader,
          component: route.component,
          errorComponent: route.errorComponent,
        };
        return [layoutMatch, ...childMatches];
      }
    }

    // leaf route: match against the pathname
    const params = matchRoute(route.path, pathname);
    if (params !== null) {
      return [
        {
          routeId: route.path,
          params,
          loaderData: undefined,
          loader: route.loader,
          component: route.component,
          errorComponent: route.errorComponent,
        },
      ];
    }
  }
  return [];
}
