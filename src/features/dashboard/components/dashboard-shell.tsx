"use client";

import { usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import { PenLine, History } from "lucide-react";
import { DashboardSidebar, UserInfo } from "./dashboard-sidebar";

interface DashboardShellProps {
  user: UserInfo;
  children: React.ReactNode;
}

const FREE_POST_LIMIT = 3;
const NAV_ITEMS = [
  {
    title: "Generator",
    href: "/dashboard",
    icon: PenLine,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: History,
  },
];

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <DashboardSidebar navItems={NAV_ITEMS} user={user} freePostLimit={FREE_POST_LIMIT} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-sm font-medium">
            {pathname === "/dashboard" ? "Generator" : "History"}
          </h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
