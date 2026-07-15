# Michi (道)

I've used React Router and TanStack Router in production for years. They work great. But I never really understood _how_ they work. So I started building one from scratch to find out.

Michi is a client-side router built from first principles - no routing libraries, no framework abstractions, just the raw History API and React primitives. It's not trying to replace anything. It's here to answer the question: what actually happens between the click and the render?

The name 道 (michi) is Japanese for "path" or "the way." Seemed fitting.

**[Documentation](https://michi-docs.vercel.app)** | **[Demo](https://michi.atharvdangedev.in)** | **[Blog](https://michi-docs.vercel.app/blog)**

## The idea

Every feature is built as a **slice** - a self-contained, demonstrable milestone that builds on the previous one. Each slice answers a specific question about how routing works:

| Slice | Status  | What it covers                                                                                |
| ----- | ------- | --------------------------------------------------------------------------------------------- |
| 1     | Done    | **History API** - `pushState`, `popstate`, and the core router loop                           |
| 2     | Done    | **Route Matching** - turning URL patterns like `/user/$id` into regex that actually matches   |
| 3     | Done    | **Nested Routes** - the route tree, `<Outlet />`, and layouts that persist across navigations |
| 4     | Done    | **Data Loaders** - render-as-you-fetch vs fetch-on-render                                     |
| 5     | Done    | **Error Boundaries** - isolating failures per route instead of blank screens                  |
| 6     | Done    | **Prefetch on Hover** - running loaders early so navigation feels instant                     |
| 7     | Done    | **Search Params** - typed, serializable state that lives in the URL                           |
| 8     | Planned | **File-Based Routing** - a codegen script that reads your filesystem                          |
| 9     | Planned | **Typed Routes** - compile-time safety for paths, params, and loader data                     |

## The stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript (strict)
- **Demo app:** Vite + React 19
- **Router package:** Pure TypeScript, zero runtime dependencies
- **Docs:** Blume (Astro-based docs framework)
- **Testing:** Vitest + @testing-library/react

## What's done

Slices 1-7 are built and working. The router supports:

- **Dynamic params** - `/user/$id` matches `/user/atharv` and extracts `{ id: "atharv" }`
- **Wildcard routes** - `/files/*` matches `/files/public/uploads/report.pdf` and captures the full path
- **Nested layouts** - `/settings` wraps its children in a sidebar layout via `<Outlet />`
- **Pathless layouts** - `_auth` wraps routes without adding a URL segment
- **Nested outlets** - 3+ levels of rendering depth (root → layout → page)
- **Programmatic navigation** - `useRouter()` hook for navigating from event handlers, effects, etc.
- **Persistent layouts** - nav and sidebars stay mounted across navigations, no remounting
- **Data loaders** - fetch data before rendering with `useLoaderData()` hook
- **Parallel loader execution** - all matched route loaders run simultaneously
- **Loader caching** - same route + same params = previous loader data reused
- **Race condition protection** - stale loader results are discarded on rapid navigation
- **Per-route error boundaries** - loader and render errors are isolated to the failing route
- **Custom error components** - each route can define its own `errorComponent`
- **useRouteError hook** - access the error from within an error component
- **Prefetch on hover** - run loaders early when the user hovers a link
- **Prefetch cache** - TTL-based cache with dedup, configurable delay
- **Search params** - `validateSearch` for typed, parsed URL state
- **Search param navigation** - merge or replace params with `navigate(path, { search })`
- **useSearch hook** - access validated search params per route

## Getting started

```bash
git clone https://github.com/atharvdange618/Michi.git
cd Michi
pnpm install
```

Run the demo app:

```bash
cd apps/demo
pnpm dev
```

Run the docs site:

```bash
pnpm docs:dev
```

Check out the blog series for deep dives into how each slice was built:

- [What Actually Happens When You Click a Link in React](https://tty.atharvdangedev.in/blog/what-happens-when-you-click-a-link-in-react) - Slices 1-2 (History API + Route Matching)
- [Layouts That Persist and Data That Arrives Before You Do](https://tty.atharvdangedev.in/blog/layout-that-persists-and-data-that-arrives-before-you-do) - Slices 3-4 (Nested Routes + Data Loaders)
- [Per-Route Error Boundaries and Prefetch on Hover](https://tty.atharvdangedev.in/blog/per-route-error-boundaries-and-prefetch-on-hover) - Slices 5-6 (Error Boundaries + Prefetch + Search Params)

## The demo app

The demo app at `apps/demo/` showcases every feature of the router:

```
/                         - Home page
/about                    - About page
/navigate                 - Programmatic navigation + back/forward buttons
/user/$id                 - Dynamic params (/user/atharv, /user/maithili)
/files/*                  - Wildcard catch-all (/files/public/uploads/report.pdf)
/dashboard                - Pathless layout (_auth) + nested layout with sidebar
/dashboard/analytics      - Nested outlet (3 levels deep)
/settings/profile         - Nested layout with parallel loaders + caching
/settings/billing         - Same layout, different child
/settings/billing-error   - Error isolation: child errors, parent layout stays
/errors/loader-fail       - Demo: loader error with custom error component
/errors/render-fail       - Demo: render error with custom error component
/prefetch                 - Demo: prefetch on hover with intent detection
/prefetch-fail            - Demo: failed prefetch handling
/users?page=1             - Search params: pagination, sort, filter
/users?page=abc           - Search params: validation error demo
```

## License

MIT
