// /src/app/test/page.tsx
"use client";

import React from "react";
import TestSidebar from "../dashboard/_components/TestSidebar";

export default function TestPage() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden pt-9 draggable bg-[#1b1b1b]">
      <div className="flex flex-1 overflow-hidden no-drag">
        <TestSidebar />
        <div className="flex-1 p-6 bg-zinc-950 text-zinc-100">
          <h1 className="text-2xl font-bold">Test Page</h1>
          <p className="mt-4">This page is for testing the dialog component.</p>
          <p className="mt-2">Click "Open Test Dialog" in the sidebar to trigger the dialog.</p>
        </div>
      </div>
    </div>
  );
}