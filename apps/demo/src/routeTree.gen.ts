// GENERATED FILE - DO NOT EDIT
// Run `pnpm codegen` to regenerate from src\routes

import type { RouteDefinition, RouteInfoOf } from "michi";
import Root from "./routes/__root";
import Auth from "./routes/_auth";
import AuthDashboard from "./routes/_auth/dashboard";
import AuthDashboardIndex from "./routes/_auth/dashboard/index";
import AuthDashboardAnalytics from "./routes/_auth/dashboard/analytics";
import Index from "./routes/index";
import About from "./routes/about";
import ErrorsLoaderFail, {
  loader as ErrorsLoaderFailLoader,
  errorComponent as ErrorsLoaderFailErrorComponent,
} from "./routes/errors/loader-fail";
import ErrorsRenderFail, {
  errorComponent as ErrorsRenderFailErrorComponent,
} from "./routes/errors/render-fail";
import Navigate from "./routes/navigate";
import Prefetch from "./routes/prefetch";
import PrefetchDemo, { loader as PrefetchDemoLoader } from "./routes/prefetch-demo";
import PrefetchFail, {
  loader as PrefetchFailLoader,
  errorComponent as PrefetchFailErrorComponent,
} from "./routes/prefetch-fail";
import Settings, { loader as SettingsLoader } from "./routes/settings";
import SettingsBilling from "./routes/settings/billing";
import SettingsBillingError, {
  loader as SettingsBillingErrorLoader,
  errorComponent as SettingsBillingErrorErrorComponent,
} from "./routes/settings/billing-error";
import SettingsProfile, { loader as SettingsProfileLoader } from "./routes/settings/profile";
import Users, {
  loader as UsersLoader,
  validateSearch as UsersValidateSearch,
} from "./routes/users";
import ShowcaseId from "./routes/showcase/$id";
import UserId, { loader as UserIdLoader } from "./routes/user/$id";
import Files from "./routes/files/$";

// "as const satisfies" instead of a ": RouteDefinition[]" annotation - the annotation
// would widen every literal (path strings, loader/validateSearch return types) down to
// RouteDefinition's own loose signatures before TypeScript ever gets to see them. "as const"
// is what actually preserves those literals through the whole nested children tree;
// "satisfies" checks the shape against RouteDefinition without discarding what "as const"
// preserved, the way a ":" annotation would.
export const routeTree = [
  {
    path: "__root",
    component: Root,
    children: [
      {
        path: "_auth",
        component: Auth,
        children: [
          {
            path: "/dashboard",
            component: AuthDashboard,
            children: [
              {
                path: "/dashboard",
                component: AuthDashboardIndex,
              },
              {
                path: "/dashboard/analytics",
                component: AuthDashboardAnalytics,
              },
            ],
          },
        ],
      },
      {
        path: "/",
        component: Index,
      },
      {
        path: "/about",
        component: About,
      },
      {
        path: "/errors/loader-fail",
        component: ErrorsLoaderFail,
        loader: ErrorsLoaderFailLoader,
        errorComponent: ErrorsLoaderFailErrorComponent,
      },
      {
        path: "/errors/render-fail",
        component: ErrorsRenderFail,
        errorComponent: ErrorsRenderFailErrorComponent,
      },
      {
        path: "/navigate",
        component: Navigate,
      },
      {
        path: "/prefetch",
        component: Prefetch,
      },
      {
        path: "/prefetch-demo",
        component: PrefetchDemo,
        loader: PrefetchDemoLoader,
      },
      {
        path: "/prefetch-fail",
        component: PrefetchFail,
        loader: PrefetchFailLoader,
        errorComponent: PrefetchFailErrorComponent,
      },
      {
        path: "/settings",
        component: Settings,
        loader: SettingsLoader,
        children: [
          {
            path: "/settings/billing",
            component: SettingsBilling,
          },
          {
            path: "/settings/billing-error",
            component: SettingsBillingError,
            loader: SettingsBillingErrorLoader,
            errorComponent: SettingsBillingErrorErrorComponent,
          },
          {
            path: "/settings/profile",
            component: SettingsProfile,
            loader: SettingsProfileLoader,
          },
        ],
      },
      {
        path: "/users",
        component: Users,
        loader: UsersLoader,
        validateSearch: UsersValidateSearch,
      },
      {
        path: "/showcase/$id",
        component: ShowcaseId,
      },
      {
        path: "/user/$id",
        component: UserId,
        loader: UserIdLoader,
      },
      {
        path: "/files/*",
        component: Files,
      },
    ],
  },
] as const satisfies RouteDefinition[];

// Powers Slice 9's typed routes: path -> { params, search, loaderData } for every
// navigable route, derived once here from the same tree the runtime router reads.
type GeneratedRouteInfo = RouteInfoOf<typeof routeTree>;

// Declaration merging, not a real export - lets "michi"'s hooks (defineRoute,
// navigate(), <Link to>) resolve this app's specific route types without the
// package ever importing this file. See RouteRegistry in michi's types.ts.
declare module "michi" {
  interface RouteRegistry {
    routes: GeneratedRouteInfo;
  }
}
