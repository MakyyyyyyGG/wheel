export const predefinedColors = [
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

export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * predefinedColors.length);
  return predefinedColors[randomIndex];
}

export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360); // Random hue between 0-359
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 40; // 40-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
