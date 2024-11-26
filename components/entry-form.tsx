"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WheelEntry } from "../types/wheel";

interface EntryFormProps {
  entries: WheelEntry[];
  onEntriesChange: (entries: WheelEntry[]) => void;
}

export function EntryForm({ entries, onEntriesChange }: EntryFormProps) {
  const [newName, setNewName] = useState("");

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addEntry = () => {
    if (newName.trim()) {
      const isFirstEntry = entries.length === 0;
      onEntriesChange([
        ...entries,
        {
          name: newName.trim(),
          odds: isFirstEntry ? 100 : 0,
          color: getRandomColor(),
        },
      ]);
      setNewName("");
    }
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
            <div className="flex-1">
              <div className="font-medium">{entry.name}</div>
              <div className="text-sm text-muted-foreground">
                Odds: {entry.odds}%
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
    </div>
  );
}
