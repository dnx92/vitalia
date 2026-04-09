"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useUIStore } from "@/store";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-[--background]">
      <Sidebar type="professional" />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : ""}`}>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
