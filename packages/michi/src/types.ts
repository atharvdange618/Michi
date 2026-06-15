import type { ComponentType } from "react";

export type ParsedLocation = {
  pathname: string;
  search: string;
  hash: string;
};

export type LoaderContext<
  TParams = Record<string, string>,
  TSearch = Record<string, string>,
> = {
  params: TParams;
  search: TSearch;
};

export type RouteDefinition = {
  path: string;
  component: ComponentType;
  loader?: (ctx: LoaderContext) => Promise<unknown>;
  children?: RouteDefinition[];
};

export type RouteMatch = {
  routeId: string;
  params: Record<string, string>;
  loaderData: unknown;
  loader?: (ctx: LoaderContext) => Promise<unknown>;
  component: ComponentType;
};

export type RouterState = {
  location: ParsedLocation;
  matches: RouteMatch[];
  status: "idle" | "loading" | "error";
  error?: unknown;
};
