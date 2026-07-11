import { describe, it, expect, vi, afterEach } from "vitest";
import { useMemo } from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { Router } from "./router";
import {
  RouterProvider,
  Outlet,
  Link,
  useRouter,
  useRouterState,
  useParams,
  useLoaderData,
  useRouteError,
} from "./react";

let mockPathname = "/";

function setMockPathname(pathname: string) {
  mockPathname = pathname;
}

function resetMockPathname() {
  mockPathname = "/";
}

const MockHistory = vi.hoisted(() => {
  const listeners = new Set<(loc: { pathname: string; search: string; hash: string }) => void>();

  function parseUrl(to: string): {
    pathname: string;
    search: string;
    hash: string;
  } {
    const questionIdx = to.indexOf("?");
    const hashIdx = to.indexOf("#");
    const endPath = questionIdx !== -1 ? questionIdx : hashIdx !== -1 ? hashIdx : to.length;
    const pathname = to.slice(0, endPath);
    const search =
      questionIdx !== -1 ? to.slice(questionIdx, hashIdx !== -1 ? hashIdx : to.length) : "";
    const hash = hashIdx !== -1 ? to.slice(hashIdx) : "";
    return { pathname, search, hash };
  }

  return class MockHistory {
    push(to: string) {
      mockPathname = to;
      const loc = parseUrl(to);
      listeners.forEach((l) => l(loc));
    }
    getLocation() {
      return parseUrl(mockPathname);
    }
    subscribe(cb: (loc: { pathname: string; search: string; hash: string }) => void) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    }
  };
});

vi.mock("./history", () => ({
  History: MockHistory,
}));

afterEach(() => {
  resetMockPathname();
  cleanup();
});

function TestRouter({ routes }: { routes: import("./types").RouteDefinition[] }) {
  const router = useMemo(() => new Router(routes), []);
  return <RouterProvider router={router} />;
}

describe("useRouter", () => {
  it("throws when used outside RouterProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bad() {
      useRouter();
      return null;
    }
    expect(() => render(<Bad />)).toThrow("useRouter must be used inside <RouterProvider>");
    spy.mockRestore();
  });
});

describe("RouterProvider", () => {
  it("renders the matched route component", async () => {
    setMockPathname("/test");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <span>root</span>
            <Outlet />
          </div>
        ),
        children: [{ path: "/test", component: () => <div>test page</div> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("root")).toBeDefined();
    });
    expect(screen.getByText("test page")).toBeDefined();
  });

  it("renders NotFound when no route matches", async () => {
    setMockPathname("/nope");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <span>root</span>
            <Outlet />
          </div>
        ),
        children: [{ path: "/exists", component: () => <div>exists</div> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("404")).toBeDefined();
    });
  });
});

describe("Outlet", () => {
  it("renders child route inside parent layout", async () => {
    setMockPathname("/child");
    function Layout() {
      return (
        <div>
          <span>layout</span>
          <Outlet />
        </div>
      );
    }
    const routes = [
      {
        path: "__root",
        component: Layout,
        children: [{ path: "/child", component: () => <span>child</span> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("layout")).toBeDefined();
    });
    expect(screen.getByText("child")).toBeDefined();
  });

  it("renders custom fallback when no child matches", async () => {
    setMockPathname("/nope");
    function Layout() {
      return (
        <div>
          <Outlet fallback={<span>custom fallback</span>} />
        </div>
      );
    }
    const routes = [
      {
        path: "__root",
        component: Layout,
        children: [{ path: "/exists", component: () => <span>exists</span> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("custom fallback")).toBeDefined();
    });
  });
});

describe("Link", () => {
  it("renders an anchor with href", async () => {
    setMockPathname("/");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <Link to="/about">About</Link>
          </div>
        ),
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      const link = screen.getByText("About");
      expect(link.getAttribute("href")).toBe("/about");
    });
  });

  it("calls router.navigate on click and prevents default", async () => {
    setMockPathname("/");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <Outlet />
          </div>
        ),
        children: [
          { path: "/", component: () => <Link to="/about">Go</Link> },
          { path: "/about", component: () => <div>about page</div> },
        ],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("Go")).toBeDefined();
    });

    const link = screen.getByText("Go");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(event, "preventDefault");
    fireEvent(link, event);

    expect(preventDefault).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("about page")).toBeDefined();
    });
  });
});

