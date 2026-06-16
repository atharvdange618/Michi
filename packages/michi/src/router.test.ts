import { describe, it, expect, vi, afterEach } from "vitest";
import { Router } from "./router";
import type { RouteDefinition } from "./types";

let mockPathname = "/";

function setMockPathname(pathname: string) {
  mockPathname = pathname;
}

function resetMockPathname() {
  mockPathname = "/";
}

const MockHistory = vi.hoisted(() => {
  const listeners = new Set<
    (loc: { pathname: string; search: string; hash: string }) => void
  >();
  return class MockHistory {
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
  };
});

vi.mock("./history", () => ({
  History: MockHistory,
}));

afterEach(() => {
  resetMockPathname();
});

function waitForIdle(router: Router, timeoutMs = 2000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("waitForIdle timeout")),
      timeoutMs,
    );
    const unsub = router.subscribe(() => {
      if (router.getState().status === "idle") {
        clearTimeout(timeout);
        unsub();
        resolve();
      }
    });
  });
}

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
  it("initializes with the current pathname", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    const state = router.getState();
    expect(state.location.pathname).toBe("/");
    expect(state.status).toBe("idle");
  });

  it("matches the current route on init", async () => {
    setMockPathname("/about");
    const router = new Router(routes);
    await waitForIdle(router);
    const state = router.getState();
    expect(state.matches).toHaveLength(2);
    expect(state.matches[0].routeId).toBe("__root");
    expect(state.matches[1].routeId).toBe("/about");
  });

  it("navigate() updates state", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    router.navigate("/about");
    await waitForIdle(router);

    const state = router.getState();
    expect(state.matches[1].routeId).toBe("/about");
  });

  it("subscribe() fires on navigation", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    const listener = vi.fn();
    router.subscribe(listener);

    router.navigate("/about");
    await waitForIdle(router);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("unsubscribe stops notifications", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    const listener = vi.fn();
    const unsub = router.subscribe(listener);

    router.navigate("/about");
    await waitForIdle(router);
    const countAfterFirst = listener.mock.calls.length;
    expect(countAfterFirst).toBeGreaterThanOrEqual(1);

    unsub();
    listener.mockClear();
    router.navigate("/");
    await waitForIdle(router);
    expect(listener).toHaveBeenCalledTimes(0);
  });

  it("supports multiple subscribers", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    const a = vi.fn();
    const b = vi.fn();
    router.subscribe(a);
    router.subscribe(b);

    router.navigate("/about");
    await waitForIdle(router);
    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
  });

  it("matches dynamic params", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    router.navigate("/user/atharv");
    await waitForIdle(router);

    const state = router.getState();
    expect(state.matches[1].params).toEqual({ id: "atharv" });
  });

  it("returns empty matches for unmatched routes", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    router.navigate("/nonexistent");
    await waitForIdle(router);

    const state = router.getState();
    expect(state.matches).toHaveLength(1);
    expect(state.matches[0].routeId).toBe("__root");
  });

  it("navigate() returns early on invalid path", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    router.navigate("");
    expect(router.getState().location.pathname).toBe("/");

    router.navigate("about");
    expect(router.getState().location.pathname).toBe("/");

    warn.mockRestore();
  });
});

