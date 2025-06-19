
import React, { useEffect, useRef } from 'react';
import { INPUT_CHANNEL_DEFAULT_COLOR, DEFAULT_CHANNEL_COLOR } from '../types';


interface ColorPaletteProps {
  options: string[];
  onSelectColor: (color: string) => void;
  onClose: () => void;
  currentChannelType: 'input' | 'output';
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ options, onSelectColor, onClose, currentChannelType }) => {
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Ensure default colors are first for their respective types if needed, or simply present them.
  // The provided options array should be fine.

  return (
    <div ref={paletteRef} className="absolute top-10 right-0 bg-black/90 rounded-lg p-2.5 grid grid-cols-4 gap-1.5 z-[100] border border-gray-700">
      {options.map((color, index) => (
        <div
          key={index}
          className="color-option w-5 h-5 rounded-full cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-white hover:scale-110"
          style={{ background: color }}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