describe("useParams", () => {
  it("returns merged params from all matches", async () => {
    setMockPathname("/user/atharv");
    let capturedParams: Record<string, string> = {};
    function ParamsCapture() {
      capturedParams = useParams();
      return null;
    }
    const routes = [
      {
        path: "__root",
        component: () => <ParamsCapture />,
        children: [{ path: "/user/$id", component: () => <div /> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(capturedParams).toEqual({ id: "atharv" });
    });
  });
});

describe("useRouterState", () => {
  it("returns current router state", async () => {
    setMockPathname("/test");
    let capturedState: ReturnType<typeof useRouterState> | null = null;
    function StateCapture() {
      capturedState = useRouterState();
      return null;
    }
    const routes = [
      {
        path: "__root",
        component: () => <StateCapture />,
        children: [{ path: "/test", component: () => <div /> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(capturedState).not.toBeNull();
      expect(capturedState!.status).toBe("idle");
    });
    expect(capturedState!.matches[1]!.routeId).toBe("/test");
  });
});

describe("Link props forwarding", () => {
  it("forwards style prop to anchor", async () => {
    setMockPathname("/");
    const routes = [
      {
        path: "__root",
        component: () => (
          <Link to="/test" style={{ color: "red" }}>
            styled link
          </Link>
        ),
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      const link = screen.getByText("styled link");
      expect(link.getAttribute("style")).toContain("color");
    });
  });

  it("forwards className to anchor", async () => {
    setMockPathname("/");
    const routes = [
      {
        path: "__root",
        component: () => (
          <Link to="/test" className="my-link">
            classed link
          </Link>
        ),
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      const link = screen.getByText("classed link");
      expect(link.className).toBe("my-link");
    });
  });

  it("calls user's onClick handler after navigation", async () => {
    setMockPathname("/");
    const onClick = vi.fn();
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <Link to="/about" onClick={onClick}>
              click me
            </Link>
            <Outlet />
          </div>
        ),
        children: [{ path: "/about", component: () => <div>about</div> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("click me")).toBeDefined();
    });
    fireEvent.click(screen.getByText("click me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Link prefetch", () => {
  it("triggers prefetch on mouseenter with intent", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "test" });
    const routes = [
      {
        path: "__root",
        component: () => (
          <Link to="/prefetch" prefetch="intent">
            hover me
          </Link>
        ),
        children: [{ path: "/prefetch", component: () => <div>prefetched</div>, loader }],
      },
    ];

    const router = new Router(routes);
    const prefetchSpy = vi.spyOn(router, "prefetch");

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("hover me")).toBeDefined();
    });

    fireEvent.mouseEnter(screen.getByText("hover me"));

    // prefetch called after default 50ms delay
    await waitFor(() => {
      expect(prefetchSpy).toHaveBeenCalledWith("/prefetch");
    });

    prefetchSpy.mockRestore();
  });

  it("does not trigger prefetch when prefetch=none", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "test" });
    const routes = [
      {
        path: "__root",
        component: () => (
          <Link to="/prefetch" prefetch="none">
            no prefetch
          </Link>
        ),
        children: [{ path: "/prefetch", component: () => <div>page</div>, loader }],
      },
    ];

    const router = new Router(routes);
    const prefetchSpy = vi.spyOn(router, "prefetch");

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("no prefetch")).toBeDefined();
    });

    fireEvent.mouseEnter(screen.getByText("no prefetch"));
    await new Promise((r) => setTimeout(r, 150));

    expect(prefetchSpy).not.toHaveBeenCalled();
    prefetchSpy.mockRestore();
  });

  it("cancels prefetch on mouseleave", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "test" });
    const routes = [
      {
        path: "__root",
        component: () => (
          <Link to="/prefetch" prefetch="intent">
            hover me
          </Link>
        ),
        children: [{ path: "/prefetch", component: () => <div>page</div>, loader }],
      },
    ];

    const router = new Router(routes);
    const prefetchSpy = vi.spyOn(router, "prefetch");

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("hover me")).toBeDefined();
    });

    fireEvent.mouseEnter(screen.getByText("hover me"));
    fireEvent.mouseLeave(screen.getByText("hover me"));
    await new Promise((r) => setTimeout(r, 150));

    expect(prefetchSpy).not.toHaveBeenCalled();
    prefetchSpy.mockRestore();
  });

  it("respects custom prefetchDelay", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "test" });
    const routes = [
      {
        path: "__root",
        component: () => (
          <Link to="/prefetch" prefetch="intent" prefetchDelay={200}>
            slow hover
          </Link>
        ),
        children: [{ path: "/prefetch", component: () => <div>page</div>, loader }],
      },
    ];

    const router = new Router(routes);
    const prefetchSpy = vi.spyOn(router, "prefetch");

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("slow hover")).toBeDefined();
    });

    fireEvent.mouseEnter(screen.getByText("slow hover"));

    // Should not be called after 100ms (less than 200ms delay)
    await new Promise((r) => setTimeout(r, 100));
    expect(prefetchSpy).not.toHaveBeenCalled();

    // Should be called after 200ms delay
    await waitFor(() => {
      expect(prefetchSpy).toHaveBeenCalledWith("/prefetch");
    });

    prefetchSpy.mockRestore();
  });

  it("forwards onMouseEnter and onMouseLeave handlers", async () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const routes = [
      {
        path: "__root",
        component: () => (
          <Link
            to="/test"
            prefetch="intent"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            with handlers
          </Link>
        ),
      },
    ];

    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("with handlers")).toBeDefined();
    });

    fireEvent.mouseEnter(screen.getByText("with handlers"));
    fireEvent.mouseLeave(screen.getByText("with handlers"));

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});

