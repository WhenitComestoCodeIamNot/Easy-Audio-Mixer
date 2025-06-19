
import React from 'react';
import { TooltipState } from '../types';

interface TooltipProps {
  tooltip: TooltipState;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip }) => {
  if (!tooltip.visible) return null;

  return (
    <div
      className="fixed bg-black/90 text-white px-2.5 py-1.5 rounded text-xs pointer-events-none z-[1000] transition-opacity duration-300 shadow-lg"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
        opacity: tooltip.visible ? 1 : 0,
      }}
    >
      {tooltip.content}
    </div>
  );
};

export default Tooltip;
