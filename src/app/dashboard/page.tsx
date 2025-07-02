// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Import the dashboard components
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import UserDashboard from "@/components/dashboards/UserDashboard";

// This is an async Server Component
export default async function DashboardPage() {
  // Get the session on the server side
  const session = await getServerSession(authOptions);

  // Although the middleware protects this page, this is a redundant check
  // to ensure a session exists before proceeding.
  if (!session) {
    redirect("/login/user");
  }

  // Conditionally render the correct dashboard based on the user's role
  if (session.user?.role === "Admin") {
    return <AdminDashboard />;
  }

  if (session.user?.role === "User") {
    // Pass the user object as a prop
    return <UserDashboard user={session.user} />;
  }

  // Fallback for any other case (shouldn't happen)
  return (
    <div>
      <h1>Error</h1>
      <p>
        Your user role could not be determined. Please sign out and try again.
      </p>
    </div>
  );
}
