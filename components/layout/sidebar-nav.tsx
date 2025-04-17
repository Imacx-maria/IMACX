"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavProps {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary [&>span]:text-primary-foreground"
                : "hover:bg-muted [&>span]:text-muted-foreground hover:[&>span]:text-foreground"
            )}
          >
            <Icon className="h-8 w-8 text-[oklch(0.769_0.188_70.08)]" color="oklch(0.769 0.188 70.08)" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}