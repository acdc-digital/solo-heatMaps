// FEED
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Space.tsx

"use client";

import React from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import DailyLogForm from "@/components/dailyLogForm";
import { Info } from "lucide-react";
import { useUser } from "@/hooks/useUser";

// Convex
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// shadcn UI components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const Feed: React.FC = () => {
  const { sidebarMode, setSidebarMode, selectedDate } = useSidebarStore();
  const { user } = useUser();

  const handleCloseForm = () => setSidebarMode("default");

  // 1) If we have a user doc, get its _id as a string
  //    (or use user.authId if that's what your feed uses)
  const userId = user ? user._id.toString() : "";

  // 2) Call our "listFeedMessages" query from feed.ts
  //    Only call it if userId is non-empty, otherwise skip
  const feedMessages = useQuery(
    userId ? api.feed.listFeedMessages : null,
    userId ? { userId } : undefined
  );

  // 3) If the sidebar is showing the Daily Log Form...
  if (sidebarMode === "logForm") {
    return (
      <div className="w-64 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">
            {selectedDate ? "Daily Log" : "New Log"}
          </h2>
          <p className="text-xs text-zinc-400">
            {selectedDate ? `Date: ${selectedDate}` : "Create a new daily log"}
          </p>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <DailyLogForm onClose={handleCloseForm} date={selectedDate ?? undefined} />
        </div>
      </div>
    );
  }

  // 4) Otherwise, we are in "default" mode – show the feed messages
  return (
    <div className="w-64 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-100">Feed</h2>
        <p className="text-xs text-zinc-400">Your LLM replies and insights</p>
      </div>

      {/* Scrollable area for feed messages */}
      <ScrollArea className="flex-1 p-4">
        {/* If feedMessages is undefined, it means it's still loading. */}
        {!feedMessages ? (
          <div className="flex items-start text-zinc-400 text-sm">
            <Info size={16} className="mr-2 mt-0.5 text-zinc-400" />
            Loading feed messages...
          </div>
        ) : feedMessages.length === 0 ? (
          <div className="flex items-start text-zinc-400 text-sm">
            <Info size={16} className="mr-2 mt-0.5 text-zinc-400" />
            No feed messages yet!
          </div>
        ) : (
          feedMessages.map((msg) => (
            <Card key={msg._id.toString()} className="mb-2 bg-zinc-800 border-none">
              <CardHeader className="p-2">
                <p className="text-xs text-zinc-400">
                  {msg.date} – {new Date(msg.createdAt).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-sm text-zinc-200 whitespace-pre-line">
                  {msg.message}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default Feed;