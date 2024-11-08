import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return null;
};

export const Route = createRootRoute({
  component: () => (
    <div className="w-dvw h-dvh flex overflow-hidden bg-black">
      <Outlet />
    </div>
  ),
  notFoundComponent: NotFound,
});
