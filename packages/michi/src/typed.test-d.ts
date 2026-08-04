import { describe, test, expectTypeOf } from "vitest";
import type { RouteDefinition } from "./types";
import type { ParsePathParams, PathsOf, RouteInfoOf, TypedPath } from "./typed";

// Dummy component - these tests never render anything, they only exist to give
// tsc a tree shaped exactly like what codegen.ts's `satisfies RouteDefinition[]`
// output produces, so `typed.ts`'s utilities are exercised against the real shape
// instead of a simplified stand-in.
const C = () => null;

const fixtureTree = [
  {
    path: "__root",
    component: C,
    children: [
      { path: "/", component: C },
      { path: "/about", component: C },
      {
        path: "/user/$id",
        component: C,
        loader: async (ctx: { params: { id: string } }) => ({
          name: "atharv",
          id: ctx.params.id,
        }),
      },
      {
        path: "/user/$userId/post/$postId",
        component: C,
      },
      {
        path: "/users",
        component: C,
        validateSearch: (raw: Record<string, string>) => ({
          page: Number(raw["page"] ?? "1"),
        }),
      },
      { path: "/files/*", component: C },
      {
        path: "_auth",
        component: C,
        children: [{ path: "/dashboard", component: C }],
      },
    ],
  },
] as const satisfies RouteDefinition[];

type Tree = typeof fixtureTree;

describe("ParsePathParams", () => {
  test("root path has no params", () => {
    expectTypeOf<ParsePathParams<"/">>().toEqualTypeOf<{}>();
  });

  test("static path has no params", () => {
    expectTypeOf<ParsePathParams<"/about">>().toEqualTypeOf<{}>();
  });

  test("single dynamic segment", () => {
    expectTypeOf<ParsePathParams<"/user/$id">>().toEqualTypeOf<{
      id: string;
    }>();
  });

  test("multiple dynamic segments", () => {
    expectTypeOf<ParsePathParams<"/user/$userId/post/$postId">>().toEqualTypeOf<{
      userId: string;
      postId: string;
    }>();
  });

  test("wildcard segment uses the '*' key, matching matchRoute's runtime convention", () => {
    expectTypeOf<ParsePathParams<"/files/*">>().toEqualTypeOf<{
      "*": string;
    }>();
  });
});

describe("PathsOf", () => {
  test("collects every navigable path, excludes layout routes", () => {
    expectTypeOf<PathsOf<Tree>>().toEqualTypeOf<
      | "/"
      | "/about"
      | "/user/$id"
      | "/user/$userId/post/$postId"
      | "/users"
      | "/files/*"
      | "/dashboard"
    >();
  });

  test("layout paths never appear, even though their children do", () => {
    // @ts-expect-error - "__root" is a layout route, must not be a valid PathsOf member
    const _root: PathsOf<Tree> = "__root";
    // @ts-expect-error - "_auth" is a layout route, must not be a valid PathsOf member
    const _auth: PathsOf<Tree> = "_auth";
    void _root;
    void _auth;
  });
});

describe("RouteInfoOf", () => {
  test("route with no loader falls back to loaderData: undefined, not unknown", () => {
    expectTypeOf<RouteInfoOf<Tree>["/about"]["loaderData"]>().toEqualTypeOf<undefined>();
  });

  test("route with no validateSearch falls back to raw Record<string,string>", () => {
    expectTypeOf<RouteInfoOf<Tree>["/about"]["search"]>().toEqualTypeOf<Record<string, string>>();
  });

  test("params come from the path pattern itself", () => {
    expectTypeOf<RouteInfoOf<Tree>["/user/$id"]["params"]>().toEqualTypeOf<{
      id: string;
    }>();
  });

  test("loaderData is inferred from the route's actual loader return type", () => {
    expectTypeOf<RouteInfoOf<Tree>["/user/$id"]["loaderData"]>().toEqualTypeOf<{
      name: string;
      id: string;
    }>();
  });

  test("search is inferred from the route's actual validateSearch return type", () => {
    expectTypeOf<RouteInfoOf<Tree>["/users"]["search"]>().toEqualTypeOf<{
      page: number;
    }>();
  });

  test("layout routes are not keys on the RouteInfo map", () => {
    // @ts-expect-error - "__root" was excluded by FlattenRoutes, not a valid key
    type _NoRoot = RouteInfoOf<Tree>["__root"];
  });
});

describe("TypedPath", () => {
  test("root path round-trips correctly - regression test for a real bug", () => {
    // Split's empty-string base case used to return [] instead of [""], which
    // doesn't match real String.prototype.split ("".split("/") is [""], not []).
    // That silently collapsed the root path through Split->JoinSegments, turning
    // "/" into "" - only caught by running codegen against a real app with an
    // actual "/" route; no hand-written fixture before this one happened to hit it.
    const p: TypedPath<Tree> = "/";
    void p;
  });

  test("static paths stay literal", () => {
    const p: TypedPath<Tree> = "/about";
    void p;
  });

  test("dynamic paths accept any interpolated value in the param position", () => {
    const p: TypedPath<Tree> = "/user/atharv";
    const p2: TypedPath<Tree> = "/user/atharv/post/42";
    void p;
    void p2;
  });

  test("wildcard paths accept any trailing value", () => {
    const p: TypedPath<Tree> = "/files/public/uploads/report.pdf";
    void p;
  });

  test("a nonexistent path is a compile error", () => {
    // @ts-expect-error - "/nonexistent" doesn't match any route in the tree
    const p: TypedPath<Tree> = "/nonexistent";
    void p;
  });

  test("a typo'd static path is a compile error", () => {
    // @ts-expect-error - "/abuot" is a typo, not a real route
    const p: TypedPath<Tree> = "/abuot";
    void p;
  });
});
