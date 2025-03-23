// SPACE
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Space.tsx

"use client";

import React from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import DailyLogForm from "@/components/dailyLogForm";
import { Info } from "lucide-react";

const Space = () => {
  const { sidebarMode, setSidebarMode } = useSidebarStore();

  const handleCloseForm = () => setSidebarMode("default");

  return (
    <div className="w-64 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col">
      {sidebarMode === "logForm" ? (
        <>
          {/* Optional: top heading */}
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">New Log</h2>
            <p className="text-xs text-zinc-400">Create a new daily log</p>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <DailyLogForm onClose={handleCloseForm} />
          </div>
        </>
      ) : (
        <>
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">Space</h2>
            <p className="text-xs text-zinc-400">Coming soon</p>
          </div>
          <div className="flex-1 p-4">
            <div className="rounded-lg bg-zinc-800/50 p-4 text-zinc-300 flex items-start">
              <Info size={16} className="mt-0.5 mr-2 flex-shrink-0 text-zinc-400" />
              <p className="text-sm">
                This area will be used for additional features in future updates.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Space;