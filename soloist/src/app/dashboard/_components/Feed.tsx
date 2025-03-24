// FEED
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Space.tsx

"use client";

import React from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import DailyLogForm from "@/components/dailyLogForm";
import { Info } from "lucide-react";

const Feed = () => {
  const { sidebarMode, setSidebarMode, selectedDate } = useSidebarStore();

  const handleCloseForm = () => setSidebarMode("default");

  return (
    <div className="w-64 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col">
      {sidebarMode === "logForm" ? (
        <>
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">
              {selectedDate ? "Daily Log" : "New Log"}
            </h2>
            <p className="text-xs text-zinc-400">
              {selectedDate ? `Date: ${selectedDate}` : "Create a new daily log"}
            </p>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {/* Pass in the selectedDate! */}
            <DailyLogForm onClose={handleCloseForm} date={selectedDate ?? undefined} />
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

export default Feed;