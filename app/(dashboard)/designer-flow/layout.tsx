'use client';

import RoleGuard from "@/components/RoleGuard";

export default function DesignerFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['Designer', 'Admin']}>
      {children}
    </RoleGuard>
  );
} 