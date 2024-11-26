"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { WheelEntry } from "../types/wheel";

interface EntryFormProps {
  entries: WheelEntry[];
  onEntriesChange: (entries: WheelEntry[]) => void;
}

export function EntryForm({ entries, onEntriesChange }: EntryFormProps) {
  const [newName, setNewName] = useState("");

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addEntry = () => {
    if (newName.trim()) {
      onEntriesChange([
        ...entries,
        {
          name: newName.trim(),
          odds: Math.floor(100 / (entries.length + 1)), // Use Math.floor for consistent rounding
          color: getRandomColor(),
        },
      ]);
      setNewName("");
    }
  };

  const updateOdds = (index: number, odds: number) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], odds: Math.floor(odds) }; // Use Math.floor for consistent rounding
    onEntriesChange(newEntries);
  };

  const removeEntry = (index: number) => {
    onEntriesChange(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEntry()}
        />
        <Button type="button" onClick={addEntry}>
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={`entry-${index}`} className="flex items-center gap-4">
            {/* <div className={`w-4 h-4 rounded-full ${entry.color}`} /> */}
            <div className="flex-1">
              <div className="font-medium">{entry.name}</div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[Math.floor(entry.odds)]} // Use Math.floor for consistent rounding
                  onValueChange={(value) => updateOdds(index, value[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {Math.floor(entry.odds)}%
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEntry(index)}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>

      {/* {entries.length > 0 && (
        <Button type="button" onClick={handlePreview} className="w-full mt-4">
          Preview Wheel
        </Button>
      )} */}
    </div>
  );
}
