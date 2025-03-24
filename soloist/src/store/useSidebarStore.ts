// FEED STORE
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/store/useSidebarStore.ts

"use client";

import { create } from "zustand";

// Enumerate possible "modes" for the right sidebar if you like, 
// or you can simply do a boolean. The enumeration is more extensible.
type SidebarMode = "default" | "logForm" | "someOtherMode";

interface SidebarState {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;

  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

// A simple Zustand store that tracks the current mode for the right sidebar
export const useSidebarStore = create<SidebarState>((set) => ({
  sidebarMode: "default",
  setSidebarMode: (mode) => set({ sidebarMode: mode }),

  // New piece of state:
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));