describe("Loaders", () => {
  it("runs loader and populates loaderData", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "atharv" });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [
          { path: "/user/$id", component: () => null, loader },
        ],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);
    router.navigate("/user/atharv");
    await waitForIdle(router);

    expect(loader).toHaveBeenCalled();
    const state = router.getState();
    expect(state.matches[1].loaderData).toEqual({ name: "atharv" });
  });

  it("passes params in LoaderContext", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [
          { path: "/user/$id", component: () => null, loader },
        ],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);
    router.navigate("/user/atharv");
    await waitForIdle(router);

    expect(loader).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: "atharv" } }),
    );
  });

  it("sets status to loading then idle on navigation", async () => {
    let resolveLoader: (value: unknown) => void;
    const loader = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveLoader = resolve; }),
    );
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [
          { path: "/slow", component: () => null, loader },
        ],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    const statuses: string[] = [];
    router.subscribe(() => {
      statuses.push(router.getState().status);
    });

    router.navigate("/slow");
    await vi.waitFor(() => {
      expect(statuses).toContain("loading");
    }, { timeout: 2000 });

    resolveLoader!(null);
    await waitForIdle(router);

    expect(statuses).toContain("idle");
  });

  it("discards stale loader results on rapid navigation", async () => {
    let resolveFirst: (value: unknown) => void;
    let resolveSecond: (value: unknown) => void;

    const firstLoader = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveFirst = resolve; }),
    );
    const secondLoader = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveSecond = resolve; }),
    );

    const routesWithLoaders: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [
          { path: "/slow", component: () => null, loader: firstLoader },
          { path: "/fast", component: () => null, loader: secondLoader },
        ],
      },
    ];

    const router = new Router(routesWithLoaders);
    await waitForIdle(router);

    router.navigate("/slow");
    router.navigate("/fast");

    resolveSecond!({ page: "fast" });
    await waitForIdle(router);

    expect(router.getState().matches[1].loaderData).toEqual({ page: "fast" });

    resolveFirst!({ page: "slow" });
    await new Promise((r) => setTimeout(r, 0));

    expect(router.getState().matches[1].loaderData).toEqual({ page: "fast" });
  });

  it("runs loaders in parallel for nested routes", async () => {
    const callOrder: string[] = [];
    const rootLoader = vi.fn().mockImplementation(async () => {
      callOrder.push("root-start");
      await new Promise((r) => setTimeout(r, 50));
      callOrder.push("root-end");
      return "root-data";
    });
    const childLoader = vi.fn().mockImplementation(async () => {
      callOrder.push("child-start");
      await new Promise((r) => setTimeout(r, 100));
      callOrder.push("child-end");
      return "child-data";
    });

    setMockPathname("/page");
    const routesWithLoaders: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        loader: rootLoader,
        children: [
          { path: "/page", component: () => null, loader: childLoader },
        ],
      },
    ];

    const router = new Router(routesWithLoaders);
    await waitForIdle(router);

    expect(callOrder).toEqual([
      "root-start",
      "child-start",
      "root-end",
      "child-end",
    ]);
    expect(router.getState().matches[0].loaderData).toBe("root-data");
    expect(router.getState().matches[1].loaderData).toBe("child-data");
  });

  it("skips loader when route and params haven't changed", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "atharv" });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [
          { path: "/user/$id", component: () => null, loader },
        ],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    router.navigate("/user/atharv");
    await waitForIdle(router);
    expect(loader).toHaveBeenCalledTimes(1);

    router.navigate("/user/atharv");
    await waitForIdle(router);
    expect(loader).toHaveBeenCalledTimes(1);

    router.navigate("/user/john");
    await waitForIdle(router);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("reuses loaderData for parent route when only child changes", async () => {
    const rootLoader = vi.fn().mockResolvedValue({ role: "admin" });
    const childLoader = vi.fn().mockResolvedValue({ name: "atharv" });
    const routesWithLoaders: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        loader: rootLoader,
        children: [
          { path: "/user/$id", component: () => null, loader: childLoader },
        ],
      },
    ];

    const router = new Router(routesWithLoaders);
    await waitForIdle(router);

    router.navigate("/user/atharv");
    await waitForIdle(router);
    expect(rootLoader).toHaveBeenCalledTimes(1);
    expect(childLoader).toHaveBeenCalledTimes(1);

    router.navigate("/user/john");
    await waitForIdle(router);
    expect(rootLoader).toHaveBeenCalledTimes(1);
    expect(childLoader).toHaveBeenCalledTimes(2);
  });

  it("sets status to error when loader throws", async () => {
    const loader = vi.fn().mockRejectedValue(new Error("fetch failed"));
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [
          { path: "/fail", component: () => null, loader },
        ],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);
    router.navigate("/fail");
    await vi.waitFor(() => {
      expect(router.getState().status).toBe("error");
    });

    const state = router.getState();
    expect(state.error).toBeInstanceOf(Error);
    expect((state.error as Error).message).toBe("fetch failed");
  });
});
