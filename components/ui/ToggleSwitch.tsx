
import React from 'react';

interface ToggleSwitchProps {
  active: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ active, onToggle }) => {
  return (
    <button
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500
                  ${active ? 'bg-[linear-gradient(135deg,_#00ff88_0%,_#00ccff_100%)]' : 'bg-gray-700'}`}
    >
      <span
        className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 
                    ${active ? 'translate-x-[20px]' : 'translate-x-0'}`}
      />
    </button>
  );
};

export default ToggleSwitch;
