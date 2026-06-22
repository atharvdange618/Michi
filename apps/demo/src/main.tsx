import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router, RouterProvider } from "michi";
import IndexPage from "./routes/index";
import AboutPage from "./routes/about";
import UserPage, { loader as userLoader } from "./routes/user/$id";
import NavigatePage from "./routes/navigate";
import RootLayout from "./routes/__root";
import AuthLayout from "./routes/_auth";
import DashboardLayout from "./routes/dashboard";
import DashboardHome from "./routes/dashboard/index";
import AnalyticsPage from "./routes/dashboard/analytics";
import SettingsLayout from "./routes/settings";
import ProfilePage from "./routes/settings/profile";
import BillingPage from "./routes/settings/billing";
import FilePage from "./routes/files/$wildcard";
import ParamsShowcasePage from "./routes/showcase/$id";
import LoaderFailPage, {
  loader as loaderFailLoader,
  errorComponent as loaderFailError,
} from "./routes/errors/loader-fail";
import RenderFailPage, { errorComponent as renderFailError } from "./routes/errors/render-fail";

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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
