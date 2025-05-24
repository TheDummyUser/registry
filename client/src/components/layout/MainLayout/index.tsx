import { Button } from "../../ui/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../../ui/sidebar";
import { useTheme } from "../../../context/theme.context";
import { Calendar, Home, Sun, Moon, Computer, LogOut } from "lucide-react";

import { Outlet } from "react-router";
import { useAuth } from "@/context/Auth.context";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/Auth.service";
import { toast } from "sonner";

const items = [
  {
    title: "Home",
    url: "/user/home",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "/user/#",
    icon: Calendar,
  },
];

const MainLayout = () => {
  const { setTheme } = useTheme();
  const { logout: authLogut, user } = useAuth();

  const { mutate, isSuccess, error, data } = useMutation({
    mutationFn: () => logout(user?.tokens?.refresh_token || ""),
  });

  const handleLogout = () => {
    mutate();
  };

  console.log("logout error", error);

  if (isSuccess) {
    toast(data?.message);
    setTimeout(() => {
      authLogut();
    }, 1000);
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <Sidebar className="z-20">
          <SidebarContent className="w-64 h-full flex flex-col">
            <div className="p-4 flex items-center justify-center">
              <h2 className="text-base">Company name... or logo</h2>
            </div>

            {/* Scrollable menu container */}
            <div className="flex-1 overflow-y-auto">
              <SidebarMenu className="px-4">
                {items.map((item) => {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <p className="flex p-5">
                          <item.icon size={20} />
                          <a href={item.url}>
                            <span>{item.title}</span>
                          </a>
                        </p>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <p>
              <SidebarTrigger variant="default" />
            </p>

            <p className="flex space-x-5">
              <Button onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setTheme((prev) => {
                    if (prev === "light") return "dark";
                    return "light";
                  });
                }}
                className=""
              >
                <Sun className="h-4 w-4" />
                <Moon className="h-4 w-4 hidden" />
                <Computer className="h-4 w-4 hidden" />
              </Button>
            </p>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <div className="rounded-[1.5rem] p-6 h-full border">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
