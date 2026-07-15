import { createRoot } from "react-dom/client";
import { Router, RouterProvider } from "michi";
import { StrictMode } from "react";
import LoaderFailPage, {
  errorComponent as loaderFailError,
  loader as loaderFailLoader,
} from "./routes/errors/loader-fail";
import RenderFailPage, { errorComponent as renderFailError } from "./routes/errors/render-fail";
import UserPage, { loader as userLoader } from "./routes/user/$id";
import AboutPage from "./routes/about";
import AnalyticsPage from "./routes/dashboard/analytics";
import AuthLayout from "./routes/_auth";
import BillingPage from "./routes/settings/billing";
import DashboardHome from "./routes/dashboard/index";
import DashboardLayout from "./routes/dashboard";
import FilePage from "./routes/files/$wildcard";
import IndexPage from "./routes/index";
import NavigatePage from "./routes/navigate";
import ParamsShowcasePage from "./routes/showcase/$id";
import ProfilePage from "./routes/settings/profile";
import RootLayout from "./routes/__root";
import SettingsLayout from "./routes/settings";
import PrefetchExplainerPage from "./routes/prefetch";
import PrefetchDemoTarget, { loader as prefetchDemoLoader } from "./routes/prefetch-demo";
import UsersPage, {
  loader as usersLoader,
  validateSearch as usersValidateSearch,
} from "./routes/users";

const router = new Router([
  {
    path: "__root",
    component: RootLayout,
    children: [
      { path: "/", component: IndexPage },
      { path: "/about", component: AboutPage },
      { path: "/navigate", component: NavigatePage },
      { path: "/user/$id", component: UserPage, loader: userLoader },
      { path: "/showcase/$id", component: ParamsShowcasePage },
      { path: "/files/*", component: FilePage },
      {
        path: "_auth",
        component: AuthLayout,
        children: [
          {
            path: "/dashboard",
            component: DashboardLayout,
            children: [
              { path: "/dashboard", component: DashboardHome },
              { path: "/dashboard/analytics", component: AnalyticsPage },
            ],
          },
        ],
      },
      {
        path: "/settings",
        component: SettingsLayout,
        children: [
          { path: "/settings/profile", component: ProfilePage },
          { path: "/settings/billing", component: BillingPage },
        ],
      },
      {
        path: "/errors/loader-fail",
        component: LoaderFailPage,
        loader: loaderFailLoader,
        errorComponent: loaderFailError,
      },
      {
        path: "/errors/render-fail",
        component: RenderFailPage,
        errorComponent: renderFailError,
      },
      { path: "/prefetch", component: PrefetchExplainerPage },
      {
        path: "/prefetch-demo",
        component: PrefetchDemoTarget,
        loader: prefetchDemoLoader,
      },
      {
        path: "/users",
        component: UsersPage,
        loader: usersLoader,
        validateSearch: usersValidateSearch,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
