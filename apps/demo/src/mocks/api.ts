let prefetchDemoCallCount = 0;

export type User = {
  id: string;
  name: string;
  email: string;
};

export type UsersPage = {
  users: { id: string; name: string }[];
  page: number;
  totalPages: number;
};

const ALL_USERS = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
}));

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

export async function fetchUsersPage(
  page: number,
  sort: "name" | "date" = "name",
  filter?: string,
  pageSize = 10,
): Promise<UsersPage> {
  await new Promise((r) => setTimeout(r, 400));

  let filtered = ALL_USERS;
  if (filter) {
    const lower = filter.toLowerCase();
    filtered = ALL_USERS.filter((u) => u.name.toLowerCase().includes(lower));
  }

  const sorted =
    sort === "date"
      ? [...filtered].toReversed()
      : [...filtered].sort((a, b) => Number(a.id) - Number(b.id));

  const start = (page - 1) * pageSize;
  return {
    users: sorted.slice(start, start + pageSize),
    page,
    totalPages: Math.ceil(sorted.length / pageSize),
  };
}
