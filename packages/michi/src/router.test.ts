import { describe, it, expect, vi, afterEach } from "vitest";
import { Router } from "./router";
import type { RouteDefinition } from "./types";
import type { NavigateTo } from "./typed";

let mockPathname = "/";

function setMockPathname(pathname: string) {
  mockPathname = pathname;
}

function resetMockPathname() {
  mockPathname = "/";
}

const MockHistory = vi.hoisted(() => {
  const listeners = new Set<(loc: { pathname: string; search: string; hash: string }) => void>();

  function parseUrl(to: string): {
    pathname: string;
    search: string;
    hash: string;
  } {
    const questionIdx = to.indexOf("?");
    const hashIdx = to.indexOf("#");
    const endPath = questionIdx !== -1 ? questionIdx : hashIdx !== -1 ? hashIdx : to.length;
    const pathname = to.slice(0, endPath);
    const search =
      questionIdx !== -1 ? to.slice(questionIdx, hashIdx !== -1 ? hashIdx : to.length) : "";
    const hash = hashIdx !== -1 ? to.slice(hashIdx) : "";
    return { pathname, search, hash };
  }

  return class MockHistory {
    push(to: string) {
      mockPathname = to;
      const loc = parseUrl(to);
      listeners.forEach((l) => l(loc));
    }
    getLocation() {
      return parseUrl(mockPathname);
    }
    subscribe(cb: (loc: { pathname: string; search: string; hash: string }) => void) {
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
    const timeout = setTimeout(() => reject(new Error("waitForIdle timeout")), timeoutMs);
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
    expect(state.matches[0]!.routeId).toBe("__root");
    expect(state.matches[1]!.routeId).toBe("/about");
  });

  it("navigate() updates state", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    router.navigate("/about");
    await waitForIdle(router);

    const state = router.getState();
    expect(state.matches[1]!.routeId).toBe("/about");
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
    expect(state.matches[1]!.params).toEqual({ id: "atharv" });
  });

  it("returns empty matches for unmatched routes", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    router.navigate("/nonexistent" as NavigateTo);
    await waitForIdle(router);

    const state = router.getState();
    expect(state.matches).toHaveLength(1);
    expect(state.matches[0]!.routeId).toBe("__root");
  });

  it("navigate() returns early on invalid path", async () => {
    setMockPathname("/");
    const router = new Router(routes);
    await waitForIdle(router);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    router.navigate("" as NavigateTo);
    expect(router.getState().location.pathname).toBe("/");

    router.navigate("about" as NavigateTo);
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
        children: [{ path: "/user/$id", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);
    router.navigate("/user/atharv");
    await waitForIdle(router);

    expect(loader).toHaveBeenCalled();
    const state = router.getState();
    expect(state.matches[1]!.loaderData).toEqual({ name: "atharv" });
  });

  it("passes params in LoaderContext", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/user/$id", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);
    router.navigate("/user/atharv");
    await waitForIdle(router);

    expect(loader).toHaveBeenCalledWith(expect.objectContaining({ params: { id: "atharv" } }));
  });

  it("sets status to loading then idle on navigation", async () => {
    let resolveLoader: (value: unknown) => void;
    const loader = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLoader = resolve;
        }),
    );
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/slow", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    const statuses: string[] = [];
    router.subscribe(() => {
      statuses.push(router.getState().status);
    });

    router.navigate("/slow" as NavigateTo);
    await vi.waitFor(
      () => {
        expect(statuses).toContain("loading");
      },
      { timeout: 2000 },
    );

    resolveLoader!(null);
    await waitForIdle(router);

    expect(statuses).toContain("idle");
  });

  it("discards stale loader results on rapid navigation", async () => {
    let resolveFirst: (value: unknown) => void;
    let resolveSecond: (value: unknown) => void;

    const firstLoader = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
    );
    const secondLoader = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSecond = resolve;
        }),
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

    router.navigate("/slow" as NavigateTo);
    router.navigate("/fast" as NavigateTo);

    resolveSecond!({ page: "fast" });
    await waitForIdle(router);

    expect(router.getState().matches[1]!.loaderData).toEqual({ page: "fast" });

    resolveFirst!({ page: "slow" });
    await new Promise((r) => setTimeout(r, 0));

    expect(router.getState().matches[1]!.loaderData).toEqual({ page: "fast" });
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
        children: [{ path: "/page", component: () => null, loader: childLoader }],
      },
    ];

    const router = new Router(routesWithLoaders);
    await waitForIdle(router);

    expect(callOrder).toEqual(["root-start", "child-start", "root-end", "child-end"]);
    expect(router.getState().matches[0]!.loaderData).toBe("root-data");
    expect(router.getState().matches[1]!.loaderData).toBe("child-data");
  });

  it("skips loader when route and params haven't changed", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "atharv" });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/user/$id", component: () => null, loader }],
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

  it("preserves match object identity for unchanged routes", async () => {
    const rootLoader = vi.fn().mockResolvedValue({ role: "admin" });
    const childLoader = vi.fn().mockResolvedValue({ name: "atharv" });
    const routesWithLoaders: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        loader: rootLoader,
        children: [{ path: "/user/$id", component: () => null, loader: childLoader }],
      },
    ];

    const router = new Router(routesWithLoaders);
    await waitForIdle(router);

    router.navigate("/user/atharv");
    await waitForIdle(router);
    const firstRootMatch = router.getState().matches[0];

    // Navigate to different child - root match should keep identity
    router.navigate("/user/john");
    await waitForIdle(router);
    const secondRootMatch = router.getState().matches[0];

    expect(secondRootMatch).toBe(firstRootMatch);

    // Same URL, same params - match identity preserved
    router.navigate("/user/john");
    await waitForIdle(router);
    const thirdRootMatch = router.getState().matches[0];
    const thirdChildMatch = router.getState().matches[1];

    expect(thirdRootMatch).toBe(firstRootMatch);

    // Capture child match, navigate away and back - different object
    // (prev for child is now the /user/john match, not the original)
    router.navigate("/user/atharv");
    await waitForIdle(router);
    const fourthChildMatch = router.getState().matches[1];

    // Child is a new object (different prev), but root still same
    expect(router.getState().matches[0]).toBe(firstRootMatch);
    expect(fourthChildMatch).not.toBe(thirdChildMatch);
  });

  it("reuses loaderData for parent route when only child changes", async () => {
    const rootLoader = vi.fn().mockResolvedValue({ role: "admin" });
    const childLoader = vi.fn().mockResolvedValue({ name: "atharv" });
    const routesWithLoaders: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        loader: rootLoader,
        children: [{ path: "/user/$id", component: () => null, loader: childLoader }],
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

  it("puts loader error on match when loader throws", async () => {
    const loader = vi.fn().mockRejectedValue(new Error("fetch failed"));
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/fail", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);
    router.navigate("/fail" as NavigateTo);
    await waitForIdle(router);

    const state = router.getState();
    expect(state.status).toBe("idle");
    const failMatch = state.matches.find((m) => m.routeId === "/fail");
    expect(failMatch).toBeDefined();
    expect(failMatch!.error).toBeInstanceOf(Error);
    expect((failMatch!.error as Error).message).toBe("fetch failed");
  });

  it("clears loader error on successful re-run", async () => {
    let shouldFail = true;
    const loader = vi.fn().mockImplementation(async () => {
      if (shouldFail) throw new Error("temporary failure");
      return { ok: true };
    });

    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/flaky", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    router.navigate("/flaky" as NavigateTo);
    await waitForIdle(router);
    let state = router.getState();
    let match = state.matches.find((m) => m.routeId === "/flaky");
    expect(match!.error).toBeInstanceOf(Error);
    expect((match!.error as Error).message).toBe("temporary failure");

    shouldFail = false;
    router.navigate("/flaky" as NavigateTo);
    await waitForIdle(router);
    state = router.getState();
    match = state.matches.find((m) => m.routeId === "/flaky");
    expect(match!.error).toBeUndefined();
    expect(match!.loaderData).toEqual({ ok: true });
  });
});

