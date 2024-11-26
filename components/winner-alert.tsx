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

interface WinnerAlertProps {
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
  onSpinAgain: () => void;
}

export function WinnerAlert({
  isOpen,
  onClose,
  winnerName,
  onSpinAgain,
}: WinnerAlertProps) {
  const handleSpinAgain = () => {
    onClose();
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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">
            🎉 We Have a Winner! 🎉
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl text-center mt-4">
            Congratulations
            <span className="block text-2xl font-bold text-primary mt-2">
              {winnerName}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 justify-center mt-4">
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          <Button
            onClick={handleSpinAgain}
            className="bg-green-500 hover:bg-green-600"
          >
            Spin Again!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
