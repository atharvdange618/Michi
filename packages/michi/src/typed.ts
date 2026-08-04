import type { RouteRegistry } from "./types";

/**
 * Structural bound for a route node, used instead of importing `RouteDefinition`
 * directly.
 */
type AnyRouteNode = {
  path: string;
  loader?: (ctx: any) => Promise<unknown>;
  validateSearch?: (raw: Record<string, string>) => unknown;
  children?: readonly AnyRouteNode[];
};

/**
 * Type-level `string.split(delimiter)`.
 */
type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
    ? [""]
    : S extends `${infer Head}${D}${infer Rest}`
      ? [Head, ...Split<Rest, D>]
      : [S];

/**
 * Walks path segments and collects param names.
 */
type ParamNames<Segments extends readonly string[]> = Segments extends readonly [
  infer Head extends string,
  ...infer Tail extends readonly string[],
]
  ? Head extends `$${infer Name}`
    ? Name | ParamNames<Tail>
    : Head extends "*"
      ? "*" | ParamNames<Tail>
      : ParamNames<Tail>
  : never;

/** `"/user/$id"` -> `{ id: string }`. `"/files/*"` -> `{ "*": string }`. `"/about"` -> `{}`. */
export type ParsePathParams<Path extends string> = {
  [K in ParamNames<Split<Path, "/">>]: string;
};

type IsLayoutPath<P extends string> = P extends `_${string}` ? true : false;

/**
 * One recursive walk over the route tree, producing a union of one entry per
 * *navigable* route (layout routes like `__root`/`_auth` are excluded - same rule
 * `matchTree` applies at runtime, since you can never `navigate("__root")`).
 *
 * This is the single source of truth both `PathsOf` and `RouteInfoOf` build on -
 * deliberately one walk, not two, so there's no second copy of "what counts as
 * navigable" that could drift out of sync with the first.
 *
 * search/loaderData fallbacks mirror the real runtime fallbacks exactly:
 * - no `validateSearch` -> `applySearch` passes `rawSearch` through untyped,
 *   so the type here falls back to `Record<string, string>`, not `unknown`.
 * - no `loader` -> `RouteMatch.loaderData` stays whatever `matcher.ts` initializes
 *   it to, which is `undefined` - so the type falls back to `undefined`, not `unknown`.
 */
type FlattenRoutes<Tree extends readonly AnyRouteNode[]> = Tree extends readonly [
  infer Head extends AnyRouteNode,
  ...infer Tail extends readonly AnyRouteNode[],
]
  ?
      | (IsLayoutPath<Head["path"]> extends true
          ? never
          : {
              path: Head["path"];
              params: ParsePathParams<Head["path"]>;
              search: Head extends { validateSearch: (raw: any) => infer S }
                ? S
                : Record<string, string>;
              loaderData: Head extends {
                loader: (ctx: any) => Promise<infer D>;
              }
                ? D
                : undefined;
            })
      | (Head extends { children: infer C extends readonly AnyRouteNode[] }
          ? FlattenRoutes<C>
          : never)
      | FlattenRoutes<Tail>
  : never;

export type PathsOf<Tree extends readonly AnyRouteNode[]> = FlattenRoutes<Tree>["path"];

/**
 * `path -> { params, search, loaderData }` lookup table for the whole tree.
 */
export type RouteInfoOf<Tree extends readonly AnyRouteNode[]> = {
  [Entry in FlattenRoutes<Tree> as Entry["path"]]: Omit<Entry, "path">;
};

type SubstituteSegment<S extends string> = S extends `$${string}`
  ? string
  : S extends "*"
    ? string
    : S;

type JoinSegments<Segments extends readonly string[]> = Segments extends readonly [
  infer Head extends string,
  ...infer Tail extends readonly string[],
]
  ? Tail extends readonly []
    ? `${SubstituteSegment<Head>}`
    : `${SubstituteSegment<Head>}/${JoinSegments<Tail>}`
  : "";

export type TypedPath<Tree extends readonly AnyRouteNode[]> = JoinSegments<
  Split<PathsOf<Tree>, "/">
>;

export type RegisteredRoutes = RouteRegistry extends { routes: infer R }
  ? R
  : Record<string, { params: Record<string, string>; search: unknown; loaderData: unknown }>;

export type RegisteredPath = RouteRegistry extends { routes: infer R }
  ? JoinSegments<Split<Extract<keyof R, string>, "/">>
  : string;

type WithOptionalSearch<P extends string> = P | `${P}?${string}`;

export type NavigateTo = WithOptionalSearch<RegisteredPath> | `http${string}`;
