# Michi (道)

> What actually happens between the click and the render?

I've used React Router and TanStack Router in production for years. They work great. But I never really understood how they worked.

So I started building one from scratch.

Michi is an educational router built from first principles to explore the architecture behind modern routing systems. Every concept is implemented incrementally, with each slice answering one fundamental question about client-side routing.

It isn't trying to replace React Router or TanStack Router. It's here to answer one question: what actually happens between the click and the render?

The name 道 (michi) is Japanese for "path" or "the way." Seemed fitting for a project about understanding the path every navigation takes.

**[Documentation](https://michi-docs.vercel.app)** | **[Demo](https://michi.atharvdangedev.in)** | **[Blog](https://michi-docs.vercel.app/blog)**

**[GitHub](https://github.com/atharvdange618)** | **[X/Twitter](https://x.com/atharvdangedev)** | **[Website](https://atharvdangedev.in)**

## The journey

Every feature is built as a self-contained **slice**. Each slice introduces a real architectural problem and gradually builds the solution.

| Slice | Status  | Question                                                 | Concepts                                   |
| ----- | ------- | -------------------------------------------------------- | ------------------------------------------ |
| 1     | Done    | How does SPA navigation work without reloading the page? | History API (`pushState`, `popstate`)      |
| 2     | Done    | How does a router know which route matches a URL?        | Route Matching, Dynamic Params, Wildcards  |
| 3     | Done    | How do layouts persist across navigations?               | Nested Routes, Route Trees, `<Outlet />`   |
| 4     | Done    | When should route data be fetched?                       | Data Loaders, Render-as-you-Fetch          |
| 5     | Done    | What happens when a route fails?                         | Per-route Error Boundaries                 |
| 6     | Done    | How can navigation feel instant?                         | Prefetch on Hover, Intent Detection        |
| 7     | Done    | How should application state live inside URLs?           | Typed Search Params                        |
| 8     | Done    | How does the filesystem become a route tree?             | File-Based Routing, Code Generation        |
| 9     | Planned | How do routes get type safety at compile time?           | Typed Routes, Type Inference               |
| 10    | Planned | Why does `/users/new` beat `/users/$id`?                 | Route Ranking, Specificity Resolution      |
| 11    | Planned | When can navigation be cancelled or redirected?          | Navigation Lifecycle                       |
| 12    | Planned | How do you skip re-renders for unchanged routes?         | Structural Sharing, Granular Subscriptions |
| 13    | Planned | Can browsers animate route transitions natively?         | View Transitions API                       |
| 14    | Planned | Why is scroll restoration so hard?                       | Scroll Restoration                         |
| 15    | Planned | How do you cancel in-flight loaders?                     | Abortable Navigation                       |

## What's built

Slices 1 through 8 are done. The router supports:

- **Dynamic params** `/user/$id` matches `/user/atharv` and extracts `{ id: "atharv" }`
- **Wildcard routes** `/files/*` matches `/files/public/uploads/report.pdf` and captures the full path
- **Nested layouts** `/settings` wraps its children in a sidebar layout via `<Outlet />`
- **Pathless layouts** `_auth` wraps routes without adding a URL segment
- **Nested outlets** 3+ levels of rendering depth (root, layout, page)
- **Programmatic navigation** `useRouter()` hook for navigating from event handlers and effects
- **Persistent layouts** nav and sidebars stay mounted across navigations, no remounting
- **Data loaders** fetch data before rendering with `useLoaderData()` hook
- **Parallel loader execution** all matched route loaders run simultaneously
- **Loader caching** same route + same params reuses previous loader data
- **Race condition protection** stale loader results are discarded on rapid navigation
- **Per-route error boundaries** loader and render errors are isolated to the failing route
- **Custom error components** each route can define its own `errorComponent`
- **useRouteError** access the error from within an error component
- **Prefetch on hover** run loaders early when the user hovers a link
- **Prefetch cache** TTL-based cache with dedup, configurable delay
- **Search params** `validateSearch` for typed, parsed URL state
- **Search param navigation** merge or replace params with `navigate(path, { search })`
- **useSearch** access validated search params per route
- **File-based routing** codegen from filesystem via AST inspection
- **Route tree generation** `routeTree.gen.ts` generated from folder structure

## Tech stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript (strict)
- **Demo app:** Vite + React 19
- **Router package:** Pure TypeScript, zero runtime dependencies
- **Docs:** Blume (Astro-based docs framework)
- **Testing:** Vitest + @testing-library/react

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

## Documentation

Every slice has a corresponding deep-dive article explaining both the implementation and the architectural reasoning behind it.

- [What Actually Happens When You Click a Link in React](https://tty.atharvdangedev.in/blog/what-happens-when-you-click-a-link-in-react) Slices 1-2: History API + Route Matching
- [Layouts That Persist and Data That Arrives Before You Do](https://tty.atharvdangedev.in/blog/layout-that-persists-and-data-that-arrives-before-you-do) Slices 3-4: Nested Routes + Data Loaders
- [Per-Route Error Boundaries and Prefetch on Hover](https://tty.atharvdangedev.in/blog/per-route-error-boundaries-and-prefetch-on-hover) Slices 5-6: Error Boundaries and Prefetch on Hover
- [The URL Remembers, and the Filesystem Already Knows](https://tty.atharvdangedev.in/blog/the-url-remembers-and-the-filesystem-already-knows) Slices 7-8: Search Params + File-Based Codegen

The goal isn't just to explain how Michi works. It's to explain why modern routers were designed this way in the first place.

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

Each page demonstrates one architectural concept in isolation.

## From first principles

Michi is part of the **From First Principles** series, a collection of educational implementations that explore how modern web technologies work by rebuilding them from scratch.

| Project                        | Core Question                                               |
| ------------------------------ | ----------------------------------------------------------- |
| **Michi (道)**                 | What actually happens between the click and the render?     |
| **Hikari (光)**                | How does a modern rendering engine actually work?           |
| **Rei (零)** _(Planned)_       | How does server state stay synchronized?                    |
| **Reiatsu (霊圧)** _(Planned)_ | What actually happens when JavaScript talks to the network? |
| **Tsuzumi (鼓)** _(Planned)_   | How does source code become executable code?                |
| **Kumo (雲)** _(Planned)_      | How do edge runtimes execute JavaScript?                    |

## License

MIT
