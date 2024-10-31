import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="w-dvw h-dvh flex overflow-hidden">
      <Outlet />
    </div>
  ),
});
