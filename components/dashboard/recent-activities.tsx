import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivity } from "@/lib/utils/mock-data";

interface RecentActivitiesProps {
  title: string;
  description?: string;
  activities: RecentActivity[];
  className?: string;
}

export function RecentActivities({ title, description, activities, className }: RecentActivitiesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="relative mt-0.5 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {activity.user.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-semibold">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}