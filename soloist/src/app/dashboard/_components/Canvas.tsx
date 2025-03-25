// CANVAS
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Canvas.tsx

"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useUser } from "@/hooks/useUser";
import { Calendar, Loader2, AlertCircle, Info } from "lucide-react";

// shadcn UI components
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Utility to convert a numeric month index to how many days are in that month (for 2025).
function daysInMonth(monthIndex: number): number {
  // monthIndex is 0-based (Jan=0, Feb=1, ... Dec=11).
  // For 2025, February has 28 days (not a leap year).
  if (monthIndex === 1) return 28; // Feb
  if ([3, 5, 8, 10].includes(monthIndex)) return 30; // Apr, Jun, Sep, Nov
  return 31; // All other months
}

// Get a Tailwind color class based on score
function getColorClass(score: number | null | undefined): string {
  if (score == null) return "bg-zinc-800/20 border border-zinc-700/30"; // No log or no score
  if (score >= 90) return "bg-emerald-500/80 hover:bg-emerald-500";
  if (score >= 70) return "bg-emerald-400/80 hover:bg-emerald-400";
  if (score >= 50) return "bg-amber-400/80 hover:bg-amber-400";
  if (score >= 30) return "bg-amber-500/80 hover:bg-amber-500";
  if (score >= 10) return "bg-rose-400/80 hover:bg-rose-400";
  return "bg-rose-600/80 hover:bg-rose-600";
}

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Canvas: React.FC = () => {
  // 1) Get current user to pass to our Convex query
  const { user } = useUser();
  const userId = user ? user._id.toString() : "";

  // 2) We'll assume we're showing year 2025
  const year = "2025";
  
  // Track the current date for highlighting "today"
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // 3) Query to get all daily logs for this user and year
  const dailyLogs = useQuery(api.dailyLogs.listDailyLogs, { userId, year });

  // 4) Zustand store for controlling the right sidebar
  const { setSidebarMode, setSelectedDate } = useSidebarStore();

  // State to track which legend item is being hovered
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

  // 5) Handle loading state (if dailyLogs is null, the query is still fetching)
  if (!dailyLogs) {
    return (
      <div className="flex-1 p-6 overflow-auto bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="h-10 w-10 text-zinc-500 animate-spin" />
          <p className="text-zinc-400">Loading your heatmap...</p>
        </div>
      </div>
    );
  }

  // 6) Convert dailyLogs array into a lookup map keyed by date ("YYYY-MM-DD")
  const logsMap = new Map<string, { date: string; score?: number }>();
  dailyLogs.forEach(log => {
    logsMap.set(log.date, log);
  });

  // 7) We'll iterate over each month and each valid day, building the heatmap
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
                  
  const monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
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

  // Generate some stats for the header
  const totalLogs = dailyLogs.length;
  const averageScore = dailyLogs.reduce((sum, log) => sum + (log.score || 0), 0) / Math.max(1, totalLogs);
  
  // Define legend items
  const legendItems = [
    { label: "90-100", color: "bg-emerald-500", score: 95 },
    { label: "70-89", color: "bg-emerald-400", score: 75 },
    { label: "50-69", color: "bg-amber-400", score: 55 },
    { label: "30-49", color: "bg-amber-500", score: 35 },
    { label: "10-29", color: "bg-rose-400", score: 15 },
    { label: "0-9", color: "bg-rose-600", score: 5 },
    { label: "No Log", color: "bg-zinc-800/30 border border-zinc-700/50", score: null }
  ];

  return (
    <div className="flex-1 overflow-hidden bg-zinc-950">
      <ScrollArea className="h-full w-full" type="hover">
        <div className="min-w-[800px] p-6">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-zinc-400" />
                  Your HeatMap
                </h1>
                <p className="text-zinc-400 mt-1">Track your daily scores and see your progress over time</p>
              </div>
              
              {/* Stats badges */}
              <div className="flex gap-3">
                <Badge variant="outline" className="px-2 py-1 border-zinc-700 text-zinc-300">
                  {totalLogs} Logs
                </Badge>
                <Badge variant="outline" className="px-2 py-1 border-zinc-700 text-zinc-300">
                  Avg: {averageScore.toFixed(1)}
                </Badge>
              </div>
            </div>
          </div>

          <Card className="bg-zinc-900/50 border border-zinc-800/50 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-zinc-100">{year} Overview</h2>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <Info className="h-4 w-4 text-zinc-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                      <p>Click on any day to add or view a daily log</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-5">
                {months.map((month, monthIndex) => {
                  const totalDays = daysInMonth(monthIndex);
                  const isCurrentMonth = currentYear.toString() === year && currentMonth === monthIndex;

                  return (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                          {month}
                          {isCurrentMonth && (
                            <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-800">Current</Badge>
                          )}
                        </div>
                        
                        {/* Count of logs for this month */}
                        <div className="text-xs text-zinc-500">
                          {dailyLogs.filter(log => {
                            const logMonth = parseInt(log.date.split('-')[1]) - 1;
                            return logMonth === monthIndex;
                          }).length} logs
                        </div>
                      </div>
                      
                      <div
                        className="grid gap-1"
                        style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(24px, 1fr))` }}
                      >
                        {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
                          // Build a "YYYY-MM-DD" for this day
                          const mm = String(monthIndex + 1).padStart(2, "0");
                          const dd = String(day).padStart(2, "0");
                          const dateKey = `${year}-${mm}-${dd}`;

                          // Check if there's a log for this date
                          const log = logsMap.get(dateKey);
                          const score = log?.score ?? null;
                          
                          // Check if this is today
                          const isToday = currentYear.toString() === year && 
                                         currentMonth === monthIndex && 
                                         currentDay === day;
                          
                          // Check if this date should be highlighted based on legend hover
                          const shouldHighlight = hoveredLegend === null || 
                            (score !== null && 
                             ((hoveredLegend === "90-100" && score >= 90) || 
                              (hoveredLegend === "70-89" && score >= 70 && score < 90) ||
                              (hoveredLegend === "50-69" && score >= 50 && score < 70) ||
                              (hoveredLegend === "30-49" && score >= 30 && score < 50) ||
                              (hoveredLegend === "10-29" && score >= 10 && score < 30) ||
                              (hoveredLegend === "0-9" && score < 10)) ||
                             (score === null && hoveredLegend === "No Log"));

                          return (
                            <TooltipProvider key={day}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`relative w-6 h-6 rounded-sm ${getColorClass(score)} flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${!shouldHighlight ? 'opacity-30' : ''} ${isToday ? 'ring-1 ring-zinc-300' : ''}`}
                                    onClick={() => handleDayClick(monthIndex, day)}
                                  >
                                    <span className={`text-[10px] font-medium ${score !== null && score >= 50 ? 'text-zinc-900' : 'text-zinc-100'}`}>
                                      {day}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent 
                                  className="bg-zinc-800 border-zinc-700 text-zinc-200"
                                  side="top"
                                >
                                  <p>{monthsAbbr[monthIndex]} {day}, {year}</p>
                                  {score !== null ? (
                                    <p className="font-medium">Score: {score}</p>
                                  ) : (
                                    <p>No log yet</p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Separator after all months, before the legend */}
              <Separator className="my-6 bg-zinc-800/30" />
              
              {/* Legend - moved from top to bottom */}
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="w-full text-xs text-zinc-400 mb-2">Score legend:</div>
                {legendItems.map(item => (
                  <div 
                    key={item.label}
                    className="flex items-center gap-1.5 text-xs cursor-pointer transition-opacity duration-200 px-1.5 py-1 rounded-sm hover:bg-zinc-800/30"
                    style={{ 
                      opacity: hoveredLegend === null || hoveredLegend === item.label ? 1 : 0.5 
                    }}
                    onMouseEnter={() => setHoveredLegend(item.label)}
                    onMouseLeave={() => setHoveredLegend(null)}
                  >
                    <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                    <span className="text-zinc-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-zinc-500 bg-zinc-900/20 py-2 border-t border-zinc-800/30">
              Click on any day to view or create a daily log
            </CardFooter>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Canvas;