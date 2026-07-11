let prefetchDemoCallCount = 0;

export type User = {
  id: string;
  name: string;
  email: string;
};

const users: Record<string, User> = {
  atharv: { id: "atharv", name: "Atharv Dange", email: "atharv@michi.dev" },
  maithili: { id: "maithili", name: "Maithili", email: "maithili@michi.dev" },
  michi: { id: "michi", name: "Michi Bot", email: "bot@michi.dev" },
};

export async function fetchUser(id: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 200));
  const user = users[id];
  if (!user) {
    return { id, name: `User ${id}`, email: `${id}@example.com` };
  }
  return user;
}

export async function fetchPrefetchDemoData(): Promise<{
  callCount: number;
  resolvedAt: string;
}> {
  prefetchDemoCallCount += 1;
  await new Promise((r) => setTimeout(r, 800));
  return {
    callCount: prefetchDemoCallCount,
    resolvedAt: new Date().toLocaleTimeString(),
  };
}
