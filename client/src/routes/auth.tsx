import { useAppSelector } from "@/redux/store";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();

  if (isAuth) {
    navigate({ to: "/app/Home", replace: true });
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
}
