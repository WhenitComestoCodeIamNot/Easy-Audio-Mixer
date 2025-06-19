
import React from 'react';
import { Channel } from '../types';

interface MiniChannelProps {
  channel: Channel;
}

const MiniChannel: React.FC<MiniChannelProps> = ({ channel }) => {
  return (
    <div
      className="mini-channel min-w-[100px] h-[52px] rounded p-2 flex flex-col justify-between gap-1 border border-black/30 shadow-md transition-all hover:shadow-lg"
      style={{ background: channel.color }}
      title={`${channel.name} - Vol: ${channel.volume}% ${channel.muted ? '(Muted)' : ''} ${channel.locked ? '(Locked)' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-white truncate max-w-[60px]" title={channel.name}>
          {channel.name}
        </span>
        <div className="flex items-center gap-1">
          {channel.locked && (
            <span className="text-[9px] text-yellow-300" title="Locked">🔒</span>
          )}
          {channel.muted && (
            <span className="text-[9px] text-red-300" title="Muted">🔇</span>
          )}
          <div 
            className={`w-2 h-2 rounded-full ${channel.active ? 'bg-green-400' : 'bg-red-600'} border border-black/50 shadow-sm`}
            title={channel.active ? 'Active' : 'Inactive'}
          />
        </div>
      </div>
      
      <div className="w-full h-1.5 bg-black/40 rounded-sm overflow-hidden relative border border-black/30">
        <div
          className="absolute bottom-0 left-0 h-full bg-green-400 transition-all duration-150"
          style={{ width: `${channel.volume}%` }}
        />
        {/* Simplified visualizer aspect: a small pip that moves with volume, or peak. For now, volume. */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-yellow-300 opacity-75"
          style={{ left: `calc(${channel.visualizerLevel}% - 1px)`}} // visualizerLevel might need a different representation here
        ></div>
      </div>
    </div>
  );
};

export default MiniChannel;
