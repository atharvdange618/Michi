# Michi Demo App

A Vite + React 19 application that demonstrates every feature of the Michi router.

## Running

```bash
pnpm dev
```

## What it shows

- **Dynamic routing** `/user/$id` extracts params from the URL
- **Nested layouts** `/settings` wraps children in a persistent sidebar
- **Pathless layouts** `_auth` wraps `/dashboard` without adding a URL segment
- **Data loaders** fetch data before rendering, with parallel execution and caching
- **Error boundaries** per-route error isolation with custom error components
- **Prefetch on hover** run loaders early when the user hovers a link
- **Search params** typed, validated URL state with `useSearch()`
- **Programmatic navigation** `useRouter()` for navigating from event handlers

## Routes

```
/                         Home page
/about                    About page
/navigate                 Programmatic navigation + back/forward buttons
/user/$id                 Dynamic params (/user/atharv, /user/maithili)
/files/*                  Wildcard catch-all (/files/public/uploads/report.pdf)
/dashboard                Pathless layout (_auth) + nested layout with sidebar
/dashboard/analytics      Nested outlet (3 levels deep)
/settings/profile         Nested layout with parallel loaders + caching
/settings/billing         Same layout, different child
/settings/billing-error   Error isolation: child errors, parent layout stays
/errors/loader-fail       Loader error with custom error component
/errors/render-fail       Render error with custom error component
/prefetch                 Prefetch on hover with intent detection
/prefetch-fail            Failed prefetch handling
/users?page=1             Search params: pagination, sort, filter
/users?page=abc           Search params: validation error demo
```
