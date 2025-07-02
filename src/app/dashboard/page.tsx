// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import AdminDashboard from "@/components/dashboards/AdminDashboard";
import UserDashboard from "@/components/dashboards/UserDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login/user");
  }

  // We still use the server session to decide which component to render
  if (session.user?.role === "Admin") {
    return <AdminDashboard />;
  }

  if (session.user?.role === "User") {
    // No longer passing the user prop
    return <UserDashboard />;
  }

  return (
    <div>
      <h1>Error</h1>
      <p>
        Your user role could not be determined. Please sign out and try again.
      </p>
    </div>
  );
}
