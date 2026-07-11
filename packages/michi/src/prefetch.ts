import type { RouteMatch } from "./types";

type CacheEntry = {
  promise: Promise<RouteMatch[]>;
  createdAt: number;
  rejected: boolean;
};

export function splitPath(to: string): {
  pathname: string;
  search: string;
} {
  const idx = to.indexOf("?");
  if (idx === -1) return { pathname: to, search: "" };

  return { pathname: to.slice(0, idx), search: to.slice(idx) };
}

export class PrefetchCache {
  private entries = new Map<string, CacheEntry>();
  private ttlMs: number;

  constructor(ttlMs: number = 30_000) {
    this.ttlMs = ttlMs;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.createdAt > this.ttlMs;
  }

  peek(key: string): Promise<RouteMatch[]> | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (this.isExpired(entry) || entry.rejected) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.promise;
  }

  getOrCreate(key: string, factory: () => Promise<RouteMatch[]>): Promise<RouteMatch[]> {
    const cached = this.peek(key);
    if (cached) return cached;

    const promise = factory();
    const entry: CacheEntry = {
      promise,
      createdAt: Date.now(),
      rejected: false,
    };

    promise.catch(() => {
      entry.rejected = true;
    });

    this.entries.set(key, entry);
    return promise;
  }

  delete(key: string): void {
    this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}
