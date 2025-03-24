// Dashboard 
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/page.tsx

"use client";

import React from "react";
import Sidebar from "./_components/Sidebar";
import { Canvas, Feed } from "./_components";

export default function DashboardPage() {
  return (
    // Remove any extra wrappers that might be affecting the sidebar
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <Canvas />
      <Feed />
    </div>
  );
}