import { describe, it, expect, vi, afterEach } from "vitest";
import { Router } from "./router";
import type { RouteDefinition } from "./types";

let mockPathname = "/";

vi.mock("./history", () => {
  const listeners = new Set<
    (loc: { pathname: string; search: string; hash: string }) => void
  >();
  return {
    History: class MockHistory {
      push(to: string) {
        mockPathname = to;
        const loc = { pathname: mockPathname, search: "", hash: "" };
        listeners.forEach((l) => l(loc));
      }
      getLocation() {
        return { pathname: mockPathname, search: "", hash: "" };
      }
      subscribe(
        cb: (loc: { pathname: string; search: string; hash: string }) => void,
      ) {
        listeners.add(cb);
        return () => {
          listeners.delete(cb);
        };
      }
    },
  };
});

afterEach(() => {
  mockPathname = "/";
});

const routes: RouteDefinition[] = [
  {
    path: "__root",
    component: () => null,
    children: [
      { path: "/", component: () => null },
      { path: "/about", component: () => null },
      { path: "/user/$id", component: () => null },
    ],
  },
];

describe("Router", () => {
  it("initializes with the current pathname", () => {
    mockPathname = "/";
    const router = new Router(routes);
    const state = router.getState();
    expect(state.location.pathname).toBe("/");
    expect(state.status).toBe("idle");
  });

  it("matches the current route on init", () => {
    mockPathname = "/about";
    const router = new Router(routes);
    const state = router.getState();
    expect(state.matches).toHaveLength(2);
    expect(state.matches[0].routeId).toBe("__root");
    expect(state.matches[1].routeId).toBe("/about");
  });

  it("navigate() updates state", () => {
    mockPathname = "/";
    const router = new Router(routes);
    router.navigate("/about");

    const state = router.getState();
    expect(state.matches[1].routeId).toBe("/about");
  });

  it("subscribe() fires on navigation", () => {
    mockPathname = "/";
    const router = new Router(routes);
    const listener = vi.fn();
    router.subscribe(listener);

    router.navigate("/about");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("unsubscribe stops notifications", () => {
    mockPathname = "/";
    const router = new Router(routes);
    const listener = vi.fn();
    const unsub = router.subscribe(listener);

    router.navigate("/about");
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    router.navigate("/");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("supports multiple subscribers", () => {
    mockPathname = "/";
    const router = new Router(routes);
    const a = vi.fn();
    const b = vi.fn();
    router.subscribe(a);
    router.subscribe(b);

    router.navigate("/about");
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("matches dynamic params", () => {
    mockPathname = "/";
    const router = new Router(routes);
    router.navigate("/user/atharv");

    const state = router.getState();
    expect(state.matches[1].params).toEqual({ id: "atharv" });
  });

  it("returns empty matches for unmatched routes", () => {
    mockPathname = "/";
    const router = new Router(routes);
    router.navigate("/nonexistent");

    const state = router.getState();
    expect(state.matches).toHaveLength(1);
    expect(state.matches[0].routeId).toBe("__root");
  });
});