describe("Outlet edge cases", () => {
  it("renders NotFound fallback by default when no child matches", async () => {
    setMockPathname("/no-child");
    function Layout() {
      return (
        <div>
          <span>layout-without-child</span>
          <Outlet />
        </div>
      );
    }
    const routes = [
      {
        path: "__root",
        component: Layout,
        children: [{ path: "/exists", component: () => <span>exists</span> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("layout-without-child")).toBeDefined();
    });
    expect(screen.getByText("404")).toBeDefined();
  });

  it("renders 3 levels of nested Outlets", async () => {
    setMockPathname("/a/b/c");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <span>root-nested</span>
            <Outlet />
          </div>
        ),
        children: [
          {
            path: "/a",
            component: () => (
              <div>
                <span>level-1</span>
                <Outlet />
              </div>
            ),
            children: [
              {
                path: "/a/b",
                component: () => (
                  <div>
                    <span>level-2</span>
                    <Outlet />
                  </div>
                ),
                children: [
                  {
                    path: "/a/b/c",
                    component: () => <span>level-3</span>,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("root-nested")).toBeDefined();
    });
    expect(screen.getByText("level-1")).toBeDefined();
    expect(screen.getByText("level-2")).toBeDefined();
    expect(screen.getByText("level-3")).toBeDefined();
  });
});

describe("useParams typed", () => {
  it("returns typed params with generic", async () => {
    setMockPathname("/user/atharv");
    let capturedParams: { id: string } = { id: "" };
    function ParamsCapture() {
      capturedParams = useParams<{ id: string }>();
      return null;
    }
    const routes = [
      {
        path: "__root",
        component: () => <ParamsCapture />,
        children: [{ path: "/user/$id", component: () => <div /> }],
      },
    ];
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(capturedParams.id).toBe("atharv");
    });
  });
});

describe("useLoaderData", () => {
  it("returns resolved loader data", async () => {
    const loader = vi.fn().mockResolvedValue({ name: "atharv" });
    let capturedData: unknown = undefined;

    function DataPage() {
      capturedData = useLoaderData();
      return <div>{(capturedData as { name: string }).name}</div>;
    }

    setMockPathname("/user/atharv");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <span>root</span>
            <Outlet />
          </div>
        ),
        children: [{ path: "/user/$id", component: DataPage, loader }],
      },
    ];

    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("atharv")).toBeDefined();
    });

    expect(capturedData).toEqual({ name: "atharv" });
    expect(loader).toHaveBeenCalled();
  });

  it("each nested route gets its own loader data", async () => {
    const rootLoader = vi.fn().mockResolvedValue({ role: "admin" });
    const childLoader = vi.fn().mockResolvedValue({ name: "atharv" });

    let rootData: unknown;
    let childData: unknown;

    function RootPage() {
      rootData = useLoaderData();
      return (
        <div>
          <span>root-data</span>
          <Outlet />
        </div>
      );
    }

    function ChildPage() {
      childData = useLoaderData();
      return <span>child-data</span>;
    }

    setMockPathname("/page");
    const routes = [
      {
        path: "__root",
        component: RootPage,
        loader: rootLoader,
        children: [{ path: "/page", component: ChildPage, loader: childLoader }],
      },
    ];

    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("child-data")).toBeDefined();
    });

    expect(rootData).toEqual({ role: "admin" });
    expect(childData).toEqual({ name: "atharv" });
  });
});

describe("Loading state", () => {
  it("shows custom loading component during initial load", async () => {
    let resolveLoader: (value: unknown) => void;
    const loader = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLoader = resolve;
        }),
    );

    setMockPathname("/slow");
    const routes = [
      {
        path: "__root",
        component: () => <Outlet />,
        children: [{ path: "/slow", component: () => <div>page</div>, loader }],
      },
    ];

    const router = new Router(routes);
    const { container } = render(
      <RouterProvider router={router} loading={<div>custom loading</div>} />,
    );

    await waitFor(() => {
      expect(container.textContent).toContain("custom loading");
    });

    resolveLoader!(null);
    await waitFor(() => {
      expect(screen.getByText("page")).toBeDefined();
    });
  });

  it("shows default Loading component when no loading prop", async () => {
    let resolveLoader: (value: unknown) => void;
    const loader = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLoader = resolve;
        }),
    );

    setMockPathname("/slow");
    const routes = [
      {
        path: "__root",
        component: () => <Outlet />,
        children: [{ path: "/slow", component: () => <div>page</div>, loader }],
      },
    ];

    const router = new Router(routes);
    const { container } = render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(container.textContent).toContain("loading");
    });

    resolveLoader!(null);
    await waitFor(() => {
      expect(screen.getByText("page")).toBeDefined();
    });
  });
});

