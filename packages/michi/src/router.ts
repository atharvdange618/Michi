import { History } from "./history";
import { matchTree } from "./matcher";
import { runLoaders } from "./loader";
import type {
  ParsedLocation,
  RouteDefinition,
  RouteMatch,
  RouterOptions,
  RouterState,
} from "./types";
import { PrefetchCache, splitPath } from "./prefetch";

export class Router {
  private history: History;
  private routes: RouteDefinition[];
  private state: RouterState;
  private listeners = new Set<() => void>();
  private navigationId = 0;
  private previousMatches: RouteMatch[] = [];
  private prefetchCache: PrefetchCache;

  constructor(routes: RouteDefinition[], options?: RouterOptions) {
    this.routes = routes;
    this.history = new History();
    this.prefetchCache = new PrefetchCache(options?.prefetchTtlMs ?? 30_000);

    const initialLocation = this.history.getLocation();
    const initialMatchesPromise = runLoaders(this.match(initialLocation.pathname), []);

    this.state = {
      location: initialLocation,
      matches: [],
      status: "loading",
    };

    void this.commitNavigation(initialLocation, initialMatchesPromise, ++this.navigationId);

    this.history.subscribe((location) => void this.handleLocationChange(location));
  }

  private match(pathname: string): RouteMatch[] {
    return matchTree(this.routes, pathname);
  }

  prefetch(to: string): Promise<RouteMatch[]> {
    const { pathname, search } = splitPath(to);
    const key = pathname + search;
    return this.prefetchCache.getOrCreate(key, () =>
      runLoaders(this.match(pathname), this.state.matches),
    );
  }

  private async handleLocationChange(location: ParsedLocation): Promise<void> {
    const navId = ++this.navigationId;
    this.previousMatches = this.state.matches;

    const key = location.pathname + location.search;
    const cached = this.prefetchCache.peek(key);

    if (cached) this.prefetchCache.delete(key);

    const resolvedMatchesPromise = cached
      ? cached
      : runLoaders(this.match(location.pathname), this.previousMatches);

    const pendingMs = 1000;
    const pendingMinMs = 500;
    const pendingInfo = { fired: false, at: 0 };

    const pendingTimer = setTimeout(() => {
      if (navId !== this.navigationId) return;
      pendingInfo.fired = true;
      pendingInfo.at = Date.now();
      this.state = { ...this.state, location, status: "loading" };
      this.notify();
    }, pendingMs);

    await this.commitNavigation(location, resolvedMatchesPromise, navId, {
      timer: pendingTimer,
      info: pendingInfo,
      minDisplayMs: pendingMinMs,
    });
  }

  private async commitNavigation(
    location: ParsedLocation,
    resolvedMatchesPromise: Promise<RouteMatch[]>,
    navId: number,
    pending?: {
      timer: ReturnType<typeof setTimeout>;
      info: { fired: boolean; at: number };
      minDisplayMs: number;
    },
  ): Promise<void> {
    try {
      const resolvedMatches = await resolvedMatchesPromise;
      clearTimeout(pending?.timer);

      if (navId !== this.navigationId) return;

      if (pending?.info.fired) {
        const elapsed = Date.now() - pending.info.at;
        const remaining = pending.minDisplayMs - elapsed;
        if (remaining > 0) {
          await new Promise((r) => setTimeout(r, remaining));
        }
        if (navId !== this.navigationId) return;
      }

      this.state = {
        location,
        matches: resolvedMatches,
        status: "idle",
      };
    } catch (error) {
      clearTimeout(pending?.timer);
      if (navId !== this.navigationId) return;

      this.state = {
        location,
        matches: [
          {
            routeId: "__root",
            params: {},
            loaderData: undefined,
            component: () => null,
            error,
          },
        ],
        status: "idle",
      };
    }
    this.notify();
  }

  navigate(to: string): void {
    if (!to || typeof to !== "string") {
      console.warn("router.navigate() requires a non-empty string path");
      return;
    }
    if (!to.startsWith("/") && !to.startsWith("http")) {
      console.warn(`router.navigate("${to}") - paths should start with "/"`);
      return;
    }
    this.history.push(to);
  }

  getState(): RouterState {
    return this.state;
  }

  subscribe(onStoreChange: () => void): () => void {
    this.listeners.add(onStoreChange);
    return () => this.listeners.delete(onStoreChange);
  }

  private notify(): void {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error("Router listener threw:", e);
      }
    });
  }
}
