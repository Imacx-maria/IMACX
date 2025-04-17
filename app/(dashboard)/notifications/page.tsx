import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl">Notifications</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>
            Manage your notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display your notifications, alerts, and system messages. 
            You'll be able to configure notification preferences, mark items as read, 
            and manage notification delivery methods.
            The implementation is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}