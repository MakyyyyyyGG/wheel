"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wheel } from "./wheel";
import { WinnerAlert } from "./winner-alert";
import { useState, useEffect } from "react";
import type { WheelEntry } from "../types/wheel";

interface SpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpin: () => void;
  entries: WheelEntry[];
  isSpinning: boolean;
  onSpinEnd: () => void;
  selectedIndex: number | null;
  onEntriesUpdate: (entries: WheelEntry[]) => void;
}

export function SpinModal({
  isOpen,
  onClose,
  onSpin,
  entries,
  isSpinning,
  onSpinEnd,
  selectedIndex,
  onEntriesUpdate,
}: SpinModalProps) {
  const [showWinnerAlert, setShowWinnerAlert] = useState(false);

  // Reset winner alert when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowWinnerAlert(false);
    }
  }, [isOpen]);

  // Show winner alert when spin ends
  useEffect(() => {
    if (!isSpinning && selectedIndex !== null) {
      const timer = setTimeout(() => {
        setShowWinnerAlert(true);
      }, 500); // Small delay after spin ends
      return () => clearTimeout(timer);
    }
  }, [isSpinning, selectedIndex]);

  const handleSpinEnd = () => {
    onSpinEnd();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-full min-h-full border-none">
          <div className="flex flex-col items-center gap-4">
            <Wheel
              entries={entries}
              isSpinning={isSpinning}
              onSpinEnd={handleSpinEnd}
              selectedIndex={selectedIndex}
              onEntriesUpdate={onEntriesUpdate}
            />
            <Button
              onClick={onSpin}
              disabled={isSpinning}
              className={`px-8 py-6 text-md font-bold ${
                isSpinning
                  ? "bg-gray-400"
                  : selectedIndex !== null
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSpinning
                ? "Spinning..."
                : selectedIndex !== null
                ? "Spin Again!"
                : "Spin the Wheel!"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedIndex !== null && (
        <WinnerAlert
          isOpen={showWinnerAlert}
          onClose={() => setShowWinnerAlert(false)}
          winnerName={entries[selectedIndex].name}
          onSpinAgain={onSpin}
        />
      )}
    </>
  );
}
