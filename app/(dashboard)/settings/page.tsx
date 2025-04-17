import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="w-full py-8">
      <h1 className="mb-8 text-4xl">Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Configure your application preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will allow you to configure application settings, including:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
            <li>User interface preferences</li>
            <li>Notification settings</li>
            <li>Security settings</li>
            <li>Integration configurations</li>
            <li>Account preferences</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            The implementation is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}