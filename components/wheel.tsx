import { useEffect, useRef } from "react";
import type { WheelEntry } from "../types/wheel";

interface WheelProps {
  entries: WheelEntry[];
  isSpinning: boolean;
  onSpinEnd: () => void;
  selectedIndex: number | null;
}

export function Wheel({
  entries,
  isSpinning,
  onSpinEnd,
  selectedIndex,
}: WheelProps) {
  const wheelRef = useRef<SVGSVGElement>(null);

  // Shuffle the entries and maintain a mapping to the original index
  const shuffledEntries = entries
    .map((entry, index) => ({ ...entry, originalIndex: index }))
    .sort(() => Math.random() - 0.5);

  const segmentAngle = 360 / shuffledEntries.length;

  useEffect(() => {
    if (isSpinning && wheelRef.current && selectedIndex !== null) {
      let rotation = 0;
      const startTime = Date.now();
      const spinDuration = 6000;
      const slowdownTime = 4500;
      const spins = 5;

      // Map selectedIndex to the shuffled order
      const shuffledIndex = shuffledEntries.findIndex(
        (entry) => entry.originalIndex === selectedIndex
      );

      if (shuffledIndex === -1) return;

      const targetRotation =
        spins * 360 - (shuffledIndex * segmentAngle + segmentAngle / 2);

      const animate = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / spinDuration, 1);

        if (progress < 1 && wheelRef.current && isSpinning) {
          const easeOut = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
  }, [
    isSpinning,
    selectedIndex,
    shuffledEntries,
    segmentAngle,
    onSpinEnd,
    entries,
  ]);

  return (
    <div className="relative w-[800px] h-[800px]">
      <svg ref={wheelRef} viewBox="0 0 100 100" className="w-full h-full">
        {shuffledEntries.map((entry, index) => {
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
                fill={entry.color}
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
