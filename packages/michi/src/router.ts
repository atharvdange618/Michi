import { History } from "./history";
import { matchTree } from "./matcher";
import type { RouteDefinition, RouterState, RouteMatch } from "./types";

export class Router {
  private history: History;
  private routes: RouteDefinition[];
  private state: RouterState;
  private listeners = new Set<() => void>();

  constructor(routes: RouteDefinition[]) {
    this.routes = routes;
    this.history = new History();
    this.state = this.buildState(this.history.getLocation().pathname);

    this.history.subscribe((location) => {
      this.state = this.buildState(location.pathname);
      this.notify();
    });
  }

  private buildState(pathname: string): RouterState {
    return {
      location: this.history.getLocation(),
      matches: this.match(pathname),
      status: "idle",
    };
  }

  private match(pathname: string): RouteMatch[] {
    return matchTree(this.routes, pathname);
  }

  navigate(to: string): void {
    if (!to || typeof to !== "string") {
      console.warn("router.navigate() requires a non-empty string path");
    }
    if (!to.startsWith("/") && !to.startsWith("http")) {
      console.warn(
        `router.navigate("${to}") — paths should start with "/"`,
      );
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
    this.listeners.forEach((l) => l());
  }
}