describe("RouteErrorBoundary", () => {
  it("catches render errors and shows default error component", async () => {
    function Boom(): React.JSX.Element {
      throw new Error("render exploded");
    }

    setMockPathname("/boom");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <span>root</span>
            <Outlet />
          </div>
        ),
        children: [{ path: "/boom", component: Boom }],
      },
    ];

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("Something broke")).toBeDefined();
    });
    expect(screen.getByText("render exploded")).toBeDefined();
    spy.mockRestore();
  });

  it("uses custom errorComponent when provided", async () => {
    function Boom(): React.JSX.Element {
      throw new Error("custom boom");
    }
    function CustomError({ error }: { error: unknown }) {
      return (
        <div>
          <span>custom error</span>
          <span>{(error as Error).message}</span>
        </div>
      );
    }

    setMockPathname("/custom");
    const routes = [
      {
        path: "__root",
        component: () => <Outlet />,
        children: [
          {
            path: "/custom",
            component: Boom,
            errorComponent: CustomError,
          },
        ],
      },
    ];

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("custom error")).toBeDefined();
    });
    expect(screen.getByText("custom boom")).toBeDefined();
    spy.mockRestore();
  });

  it("shows error component when loader throws", async () => {
    const loader = vi.fn().mockRejectedValue(new Error("loader failed"));
    function CustomError({ error }: { error: unknown }) {
      return <span>{(error as Error).message}</span>;
    }

    setMockPathname("/loader-error");
    const routes = [
      {
        path: "__root",
        component: () => <Outlet />,
        children: [
          {
            path: "/loader-error",
            component: () => <div>should not render</div>,
            loader,
            errorComponent: CustomError,
          },
        ],
      },
    ];

    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("loader failed")).toBeDefined();
    });
    expect(screen.queryByText("should not render")).toBeNull();
  });

  it("error in child does not crash parent layout", async () => {
    function Boom(): React.JSX.Element {
      throw new Error("child error");
    }

    setMockPathname("/child-error");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <span>parent layout</span>
            <Outlet />
          </div>
        ),
        children: [{ path: "/child-error", component: Boom }],
      },
    ];

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("parent layout")).toBeDefined();
    });
    expect(screen.getByText("Something broke")).toBeDefined();
    spy.mockRestore();
  });

  it("useRouteError returns the error inside error component", async () => {
    let capturedError: unknown;
    function Boom(): React.JSX.Element {
      throw new Error("hook test");
    }
    function ErrorCapture({ error: _error }: { error: unknown }) {
      capturedError = useRouteError();
      return <span>captured</span>;
    }

    setMockPathname("/hook-error");
    const routes = [
      {
        path: "__root",
        component: () => <Outlet />,
        children: [
          {
            path: "/hook-error",
            component: Boom,
            errorComponent: ErrorCapture,
          },
        ],
      },
    ];

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("captured")).toBeDefined();
    });
    expect(capturedError).toBeInstanceOf(Error);
    expect((capturedError as Error).message).toBe("hook test");
    spy.mockRestore();
  });

  it("child render error is isolated and does not crash parent layout", async () => {
    function ChildBoom(): React.JSX.Element {
      throw new Error("child broke");
    }

    setMockPathname("/isolated");
    const routes = [
      {
        path: "__root",
        component: () => (
          <div>
            <span>root</span>
            <Outlet />
          </div>
        ),
        children: [
          {
            path: "/isolated",
            component: () => (
              <div>
                <span>parent layout</span>
                <Outlet />
              </div>
            ),
            children: [
              {
                path: "/isolated",
                component: ChildBoom,
                errorComponent: ({ error }: { error: unknown }) => (
                  <span>{(error as Error).message}</span>
                ),
              },
            ],
          },
        ],
      },
    ];

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<TestRouter routes={routes} />);
    await waitFor(() => {
      expect(screen.getByText("root")).toBeDefined();
    });
    expect(screen.getByText("parent layout")).toBeDefined();
    expect(screen.getByText("child broke")).toBeDefined();
    spy.mockRestore();
  });
});
