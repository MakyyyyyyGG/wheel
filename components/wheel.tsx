"use client";

import { useEffect, useRef } from "react";
import type { WheelEntry } from "../types/wheel";

interface WheelProps {
  entries: WheelEntry[];
  isSpinning: boolean;
  onSpinEnd: () => void;
  selectedIndex: number | null;
  onEntriesUpdate: (entries: WheelEntry[]) => void;
}

export function Wheel({
  entries,
  isSpinning,
  onSpinEnd,
  selectedIndex,
  onEntriesUpdate,
}: WheelProps) {
  const wheelRef = useRef<SVGSVGElement>(null);
  const hasUpdatedOddsRef = useRef(false);

  // Define vibrant colors for the wheel
  const wheelColors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEEAD", // Yellow
    "#D4A5A5", // Pink
    "#9B59B6", // Purple
    "#3498DB", // Blue
    "#E67E22", // Orange
    "#1ABC9C", // Turquoise
    "#F1C40F", // Yellow
    "#E74C3C", // Red
    "#2ECC71", // Green
    "#BE90D4", // Purple
    "#F39C12", // Orange
  ];

  const normalizedEntries =
    entries.length > 0
      ? entries.map((entry, index) => ({
          ...entry,
          color: wheelColors[index % wheelColors.length], // Assign color based on index
        }))
      : [{ name: "Add items", odds: 100, color: "#CCCCCC" }];

  useEffect(() => {
    if (isSpinning && wheelRef.current && selectedIndex !== null) {
      let rotation = 0;
      const startTime = Date.now();
      const spinDuration = 6000;
      const slowdownTime = 4500;
      const segmentAngle = 360 / normalizedEntries.length;
      const spins = 5;
      const targetRotation =
        spins * 360 - (selectedIndex * segmentAngle + segmentAngle / 2);

      const animate = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / spinDuration, 1);

        if (progress < 1 && wheelRef.current && isSpinning) {
          const easeOut = (t: number) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          };

          const currentRotation =
            elapsedTime < slowdownTime
              ? rotation + 15
              : targetRotation * easeOut(progress);

          wheelRef.current.style.transform = `rotate(${currentRotation}deg)`;
          rotation = currentRotation;
          requestAnimationFrame(animate);
        } else if (progress >= 1) {
          if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;
          }
          onSpinEnd();
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isSpinning, selectedIndex, normalizedEntries.length, onSpinEnd]);

  useEffect(() => {
    if (!isSpinning && selectedIndex !== null && !hasUpdatedOddsRef.current) {
      hasUpdatedOddsRef.current = true;

      const updatedEntries = entries.map((entry, index) => ({
        ...entry,
        odds: index === selectedIndex + 1 ? 100 : 0,
      }));
      onEntriesUpdate(updatedEntries);
    } else if (isSpinning) {
      // Reset the flag when spinning starts
      hasUpdatedOddsRef.current = false;
    }
  }, [isSpinning, selectedIndex]);

  const segmentAngle = 360 / normalizedEntries.length;

  return (
    <div className="relative w-[800px] h-[800px]">
      <svg ref={wheelRef} viewBox="0 0 100 100" className="w-full h-full">
        {normalizedEntries.map((entry, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const midAngle = startAngle + segmentAngle / 2;

          const startX =
            50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
          const startY =
            50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
          const endX = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
          const endY = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));

          const textRadius = 35;
          const textX =
            50 + textRadius * Math.cos((midAngle - 90) * (Math.PI / 180));
          const textY =
            50 + textRadius * Math.sin((midAngle - 90) * (Math.PI / 180));

          return (
            <g key={index}>
              <path
                d={`M 50 50 L ${startX} ${startY} A 50 50 0 0 1 ${endX} ${endY} Z`}
                fill={entry.color} // Use the color directly
                stroke="white"
                strokeWidth="0.5"
              />
              <text
                x={textX}
                y={textY}
                className="text-[3px] font-bold fill-white"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midAngle}, ${textX}, ${textY})`}
              >
                {entry.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-white shadow-lg" />
      </div>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 rotate-180 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-500"
        aria-hidden="true"
      />
    </div>
  );
}
