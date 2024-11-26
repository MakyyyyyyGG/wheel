"use client";

import { useState } from "react";
import { EntryForm } from "../components/entry-form";
import { SpinModal } from "../components/spin-modal";
import { Wheel } from "../components/wheel";
import type { WheelEntry } from "../types/wheel";
import { Button } from "@/components/ui/button";

export default function WheelPage() {
  const [entries, setEntries] = useState<WheelEntry[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpinClick = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      const nextWinnerIndex = entries.findIndex((entry) => entry.odds === 100);
      if (nextWinnerIndex !== -1) {
        setSelectedIndex(nextWinnerIndex);
      } else {
        setSelectedIndex(0);
        const updatedEntries = entries.map((entry, index) => ({
          ...entry,
          odds: index === 0 ? 100 : 0,
        }));
        setEntries(updatedEntries);
      }
    }
  };

  const handleSpinEnd = () => {
    setIsSpinning(false);
  };

  const handleEntriesUpdate = (newEntries: WheelEntry[]) => {
    if (JSON.stringify(newEntries) !== JSON.stringify(entries)) {
      setEntries(newEntries);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold mb-4">Spin the Wheel!</h1>

        <div className="flex gap-8 items-start w-full justify-center">
          <div className="flex-1 max-w-md">
            <EntryForm
              entries={entries}
              onEntriesChange={handleEntriesUpdate}
            />
          </div>

          <div className="flex-1 max-w-[600px]">
            <div className="origin-top">
              <Wheel
                entries={entries}
                isSpinning={isSpinning}
                onSpinEnd={handleSpinEnd}
                selectedIndex={selectedIndex}
                onEntriesUpdate={handleEntriesUpdate}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={entries.length === 0}
          className="px-8 py-4 text-lg"
        >
          Open Fullscreen
        </Button>

        <SpinModal
          isOpen={isModalOpen}
          onClose={() => {
            if (!isSpinning) {
              setIsModalOpen(false);
            }
          }}
          onSpin={handleSpinClick}
          entries={entries}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
          selectedIndex={selectedIndex}
          onEntriesUpdate={handleEntriesUpdate}
        />
      </div>
    </div>
  );
}
