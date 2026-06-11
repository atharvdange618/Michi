import { History } from "./history";
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
    const route = this.routes.find((r) => r.path === pathname);
    if (!route) return [];
    return [
      {
        routeId: route.path,
        params: {},
        loaderData: undefined,
        component: route.component,
      },
    ];
  }

  navigate(to: string): void {
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
