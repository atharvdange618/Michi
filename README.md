# Michi (道)

I've used React Router and TanStack Router in production for years. They work great. But I never really understood _how_ they work. So I started building one from scratch to find out.

Michi is a client-side router built from first principles - no routing libraries, no framework abstractions, just the raw History API and React primitives. It's not trying to replace anything. It's here to answer the question: what actually happens between the click and the render?

The name 道 (michi) is Japanese for "path" or "the way." Seemed fitting.

## The idea

Every feature is built as a **slice** - a self-contained, demonstrable milestone that builds on the previous one. Each slice answers a specific question about how routing works:

| Slice | Status  | What it covers                                                                                |
| ----- | ------- | --------------------------------------------------------------------------------------------- |
| 1     | ✅ Done | **History API** - `pushState`, `popstate`, and the core router loop                           |
| 2     | ✅ Done | **Route Matching** - turning URL patterns like `/user/$id` into regex that actually matches   |
| 3     | ✅ Done | **Nested Routes** - the route tree, `<Outlet />`, and layouts that persist across navigations |
| 4     | ✅ Done | **Data Loaders** - render-as-you-fetch vs fetch-on-render                                     |
| 5     | 🔲 Next | **Error Boundaries** - isolating failures per route instead of blank screens                  |
| 6     | 🔲      | **Prefetch on Hover** - running loaders early so navigation feels instant                     |
| 7     | 🔲      | **Search Params** - typed, serializable state that lives in the URL                           |
| 8     | 🔲      | **File-Based Routing** - a codegen script that reads your filesystem                          |
| 9     | 🔲      | **Typed Routes** - compile-time safety for paths, params, and loader data                     |

## The stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript (strict)
- **Demo app:** Vite + React 19
- **Router package:** Pure TypeScript, zero runtime dependencies
- **Testing:** Vitest + @testing-library/react

## What's done

Slices 1–4 are built and working. The router supports:

- **Dynamic params** - `/user/$id` matches `/user/atharv` and extracts `{ id: "atharv" }`
- **Wildcard routes** - `/files/*` matches `/files/public/uploads/report.pdf` and captures the full path
- **Nested layouts** - `/settings` wraps its children in a sidebar layout via `<Outlet />`
- **Pathless layouts** - `_auth` wraps routes without adding a URL segment
- **Nested outlets** - 3+ levels of rendering depth (root → layout → page)
- **Programmatic navigation** - `useRouter()` hook for navigating from event handlers, effects, etc.
- **Persistent layouts** - nav and sidebars stay mounted across navigations, no remounting
- **Data loaders** - fetch data before rendering with `useLoaderData()` hook
- **Parallel loader execution** - all matched route loaders run simultaneously
- **Race condition protection** - stale loader results are discarded on rapid navigation

Check out [the blog post](https://tty.atharvdangedev.in/blog/what-happens-when-you-click-a-link-in-react) for the deep dive on Slices 1–2 (History API + Route Matching).

## The demo app

The demo app at `apps/demo/` showcases every feature of the router:

```
/                    - Home page
/about               - About page
/navigate            - Programmatic navigation with useRouter()
/user/$id            - Dynamic params (/user/atharv, /user/maithili)
/files/*             - Wildcard catch-all (/files/public/uploads/report.pdf)
/dashboard           - Pathless layout (_auth) + nested layout with sidebar
/dashboard/analytics - Nested outlet (3 levels deep)
/settings/profile    - Nested layout with sidebar + Outlet
/settings/billing    - Same layout, different child
```

## License

MIT
