# Michi (道)

I've used React Router and TanStack Router in production for years. They work great. But I never really understood _how_ they work. So I started building one from scratch to find out.

Michi is a client-side router built from first principles - no routing libraries, no framework abstractions, just the raw History API and React primitives. It's not trying to replace anything. It's here to answer the question: what actually happens between the click and the render?

The name 道 (michi) is Japanese for "path" or "the way." Seemed fitting.

## The idea

Every feature is built as a **slice** - a self-contained, demonstrable milestone that builds on the previous one. Each slice answers a specific question about how routing works:

| Slice | What it covers                                                                                |
| ----- | --------------------------------------------------------------------------------------------- |
| 1     | **History API** - `pushState`, `popstate`, and the core router loop                           |
| 2     | **Route Matching** - turning URL patterns like `/user/$id` into regex that actually matches   |
| 3     | **Nested Routes** - the route tree, `<Outlet />`, and layouts that persist across navigations |
| 4     | **Data Loaders** - render-as-you-fetch vs fetch-on-render                                     |
| 5     | **Error Boundaries** - isolating failures per route instead of blank screens                  |
| 6     | **Prefetch on Hover** - running loaders early so navigation feels instant                     |
| 7     | **Search Params** - typed, serializable state that lives in the URL                           |
| 8     | **File-Based Routing** - a codegen script that reads your filesystem                          |
| 9     | **Typed Routes** - compile-time safety for paths, params, and loader data                     |

## The stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript (strict)
- **Demo app:** Vite + React
- **Router package:** Pure TypeScript, zero runtime dependencies

## What's done

Slice 1 (History API) and Slice 2 (Route Matching) are built and working. Check out [the blog post](https://tty.atharvdangedev.in/blog/what-happens-when-you-click-a-link-in-react) for the deep dive on those two.

The rest is in progress.

## License

MIT
