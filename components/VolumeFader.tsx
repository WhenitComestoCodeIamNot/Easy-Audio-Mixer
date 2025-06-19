
import React from 'react';

interface VolumeFaderProps {
  value: number;
  onValueChange: (value: number) => void;
  onValueDoubleClick: () => void;
  log: (message: string) => void;
  faderId: string; 
  label: string; 
  showTooltip: (content: string, e: React.MouseEvent) => void;
  max?: number; 
  disabled?: boolean;
  isBeingDragged?: boolean; // Added to prevent tooltip activation when parent is dragged
}

const VolumeFader: React.FC<VolumeFaderProps> = ({ 
  value, 
  onValueChange, 
  onValueDoubleClick, 
  log, 
  faderId, 
  label,
  showTooltip, 
  max = 100, 
  disabled,
  isBeingDragged 
}) => {
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    onValueChange(newValue);
  };

  const handleMouseUp = () => {
     log(`Final ${faderId} ${label}: ${value}%`);
  }

  const handleDoubleClick = () => {
    onValueDoubleClick();
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isBeingDragged && !disabled) { // Only show tooltip if parent is not being dragged and fader not disabled
      showTooltip(`${label}: ${value}%`, e);
    }
  };

  return (
    <div className="volume-control h-[220px] flex flex-col items-center my-1"
      onMouseEnter={handleMouseEnter} 
    >
      <div className="text-xs text-gray-400 mb-1 uppercase">{label}</div>
      <div className="volume-slider-container relative w-[50px] h-[160px] bg-[linear-gradient(135deg,_#2a2a2a_0%,_#1a1a1a_100%)] rounded-[15px] border-3 border-[#333] shadow-[inset_0_0_15px_rgba(0,0,0,0.7)]" style={{borderStyle: 'inset'}}>
        <div className="volume-slider-track absolute left-1/2 top-[10px] bottom-[10px] w-[8px] -ml-[4px] bg-[linear-gradient(180deg,_#ff2222_0%,_#ffff22_50%,_#22ff22_100%)] rounded-[4px] border border-black shadow-[0_0_6px_rgba(255,255,0,0.3)]"></div>
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={handleInput}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onMouseDown={(e) => e.stopPropagation()} // Prevent mousedown from bubbling
          disabled={disabled}
          data-no-channel-drag="true" 
          style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
          className={`volume-slider absolute left-0 top-0 w-full h-full bg-transparent outline-none appearance-none z-10 
                     ${disabled ? 'cursor-not-allowed' : 'pointer-events-auto'}
                     ${!disabled && 'cursor-grab active:cursor-grabbing'}
                     [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-[40px] 
                     [&::-webkit-slider-thumb]:h-[20px] 
                     [&::-webkit-slider-thumb]:bg-[linear-gradient(180deg,_#d0d0d0_0%,_#b0b0b0_15%,_#909090_50%,_#707070_85%,_#606060_100%)]
                     [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#404040]
                     [&::-webkit-slider-thumb]:rounded-[2px] 
                     [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.3),_inset_0_-1px_0_rgba(0,0,0,0.5)]
                     [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-100
                     ${!disabled ? `
                     [&::-webkit-slider-thumb:hover]:bg-[linear-gradient(180deg,_#e0e0e0_0%,_#c0c0c0_15%,_#a0a0a0_50%,_#808080_85%,_#707070_100%)]
                     [&::-webkit-slider-thumb:hover]:shadow-[0_3px_6px_rgba(0,0,0,0.9),_inset_0_1px_0_rgba(255,255,255,0.4),_inset_0_-1px_0_rgba(0,0,0,0.6)]
                     [&::-webkit-slider-thumb:active]:bg-[linear-gradient(180deg,_#b0b0b0_0%,_#909090_15%,_#707070_50%,_#505050_85%,_#404040_100%)]
                     [&::-webkit-slider-thumb:active]:shadow-[0_1px_2px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.2),_inset_0_-1px_0_rgba(0,0,0,0.7)]
                     ` : ''}
                     
                     /* Firefox Thumb */
                     [&::-moz-range-thumb]:pointer-events-auto
                     [&::-moz-range-thumb]:appearance-none
                     [&::-moz-range-thumb]:w-[40px] 
                     [&::-moz-range-thumb]:h-[20px] 
                     [&::-moz-range-thumb]:bg-[linear-gradient(180deg,_#d0d0d0_0%,_#b0b0b0_15%,_#909090_50%,_#707070_85%,_#606060_100%)]
                     [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[#404040]
                     [&::-moz-range-thumb]:rounded-[2px] 
                     [&::-moz-range-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.3),_inset_0_-1px_0_rgba(0,0,0,0.5)]
                     [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-100
                     ${!disabled ? `
                     [&::-moz-range-thumb:hover]:bg-[linear-gradient(180deg,_#e0e0e0_0%,_#c0c0c0_15%,_#a0a0a0_50%,_#808080_85%,_#707070_100%)]
                     [&::-moz-range-thumb:hover]:shadow-[0_3px_6px_rgba(0,0,0,0.9),_inset_0_1px_0_rgba(255,255,255,0.4),_inset_0_-1px_0_rgba(0,0,0,0.6)]
                     [&::-moz-range-thumb:active]:bg-[linear-gradient(180deg,_#b0b0b0_0%,_#909090_15%,_#707070_50%,_#505050_85%,_#404040_100%)]
                     [&::-moz-range-thumb:active]:shadow-[0_1px_2px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.2),_inset_0_-1px_0_rgba(0,0,0,0.7)]
                     ` : ''}
                    `}
        />
      </div>
      <div className="volume-value mt-1.5 text-xs font-semibold text-green-400">{value}%</div>
    </div>
  );
};

export default VolumeFader;
