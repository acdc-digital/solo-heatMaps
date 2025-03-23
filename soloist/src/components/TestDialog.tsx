// /src/components/TestDialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestDialog: React.FC<TestDialogProps> = ({ isOpen, onClose }) => {
  console.log("Dialog component rendered with isOpen:", isOpen); // Debug log
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogHeader>
        <p>This is a test dialog to verify the dialog component works.</p>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestDialog;