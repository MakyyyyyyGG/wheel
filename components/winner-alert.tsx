"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import type { WheelEntry } from "../types/wheel";

interface WinnerAlertProps {
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
  onSpinAgain: () => void;
  entries: WheelEntry[];
  selectedIndex: number;
  onEntriesUpdate: (entries: WheelEntry[]) => void;
}

export function WinnerAlert({
  isOpen,
  onClose,
  winnerName,
  onSpinAgain,
  entries,
  selectedIndex,
  onEntriesUpdate,
}: WinnerAlertProps) {
  const handleSpinAgain = () => {
    updateEntriesAndSpin();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const updateEntriesAndSpin = () => {
    // Remove the winner and update the next person's odds
    const updatedEntries = entries.filter(
      (_, index) => index !== selectedIndex
    );

    // If there are remaining entries, set the next one to 100%
    if (updatedEntries.length > 0) {
      updatedEntries[0].odds = 100;
    }
    onEntriesUpdate(updatedEntries);
    onSpinAgain();
  };

  // Trigger confetti when the alert opens
  if (isOpen) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="min-w-[800px] min-h-[800px] flex flex-col items-center justify-center">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-2xl">
            🎉 We Have a Winner! 🎉
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl mt-4 text-center">
            Congratulations
            <span className="block text-5xl font-bold text-primary mt-2">
              {winnerName}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 justify-center mt-4">
          <Button
            onClick={handleSpinAgain}
            className="bg-green-500 hover:bg-green-600"
          >
            Spin Again!
          </Button>
          <AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
