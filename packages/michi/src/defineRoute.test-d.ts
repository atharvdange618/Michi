import { describe, test, expectTypeOf } from "vitest";
import { defineRoute } from "./react";
import type { NavigateTo } from "./typed";

// Simulate what a generated routeTree.gen.ts would declare via
// `declare module "michi" { interface RouteRegistry { routes: ... } }`.
// This is the one place in the test suite standing in for codegen's output.
declare module "./types" {
  interface RouteRegistry {
    routes: {
      "/": {
        params: {};
        search: Record<string, string>;
        loaderData: undefined;
      };
      "/about": {
        params: {};
        search: Record<string, string>;
        loaderData: undefined;
      };
      "/user/$id": {
        params: { id: string };
        search: Record<string, string>;
        loaderData: { name: string; id: string };
      };
      "/users": {
        params: {};
        search: { page: number };
        loaderData: { users: string[] };
      };
      "/prefetch-demo": {
        params: {};
        search: Record<string, string>;
        loaderData: undefined;
      };
    };
  }
}

describe("defineRoute", () => {
  test("root path: useParams returns {}", () => {
    const Route = defineRoute("/");
    expectTypeOf(Route.useParams).returns.toEqualTypeOf<{}>();
  });

  test("static route with no params: useParams returns {}", () => {
    const Route = defineRoute("/about");
    expectTypeOf(Route.useParams).returns.toEqualTypeOf<{}>();
  });

  test("static route with no validateSearch: useSearch returns raw Record<string,string>", () => {
    const Route = defineRoute("/about");
    expectTypeOf(Route.useSearch).returns.toEqualTypeOf<Record<string, string>>();
  });

  test("static route with no loader: useLoaderData returns undefined", () => {
    const Route = defineRoute("/about");
    expectTypeOf(Route.useLoaderData).returns.toEqualTypeOf<undefined>();
  });

  test("dynamic route: useParams returns the parsed param shape, not a loose index signature", () => {
    const Route = defineRoute("/user/$id");
    expectTypeOf(Route.useParams).returns.toEqualTypeOf<{ id: string }>();
  });

  test("dynamic route: useLoaderData returns the route's real loader return type", () => {
    const Route = defineRoute("/user/$id");
    expectTypeOf(Route.useLoaderData).returns.toEqualTypeOf<{
      name: string;
      id: string;
    }>();
  });

  test("route with validateSearch: useSearch returns the validated shape, not raw strings", () => {
    const Route = defineRoute("/users");
    expectTypeOf(Route.useSearch).returns.toEqualTypeOf<{ page: number }>();
  });

  test("an unregistered path is a compile error", () => {
    // @ts-expect-error - "/nonexistent" was never registered on RouteRegistry
    defineRoute("/nonexistent");
  });
});

describe("NavigateTo", () => {
  test("a registered path with a query string - regression test for a real bug", () => {
    // <Link to="/prefetch-demo?via=hover"> is a real pattern in the demo app.
    // NavigateTo originally only accounted for the path portion, with no allowance
    // for a "?..." suffix at all - found by running codegen against the real app,
    // not by any hand-written fixture, since none of them embedded a query string.
    const p: NavigateTo = "/prefetch-demo?via=hover";
    void p;
  });

  test("a registered path with no query string still works", () => {
    const p: NavigateTo = "/prefetch-demo";
    void p;
  });

  test("a dynamic path with a query string together", () => {
    const p: NavigateTo = "/user/atharv?tab=settings";
    void p;
  });

  test("an external URL still works", () => {
    const p: NavigateTo = "https://example.com";
    void p;
  });

  test("an unregistered path is a compile error, with or without a query string", () => {
    // @ts-expect-error - not registered, no query string
    const bad1: NavigateTo = "/nonexistent";
    // @ts-expect-error - not registered, a query string doesn't rescue it
    const bad2: NavigateTo = "/nonexistent?via=hover";
    void bad1;
    void bad2;
  });
});
