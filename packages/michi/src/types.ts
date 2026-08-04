import type { ComponentType } from "react";

export type ParsedLocation = {
  pathname: string;
  search: string;
  hash: string;
};

export type LoaderContext<TParams = Record<string, string>, TSearch = Record<string, string>> = {
  params: TParams;
  search: TSearch;
};

export type RouteDefinition = {
  path: string;
  component: ComponentType;
  loader?: (ctx: LoaderContext<any, any>) => Promise<unknown>;
  validateSearch?: (raw: Record<string, string>) => unknown;
  errorComponent?: ComponentType<{ error: unknown }>;
  children?: RouteDefinition[];
};

export type RouteMatch = {
  routeId: string;
  params: Record<string, string>;
  rawSearch?: Record<string, string>;
  search?: unknown;
  loaderData: unknown;
  errorComponent: ComponentType<{ error: unknown }> | undefined;
  error?: unknown;
  loader: ((ctx: LoaderContext) => Promise<unknown>) | undefined;
  component: ComponentType;
};

export type RouterState = {
  location: ParsedLocation;
  matches: RouteMatch[];
  status: "idle" | "loading" | "error";
};

export type RouterOptions = {
  prefetchTtlMs?: number;
};

export type NavigateOptions = {
  search?: Record<string, unknown> | ((prev: Record<string, string>) => Record<string, unknown>);
  searchMode?: "merge" | "replace"; // default: "merge"
};

// Empty on purpose. A consuming app's generated routeTree.gen.ts augments this
// via declaration merging (`declare module "michi" { interface RouteRegistry { routes: ... } }`)
// so the package can reference the app's route types without ever importing the app's code.
// Until that augmentation runs, `RouteRegistry["routes"]` resolves to `never`/`{}` - see typed.ts
// for how consumers of this fall back safely when the package compiles standalone.
export interface RouteRegistry {}
