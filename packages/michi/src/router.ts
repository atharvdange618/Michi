import { History } from "./history";
import { matchTree } from "./matcher";
import { runLoaders } from "./loader";
import type { RouteDefinition, RouterState, RouteMatch, ParsedLocation } from "./types";

export class Router {
  private history: History;
  private routes: RouteDefinition[];
  private state: RouterState;
  private listeners = new Set<() => void>();
  private navigationId = 0;
  private previousMatches: RouteMatch[] = [];

  constructor(routes: RouteDefinition[]) {
    this.routes = routes;
    this.history = new History();

    const initialLocation = this.history.getLocation();
    const initialMatches = this.match(initialLocation.pathname);

    this.state = {
      location: initialLocation,
      matches: [],
      status: "loading",
    };

    void this.commitNavigation(initialLocation, initialMatches, ++this.navigationId);

    this.history.subscribe((location) => void this.handleLocationChange(location));
  }

  private match(pathname: string): RouteMatch[] {
    return matchTree(this.routes, pathname);
  }

  private async handleLocationChange(location: ParsedLocation): Promise<void> {
    const navId = ++this.navigationId;
    const pendingMatches = this.match(location.pathname);
    this.previousMatches = this.state.matches;

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

    await this.commitNavigation(location, pendingMatches, navId, {
      timer: pendingTimer,
      info: pendingInfo,
      minDisplayMs: pendingMinMs,
    });
  }

  private async commitNavigation(
    location: ParsedLocation,
    pendingMatches: RouteMatch[],
    navId: number,
    pending?: {
      timer: ReturnType<typeof setTimeout>;
      info: { fired: boolean; at: number };
      minDisplayMs: number;
    },
  ): Promise<void> {
    try {
      const resolvedMatches = await runLoaders(pendingMatches, this.previousMatches);
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
