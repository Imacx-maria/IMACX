'use client';

import RoleGuard from "@/components/RoleGuard";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['Designer', 'Admin', 'User', 'Editor']}>
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <DashboardHeader />
        <main className="flex-1 p-12">
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}