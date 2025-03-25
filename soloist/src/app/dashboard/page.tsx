// Dashboard 
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/page.tsx

"use client";

import React, { useState } from "react";
import Sidebar from "./_components/Sidebar";
import { Canvas, Feed } from "./_components";

// Import the initResize function from your resizer file
import { initResize } from "@/components/resizer";

export default function DashboardPage() {
  const [feedWidth, setFeedWidth] = useState(300); // default width for feed
  const MIN_WIDTH = 250;
  const MAX_WIDTH = 480;

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left sidebar */}
      <Sidebar />

      {/* Middle canvas */}
      <Canvas />

      {/* Right feed panel */}
      <div
        id="feedPanel"
        className="relative flex-shrink-0 bg-zinc-900 border-l border-zinc-800"
        style={{ width: feedWidth }}
      >
        {/* A small draggable handle on the left edge of this panel */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize"
          onMouseDown={(e) => initResize(e, setFeedWidth, MIN_WIDTH, MAX_WIDTH)}
          onTouchStart={(e) => initResize(e, setFeedWidth, MIN_WIDTH, MAX_WIDTH)}
        />

        {/* Our actual Feed component */}
        <Feed />
      </div>
    </div>
  );
}