describe("Prefetch integration", () => {
  it("prefetch populates cache, navigate consumes it without re-running loader", async () => {
    const loader = vi.fn().mockResolvedValue({ data: "prefetched" });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/target", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // Simulate hover: prefetch triggers loader
    await router.prefetch("/target" as NavigateTo);
    expect(loader).toHaveBeenCalledTimes(1);

    // Simulate click: navigate finds cached promise, skips loader
    router.navigate("/target" as NavigateTo);
    await waitForIdle(router);

    expect(loader).toHaveBeenCalledTimes(1);
    const state = router.getState();
    const match = state.matches.find((m) => m.routeId === "/target");
    expect(match!.loaderData).toEqual({ data: "prefetched" });
  });

  it("navigate without prefetch runs loader fresh", async () => {
    const loader = vi.fn().mockResolvedValue({ data: "fresh" });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/direct", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // No prefetch - navigate runs loader directly
    router.navigate("/direct" as NavigateTo);
    await waitForIdle(router);

    expect(loader).toHaveBeenCalledTimes(1);
    const state = router.getState();
    const match = state.matches.find((m) => m.routeId === "/direct");
    expect(match!.loaderData).toEqual({ data: "fresh" });
  });

  it("failed prefetch does not block subsequent navigation", async () => {
    let shouldFail = true;
    const loader = vi.fn().mockImplementation(async () => {
      if (shouldFail) throw new Error("prefetch failed");
      return { data: "recovered" };
    });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/retry", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // Hover prefetch fails - error lands on match, promise still resolves
    await router.prefetch("/retry" as NavigateTo);

    // Navigate consumes the cached result - error is visible on state
    router.navigate("/retry" as NavigateTo);
    await waitForIdle(router);

    let state = router.getState();
    let match = state.matches.find((m) => m.routeId === "/retry");
    expect(match!.error).toBeInstanceOf(Error);
    expect((match!.error as Error).message).toBe("prefetch failed");

    // Navigate away and back - cache was consumed, fresh loader runs
    shouldFail = false;
    router.navigate("/");
    await waitForIdle(router);
    router.navigate("/retry" as NavigateTo);
    await waitForIdle(router);

    state = router.getState();
    match = state.matches.find((m) => m.routeId === "/retry");
    expect(match!.error).toBeUndefined();
    expect(match!.loaderData).toEqual({ data: "recovered" });
  });
});

