// FEED
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/dashboard/_components/Space.tsx

"use client";

import React from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import DailyLogForm from "@/components/dailyLogForm";
import { Info, MessageSquare, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";

// Convex
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// shadcn UI components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Feed: React.FC = () => {
  const { sidebarMode, setSidebarMode, selectedDate } = useSidebarStore();
  const { user } = useUser();

  const handleCloseForm = () => setSidebarMode("default");

  // 1) If we have a user doc, get its _id as a string
  const userId = user ? user._id.toString() : "";

  // 2) Call our "listFeedMessages" query from feed.ts
  const feedMessagesRaw = useQuery(
    userId ? api.feed.listFeedMessages : null,
    userId ? { userId } : undefined
  );

  // Sort messages to show newest first (if messages exist)
  const feedMessages = feedMessagesRaw ?
    [...feedMessagesRaw].sort((a, b) => b.createdAt - a.createdAt) :
    feedMessagesRaw;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 3) If the sidebar is showing the Daily Log Form...
  if (sidebarMode === "logForm") {
    return (
      <div className="h-full bg-zinc-900/95 border-l border-zinc-800 flex flex-col overflow-hidden transition-all duration-200 ease-in-out">
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-zinc-50 flex items-center gap-2">
            {selectedDate ? "Daily Log" : "New Log"}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {selectedDate
              ? `Date: ${formatDate(selectedDate)}`
              : "Record your experiences for today"}
          </p>
        </div>
        <div className="flex-1 px-4 py-6 overflow-auto">
          <DailyLogForm onClose={handleCloseForm} date={selectedDate ?? undefined} />
        </div>
      </div>
    );
  }

  // 4) Otherwise, we are in "default" mode – show the feed messages
  return (
    <div className="h-full bg-zinc-900/95 border-l border-zinc-800 flex flex-col transition-all duration-200 ease-in-out">
      <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-zinc-50 flex items-center gap-2">
          <MessageSquare size={18} className="text-zinc-400" />
          Feed
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Your insights and observations
        </p>
      </div>

      {/* Scrollable area for feed messages without visible scrollbar */}
      <ScrollArea className="flex-1 h-full" type="hover">
        <div className="px-4 py-6">
          {/* If feedMessages is undefined, it means it's still loading. */}
          {!feedMessages ? (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-400">
              <Loader2 size={24} className="animate-spin mb-2" />
              <p className="text-sm">Loading your insights...</p>
            </div>
          ) : feedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-400 p-4 border border-dashed border-zinc-800 rounded-lg">
              <Info size={24} className="mb-2 text-zinc-500" />
              <p className="text-sm text-center">No insights yet! Complete a daily log to get started.</p>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              {feedMessages.map((msg) => (
                <Card
                  key={msg._id.toString()}
                  className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/80 transition-colors duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-normal text-zinc-300 border-zinc-700 px-2">
                        {formatDate(msg.date)}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <Separator className="mb-3 bg-zinc-700/50" />
                    <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                      {msg.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Feed;