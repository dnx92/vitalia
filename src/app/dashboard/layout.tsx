"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore, useUIStore } from "@/store";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const pathname = usePathname();

  const getUserType = () => {
    if (pathname?.startsWith("/admin")) return "admin";
    if (pathname?.startsWith("/professional")) return "professional";
    return "user";
  };

  return (
    <div className="min-h-screen bg-[--background]">
      <Sidebar type={getUserType()} />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : ""}`}>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
