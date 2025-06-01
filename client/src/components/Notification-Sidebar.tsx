import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface NotificationDrawerProps {
  drawerOpen: boolean;
  drawerClick: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  drawerOpen,
  drawerClick,
}) => {
  return (
    <Drawer open={drawerOpen} direction="right" onClose={drawerClick}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="border-b">
            <div className="flex justify-between items-center">
              <DrawerTitle>Notifications</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="outline">
                  <X className="h-3 w-3" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription>Notification you got so far!</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 h-screen pb-0 border"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDrawer;
