
import { Channel, EQKnobValues, DEFAULT_CHANNEL_COLOR, INPUT_CHANNEL_DEFAULT_COLOR } from './types';

const defaultEQ: EQKnobValues = { high: 5, mid: 5, low: 5, gain: 5, reverb: 1, delay: 1 };

export const INITIAL_INPUT_CHANNELS: Channel[] = [
  { id: 'mic1', name: 'MIC', type: 'Input', volume: 70, active: true, muted: false, solo: false, locked: false, hidden: false, monitor: 50, eq: { ...defaultEQ }, color: INPUT_CHANNEL_DEFAULT_COLOR, visualizerLevel: 0, isMonitorLinked: false },
];

export const INITIAL_OUTPUT_CHANNELS: Channel[] = [
  { id: 'chrome', name: 'Chrome', type: 'Browser', volume: 75, active: true, muted: false, solo: false, locked: false, hidden: false, monitor: 100, eq: { ...defaultEQ }, color: DEFAULT_CHANNEL_COLOR, visualizerLevel: 0, isMonitorLinked: false },
  { id: 'discord', name: 'Discord', type: 'VoIP', volume: 60, active: true, muted: false, solo: false, locked: false, hidden: false, monitor: 100, eq: { ...defaultEQ }, color: DEFAULT_CHANNEL_COLOR, visualizerLevel: 0, isMonitorLinked: false },
  { id: 'spotify', name: 'Spotify', type: 'Music', volume: 45, active: false, muted: false, solo: false, locked: false, hidden: false, monitor: 100, eq: { ...defaultEQ }, color: DEFAULT_CHANNEL_COLOR, visualizerLevel: 0, isMonitorLinked: false },
  { id: 'obs', name: 'OBS', type: 'Streaming', volume: 85, active: true, muted: false, solo: false, locked: false, hidden: false, monitor: 0, eq: { ...defaultEQ }, color: DEFAULT_CHANNEL_COLOR, visualizerLevel: 0, isMonitorLinked: false },
  { id: 'steam', name: 'Steam', type: 'Gaming', volume: 90, active: true, muted: false, solo: false, locked: false, hidden: false, monitor: 100, eq: { ...defaultEQ }, color: DEFAULT_CHANNEL_COLOR, visualizerLevel: 0, isMonitorLinked: false },
  { id: 'vlc', name: 'VLC', type: 'Media', volume: 70, active: false, muted: true, solo: false, locked: false, hidden: false, monitor: 100, eq: { ...defaultEQ }, color: DEFAULT_CHANNEL_COLOR, visualizerLevel: 0, isMonitorLinked: false },
];

export const SETTINGS_MENU_ITEMS = [
    { id: 'console', label: 'Console Output', type: 'toggle' },
    { id: 'separator1', type: 'separator' },
    { id: 'addInput', label: 'Add New Input Channel', type: 'action' },
    { id: 'addOutput', label: 'Add New Output Channel', type: 'action' },
    { id: 'separator2', type: 'separator' },
    { id: 'showHide', label: 'Show/Hide Channels', type: 'action' },
    { id: 'autoDetect', label: 'Auto-Detect Apps', type: 'action' },
    { id: 'separator3', type: 'separator' },
    { id: 'loadProfile', label: 'Load Profile', type: 'action' },
    { id: 'saveProfile', label: 'Save Profile', type: 'action' },
];

export const DEFAULT_NEW_INPUT_TEMPLATE: Omit<Channel, 'id' | 'name'> = {
  type: 'Input',
  volume: 75,
  active: true,
  muted: false,
  solo: false,
  locked: false,
  hidden: false,
  monitor: 50,
  eq: { ...defaultEQ },
  color: INPUT_CHANNEL_DEFAULT_COLOR,
  visualizerLevel: 0,
  isMonitorLinked: false,
};

export const DEFAULT_NEW_OUTPUT_TEMPLATE: Omit<Channel, 'id' | 'name'> = {
  type: 'Application',
  volume: 75,
  active: true,
  muted: false,
  solo: false,
  locked: false,
  hidden: false,
  monitor: 100,
  eq: { ...defaultEQ },
  color: DEFAULT_CHANNEL_COLOR,
  visualizerLevel: 0,
  isMonitorLinked: false,
};
