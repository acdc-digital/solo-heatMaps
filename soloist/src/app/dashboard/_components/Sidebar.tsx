// SIDEBAR
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Sidebar.tsx

"use client";

import React from "react";
import { Home, Calendar, Settings, BarChart, PlusCircle } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
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

  const menuItems = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <Calendar size={20} />, label: "Logs" },
    { icon: <BarChart size={20} />, label: "Analytics" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="h-full w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-100">Soloist</h2>
        <p className="text-xs text-zinc-400">Solomon Powered HeatMaps</p>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <span className="text-zinc-400 group-hover:text-white">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800">
        <Button
          variant="ghost"
          onClick={handleToggleNewLog}
          className="w-full justify-start gap-2 px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          <PlusCircle size={20} className="text-zinc-400" />
          {sidebarMode === "logForm" ? "Close Log Form" : "New Log"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;