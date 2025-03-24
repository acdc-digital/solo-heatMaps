// CANVAS
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Canvas.tsx

"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useUser } from "@/hooks/useUser";

// Utility to convert a numeric month index to how many days are in that month (for 2025).
// NOTE: This is a simplistic approach that doesn't handle leap years, etc.
function daysInMonth(monthIndex: number): number {
  // monthIndex is 0-based (Jan=0, Feb=1, ... Dec=11).
  // For 2025, February has 28 days (not a leap year).
  if (monthIndex === 1) return 28; // Feb
  if ([3, 5, 8, 10].includes(monthIndex)) return 30; // Apr, Jun, Sep, Nov
  return 31; // All other months
}

// Get a Tailwind color class based on score
function getColorClass(score: number | null | undefined): string {
  if (score == null) return "bg-zinc-800"; // No log or no score
  if (score >= 90) return "bg-emerald-500";
  if (score >= 70) return "bg-emerald-400";
  if (score >= 50) return "bg-amber-400";
  if (score >= 30) return "bg-amber-500";
  if (score >= 10) return "bg-rose-400";
  return "bg-rose-600";
}

const Canvas: React.FC = () => {
  // 1) Get current user to pass to our Convex query
  const { user } = useUser();
  const userId = user ? user._id.toString() : "";

  // 2) We’ll assume we’re showing year 2025
  const year = "2025";

  // 3) Query to get all daily logs for this user and year
  //    You’ll need to define `listDailyLogs` in your Convex project:
  //    export const listDailyLogs = query({...});
  const dailyLogs = useQuery(api.dailyLogs.listDailyLogs, { userId, year });

  // 4) Zustand store for controlling the right sidebar
  const { setSidebarMode, setSelectedDate } = useSidebarStore();

  // 5) Handle loading state (if dailyLogs is null, the query is still fetching)
  if (!dailyLogs) {
    return (
      <div className="flex-1 p-6 overflow-auto bg-zinc-950 text-zinc-100">
        Loading your heatmap...
      </div>
    );
  }

  // 6) Convert dailyLogs array into a lookup map keyed by date ("YYYY-MM-DD")
  //    so we can quickly find if a particular day has a log.
  const logsMap = new Map<string, { date: string; score?: number }>();
  dailyLogs.forEach(log => {
    logsMap.set(log.date, log);
  });

  // 7) We’ll iterate over each month and each valid day, building the heatmap
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function handleDayClick(monthIndex: number, day: number) {
    // Convert to a "YYYY-MM-DD" string. MonthIndex is 0-based.
    const mm = String(monthIndex + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateString = `${year}-${mm}-${dd}`;

    // Set the selected date in your Zustand store,
    // and tell the sidebar to show the log form / detail.
    setSelectedDate(dateString);
    setSidebarMode("logForm");
  }

  return (
    <div className="flex-1 p-6 overflow-auto bg-zinc-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Your HeatMap</h1>
        <p className="text-zinc-400">Track your daily scores over time</p>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-zinc-100">{year}</h2>
          <p className="text-sm text-zinc-400">Daily scores from 0-100</p>
        </div>

        <div className="grid gap-4">
          {months.map((month, monthIndex) => {
            const totalDays = daysInMonth(monthIndex);

            return (
              <div key={month} className="space-y-2">
                <div className="text-sm font-medium text-zinc-300">{month}</div>
                {/* 
                  Instead of "grid-cols-XX" (which doesn't exist for large numbers), 
                  we use an inline style with repeat() for each day's column.
                */}
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
                    // Build a "YYYY-MM-DD" for this day
                    const mm = String(monthIndex + 1).padStart(2, "0");
                    const dd = String(day).padStart(2, "0");
                    const dateKey = `${year}-${mm}-${dd}`;

                    // Check if there's a log for this date
                    const log = logsMap.get(dateKey);
                    const score = log?.score ?? null;

                    return (
                      <div
                        key={day}
                        className={`w-5 h-5 rounded-sm ${getColorClass(score)} flex items-center justify-center cursor-pointer`}
                        title={score !== null ? `${month} ${day}: Score ${score}` : ""}
                        onClick={() => handleDayClick(monthIndex, day)}
                      >
                        <span className="text-[8px] text-zinc-100">
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Canvas;