import type { WheelEntry } from "../types/wheel";

export const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

export function normalizeOdds(entries: WheelEntry[]): WheelEntry[] {
  const totalOdds = entries.reduce((sum, entry) => sum + entry.odds, 0);
  if (totalOdds === 0) return entries;

  return entries.map((entry) => ({
    ...entry,
    odds: (entry.odds / totalOdds) * 100,
  }));
}

export function calculateRotation(
  index: number,
  entries: WheelEntry[]
): number {
  let rotation = 0;
  for (let i = 0; i < index; i++) {
    rotation += (entries[i].odds / 100) * 360;
  }
  return rotation + ((entries[index].odds / 100) * 360) / 2;
}

export async function getWheelById(wheelId: string) {
  try {
    const response = await fetch(`/api/wheels/${wheelId}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching wheel:", error);
    return null;
  }
}
