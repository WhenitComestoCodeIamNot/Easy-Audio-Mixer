
import React, { useState, useEffect, useRef } from 'react';
import { Channel, EQKnobType, EQKnobValues, CHANNEL_COLOR_PALETTE } from '../types';
import VolumeFader from './VolumeFader';
import EQKnob from './EQKnob';
import Visualizer from './Visualizer';
import ColorPalette from './ColorPalette';
import Icon from './ui/Icon';
import ChannelContextMenu from './ChannelContextMenu';

interface ChannelStripProps {
  channel: Channel;
  channelType: 'input' | 'output';
  onUpdate: (channelId: string, type: 'input' | 'output', updatedProps: Partial<Channel>) => void;
  log: (message: string) => void;
  showTooltip: (content: string, e: React.MouseEvent) => void;
  hideTooltip: () => void;
  isDimmed: boolean;
  onKnobMouseDown: (channelId: string, channelType: 'input' | 'output', eqType: keyof EQKnobValues, value: number, e: React.MouseEvent) => void;
  // Removed onDragStart, onDropOnThisChannel, isDragTarget, isBeingDragged
}

const ChannelStrip: React.FC<ChannelStripProps> = ({ 
  channel, 
  channelType, 
  onUpdate, 
  log, 
  showTooltip, 
  hideTooltip, 
  isDimmed, 
  onKnobMouseDown,
  // Removed onDragStart, onDropOnThisChannel, isDragTarget, isBeingDragged
}) => {
  const [colorPaletteOpen, setColorPaletteOpen] = useState(false);
  // Removed isDragOver state
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentEditingName, setCurrentEditingName] = useState(channel.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isChannelMenuOpen, setIsChannelMenuOpen] = useState(false);
  const channelMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (!isEditingName) {
      setCurrentEditingName(channel.name);
    }
  }, [channel.name, isEditingName]);


  const baseChannelClass = "channel min-w-[180px] rounded-[15px] p-[15px_15px_20px_15px] border-2 transition-all duration-400 relative overflow-visible shadow-[0_4px_15px_rgba(0,0,0,0.5)] z-[1]";
  // Removed dynamicClasses related to drag state

  const channelStyle = {
    background: channel.color,
    borderColor: channelType === 'input' ? '#334' : '#333',
    opacity: isDimmed ? 0.5 : 1, 
  };

  const handleUpdate = (props: Partial<Channel>) => {
    onUpdate(channel.id, channelType, props);
  };

  const toggleMute = () => { handleUpdate({ muted: !channel.muted }); log(`${!channel.muted ? 'Muted' : 'Unmuted'} ${channel.name}`); };
  const toggleSolo = () => { handleUpdate({ solo: !channel.solo }); log(`${!channel.solo ? 'Soloed' : 'Unsoloed'} ${channel.name}`); };
  const toggleLock = () => { handleUpdate({ locked: !channel.locked }); log(`${channel.name} ${!channel.locked ? 'Locked' : 'Unlocked'}`); };
  const toggleHide = () => { handleUpdate({ hidden: !channel.hidden }); log(`${!channel.hidden ? 'Hidden' : 'Shown'} ${channel.name}`); };
  const handleColorChange = (newColor: string) => { handleUpdate({ color: newColor }); setColorPaletteOpen(false); log(`Changed ${channel.name} color`); };

  const handleVolumeChange = (newVolume: number) => {
    const updateProps: Partial<Channel> = { volume: newVolume };
    if (channel.isMonitorLinked) updateProps.monitor = newVolume;
    handleUpdate(updateProps);
  };

  const handleMonitorChange = (newMonitorLevel: number) => {
    const updateProps: Partial<Channel> = { monitor: newMonitorLevel };
    if (channel.isMonitorLinked) updateProps.volume = newMonitorLevel;
    handleUpdate(updateProps);
  };
  
  const toggleLink = () => {
    const newLinkState = !channel.isMonitorLinked;
    handleUpdate({ isMonitorLinked: newLinkState });
    log(`${channel.name} monitor fader ${newLinkState ? 'linked to' : 'unlinked from'} volume fader.`);
  };

  // Removed all drag event handlers (handleDragStartInternal, handleDragOverInternal, etc.)

  const handleNameDoubleClick = () => {
    if (!channel.locked) {
      setCurrentEditingName(channel.name); 
      setIsEditingName(true);
    }
  };

  const handleNameChangeConfirm = () => {
    const trimmedName = currentEditingName.trim();
    if (trimmedName && trimmedName !== channel.name) {
      handleUpdate({ name: trimmedName });
      log(`Channel ${channel.id} renamed to: ${trimmedName}`);
    } else {
      setCurrentEditingName(channel.name); 
    }
    setIsEditingName(false);
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEditingName(e.target.value);
  };

  const handleNameInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameChangeConfirm();
    } else if (e.key === 'Escape') {
      setCurrentEditingName(channel.name); 
      setIsEditingName(false);
    }
  };

  const handleTriggerRenameFromMenu = () => {
    if (!channel.locked) {
      setCurrentEditingName(channel.name);
      setIsEditingName(true);
    }
  };

  return (
    <div
      // Removed draggable attribute and drag event handlers
      className={`${baseChannelClass} group hover:z-10 hover:-translate-y-1 hover:!border-green-400 hover:shadow-[0_10px_30px_rgba(0,255,136,0.2)]`}
      style={channelStyle}
      onMouseLeave={() => { hideTooltip(); /* setIsDragOver(false); removed */ }}
      title={isDimmed ? `${channel.name} (Hidden)` : (isEditingName ? `Editing ${channel.name}...` : channel.name)}
    >
      <div className="absolute inset-[-2px] rounded-[15px] p-[2px] bg-[linear-gradient(135deg,transparent,#00ff88,#00ccff,transparent)] opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-[1]"></div>
      <div className="absolute -top-2 left-0 right-0 h-[3px] bg-[linear-gradient(90deg,#00ff88_0%,#00ccff_100%)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-sm"></div>

      <div className="channel-controls-header absolute top-2.5 right-2.5 flex gap-2 items-center z-20">
        <Icon icon={channel.locked ? 'lockClosed' : 'lockOpen'} onClick={toggleLock} title="Lock/Unlock Channel" disabled={isDimmed || isEditingName} />
        <Icon icon={channel.hidden ? 'eyeSlash' : 'eye'} onClick={toggleHide} title="Hide/Show Channel" disabled={isDimmed || channel.locked || isEditingName} />
        <div 
            className="w-[18px] h-[18px] rounded-full border border-gray-600 cursor-pointer bg-[linear-gradient(135deg,#ff4444_0%,#44ff44_50%,#4444ff_100%)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            onClick={() => !channel.locked && !isEditingName && setColorPaletteOpen(!colorPaletteOpen)}
            title="Change Color"
            onMouseEnter={(e) => !isEditingName && showTooltip("Change Color", e)}
            style={{ pointerEvents: (channel.locked || isEditingName) ? 'none' : 'auto' }}
        />
        <Icon 
          icon="ellipsisVertical" 
          title="Channel Settings"
          onClick={() => setIsChannelMenuOpen(!isChannelMenuOpen)}
          disabled={isEditingName} 
          ref={channelMenuButtonRef} 
          className="text-lg" 
        />
      </div>
      {colorPaletteOpen && (
        <ColorPalette 
            options={CHANNEL_COLOR_PALETTE} 
            onSelectColor={handleColorChange} 
            onClose={() => setColorPaletteOpen(false)}
            currentChannelType={channelType}
        />
      )}
      {isChannelMenuOpen && (
        <ChannelContextMenu
          channelType={channelType}
          onRename={handleTriggerRenameFromMenu}
          onSelectDevice={() => {
            log(`Channel '${channel.name}': Select ${channelType === 'input' ? 'Input' : 'Output'} Device clicked.`);
          }}
          onClose={() => setIsChannelMenuOpen(false)}
          buttonRef={channelMenuButtonRef}
          isChannelLocked={channel.locked}
        />
      )}


      <div className="channel-header text-center mb-1 pt-4">
        {isEditingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={currentEditingName}
            onChange={handleNameInputChange}
            onKeyDown={handleNameInputKeyDown}
            onBlur={handleNameChangeConfirm}
            className="channel-name-input bg-transparent text-sm font-semibold text-white text-center border border-green-500 rounded px-1 py-0.5 w-[calc(100%-20px)] mx-auto outline-none focus:ring-1 focus:ring-green-400"
            aria-label={`Edit name for ${channel.name}`}
          />
        ) : (
          <div 
            className={`channel-name text-sm font-semibold text-white mb-0.5 px-1 ${channel.locked ? 'cursor-default' : 'cursor-text hover:bg-white/10 rounded'}`}
            onDoubleClick={handleNameDoubleClick}
            tabIndex={channel.locked ? -1 : 0}
            aria-label={`${channel.name}, double click to edit`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNameDoubleClick();}}
            role="button"
          >
            {channel.name}
          </div>
        )}
        <div className="channel-type text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">{channel.type}</div>
        <div className={`status-indicator w-2.5 h-2.5 rounded-full mx-auto transition-all duration-300 ${channel.active ? 'bg-green-400 shadow-[0_0_10px_rgba(0,255,136,0.8)] animate-pulse-custom' : 'bg-red-500 shadow-[0_0_8px_rgba(255,68,68,0.5)]'}`}></div>
        <style>{` @keyframes pulse-custom { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } } .animate-pulse-custom { animation: pulse-custom 2s infinite; } `}</style>
      </div>

      <div className="faders-section flex justify-center items-start gap-1">
        <VolumeFader
          value={channel.volume}
          onValueChange={handleVolumeChange}
          onValueDoubleClick={() => { handleVolumeChange(50); log(`Reset ${channel.name} Volume to 50%`); }}
          log={log} 
          faderId={`${channel.name}-vol`}
          label="Vol"
          showTooltip={showTooltip}
          disabled={channel.locked || isEditingName}
          max={100}
          isBeingDragged={false} // No longer relevant
        />
        <div className="flex flex-col items-center justify-start pt-[30px]">
            <Icon 
                icon={channel.isMonitorLinked ? 'linkBroken' : 'link'} 
                onClick={toggleLink} 
                title={channel.isMonitorLinked ? 'Unlink Faders' : 'Link Faders'}
                disabled={channel.locked || isEditingName}
                className="mt-1 text-lg"
            />
        </div>
        <VolumeFader
          value={channel.monitor}
          onValueChange={handleMonitorChange}
          onValueDoubleClick={() => { handleMonitorChange(100); log(`Reset ${channel.name} Monitor to 100%`); }}
          log={log} 
          faderId={`${channel.name}-mon`}
          label="Mon"
          showTooltip={showTooltip}
          disabled={channel.locked || isEditingName}
          max={100} 
          isBeingDragged={false} // No longer relevant
        />
      </div>
      
      <Visualizer level={channel.visualizerLevel} />

      <div className="channel-controls flex flex-col gap-2 mt-1.5">
        <button
          onClick={toggleMute}
          className={`control-btn px-3 py-1.5 border-none rounded-md text-[9px] font-semibold uppercase cursor-pointer transition-all duration-300 text-white ${channel.muted ? 'bg-[linear-gradient(135deg,_#ff4444_0%,_#cc0000_100%)]' : 'bg-[linear-gradient(135deg,_#333_0%,_#555_100%)]'} hover:scale-105 hover:shadow-[0_3px_15px_rgba(255,255,255,0.1)]`}
          disabled={channel.locked || isEditingName}
          onMouseEnter={(e) => !isEditingName && showTooltip(channel.muted ? 'Unmute' : 'Mute', e)}
        >
          {channel.muted ? 'UNMUTE' : 'MUTE'}
        </button>
        <button
          onClick={toggleSolo}
          className={`control-btn px-3 py-1.5 border-none rounded-md text-[9px] font-semibold uppercase cursor-pointer transition-all duration-300 text-white ${channel.solo ? 'bg-[linear-gradient(135deg,_#ffaa00_0%,_#ff6600_100%)]' : 'bg-[linear-gradient(135deg,_#333_0%,_#555_100%)]'} hover:scale-105 hover:shadow-[0_3px_15px_rgba(255,255,255,0.1)]`}
          disabled={channel.locked || isEditingName}
          onMouseEnter={(e) => !isEditingName && showTooltip(channel.solo ? 'Unsolo' : 'Solo', e)}
        >
          {channel.solo ? 'UNSOLO' : 'SOLO'}
        </button>
      </div>

      <div className="eq-controls mt-3">
        <div className="eq-title text-[9px] text-gray-400 text-center mb-1.5 uppercase tracking-wider">EQ & FX</div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
          {(Object.keys(channel.eq) as EQKnobType[]).map((eqType) => (
            <EQKnob
              key={eqType}
              label={eqType.charAt(0).toUpperCase() + eqType.slice(1)}
              value={channel.eq[eqType]}
              onMouseDown={(e) => !isEditingName && onKnobMouseDown(channel.id, channelType, eqType, channel.eq[eqType], e)}
              onDoubleClick={() => {
                if (isEditingName) return;
                const resetValue = (eqType === 'reverb' || eqType === 'delay') ? 0 : 5;
                handleUpdate({ eq: { ...channel.eq, [eqType]: resetValue } });
                log(`Reset ${channel.name} EQ ${eqType} to ${resetValue}`);
              }}
              showTooltip={showTooltip}
              disabled={channel.locked || isEditingName}
              isBeingDragged={false} // No longer relevant
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelStrip;
