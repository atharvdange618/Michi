import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router, RouterProvider } from "michi";
import IndexPage from "./routes/index";
import AboutPage from "./routes/about";
import UserPage from "./routes/user/$id";

const router = new Router([
  { path: "/", component: IndexPage },
  { path: "/about", component: AboutPage },
  { path: "/user/$id", component: UserPage },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
