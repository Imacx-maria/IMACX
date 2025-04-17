import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilesPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl">User Profiles</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Profile Management</CardTitle>
          <CardDescription>
            View and manage user profiles in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will allow you to manage user profiles, including viewing user details, 
            editing profiles, and managing user permissions. The implementation is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}