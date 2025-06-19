
export interface EQKnobValues {
  high: number;
  mid: number;
  low: number;
  gain: number;
  reverb: number;
  delay: number;
}

export type EQKnobType = keyof EQKnobValues;

export interface Channel {
  id: string;
  name: string;
  type: string;
  volume: number; // 0-100
  active: boolean;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  hidden: boolean;
  monitor: number; // Now 0-100 for channel monitor fader
  eq: EQKnobValues;
  color: string; // Store as CSS gradient string
  visualizerLevel: number;
  isMonitorLinked: boolean; 
}

export interface Section {
  title: string;
  channels: Channel[];
  isCollapsed: boolean;
  type: 'input' | 'output';
}

export interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

export const DEFAULT_CHANNEL_COLOR = 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
export const INPUT_CHANNEL_DEFAULT_COLOR = 'linear-gradient(135deg, #1a1a2a 0%, #2a2a3a 100%)';

// Updated to use the constants for default colors
export const CHANNEL_COLOR_PALETTE: string[] = [
  DEFAULT_CHANNEL_COLOR, // Default for output
  INPUT_CHANNEL_DEFAULT_COLOR, // Default for input (often a blueish dark theme)
  'linear-gradient(135deg, #2a1a1a 0%, #3a2a2a 100%)', // Dark Reddish
  'linear-gradient(135deg, #1a2a1a 0%, #2a3a2a 100%)', // Dark Greenish
  'linear-gradient(135deg, #2a2a1a 0%, #3a3a2a 100%)', // Dark Yellowish/Brownish
  'linear-gradient(135deg, #2a1a2a 0%, #3a2a3a 100%)', // Dark Purpleish
  'linear-gradient(135deg, #1a2a2a 0%, #2a3a3a 100%)', // Dark Tealish
  'linear-gradient(135deg, #301010 0%, #402020 100%)', // Darker Red
];