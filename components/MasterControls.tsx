
import React, { useState, useEffect, useRef } from 'react';
import SettingsDropdown from './SettingsDropdown';

interface MasterControlsProps {
  masterVolume: number;
  onMasterVolumeChange: (value: number) => void;
  masterMonitor: number;
  onMasterMonitorChange: (value: number) => void;
  consoleEnabled: boolean;
  onToggleConsole: () => void;
  showingHidden: boolean;
  onToggleShowHidden: () => void;
  onAutoDetect: () => void;
  onLoadProfile: () => void;
  onSaveProfile: () => void;
  onAddInputChannel: () => void; // New prop
  onAddOutputChannel: () => void; // New prop
  log: (message: string) => void;
}

const MasterControls: React.FC<MasterControlsProps> = ({
  masterVolume,
  onMasterVolumeChange,
  masterMonitor,
  onMasterMonitorChange,
  consoleEnabled,
  onToggleConsole,
  showingHidden,
  onToggleShowHidden,
  onAutoDetect,
  onLoadProfile,
  onSaveProfile,
  onAddInputChannel, // Destructure new prop
  onAddOutputChannel, // Destructure new prop
  log,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const handleMasterVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onMasterVolumeChange(value);
    // log(`Master volume: ${value}%`); // Logging is done in App.tsx to avoid duplication
  };

  const handleMasterVolumeDblClick = () => {
    onMasterVolumeChange(50);
    // log('Reset Master volume to 50%');
  };

  const handleMasterMonitorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onMasterMonitorChange(value);
    // log(`Master monitor level: ${value}%`);
  };
  
  const handleMasterMonitorDblClick = () => {
    onMasterMonitorChange(100);
    // log('Reset Master monitor to 100%');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="master-controls flex justify-between items-center bg-[linear-gradient(135deg,_#1a1a1a_0%,_#0a0a0a_100%)] px-[30px] py-[20px] border-b border-gray-700 relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,_transparent_10%,_#333_50%,_transparent_90%)]"></div>
      <div className="left-controls flex items-center gap-10">
        <div className="master-volume flex items-center gap-4">
          <label className="font-semibold text-green-400">Master</label>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={handleMasterVolumeInput}
            onDoubleClick={handleMasterVolumeDblClick}
            className="w-[200px] h-2 rounded-md bg-[linear-gradient(90deg,_#333_0%,_#555_100%)] outline-none appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-[linear-gradient(135deg,_#00ff88_0%,_#00ccff_100%)]
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,136,0.5)]
                       [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                       [&::-webkit-slider-thumb]:hover:scale-125
                       [&::-webkit-slider-thumb]:hover:shadow-[0_0_20px_rgba(0,255,136,0.8)]
                       "
          />
          <span className="text-green-400 w-10 text-sm">{masterVolume}%</span>
        </div>
        <div className="monitoring-section flex items-center gap-4 p-4 bg-[linear-gradient(135deg,_#1a1a1a_0%,_#2a2a2a_100%)] rounded-lg border border-gray-700">
          <div className="text-xs font-semibold text-green-400">Master Monitor</div>
          <input
            type="range"
            min="0"
            max="150" 
            value={masterMonitor}
            onChange={handleMasterMonitorInput}
            onDoubleClick={handleMasterMonitorDblClick}
            className="w-[120px] h-[6px] rounded bg-gray-700 outline-none appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-[linear-gradient(135deg,_#00ff88_0%,_#00ccff_100%)]
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,136,0.5)]
                       "
          />
          <div className="routing-info text-[10px] text-gray-500 leading-tight">
            Stream: {masterMonitor}%<br />
            Headphones: Var.
          </div>
        </div>
      </div>
      <div className="right-controls relative" ref={settingsRef}>
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="px-5 py-2.5 border-none rounded-lg font-semibold text-xs uppercase cursor-pointer transition-all duration-300 bg-[linear-gradient(135deg,_#333_0%,_#555_100%)] text-white border border-gray-500 hover:translate-y-[-2px] hover:shadow-[0_5px_20px_rgba(0,255,136,0.3)]"
        >
          ⚙️ Settings
        </button>
        {settingsOpen && (
          <SettingsDropdown
            consoleEnabled={consoleEnabled}
            onToggleConsole={onToggleConsole}
            onToggleShowHidden={onToggleShowHidden}
            onAutoDetect={onAutoDetect}
            onLoadProfile={onLoadProfile}
            onSaveProfile={onSaveProfile}
            onAddInputChannel={onAddInputChannel} // Pass new prop
            onAddOutputChannel={onAddOutputChannel} // Pass new prop
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MasterControls;
