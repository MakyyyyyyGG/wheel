"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { Wheel } from './components/wheel'
// import { EntryForm } from './components/entry-form'
// import type { WheelEntry } from './types/wheel'
// import { normalizeOdds } from './utils/wheel-utils'
import { keyframes } from "@emotion/react";
import { Wheel } from "./wheel";
import { EntryForm } from "./entry-form";
import { WheelEntry } from "@/types/wheel";
import { normalizeOdds } from "@/utils/wheel-utils";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export default function WheelOfNames() {
  const [entries, setEntries] = useState<WheelEntry[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSlowingDown, setIsSlowingDown] = useState(false);

  const normalizedEntries = normalizeOdds(entries);

  const handleSpin = () => {
    if (!isSpinning && entries.length > 0) {
      setSelectedIndex(null);
      setIsSpinning(true);
      setIsSlowingDown(false);

      // Select a random index based on odds
      const random = Math.random() * 100;
      let accumulator = 0;
      let index = 0;

      for (let i = 0; i < normalizedEntries.length; i++) {
        accumulator += normalizedEntries[i].odds;
        if (random <= accumulator) {
          index = i;
          break;
        }
      }

      // Delay setting the selected index until the wheel has been spinning for a while
      setTimeout(() => {
        setSelectedIndex(index);
        setIsSlowingDown(true);
      }, 5000);
    }
  };

  const handleSpinEnd = () => {
    setIsSpinning(false);
    setIsSlowingDown(false);
  };

  const animateFadeIn = {
    animation: `${fadeIn} 1s ease-out`,
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Setup</h2>
            <EntryForm
              entries={normalizedEntries}
              onEntriesChange={setEntries}
            />
            <Button
              className="w-full"
              disabled={entries.length === 0}
              onClick={() => setShowPreview(true)}
            >
              Preview Wheel
            </Button>
          </div>

          <div className="hidden md:block">
            <Wheel
              entries={normalizedEntries}
              isSpinning={isSpinning}
              onSpinEnd={handleSpinEnd}
              selectedIndex={selectedIndex}
            />
          </div>
        </div>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-full max-h-full flex flex-row overflow-auto">
            <DialogHeader>
              <DialogTitle>Wheel Preview</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 p-4 flex-1 overflow-auto min-w-[1000px]">
              <Wheel
                entries={normalizedEntries}
                isSpinning={isSpinning}
                onSpinEnd={handleSpinEnd}
                selectedIndex={selectedIndex}
              />
              <Button
                size="lg"
                disabled={isSpinning || entries.length === 0}
                onClick={handleSpin}
              >
                {isSpinning
                  ? isSlowingDown
                    ? "Almost there..."
                    : "Loading..."
                  : "Spin the Wheel"}
              </Button>
              {selectedIndex !== null && !isSpinning && (
                <div
                  className="text-xl font-bold text-center animate-fade-in"
                  style={animateFadeIn}
                >
                  Winner: {normalizedEntries[selectedIndex].name}!
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 p-4 flex-1 overflow-auto">
              <h3 className="text-lg font-bold">Names List</h3>
              <ul>
                {normalizedEntries.map((entry, index) => (
                  <li key={index} className="text-sm">
                    {entry.name}
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
