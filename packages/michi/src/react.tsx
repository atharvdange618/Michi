import React, { createContext, useContext, useSyncExternalStore } from "react";
import type { Router } from "./router";
import type { RouterState } from "./types";
import { NotFound } from "./components/not-found";

const RouterContext = createContext<Router | null>(null);

// tracks which index into matches[] the next <Outlet /> should render.
// RouterProvider always renders matches[0] directly and sets this to 1
// each <Outlet /> reads its index, renders that match, and then sets the next index
const OutletContext = createContext<number>(1);

export function useRouter(): Router {
  const router = useContext(RouterContext);
  if (!router)
    throw new Error("useRouter must be used inside <RouterProvider>");
  return router;
}

export function useRouterState(): RouterState {
  const router = useRouter();
  return useSyncExternalStore(
    (cb) => router.subscribe(cb),
    () => router.getState(),
    () => router.getState(),
  );
}

export function useParams<
  T extends Record<string, string> = Record<string, string>,
>(): T {
  const state = useRouterState();
  const params = state.matches.reduce(
    (acc, match) => ({ ...acc, ...match.params }),
    {} as Record<string, string>,
  );
  return params as T;
}

export function RouterProvider({ router }: { router: Router }) {
  // useState + useEffect would work but has a subscription gap and tears in
  // concurrent mode. useSyncExternalStore was built exactly for external stores.
  const state = useSyncExternalStore(
    (cb) => router.subscribe(cb),
    () => router.getState(),
    () => router.getState(),
  );

  const rootMatch = state.matches[0];

  return (
    <RouterContext.Provider value={router}>
      {rootMatch ? (
        <OutletContext.Provider value={1}>
          <rootMatch.component />
        </OutletContext.Provider>
      ) : (
        <NotFound />
      )}
    </RouterContext.Provider>
  );
}

export function Outlet({
  fallback = <NotFound />,
}: {
  fallback?: React.ReactNode;
}) {
  const matchIndex = useContext(OutletContext);
  const state = useRouterState();
  const match = state.matches[matchIndex];

  if (!match) return <>{fallback}</>;

  return (
    <OutletContext.Provider value={matchIndex + 1}>
      <match.component />
    </OutletContext.Provider>
  );
}

export function Link({
  to,
  children,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter();

  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        router.navigate(to);
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
