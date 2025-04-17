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

export type KpiData = {
  title: string;
  value: number;
  target: number;
  unit?: string;
  description: string;
};

export type TableData = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  lastActive: string;
};

export type CalendarData = {
  date: Date;
  value: number;
};

export type MapLocationData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  value: number;
  color?: string;
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

// Mock data for KPIs
export const kpiData: KpiData[] = [
  {
    title: "Monthly Revenue",
    value: 24567,
    target: 30000,
    unit: "$",
    description: "Monthly revenue target",
  },
  {
    title: "New Customers",
    value: 573,
    target: 1000,
    description: "Monthly acquisition target",
  },
  {
    title: "Conversion Rate",
    value: 24.3,
    target: 30,
    unit: "%",
    description: "Target conversion rate",
  },
  {
    title: "Customer Satisfaction",
    value: 4.2,
    target: 5,
    description: "Average rating out of 5",
  },
];

// Mock data for table
export const usersTableData: TableData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    role: "Admin",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
    role: "Manager",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    status: "inactive",
    role: "Staff",
    lastActive: "1 week ago",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    status: "active",
    role: "Manager",
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    status: "pending",
    role: "Staff",
    lastActive: "Never",
  },
];

// Mock data for calendar heatmap
export const calendarData: CalendarData[] = [
  // Generate 90 days of data
  ...Array.from({ length: 90 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date,
      value: Math.floor(Math.random() * 10), // Random value between 0 and 10
    };
  }),
];

// Mock data for map
export const mapLocationsData: MapLocationData[] = [
  {
    id: "1",
    name: "New York",
    latitude: 40.7128,
    longitude: -74.006,
    value: 85,
  },
  {
    id: "2",
    name: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    value: 67,
  },
  {
    id: "3",
    name: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    value: 92,
  },
  {
    id: "4",
    name: "Sydney",
    latitude: -33.8688,
    longitude: 151.2093,
    value: 45,
  },
  {
    id: "5",
    name: "Rio de Janeiro",
    latitude: -22.9068,
    longitude: -43.1729,
    value: 32,
  },
  {
    id: "6",
    name: "Cape Town",
    latitude: -33.9249,
    longitude: 18.4241,
    value: 28,
  },
  {
    id: "7",
    name: "Moscow",
    latitude: 55.7558,
    longitude: 37.6173,
    value: 51,
  },
  {
    id: "8",
    name: "Beijing",
    latitude: 39.9042,
    longitude: 116.4074,
    value: 78,
  },
];