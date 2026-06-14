import type { ComponentType } from "react";

export type ParsedLocation = {
  pathname: string;
  search: string;
  hash: string;
};

export type RouteDefinition = {
  path: string;
  component: ComponentType;
  children?: RouteDefinition[];
};

export type RouteMatch = {
  routeId: string;
  params: Record<string, string>;
  loaderData: unknown;
  component: ComponentType;
};

export type RouterState = {
  location: ParsedLocation;
  matches: RouteMatch[];
  status: "idle" | "loading" | "error";
};
