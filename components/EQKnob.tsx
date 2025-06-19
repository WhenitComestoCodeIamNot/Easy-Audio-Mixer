
import React from 'react';

interface EQKnobProps {
  label: string;
  value: number; // 0-10
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  showTooltip: (content: string, e: React.MouseEvent) => void;
  disabled?: boolean;
  isBeingDragged?: boolean; // Added to prevent tooltip activation when parent is dragged
}

const EQKnob: React.FC<EQKnobProps> = ({ label, value, onMouseDown, onDoubleClick, showTooltip, disabled, isBeingDragged }) => {
  const rotation = ((value - 5) / 5) * 135; 

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isBeingDragged && !disabled) { // Only show tooltip if parent is not being dragged and knob not disabled
        showTooltip(`${label}: ${value}`, e);
    }
  };

  const handleKnobMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation(); // Stop propagation to prevent channel drag
    onMouseDown(e); // Call the original mouse down handler for knob turning
  };


  return (
    <div 
        className="flex flex-col items-center"
        onMouseEnter={handleMouseEnter} // Use the new handler
    >
      <div className="eq-label text-center text-[8px] text-gray-500 mb-1 uppercase">{label}</div>
      <div className="eq-knob-container relative w-10 h-10 mx-auto mb-1">
        <div
          data-no-channel-drag="true" 
          className={`eq-knob w-10 h-10 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0f0f0,#999),linear-gradient(135deg,#ccc_0%,#888_100%)] border-[3px] border-gray-700 relative shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.3)] transition-all duration-100 
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:shadow-[0_6px_12px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4)] active:scale-95'}`}
          onMouseDown={handleKnobMouseDown} // Use the combined handler
          onDoubleClick={disabled ? undefined : onDoubleClick}
          title={`${label}: ${value}`}
        >
          <div
            className="absolute top-[3px] left-1/2 w-0.5 h-3 bg-[linear-gradient(180deg,_#ff4444_0%,_#cc0000_100%)] rounded-[1px] -ml-px shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-100"
            style={{ transformOrigin: '50% 17px', transform: `rotate(${rotation}deg)` }} 
          ></div>
          <div className="eq-knob-marks absolute inset-0 pointer-events-none">
            <div className="absolute top-[-5px] left-1/2 w-px h-1 bg-green-400 -ml-px rounded-px"></div>
          </div>
        </div>
      </div>
      <div className="eq-value text-center text-[10px] text-green-400 font-semibold">{value}</div>
    </div>
  );
};

export default EQKnob;
