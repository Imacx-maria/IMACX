// Mock data for dashboard analytics
// In a real application, this would come from an API or database

export type StatCardData = {
  title: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
  description: string;
};

export type ChartData = {
  name: string;
  value: number;
  [key: string]: string | number;
};

// Mock data for stat cards
export const statCardsData: StatCardData[] = [
  {
    title: "Total Revenue",
    value: "$24,567",
    change: 12.5,
    trend: "up",
    description: "Compared to last month",
  },
  {
    title: "New Customers",
    value: 573,
    change: 8.2,
    trend: "up",
    description: "Compared to last month",
  },
  {
    title: "Active Projects",
    value: 34,
    change: -2.8,
    trend: "down",
    description: "Compared to last month",
  },
  {
    title: "Conversion Rate",
    value: "24.3%",
    change: 1.5,
    trend: "up",
    description: "Compared to last month",
  },
];

// Mock data for revenue chart
export const revenueData: ChartData[] = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 19000 },
  { name: "Mar", value: 15000 },
  { name: "Apr", value: 22000 },
  { name: "May", value: 18000 },
  { name: "Jun", value: 24000 },
  { name: "Jul", value: 21000 },
  { name: "Aug", value: 25000 },
  { name: "Sep", value: 19000 },
  { name: "Oct", value: 23000 },
  { name: "Nov", value: 20000 },
  { name: "Dec", value: 28000 },
];

// Mock data for customer acquisition chart
export const customerData: ChartData[] = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 150 },
  { name: "Mar", value: 180 },
  { name: "Apr", value: 220 },
  { name: "May", value: 250 },
  { name: "Jun", value: 280 },
  { name: "Jul", value: 260 },
  { name: "Aug", value: 300 },
  { name: "Sep", value: 320 },
  { name: "Oct", value: 290 },
  { name: "Nov", value: 350 },
  { name: "Dec", value: 380 },
];

// Mock data for sales by category
export const salesByCategoryData: ChartData[] = [
  { name: "Product A", value: 35 },
  { name: "Product B", value: 25 },
  { name: "Product C", value: 20 },
  { name: "Product D", value: 15 },
  { name: "Other", value: 5 },
];

// Mock data for user activity
export const userActivityData: ChartData[] = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 150 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 135 },
  { name: "Fri", value: 90 },
  { name: "Sat", value: 75 },
  { name: "Sun", value: 60 },
];

// Mock data for project status
export const projectStatusData: ChartData[] = [
  { name: "Completed", value: 45 },
  { name: "In Progress", value: 30 },
  { name: "Planning", value: 15 },
  { name: "On Hold", value: 10 },
];

// Mock data for recent activities
export type RecentActivity = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
};

export const recentActivitiesData: RecentActivity[] = [
  {
    id: "1",
    user: "John Doe",
    action: "created",
    target: "Project X",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "updated",
    target: "Client Y profile",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    user: "Mike Johnson",
    action: "completed",
    target: "Task Z",
    timestamp: "6 hours ago",
  },
  {
    id: "4",
    user: "Sarah Williams",
    action: "commented on",
    target: "Project A",
    timestamp: "8 hours ago",
  },
  {
    id: "5",
    user: "David Brown",
    action: "assigned",
    target: "Task B to Alex",
    timestamp: "10 hours ago",
  },
];