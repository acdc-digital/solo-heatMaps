// SIDEBAR
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Sidebar.tsx

"use client";

import React, { useState } from "react";
import { Home, Calendar, Settings, BarChart, PlusCircle, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  // State to track whether sidebar is collapsed
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // We want to know the current state as well, so we can toggle.
  const { sidebarMode, setSidebarMode } = useSidebarStore();

  const handleToggleNewLog = () => {
    if (sidebarMode === "logForm") {
      // If already open, close it
      setSidebarMode("default");
    } else {
      // Otherwise, open it
      setSidebarMode("logForm");
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <Calendar size={20} />, label: "Logs" },
    { icon: <BarChart size={20} />, label: "Analytics" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div 
      className={cn(
        "h-full flex-shrink-0 bg-zinc-900 border-r border-zinc-800/50 flex flex-col relative transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle button for sidebar collapse */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center z-10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={cn(
        "p-4 border-b border-zinc-800/50 flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {isCollapsed ? (
          <Menu size={20} className="text-zinc-100" />
        ) : (
          <>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Soloist</h2>
              <p className="text-xs text-zinc-400">Solomon Powered HeatMaps</p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 py-4">
        <nav className={cn(
          "space-y-1",
          isCollapsed ? "px-1" : "px-2"
        )}>
          <TooltipProvider delayDuration={300}>
            {menuItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full hover:bg-zinc-800/70 hover:text-white transition-all",
                      isCollapsed 
                        ? "justify-center h-10 px-0" 
                        : "justify-start gap-3 px-3 py-2 text-zinc-300"
                    )}
                  >
                    <span className="text-zinc-400 group-hover:text-white">
                      {item.icon}
                    </span>
                    {!isCollapsed && item.label}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-zinc-800 border-zinc-700/50 text-zinc-200">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>

      <div className={cn(
        "border-t border-zinc-800/50",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleToggleNewLog}
                className={cn(
                  "w-full hover:bg-zinc-800/70 hover:text-white transition-all",
                  isCollapsed 
                    ? "justify-center h-10 px-0" 
                    : "justify-start gap-2 px-3 py-2 text-zinc-300"
                )}
              >
                <PlusCircle size={20} className="text-zinc-400" />
                {!isCollapsed && (sidebarMode === "logForm" ? "Close Log Form" : "New Log")}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-zinc-800 border-zinc-700/50 text-zinc-200">
                {sidebarMode === "logForm" ? "Close Log Form" : "New Log"}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;