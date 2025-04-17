"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";
import { navigationItems } from "@/lib/config/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header"; // Import the header
import { CardWithGlow } from "@/components/ui/card-with-glow";
import { 
  ChartPie, 
  PackageOpen, 
  NotepadTextDashed, 
  CalendarCog, 
  Users, 
  CircleDollarSign,
  UserCog, 
  Settings, 
  Puzzle, 
  SwatchBook
} from "lucide-react";

// Copied from previous version
function DashboardCard({ 
  title, 
  description, 
  link,
  iconType
}: { 
  title: string, 
  description: string, 
  link: string,
  iconType: string
}) {
  const renderIcon = () => {
    switch (iconType) {
      case 'analytics':
        return <ChartPie size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'stock-management':
        return <PackageOpen size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'quoting-system':
        return <NotepadTextDashed size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'production-management':
        return <CalendarCog size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'employees':
        return <Users size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'price-structure':
        return <CircleDollarSign size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'users':
        return <UserCog size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'settings':
        return <Settings size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'components':
        return <Puzzle size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      case 'style-guide':
        return <SwatchBook size={85} color="#fa851a" strokeWidth={1.75} absoluteStrokeWidth />;
      default:
        return null;
    }
  };

  return (
    <Link href={link} className="block h-full">
      <CardWithGlow 
        className="hover:bg-accent/10 transition-colors h-[280px] text-center flex flex-col items-center justify-between z-20 relative p-6"
        glowProps={{ spread: 25, borderWidth: 1 }}
      >
        <div className="flex-shrink-0 flex justify-center">
          {renderIcon()}
        </div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg mb-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardWithGlow>
    </Link>
  );
}


export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [userDetails, setUserDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: ""
  });

  useEffect(() => {
    if (user && user.profile) {
      setUserDetails({
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        role: user.profile.role.name
      });
      console.log("User authenticated on home page:", user);
    } else if (!isLoading && !user) {
        // Redirect if not loading and not logged in
        router.push('/login'); // Or your specific login page route
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="relative z-10 flex-grow p-6 pt-10 flex flex-col items-center">
        {isLoading ? (
          <div className="flex justify-center">
            <p className="text-foreground font-medium">Loading authentication status...</p>
          </div>
        ) : user ? (
          <div className="w-full max-w-6xl space-y-8">
            <h2 className="text-2xl font-bold text-foreground">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navigationItems
                .filter(item => item.href !== '/') // Exclude the link to this page
                .map((item) => (
                  <DashboardCard
                    key={item.href}
                    title={item.title}
                    description={item.description}
                    link={item.href}
                    iconType={item.href.substring(1)}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-300 font-medium">
              Not authenticated. Please <a href="/login" className="underline">login</a> to continue.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
