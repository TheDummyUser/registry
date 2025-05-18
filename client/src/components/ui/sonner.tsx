import { useTheme } from "next-themes";
import {
  Toaster as SonnerToaster,
  toast,
  useSonner,
  type ToasterProps,
  type ToastT,
  type ToastClassnames,
  type ToastToDismiss,
  type ExternalToast,
  type Action,
} from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export {
  Toaster,
  toast, // ✅ Re-export this
  useSonner, // ✅ Optional if you use it elsewhere
  type Action,
  type ExternalToast,
  type ToastClassnames,
  type ToastT,
  type ToastToDismiss,
  type ToasterProps,
};
