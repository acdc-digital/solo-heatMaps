// Dashboard Layout
// /Users/matthewsimon/Documents/GitHub/acdc.solomon-electron/solomon-electron/next/src/app/dashboard/DashboardLayout.tsx

"use client";

import React from "react";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

// Import your hooks
import { useUser, useUpsertUser } from "@/hooks/useUser";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // `useUser()` returns the user doc from the database (or null if not found)
  // and also a boolean isSignedIn which is based on the auth session token.
  const { user, isSignedIn } = useUser();

  // Ensures that a user doc exists (and is updated) whenever we're authenticated
  // The user doc might contain name, email, image, etc. 
  // Adjust arguments as needed if you want them from the GitHub profile or DB doc.
  useUpsertUser(user?.name, user?.email, user?.image);

  if (isLoading) {
    return (
      <div>
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  // If not authenticated at the session level, redirect to home page.
  if (!isAuthenticated) {
    return redirect("/");
  }

  // Once authenticated, render the dashboard layout children
  return <div className="dashboard-content">{children}</div>;
};

export default DashboardLayout;