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
import {
  Calendar,
  Home,
  Sun,
  Moon,
  Computer,
} from "lucide-react/dist/lucide-react";

import { Outlet, useLocation } from "react-router/dist/development/index.d.mts";

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
  const location = useLocation();
  const { setTheme } = useTheme();
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <Sidebar className="z-20">
          <SidebarContent className="w-64 h-full flex flex-col border-r border-zinc-50">
            <div className="p-4 border-b border-zinc-50">
              <h2 className="text-lg font-semibold">Company name... or logo</h2>
            </div>

            {/* Scrollable menu container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <SidebarMenu className="p-2">
                {items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Button className="w-full">
                          <item.icon size={20} />
                          <a href={item.url}>
                            <span>{item.title}</span>
                          </a>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-50 flex items-center justify-between">
            <p>
              <SidebarTrigger variant="outline" />
              <span className="ml-4 font-medium">Dashboard</span>
            </p>

            <p className="">
              <Button
                variant="outline"
                onClick={() => {
                  setTheme((prev) => {
                    if (prev === "light") return "dark";
                    return "light";
                  });
                }}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                <Moon className="h-4 w-4 hidden" />
                <Computer className="h-4 w-4 hidden" />
              </Button>
            </p>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <div className=" rounded-lg p-6 h-full shadow-sm">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
