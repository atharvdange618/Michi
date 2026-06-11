import React, { createContext, useContext, useSyncExternalStore } from "react";
import type { Router } from "./router";
import type { RouterState } from "./types";

const RouterContext = createContext<Router | null>(null);

function useRouter(): Router {
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

export function RouterProvider({ router }: { router: Router }) {
  // useState + useEffect would work but has a subscription gap and tears in
  // concurrent mode. useSyncExternalStore was built exactly for external stores.
  const state = useSyncExternalStore(
    (cb) => router.subscribe(cb),
    () => router.getState(),
    () => router.getState(),
  );

  const match = state.matches[0];

  return (
    <RouterContext.Provider value={router}>
      {match ? <match.component /> : <div>404 - no route matched</div>}
    </RouterContext.Provider>
  );
}

export function Link({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        router.navigate(to);
      }}
    >
      {children}
    </a>
  );
}
