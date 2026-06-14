import { describe, it, expect } from "vitest";
import { matchRoute, matchTree } from "./matcher";
import type { RouteDefinition } from "./types";

describe("matchRoute", () => {
  it("matches static routes", () => {
    expect(matchRoute("/about", "/about")).toEqual({});
    expect(matchRoute("/about", "/other")).toBeNull();
  });

  it("matches dynamic params", () => {
    expect(matchRoute("/user/$id", "/user/atharv")).toEqual({ id: "atharv" });
    expect(matchRoute("/user/$id", "/user")).toBeNull();
  });

  it("matches wildcard routes", () => {
    expect(matchRoute("/files/*", "/files/a/b/c")).toEqual({
      "*": "a/b/c",
    });
  });

  it("decodes URI components in params", () => {
    expect(matchRoute("/user/$id", "/user/atharv%20dange")).toEqual({
      id: "atharv dange",
    });
  });

  it("does not match partial paths", () => {
    expect(matchRoute("/about", "/about/more")).toBeNull();
    expect(matchRoute("/about/more", "/about")).toBeNull();
  });

  it("caches compiled patterns for repeated calls", () => {
    const first = matchRoute("/user/$id", "/user/alice");
    const second = matchRoute("/user/$id", "/user/bob");
    expect(first).toEqual({ id: "alice" });
    expect(second).toEqual({ id: "bob" });
  });
});

describe("matchTree", () => {
  it("matches a flat route list", () => {
    const routes: RouteDefinition[] = [
      { path: "/", component: () => null },
      { path: "/about", component: () => null },
    ];

    const matches = matchTree(routes, "/about");
    expect(matches).toHaveLength(1);
    expect(matches[0].routeId).toBe("/about");
  });

  it("matches nested routes under __root", () => {
    const Root = () => null;
    const About = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [{ path: "/about", component: About }],
      },
    ];

    const matches = matchTree(routes, "/about");
    expect(matches).toHaveLength(2);
    expect(matches[0].routeId).toBe("__root");
    expect(matches[1].routeId).toBe("/about");
  });

  it("returns only root match when no child matches", () => {
    const Root = () => null;
    const About = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [{ path: "/about", component: About }],
      },
    ];

    const matches = matchTree(routes, "/nonexistent");
    expect(matches).toHaveLength(1);
    expect(matches[0].routeId).toBe("__root");
  });

  it("matches dynamic params in nested routes", () => {
    const Root = () => null;
    const User = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [{ path: "/user/$id", component: User }],
      },
    ];

    const matches = matchTree(routes, "/user/atharv");
    expect(matches).toHaveLength(2);
    expect(matches[1].params).toEqual({ id: "atharv" });
  });

  it("treats any _ prefixed path as a layout route", () => {
    const Root = () => null;
    const Auth = () => null;
    const Dashboard = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [
          {
            path: "_auth",
            component: Auth,
            children: [{ path: "/dashboard", component: Dashboard }],
          },
        ],
      },
    ];

    const matches = matchTree(routes, "/dashboard");
    expect(matches).toHaveLength(3);
    expect(matches[0].routeId).toBe("__root");
    expect(matches[1].routeId).toBe("_auth");
    expect(matches[2].routeId).toBe("/dashboard");
  });

  it("returns empty array when no routes match", () => {
    const routes: RouteDefinition[] = [
      { path: "/about", component: () => null },
    ];

    const matches = matchTree(routes, "/nonexistent");
    expect(matches).toHaveLength(0);
  });

  it("skips layout routes whose children don't match, letting siblings try", () => {
    const Root = () => null;
    const Auth = () => null;
    const SettingsLayout = () => null;
    const ProfilePage = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [
          {
            path: "_auth",
            component: Auth,
            children: [{ path: "/dashboard", component: () => null }],
          },
          {
            path: "/settings",
            component: SettingsLayout,
            children: [{ path: "/settings/profile", component: ProfilePage }],
          },
        ],
      },
    ];

    const matches = matchTree(routes, "/settings/profile");
    expect(matches).toHaveLength(3);
    expect(matches[0].routeId).toBe("__root");
    expect(matches[1].routeId).toBe("/settings");
    expect(matches[2].routeId).toBe("/settings/profile");
  });

  it("matches 3-level nested routes (root → layout → child)", () => {
    const Root = () => null;
    const SettingsLayout = () => null;
    const ProfilePage = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [
          {
            path: "/settings",
            component: SettingsLayout,
            children: [{ path: "/settings/profile", component: ProfilePage }],
          },
        ],
      },
    ];

    const matches = matchTree(routes, "/settings/profile");
    expect(matches).toHaveLength(3);
    expect(matches[0].routeId).toBe("__root");
    expect(matches[1].routeId).toBe("/settings");
    expect(matches[2].routeId).toBe("/settings/profile");
  });

  it("matches pathless layout (_auth) wrapping a nested layout", () => {
    const Root = () => null;
    const Auth = () => null;
    const DashboardLayout = () => null;
    const AnalyticsPage = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [
          {
            path: "_auth",
            component: Auth,
            children: [
              {
                path: "/dashboard",
                component: DashboardLayout,
                children: [
                  {
                    path: "/dashboard/analytics",
                    component: AnalyticsPage,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const matches = matchTree(routes, "/dashboard/analytics");
    expect(matches).toHaveLength(4);
    expect(matches[0].routeId).toBe("__root");
    expect(matches[1].routeId).toBe("_auth");
    expect(matches[2].routeId).toBe("/dashboard");
    expect(matches[3].routeId).toBe("/dashboard/analytics");
  });

  it("matches nested layout children independently", () => {
    const Root = () => null;
    const SettingsLayout = () => null;
    const ProfilePage = () => null;
    const BillingPage = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [
          {
            path: "/settings",
            component: SettingsLayout,
            children: [
              { path: "/settings/profile", component: ProfilePage },
              { path: "/settings/billing", component: BillingPage },
            ],
          },
        ],
      },
    ];

    const profileMatches = matchTree(routes, "/settings/profile");
    expect(profileMatches).toHaveLength(3);
    expect(profileMatches[2].routeId).toBe("/settings/profile");

    const billingMatches = matchTree(routes, "/settings/billing");
    expect(billingMatches).toHaveLength(3);
    expect(billingMatches[2].routeId).toBe("/settings/billing");
  });

  it("matches a parent route with children when no child matches", () => {
    const Root = () => null;
    const SettingsLayout = () => null;
    const ProfilePage = () => null;

    const routes: RouteDefinition[] = [
      {
        path: "__root",
        component: Root,
        children: [
          {
            path: "/settings",
            component: SettingsLayout,
            children: [{ path: "/settings/profile", component: ProfilePage }],
          },
        ],
      },
    ];

    const matches = matchTree(routes, "/settings");
    expect(matches).toHaveLength(2);
    expect(matches[0].routeId).toBe("__root");
    expect(matches[1].routeId).toBe("/settings");
  });
});
