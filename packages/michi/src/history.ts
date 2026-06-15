import type { ParsedLocation } from "./types";

type Listener = (location: ParsedLocation) => void;

function getLocation(): ParsedLocation {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}

export class History {
  // Set instead of array, registering the same listener twice would be a bug
  private listeners = new Set<Listener>();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", () => this.notify());
    }
  }

  push(to: string): void {
    if (typeof window === "undefined") return;
    window.history.pushState(null, "", to);
    this.notify(); // pushState doesn't fire popstate, we notify manually
  }

  replace(to: string): void {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", to);
    this.notify();
  }

  getLocation(): ParsedLocation {
    if (typeof window === "undefined") {
      return { pathname: "/", search: "", hash: "" };
    }
    return getLocation();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const location = getLocation();
    this.listeners.forEach((l) => l(location));
  }
}
