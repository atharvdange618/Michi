import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router, RouterProvider } from "michi";
import { routeTree } from "./routeTree.gen";

const router = new Router(routeTree);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
