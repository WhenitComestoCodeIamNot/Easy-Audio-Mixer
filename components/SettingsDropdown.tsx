
import React from 'react';
import { SETTINGS_MENU_ITEMS } from '../constants';
import ToggleSwitch from './ui/ToggleSwitch';

interface SettingsDropdownProps {
  consoleEnabled: boolean;
  onToggleConsole: () => void;
  onToggleShowHidden: () => void;
  onAutoDetect: () => void;
  onLoadProfile: () => void;
  onSaveProfile: () => void;
  onAddInputChannel: () => void; // New prop
  onAddOutputChannel: () => void; // New prop
  onClose: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  consoleEnabled,
  onToggleConsole,
  onToggleShowHidden,
  onAutoDetect,
  onLoadProfile,
  onSaveProfile,
  onAddInputChannel, // Destructure new prop
  onAddOutputChannel, // Destructure new prop
  onClose
}) => {

  const handleItemClick = (id: string) => {
    switch (id) {
      case 'console':
        // Toggle is handled directly by the ToggleSwitch component
        break;
      case 'showHide':
        onToggleShowHidden();
        onClose();
        break;
      case 'autoDetect':
        onAutoDetect();
        onClose();
        break;
      case 'loadProfile':
        onLoadProfile();
        onClose();
        break;
      case 'saveProfile':
        onSaveProfile();
        onClose();
        break;
      case 'addInput': // New case
        onAddInputChannel();
        onClose();
        break;
      case 'addOutput': // New case
        onAddOutputChannel();
        onClose();
        break;
    }
  };


  return (
    <div className="absolute top-full right-0 mt-2.5 bg-[linear-gradient(135deg,_#2a2a2a_0%,_#1a1a1a_100%)] rounded-lg border border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.8)] min-w-[200px] z-[1000] py-1">
      {SETTINGS_MENU_ITEMS.map((item) => {
        if (item.type === 'separator') {
          return <div key={item.id} className="h-px bg-gray-700 my-1.5 mx-2"></div>;
        }
        if (item.id === 'console') {
          return (
            <div key={item.id} className="flex items-center justify-between px-5 py-2.5 text-xs cursor-default">
              <span>{item.label}</span>
              <ToggleSwitch active={consoleEnabled} onToggle={onToggleConsole} />
            </div>
          );
        }
        return (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="px-5 py-2.5 text-xs cursor-pointer hover:bg-[rgba(0,255,136,0.1)] hover:pl-6 transition-all duration-200"
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default SettingsDropdown;
