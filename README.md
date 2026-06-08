# Michi (道)

**A from-first-principles client-side router, built to learn how routers actually work under the hood.**

## What is this?

Michi is an educational deep-dive into the internals of modern client-side routing. It's a real TypeScript package consumed by a real React app - but the goal isn't to replace TanStack Router or React Router. The goal is to understand the problems they solve and how they solve them.

Every feature is built from scratch: no routing libraries, no framework abstractions, just the raw History API and React primitives. Each concept gets its own slice - a self-contained, demonstrable milestone that builds on the previous one.

The name 道 (michi) is Japanese for "path" or "the way."

## What gets built

9 slices, each explaining a core routing concept:

| Slice | What it covers                                                               |
| ----- | ---------------------------------------------------------------------------- |
| 1     | **History API** - `pushState`, `popstate`, and the core router loop          |
| 2     | **Route Matching** - turning URL patterns into regex, dynamic params         |
| 3     | **Nested Routes** - the route tree, `<Outlet />`, and persistent layouts     |
| 4     | **Data Loaders** - render-as-you-fetch vs fetch-on-render                    |
| 5     | **Error Boundaries** - isolating failures per route instead of blank screens |
| 6     | **Prefetch on Hover** - running loaders early so navigation feels instant    |
| 7     | **Search Params** - typed, serializable state that lives in the URL          |
| 8     | **File-Based Routing** - a codegen script that reads your filesystem         |
| 9     | **Typed Routes** - compile-time safety for paths, params, and loader data    |

## Tech stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript (strict)
- **Demo app:** Vite + React
- **Router package:** Pure TypeScript, zero runtime dependencies

## Status

Planning phase. The design spec is completed, implementation starts soon.

## License

MIT
