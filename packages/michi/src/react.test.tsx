import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Router } from "./router";
import {
  RouterProvider,
  Outlet,
  Link,
  useRouter,
  useRouterState,
  useParams,
} from "./react";

let mockPathname = "/";

vi.mock("./history", () => {
  const listeners = new Set<
    (loc: { pathname: string; search: string; hash: string }) => void
  >();
  return {
    History: class MockHistory {
      push(to: string) {
        mockPathname = to;
        const loc = { pathname: mockPathname, search: "", hash: "" };
        listeners.forEach((l) => l(loc));
      }
      getLocation() {
        return { pathname: mockPathname, search: "", hash: "" };
      }
      subscribe(
        cb: (loc: { pathname: string; search: string; hash: string }) => void,
      ) {
        listeners.add(cb);
        return () => {
          listeners.delete(cb);
        };
      }
    },
  };
});

afterEach(() => {
  mockPathname = "/";
  cleanup();
});

function TestRouter({
  routes,
}: {
  routes: import("./types").RouteDefinition[];
}) {
  const router = new Router(routes);
  return <RouterProvider router={router} />;
}

describe("useRouter", () => {
  it("throws when used outside RouterProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bad() {
      useRouter();
      return null;
    }
    expect(() => render(<Bad />)).toThrow(
      "useRouter must be used inside <RouterProvider>",
    );
    spy.mockRestore();
  });
});

describe("RouterProvider", () => {
  it("renders the matched route component", () => {
    mockPathname = "/test";
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
    expect(screen.getByText("root")).toBeDefined();
    expect(screen.getByText("test page")).toBeDefined();
  });

  it("renders NotFound when no route matches", () => {
    mockPathname = "/nope";
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
    expect(screen.getByText("404")).toBeDefined();
  });
});

describe("Outlet", () => {
  it("renders child route inside parent layout", () => {
    mockPathname = "/child";
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
    expect(screen.getByText("layout")).toBeDefined();
    expect(screen.getByText("child")).toBeDefined();
  });

  it("renders custom fallback when no child matches", () => {
    mockPathname = "/nope";
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
    expect(screen.getByText("custom fallback")).toBeDefined();
  });
});

describe("Link", () => {
  it("renders an anchor with href", () => {
    mockPathname = "/";
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
    const link = screen.getByText("About");
    expect(link.getAttribute("href")).toBe("/about");
  });

  it("calls router.navigate on click and prevents default", () => {
    mockPathname = "/";
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

    const link = screen.getByText("Go");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(event, "preventDefault");
    fireEvent(link, event);

    expect(preventDefault).toHaveBeenCalled();
    expect(screen.getByText("about page")).toBeDefined();
  });
});

describe("useParams", () => {
  it("returns merged params from all matches", () => {
    mockPathname = "/user/atharv";
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
    expect(capturedParams).toEqual({ id: "atharv" });
  });
});

describe("useRouterState", () => {
  it("returns current router state", () => {
    mockPathname = "/test";
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
    expect(capturedState).not.toBeNull();
    expect(capturedState!.matches[1].routeId).toBe("/test");
    expect(capturedState!.status).toBe("idle");
  });
});

describe("Link props forwarding", () => {
  it("forwards style prop to anchor", () => {
    mockPathname = "/";
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
    const link = screen.getByText("styled link");
    expect(link.getAttribute("style")).toContain("color");
  });

  it("forwards className to anchor", () => {
    mockPathname = "/";
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
    const link = screen.getByText("classed link");
    expect(link.className).toBe("my-link");
  });

  it("calls user's onClick handler after navigation", () => {
    mockPathname = "/";
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
        children: [
          { path: "/about", component: () => <div>about</div> },
        ],
      },
    ];
    render(<TestRouter routes={routes} />);
    fireEvent.click(screen.getByText("click me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Outlet edge cases", () => {
  it("renders NotFound fallback by default when no child matches", () => {
    mockPathname = "/no-child";
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
    expect(screen.getByText("layout-without-child")).toBeDefined();
    expect(screen.getByText("404")).toBeDefined();
  });

  it("renders 3 levels of nested Outlets", () => {
    mockPathname = "/a/b/c";
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
    expect(screen.getByText("root-nested")).toBeDefined();
    expect(screen.getByText("level-1")).toBeDefined();
    expect(screen.getByText("level-2")).toBeDefined();
    expect(screen.getByText("level-3")).toBeDefined();
  });
});

describe("useParams typed", () => {
  it("returns typed params with generic", () => {
    mockPathname = "/user/atharv";
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
    expect(capturedParams.id).toBe("atharv");
  });
});
