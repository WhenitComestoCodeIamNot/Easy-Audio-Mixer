
import React from 'react';
import { Channel, Section, EQKnobValues } from '../types';
import ChannelStrip from './ChannelStrip';
import MiniChannel from './MiniChannel';
import Icon from './ui/Icon';

interface MixerSectionProps {
  section: Section;
  sectionIndex: number; 
  isFirstInOrder: boolean; 
  onToggleCollapse: () => void;
  onChannelUpdate: (channelId: string, type: 'input' | 'output', updatedProps: Partial<Channel>) => void;
  showingHidden: boolean;
  log: (message: string) => void;
  showTooltip: (content: string, e: React.MouseEvent) => void;
  hideTooltip: () => void;
  onKnobMouseDown: (channelId: string, channelType: 'input' | 'output', eqType: keyof EQKnobValues, value: number, e: React.MouseEvent) => void;
  // Channel D&D props REMOVED
  // Section D&D
  onSectionDragStart: (sectionType: 'input' | 'output', originalIndex: number) => void;
  draggedSectionInfo: { type: 'input' | 'output', originalIndex: number } | null; 
  onSetDropIndicatorSlot: (slot: number | null) => void;
}

const MixerSection: React.FC<MixerSectionProps> = ({
  section,
  sectionIndex,
  isFirstInOrder, 
  onToggleCollapse,
  onChannelUpdate,
  showingHidden,
  log,
  showTooltip,
  hideTooltip,
  onKnobMouseDown,
  // Channel D&D props REMOVED
  onSectionDragStart, 
  draggedSectionInfo: draggedSectionInfoForSection, 
  onSetDropIndicatorSlot,
}) => {

  let sectionContainerClasses = `mixer-section px-[30px] py-[15px] bg-[linear-gradient(135deg,_#0a0a0a_0%,_#1a1a1a_100%)] relative overflow-visible`;
  let sectionStyleObject: React.CSSProperties = {};

  if (isFirstInOrder) {
    sectionContainerClasses += ` border-b-2 border-transparent`;
    sectionStyleObject.borderImage = 'linear-gradient(90deg, transparent 10%, #00ff88 30%, #00ccff 70%, transparent 90%) 1';
  } else {
    sectionContainerClasses += ` border-t border-transparent`;
    if (section.type === 'output') {
      sectionContainerClasses += ` flex-1`; 
      sectionStyleObject.borderImage = 'linear-gradient(90deg, transparent 10%, rgba(51, 51, 51, 0.5) 50%, transparent 90%) 1';
      if (section.isCollapsed) {
        sectionContainerClasses += ` !flex-none`; 
      }
    }
  }
  
  // Channel drag over/leave/drop handlers on channels-wrapper REMOVED

  const handleSectionHeaderDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedSectionInfoForSection && draggedSectionInfoForSection.type !== section.type) {
      e.dataTransfer.dropEffect = 'move';
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseY = e.clientY;
      const isTopHalf = mouseY < rect.top + rect.height / 2;
      
      if (isTopHalf) {
        onSetDropIndicatorSlot(sectionIndex);
      } else {
        onSetDropIndicatorSlot(sectionIndex + 1);
      }
    } else if (draggedSectionInfoForSection && draggedSectionInfoForSection.type === section.type) {
      onSetDropIndicatorSlot(null);
      e.dataTransfer.dropEffect = 'none';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };
  
  const headerOpacityStyle = draggedSectionInfoForSection?.type === section.type ? 'opacity-50' : '';

  return (
    <section 
      className={sectionContainerClasses}
      style={sectionStyleObject}
    >
      <div 
        className={`section-header flex items-center gap-1.5 mb-3 p-1 rounded-md transition-all duration-150 ${headerOpacityStyle}`}
        onDragOver={handleSectionHeaderDragOver}
      >
        <Icon 
            icon="gripVertical" 
            title={`Drag to reorder ${section.title}`}
            draggable="true"
            onDragStart={() => onSectionDragStart(section.type, sectionIndex)}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-green-400 text-sm p-1"
        />
        <button
          onClick={onToggleCollapse}
          className={`collapse-arrow w-5 h-5 cursor-pointer transition-transform duration-300 text-green-400 text-base ${section.isCollapsed ? 'rotate-[-90deg]' : ''} flex-shrink-0`}
          aria-expanded={!section.isCollapsed}
          aria-controls={`${section.type}-channels-wrapper`}
        >
          ▼
        </button>
        <h2 className="section-title text-sm font-semibold text-green-400 uppercase tracking-wider cursor-default flex-grow">
          {section.title}
        </h2>
      </div>

      {section.isCollapsed && (
        <div className="mini-channels-container flex flex-wrap gap-2 pb-2 overflow-x-auto">
          {section.channels.map((channel) => (
            (!channel.hidden || showingHidden) && (
              <MiniChannel key={`mini-${channel.id}`} channel={channel} />
            )
          ))}
        </div>
      )}

      <div
        id={`${section.type}-channels-wrapper`}
        className={`channels-wrapper flex gap-6 overflow-x-auto overflow-y-hidden pb-2.5 pt-1.5 transition-all duration-300 
                    ${section.isCollapsed ? 'max-h-0 !py-0 !pt-0 !pb-0 opacity-0 invisible' : 'max-h-[calc(100vh-320px)] opacity-100 visible'}
                    min-h-[50px]`}
        // Removed onDragOver, onDragLeave, onDrop for channels wrapper
      >
        {section.channels.map((channel) => (
          (!channel.hidden || showingHidden) && (
            <ChannelStrip
              key={channel.id}
              channel={channel}
              channelType={section.type}
              onUpdate={onChannelUpdate}
              log={log}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
              isDimmed={channel.hidden && showingHidden}
              onKnobMouseDown={onKnobMouseDown}
              // Removed onDragStart, onDropOnThisChannel, isDragTarget, isBeingDragged props
            />
          )
        ))}
      </div>
    </section>
  );
};

export default MixerSection;
