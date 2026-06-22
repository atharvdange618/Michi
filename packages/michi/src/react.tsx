import React, {
  Component,
  type ErrorInfo,
  type ReactNode,
  type ComponentType,
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import type { Router } from "./router";
import type { RouterState, RouteMatch } from "./types";
import { NotFound } from "./components/not-found";
import { Loading } from "./components/loading";
import { RouteError as DefaultRouteError } from "./components/route-error";

const RouterContext = createContext<Router | null>(null);

// tracks which index into matches[] the next <Outlet /> should render.
// RouterProvider always renders matches[0] directly and sets this to 1.
// each <Outlet /> reads its index, renders that match, and then sets the next index.
const OutletContext = createContext<number>(1);

const NO_ERROR = Symbol("no-error");
const RouteErrorContext = createContext<unknown>(NO_ERROR);

export function useRouter(): Router {
  const router = useContext(RouterContext);
  if (!router)
    throw new Error("useRouter must be used inside <RouterProvider>");
  return router;
}

export function useRouterState(): RouterState {
  const router = useRouter();
  const subscribe = useCallback(
    (cb: () => void) => router.subscribe(cb),
    [router],
  );
  return useSyncExternalStore(
    subscribe,
    () => router.getState(),
    () => router.getState(),
  );
}

export function useParams<
  T extends Record<string, string> = Record<string, string>,
>(): T {
  const state = useRouterState();
  const params: Record<string, string> = {};
  for (const match of state.matches) {
    for (const [key, value] of Object.entries(match.params)) {
      if (key in params && params[key] !== value) {
        console.warn(
          `useParams(): param "${key}" is defined by multiple routes. ` +
            `Value "${params[key]}" was overridden by "${value}". ` +
            `Consider renaming the param in your route patterns to avoid ambiguity.`,
        );
      }
      params[key] = value;
    }
  }
  return params as T;
}

export function useLoaderData<T = unknown>(): T {
  const state = useRouterState();

  const matchIndex = useContext(OutletContext) - 1;
  const match = state.matches[matchIndex];
  return match?.loaderData as T;
}

export function useRouteError(): unknown {
  const error = useContext(RouteErrorContext);
  return error === NO_ERROR ? undefined : error;
}

function matchKey(match: RouteMatch): string {
  const sorted = Object.keys(match.params)
    .sort()
    .reduce(
      (acc, k) => {
        acc[k] = match.params[k];
        return acc;
      },
      {} as Record<string, string>,
    );
  return `${match.routeId}:${JSON.stringify(sorted)}`;
}

type RouteErrorBoundaryProps = {
  error?: unknown;
  errorComponent?: ComponentType<{ error: unknown }>;
  children: ReactNode;
};

type RouteErrorBoundaryState = {
  renderError: unknown;
};

class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { renderError: undefined };

  static getDerivedStateFromError(error: unknown): RouteErrorBoundaryState {
    return { renderError: error };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    console.error("Michi caught a render error in a route:", error, errorInfo);
  }

  render(): ReactNode {
    // loader error takes precedence here
    const error = this.props.error ?? this.state.renderError;

    if (error !== undefined) {
      if (this.props.error) {
        console.error("Michi caught a loader error in a route:", error);
      }
      const ErrorComponent = this.props.errorComponent ?? DefaultRouteError;
      return (
        <RouteErrorContext.Provider value={error}>
          <ErrorComponent error={error} />
        </RouteErrorContext.Provider>
      );
    }

    return this.props.children;
  }
}

export function RouterProvider({
  router,
  loading,
}: {
  router: Router;
  loading?: ReactNode;
}) {
  // useState + useEffect would work but has a subscription gap and tears in
  // concurrent mode. useSyncExternalStore was built exactly for external stores.
  const subscribe = useCallback(
    (cb: () => void) => router.subscribe(cb),
    [router],
  );
  const state = useSyncExternalStore(
    subscribe,
    () => router.getState(),
    () => router.getState(),
  );

  const rootMatch = state.matches[0];
  const loadingComponent = loading ?? <Loading />;

  return (
    <RouterContext.Provider value={router}>
      {state.status === "loading" && !rootMatch ? (
        loadingComponent
      ) : rootMatch ? (
        <RouteErrorBoundary
          key={matchKey(rootMatch)}
          error={rootMatch.error}
          errorComponent={rootMatch.errorComponent}
        >
          <OutletContext.Provider value={1}>
            <rootMatch.component />
          </OutletContext.Provider>
        </RouteErrorBoundary>
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
    <RouteErrorBoundary
      key={matchKey(match)}
      error={match.error}
      errorComponent={match.errorComponent}
    >
      <OutletContext.Provider value={matchIndex + 1}>
        <match.component />
      </OutletContext.Provider>
    </RouteErrorBoundary>
  );
}

export const Link = React.forwardRef<
  HTMLAnchorElement,
  {
    to: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function Link({ to, children, ...rest }, ref) {
  const router = useRouter();

  return (
    <a
      ref={ref}
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
});
