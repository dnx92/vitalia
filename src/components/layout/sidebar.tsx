"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  Wallet, 
  Heart,
  Settings,
  Users,
  FileCheck,
  BarChart3,
  ChevronLeft,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, useUIStore } from "@/store";

interface SidebarProps {
  type?: "user" | "professional" | "admin";
}

const userNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/search", label: "Find Services", icon: Search },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/health", label: "Health Tracking", icon: Heart },
];

const professionalNavItems = [
  { href: "/professional", label: "Overview", icon: LayoutDashboard },
  { href: "/professional/services", label: "My Services", icon: FileCheck },
  { href: "/professional/calendar", label: "Calendar", icon: Calendar },
  { href: "/professional/patients", label: "Patients", icon: Users },
];

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/professionals", label: "Verifications", icon: Shield },
  { href: "/admin/transactions", label: "Transactions", icon: Wallet },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar({ type = "user" }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const navItems = type === "admin" ? adminNavItems : type === "professional" ? professionalNavItems : userNavItems;

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside
        className={cn(
          "fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-[--border] bg-[--surface] transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-[--radius-md] px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[--primary] text-white"
                        : "text-[--text-secondary] hover:bg-[--background] hover:text-[--text-primary]"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-[--border]">
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex items-center gap-3 rounded-[--radius-md] px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/dashboard/settings"
                    ? "bg-[--primary] text-white"
                    : "text-[--text-secondary] hover:bg-[--background] hover:text-[--text-primary]"
                )}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </div>
          </div>

          {user && type === "professional" && (
            <div className="border-t border-[--border] p-4">
              <div className="flex items-center gap-3 rounded-[--radius-md] bg-[--primary]/10 p-3">
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[--text-primary]">{user.name}</p>
                  <Badge variant="default" className="mt-1 text-[10px]">Professional</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
