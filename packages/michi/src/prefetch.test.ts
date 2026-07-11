import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { PrefetchCache, splitPath } from "./prefetch";

describe("splitPath", () => {
  it("splits pathname and search", () => {
    expect(splitPath("/user/1?foo=bar")).toEqual({
      pathname: "/user/1",
      search: "?foo=bar",
    });
  });

  it("returns empty search when no query string", () => {
    expect(splitPath("/user/1")).toEqual({
      pathname: "/user/1",
      search: "",
    });
  });

  it("handles search without pathname", () => {
    expect(splitPath("?foo=bar")).toEqual({
      pathname: "",
      search: "?foo=bar",
    });
  });
});

describe("PrefetchCache", () => {
  let cache: PrefetchCache;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new PrefetchCache(1000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("caches and returns promises", async () => {
    const factory = vi.fn().mockResolvedValue([{ routeId: "/test" }]);
    const result = cache.getOrCreate("/test", factory);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(await result).toEqual([{ routeId: "/test" }]);
  });

  it("deduplicates concurrent calls", () => {
    const factory = vi.fn().mockResolvedValue([{ routeId: "/test" }]);

    const a = cache.getOrCreate("/test", factory);
    const b = cache.getOrCreate("/test", factory);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it("returns cached promise on peek", () => {
    const factory = vi.fn().mockResolvedValue([{ routeId: "/test" }]);
    const promise = cache.getOrCreate("/test", factory);
    const peeked = cache.peek("/test");

    expect(peeked).toBe(promise);
  });

  it("returns undefined on peek for missing key", () => {
    expect(cache.peek("/missing")).toBeUndefined();
  });

  it("evicts expired entries", () => {
    const factory = vi.fn().mockResolvedValue([{ routeId: "/test" }]);
    cache.getOrCreate("/test", factory);

    vi.advanceTimersByTime(1500);

    expect(cache.peek("/test")).toBeUndefined();
  });

  it("allows new fetch after eviction", async () => {
    const factory = vi.fn().mockResolvedValue([{ routeId: "/test" }]);
    cache.getOrCreate("/test", factory);

    vi.advanceTimersByTime(1500);

    const factory2 = vi.fn().mockResolvedValue([{ routeId: "/test-v2" }]);
    const result = await cache.getOrCreate("/test", factory2);

    expect(factory2).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ routeId: "/test-v2" }]);
  });

  it("does not cache rejected promises", async () => {
    const factory = vi.fn().mockRejectedValue(new Error("fail"));
    const promise = cache.getOrCreate("/fail", factory);

    await expect(promise).rejects.toThrow("fail");

    // Should not be cached - peek returns undefined
    expect(cache.peek("/fail")).toBeUndefined();
  });

  it("allows retry after rejection", async () => {
    let shouldFail = true;
    const factory = vi.fn().mockImplementation(async () => {
      if (shouldFail) throw new Error("fail");
      return [{ routeId: "/retry" }];
    });

    // First call fails
    await expect(cache.getOrCreate("/retry", factory)).rejects.toThrow("fail");

    // Second call retries
    shouldFail = false;
    const result = await cache.getOrCreate("/retry", factory);
    expect(result).toEqual([{ routeId: "/retry" }]);
  });

  it("delete removes entry", () => {
    const factory = vi.fn().mockResolvedValue([{ routeId: "/test" }]);
    cache.getOrCreate("/test", factory);

    cache.delete("/test");
    expect(cache.peek("/test")).toBeUndefined();
  });

  it("clear removes all entries", () => {
    const factory = vi.fn().mockResolvedValue([{ routeId: "/test" }]);
    cache.getOrCreate("/a", factory);
    cache.getOrCreate("/b", factory);

    cache.clear();
    expect(cache.peek("/a")).toBeUndefined();
    expect(cache.peek("/b")).toBeUndefined();
  });
});
