import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, BarChart2Icon, LineChartIcon, PieChartIcon, TrendingUpIcon, UsersIcon, DollarSignIcon } from "lucide-react";

export default function AnalyticsDashboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl">Analytics Dashboard</h1>
      </div>
      
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          The Analytics Dashboard module is currently under development. Check back soon for updates.
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
            <div className="mt-4 h-[80px] w-full bg-muted/30 flex items-center justify-center text-muted-foreground">
              <BarChart2Icon className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
            <div className="mt-4 h-[80px] w-full bg-muted/30 flex items-center justify-center text-muted-foreground">
              <LineChartIcon className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Growth</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              +4.1% from last month
            </p>
            <div className="mt-4 h-[80px] w-full bg-muted/30 flex items-center justify-center text-muted-foreground">
              <PieChartIcon className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted/30 flex items-center justify-center text-muted-foreground">
              <BarChart2Icon className="h-16 w-16" />
              <span className="ml-2">Sales Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription>Customer distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted/30 flex items-center justify-center text-muted-foreground">
              <PieChartIcon className="h-16 w-16" />
              <span className="ml-2">Demographics Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Customer Acquisition Cost</p>
                  <p className="text-xs text-muted-foreground">Cost per new customer</p>
                </div>
                <div className="font-medium">$24.50</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Average Order Value</p>
                  <p className="text-xs text-muted-foreground">Average revenue per order</p>
                </div>
                <div className="font-medium">$156.25</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Conversion Rate</p>
                  <p className="text-xs text-muted-foreground">Visitors who completed a purchase</p>
                </div>
                <div className="font-medium">3.2%</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Customer Lifetime Value</p>
                  <p className="text-xs text-muted-foreground">Projected revenue from a customer</p>
                </div>
                <div className="font-medium">$1,245.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}