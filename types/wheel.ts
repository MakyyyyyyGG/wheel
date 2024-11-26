export interface WheelEntry {
  name: string;
  odds: number;
  color: string;
}

export interface WheelState {
  entries: WheelEntry[];
  isSpinning: boolean;
  selectedIndex: number | null;
}

