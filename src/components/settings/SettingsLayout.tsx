import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  children: ReactNode;
  className?: string;
}

export function SettingsLayout({ children, className }: SettingsLayoutProps) {
  return (
    <div className={cn("max-w-4xl mx-auto p-6 space-y-6", className)}>
      <h1 className="text-3xl font-bold">Settings</h1>
      {children}
    </div>
  );
}