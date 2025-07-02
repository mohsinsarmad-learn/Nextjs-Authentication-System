// src/components/dashboards/UserDashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserDashboard() {
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>User Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your personal dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
