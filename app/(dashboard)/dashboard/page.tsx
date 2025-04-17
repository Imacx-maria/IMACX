import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CardWithGradientBorder } from "@/components/ui/card-with-gradient-border";
import { LayoutDashboardIcon, LineChartIcon, FileTextIcon, UsersIcon, SettingsIcon, InfoIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-theme(spacing.16))] items-start justify-center py-8">
      <div className="w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl">Dashboard</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Analytics Card */}
          <Link href="/analytics">
            <CardWithGradientBorder className="h-full flex flex-col">
              <CardHeader className="flex flex-col items-center pt-6 pb-2 text-center">
                <LineChartIcon className="h-12 w-12 text-orange-500" strokeWidth={1} />
                <CardTitle className="text-lg mt-2">Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 flex-grow">
                <CardDescription>View sales performance and metrics</CardDescription>
              </CardContent>
            </CardWithGradientBorder>
          </Link>
          
          {/* Stock Management Card */}
          <Link href="/stock-management">
            <CardWithGradientBorder className="h-full flex flex-col">
              <CardHeader className="flex flex-col items-center pt-6 pb-2 text-center">
                <LayoutDashboardIcon className="h-12 w-12 text-orange-500" strokeWidth={1} />
                <CardTitle className="text-lg mt-2">Stock Management</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 flex-grow">
                <CardDescription>Manage your inventory and orders</CardDescription>
              </CardContent>
            </CardWithGradientBorder>
          </Link>
          
          {/* Employees Card */}
          <Link href="/employees">
            <CardWithGradientBorder className="h-full flex flex-col">
              <CardHeader className="flex flex-col items-center pt-6 pb-2 text-center">
                <UsersIcon className="h-12 w-12 text-orange-500" strokeWidth={1} />
                <CardTitle className="text-lg mt-2">Employees</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 flex-grow">
                <CardDescription>Manage your team and assignments</CardDescription>
              </CardContent>
            </CardWithGradientBorder>
          </Link>
          
          {/* Quoting System Card */}
          <Link href="/quoting-system">
            <CardWithGradientBorder className="h-full flex flex-col">
              <CardHeader className="flex flex-col items-center pt-6 pb-2 text-center">
                <FileTextIcon className="h-12 w-12 text-orange-500" strokeWidth={1} />
                <CardTitle className="text-lg mt-2">Quoting System</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 flex-grow">
                <CardDescription>Create and manage quotes for customers</CardDescription>
              </CardContent>
            </CardWithGradientBorder>
          </Link>
          
          {/* Designer Flow Card */}
          <Link href="/designer-flow">
            <CardWithGradientBorder className="h-full flex flex-col">
              <CardHeader className="flex flex-col items-center pt-6 pb-2 text-center">
                <InfoIcon className="h-12 w-12 text-orange-500" strokeWidth={1} />
                <CardTitle className="text-lg mt-2">Designer Flow</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 flex-grow">
                <CardDescription>Design workflow and approvals</CardDescription>
              </CardContent>
            </CardWithGradientBorder>
          </Link>
          
          {/* Settings Card */}
          <Link href="/settings">
            <CardWithGradientBorder className="h-full flex flex-col">
              <CardHeader className="flex flex-col items-center pt-6 pb-2 text-center">
                <SettingsIcon className="h-12 w-12 text-orange-500" strokeWidth={1} />
                <CardTitle className="text-lg mt-2">Settings</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 flex-grow">
                <CardDescription>Configure system preferences</CardDescription>
              </CardContent>
            </CardWithGradientBorder>
          </Link>
        </div>
      </div>
    </div>
  );
} 