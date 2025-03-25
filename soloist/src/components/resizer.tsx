// FEED PANEL RESIZER 
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/components/resizer.tsx

import React from "react";

type ResizeHandler = (
  e: React.MouseEvent | React.TouchEvent,
  setWidth: (w: number) => void,
  MIN_WIDTH: number,
  MAX_WIDTH: number
) => void;

export const initResize: ResizeHandler = (e, setWidth, MIN_WIDTH, MAX_WIDTH) => {
  // Prevent default to avoid text selection during resize
  e.preventDefault();
  e.stopPropagation();

  const startX =
    "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

  const feedPanelEl = document.getElementById("feedPanel");
  const startWidth = feedPanelEl
    ? feedPanelEl.offsetWidth
    : 300; // default if not found

  function onMouseMove(ev: MouseEvent | TouchEvent) {
    // Prevent any scrolling during resize
    ev.preventDefault();
    
    let clientX: number;
    if ("touches" in ev) {
      clientX = ev.touches[0].clientX;
    } else {
      clientX = (ev as MouseEvent).clientX;
    }

    const delta = clientX - startX;
    let newWidth = startWidth - delta;

    if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
    if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

    setWidth(newWidth);
    
    // Set a style on body to prevent scrolling during resize
    document.body.style.userSelect = 'none';
    document.body.style.overflow = 'hidden';
  }

  function onMouseUp() {
    // Remove event listeners
    document.removeEventListener("mousemove", onMouseMove as (ev: MouseEvent) => void);
    document.removeEventListener("touchmove", onMouseMove as (ev: TouchEvent) => void, { passive: false });
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("touchend", onMouseUp);
    
    // Re-enable scrolling and selection
    document.body.style.userSelect = '';
    document.body.style.overflow = '';
  }

  // Add event listeners - touchmove needs passive: false to allow preventDefault
  document.addEventListener("mousemove", onMouseMove as (ev: MouseEvent) => void);
  document.addEventListener("touchmove", onMouseMove as (ev: TouchEvent) => void, { passive: false });
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchend", onMouseUp);
};