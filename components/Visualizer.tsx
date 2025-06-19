import React from 'react';

interface VisualizerProps {
  level: number; // 0-100
}

const NUM_SEGMENTS = 12;

const Visualizer: React.FC<VisualizerProps> = ({ level }) => {
  const litSegments = Math.ceil((level / 100) * NUM_SEGMENTS);

  const getSegmentStyle = (index: number): string => {
    const isActive = index < litSegments;
    if (!isActive) {
      return 'bg-gray-800 opacity-40';
    }
    // Active segments
    if (index < 7) { // Green (0-~58%)
      return 'bg-green-500 shadow-[0_0_3px_#00ff00,inset_0_0_1px_1px_rgba(255,255,255,0.2)]';
    }
    if (index < 10) { // Yellow (~59%-~83%)
      return 'bg-yellow-500 shadow-[0_0_3px_#ffff00,inset_0_0_1px_1px_rgba(255,255,255,0.2)]';
    }
    // Red (~84%-100%)
    return 'bg-red-500 shadow-[0_0_3px_#ff0000,inset_0_0_1px_1px_rgba(255,255,255,0.2)]';
  };

  return (
    <div className="visualizer h-[28px] bg-gray-900 rounded p-1.5 flex items-center gap-0.5 border border-gray-700 my-3">
      {Array.from({ length: NUM_SEGMENTS }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full rounded-sm transition-colors duration-50 ${getSegmentStyle(i)}`}
        />
      ))}
    </div>
  );
};

export default Visualizer;