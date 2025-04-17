"use client"; // Mark as a Client Component

import Link from "next/link"; // Keep necessary imports
import Image from "next/image";
import { cn } from "@/lib/utils"; // Import cn utility
/* Removed duplicate cn import */

import { usePathname, useRouter } from "next/navigation"; // Re-add usePathname and add useRouter
import { navigationItems } from "@/lib/config/navigation"; // Re-add navigation items
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuBarDemo } from "@/app/components/menu-bar-demo";
import { LogOut } from "lucide-react";
// Removed temporary createClient import
import { supabase } from "@/lib/supabase/client"; // Restore original import if needed elsewhere, or remove if unused

// The DashboardHeader function moved here
export function DashboardHeader() {
  const { user, logout } = useAuth();
  // console.log('User state in header:', user); // Removed user state log
  const router = useRouter();
  const pathname = usePathname();

  const initials =
    user && user.profile
      ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`
      : "U";

  const handleLogout = async () => {
    // Reverted to original logic + logging from previous steps
    console.log("[Header] handleLogout triggered.");
    try {
      console.log("[Header] Calling logout() from AuthContext...");
      // Call the logout function from context - This should handle signOut and redirect
      await logout();
      console.log("[Header] AuthContext logout() finished."); // This might not be reached if redirect happens first

      // Redirect is now handled within AuthContext.logout, removing it from here.
      // console.log("[Header] Pushing to /login route...");
      // router.push("/login");
      // console.log("[Header] Navigation to /login initiated.");

    } catch (error) {
      // Catch errors specifically from the context logout call if it throws
      console.error("[Header] Error during handleLogout (calling context logout):", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4 pl-2">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/Logo_dark_theme.png"
              alt="IMACX Suite Logo"
              width={120}
              height={40}
              className="hidden dark:block"
              priority
            />
            <Image
              src="/Logo_light_theme.png"
              alt="IMACX Suite Logo"
              width={120}
              height={40}
              className="block dark:hidden"
              priority
            />
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center">
          <MenuBarDemo />
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="dark:text-white">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuLabel>
                {user && user.profile
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : "Account"}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {user ? user.email : ""}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}