describe("Search params", () => {
  it("passes search params to loader context", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/search", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // Mock navigate with search params
    mockPathname = "/search?foo=bar&baz=qux";
    router.navigate("/search?foo=bar&baz=qux" as NavigateTo);
    await waitForIdle(router);

    expect(loader).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {},
        search: { foo: "bar", baz: "qux" },
      }),
    );
  });

  it("prefetch passes search params to loader context", async () => {
    const loader = vi.fn().mockResolvedValue({ data: "prefetched" });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/prefetch", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    await router.prefetch("/prefetch?search=test");

    expect(loader).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {},
        search: { search: "test" },
      }),
    );
  });

  it("validateSearch receives raw params and its output goes to loader context", async () => {
    const validateSearch = vi.fn().mockReturnValue({ page: 1 });
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithValidator: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/paged", component: () => null, loader, validateSearch }],
      },
    ];

    const router = new Router(routesWithValidator);
    await waitForIdle(router);

    mockPathname = "/paged?page=5";
    router.navigate("/paged?page=5" as NavigateTo);
    await waitForIdle(router);

    expect(validateSearch).toHaveBeenCalledWith({ page: "5" });
    expect(loader).toHaveBeenCalledWith(expect.objectContaining({ search: { page: 1 } }));
  });

  it("validateSearch throwing puts error on match and skips loader", async () => {
    const validateSearch = vi.fn().mockImplementation(() => {
      throw new Error("invalid page param");
    });
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithValidator: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/strict", component: () => null, loader, validateSearch }],
      },
    ];

    const router = new Router(routesWithValidator);
    await waitForIdle(router);

    mockPathname = "/strict?page=abc";
    router.navigate("/strict?page=abc" as NavigateTo);
    await waitForIdle(router);

    const state = router.getState();
    const match = state.matches.find((m) => m.routeId === "/strict");
    expect(match).toBeDefined();
    expect(match!.error).toBeInstanceOf(Error);
    expect((match!.error as Error).message).toBe("invalid page param");
    expect(match!.search).toBeUndefined();
    expect(loader).not.toHaveBeenCalled();
  });

  it("rawSearch is set on every match", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/inspect", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    mockPathname = "/inspect?color=blue&size=10";
    router.navigate("/inspect?color=blue&size=10" as NavigateTo);
    await waitForIdle(router);

    const state = router.getState();
    for (const match of state.matches) {
      expect(match.rawSearch).toEqual({ color: "blue", size: "10" });
    }
  });

  it("same URL with same search params does not re-run loader", async () => {
    const loader = vi.fn().mockResolvedValue({ data: "once" });
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/stable", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    mockPathname = "/stable?q=hello";
    router.navigate("/stable?q=hello" as NavigateTo);
    await waitForIdle(router);
    expect(loader).toHaveBeenCalledTimes(1);

    router.navigate("/stable?q=hello" as NavigateTo);
    await waitForIdle(router);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("navigate() merges search params by default", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/dash", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // First navigation: set color=blue via options.search
    router.navigate("/dash" as NavigateTo, { search: { color: "blue" } });
    await waitForIdle(router);

    // Second navigation: set size=10 - color should persist (merge mode)
    router.navigate("/dash" as NavigateTo, { search: { size: "10" } });
    await waitForIdle(router);

    const state = router.getState();
    const match = state.matches.find((m) => m.routeId === "/dash");
    expect(match!.rawSearch).toEqual({ color: "blue", size: "10" });
  });

  it("searchMode: 'replace' replaces all search params", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/dash", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // First navigation: set color=blue
    router.navigate("/dash" as NavigateTo, { search: { color: "blue" } });
    await waitForIdle(router);

    // Second navigation with replace mode: only size=10 - color should be gone
    router.navigate("/dash" as NavigateTo, { search: { size: "10" }, searchMode: "replace" });
    await waitForIdle(router);

    const state = router.getState();
    const match = state.matches.find((m) => m.routeId === "/dash");
    expect(match!.rawSearch).toEqual({ size: "10" });
  });

  it("navigate() with function search receives current params", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/counter", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // Set page=1
    router.navigate("/counter" as NavigateTo, { search: { page: "1" } });
    await waitForIdle(router);

    // Use function form to increment page
    router.navigate("/counter" as NavigateTo, {
      search: (prev: Record<string, string>) => ({
        ...prev,
        page: String(Number(prev["page"]) + 1),
      }),
    });
    await waitForIdle(router);

    const state = router.getState();
    const match = state.matches.find((m) => m.routeId === "/counter");
    expect(match!.rawSearch).toEqual({ page: "2" });
  });

  it("deletes a param when set to undefined", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/items", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // Set page and filter
    router.navigate("/items" as NavigateTo, { search: { page: "1", filter: "shoes" } });
    await waitForIdle(router);
    expect(router.getState().matches.find((m) => m.routeId === "/items")!.rawSearch).toEqual({
      page: "1",
      filter: "shoes",
    });

    // Remove filter via undefined
    router.navigate("/items" as NavigateTo, {
      search: (prev: Record<string, string>) => ({ ...prev, filter: undefined }),
    });
    await waitForIdle(router);

    const match = router.getState().matches.find((m) => m.routeId === "/items");
    expect(match!.rawSearch).toEqual({ page: "1" });
    expect(match!.rawSearch!["filter"]).toBeUndefined();
  });

  it("sets multiple params at once", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/search", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    router.navigate("/search" as NavigateTo, {
      search: { page: "2", sort: "date", filter: "active" },
    });
    await waitForIdle(router);

    const match = router.getState().matches.find((m) => m.routeId === "/search");
    expect(match!.rawSearch).toEqual({ page: "2", sort: "date", filter: "active" });
  });

  it("string URL to + search option merges onto URL's own params", async () => {
    const loader = vi.fn().mockResolvedValue(null);
    const routesWithLoader: RouteDefinition[] = [
      {
        path: "__root",
        component: () => null,
        children: [{ path: "/mixed", component: () => null, loader }],
      },
    ];

    const router = new Router(routesWithLoader);
    await waitForIdle(router);

    // to has ?page=1 embedded, search option adds sort=date
    router.navigate("/mixed?page=1" as NavigateTo, { search: { sort: "date" } });
    await waitForIdle(router);

    const match = router.getState().matches.find((m) => m.routeId === "/mixed");
    expect(match!.rawSearch).toEqual({ page: "1", sort: "date" });
  });
});
