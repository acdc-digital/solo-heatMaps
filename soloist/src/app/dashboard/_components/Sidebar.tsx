// SIDEBAR
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Sidebar.tsx

// /src/app/dashboard/_components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import { Home, Calendar, Settings, BarChart, PlusCircle } from "lucide-react";
import DailyLogForm from "../../../components/dailyLogForm";

const Sidebar = () => {
  const [showLogForm, setShowLogForm] = useState(false);
  
  const menuItems = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <Calendar size={20} />, label: "Logs" },
    { icon: <BarChart size={20} />, label: "Analytics" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    // Make sure the sidebar has a fixed width of 64 and takes full height
    <div className="h-full w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-100">Soloist</h2>
        <p className="text-xs text-zinc-400">Solomon Powered HeatMaps</p>
      </div>
      
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center w-full px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors group"
            >
              <span className="mr-3 text-zinc-400 group-hover:text-white">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={() => setShowLogForm(true)}
          className="flex items-center w-full px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"
        >
          <PlusCircle size={20} className="mr-2 text-zinc-400" />
          New Log
        </button>
      </div>
      
      <DailyLogForm 
        isOpen={showLogForm} 
        onClose={() => setShowLogForm(false)} 
      />
    </div>
  );
};

export default Sidebar;