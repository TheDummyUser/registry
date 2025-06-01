import { AppSidebar } from "@/components/app-sidebar";
import NotificationDrawer from "@/components/Notification-Sidebar";
import { Button } from "@/components/ui/button";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app")({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  if (isAuth) {
    navigate({ to: "/app/Home", replace: true });
  } else {
    navigate({ to: "/auth/login", replace: true });
  }

  const drawerClick = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-3  bg-accent">
        <div className="w-full h-[50px] flex items-center p-3 justify-between">
          <SidebarTrigger variant="outline" className="h-8 w-8 rounded-lg" />

          <div className="space-x-3">
            <Button variant="outline" onClick={drawerClick}>
              <Bell />
            </Button>
            <Button variant="outline">
              <LogOut />
            </Button>
          </div>
        </div>
        <div className="bg-background h-full rounded p-3">
          <Outlet />
        </div>
        <NotificationDrawer drawerOpen={drawerOpen} drawerClick={drawerClick} />
      </SidebarInset>
    </SidebarProvider>
  );
}
