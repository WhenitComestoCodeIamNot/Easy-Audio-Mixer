
import React, { useState, useEffect, useCallback } from 'react';
import { Channel, Section, TooltipState, EQKnobValues } from './types';
import { INITIAL_INPUT_CHANNELS, INITIAL_OUTPUT_CHANNELS, DEFAULT_NEW_INPUT_TEMPLATE, DEFAULT_NEW_OUTPUT_TEMPLATE } from './constants';
import Header from './components/Header';
import MasterControls from './components/MasterControls';
import MixerSection from './components/MixerSection';
import Tooltip from './components/Tooltip';

let newInputChannelCount = 0;
let newOutputChannelCount = 0;

const App: React.FC = () => {
  const [inputChannelsData, setInputChannelsData] = useState<Channel[]>(INITIAL_INPUT_CHANNELS);
  const [outputChannelsData, setOutputChannelsData] = useState<Channel[]>(INITIAL_OUTPUT_CHANNELS);

  const [masterVolume, setMasterVolume] = useState(85);
  const [masterMonitor, setMasterMonitor] = useState(100);

  const [consoleEnabled, setConsoleEnabled] = useState(true);
  const [showingHidden, setShowingHidden] = useState(false);
  const [sectionsCollapsed, setSectionsCollapsed] = useState<{ input: boolean; output: boolean }>({ input: false, output: false });

  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: '', x: 0, y: 0 });
  
  const [activeKnobInfo, setActiveKnobInfo] = useState<{ channelId: string; channelType: 'input' | 'output'; eqType: keyof EQKnobValues; startY: number; startValue: number } | null>(null);

  // Removed draggedChannelInfo state
  
  const [sectionOrder, setSectionOrder] = useState<Array<'input' | 'output'>>(['input', 'output']);
  const [draggedSectionInfoState, setDraggedSectionInfoState] = useState<{ type: 'input' | 'output', originalIndex: number } | null>(null);
  const [dropIndicatorSlot, setDropIndicatorSlot] = useState<number | null>(null);


  const log = useCallback((message: string) => {
    if (consoleEnabled) {
      console.log(message);
    }
  }, [consoleEnabled]);

  useEffect(() => {
    log('🎛️ Connected to VoiceMeeter Engine (Simulated)');
    log('🔊 Virtual audio routing established (Simulated)');
    log('🎧 Monitor mix configured (Simulated)');
  }, [log]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const updateLevel = (prevChannels: Channel[]) => 
        prevChannels.map(ch => ({
          ...ch,
          visualizerLevel: (ch.active && !ch.muted) ? Math.random() * 95 + 5 : 0,
        }));
      setInputChannelsData(updateLevel);
      setOutputChannelsData(updateLevel);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleChannelUpdate = (channelId: string, type: 'input' | 'output', updatedProps: Partial<Channel>) => {
    const updater = (prevChannels: Channel[]) =>
      prevChannels.map(ch => (ch.id === channelId ? { ...ch, ...updatedProps } : ch));
    if (type === 'input') {
      setInputChannelsData(updater);
    } else {
      setOutputChannelsData(updater);
    }
  };

  const handleToggleSectionCollapse = (type: 'input' | 'output') => {
    setSectionsCollapsed(prev => ({ ...prev, [type]: !prev[type] }));
    log(`${type} section ${sectionsCollapsed[type] ? 'expanded' : 'collapsed'}`);
  };

  const showTooltip = (content: string, e: React.MouseEvent) => {
    setTooltip({ visible: true, content, x: e.pageX + 10, y: e.pageY - 30 });
  };
  
  const handleNativeMouseMove = (e: MouseEvent) => { 
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.pageX + 10, y: e.pageY - 30 }));
    }
  };


  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleKnobMouseDown = useCallback((channelId: string, channelType: 'input' | 'output', eqType: keyof EQKnobValues, value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling
    document.body.classList.add('cursor-grabbing');
    setActiveKnobInfo({ channelId, channelType, eqType, startY: e.clientY, startValue: value });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeKnobInfo) return;
      const { channelId, channelType, eqType, startY, startValue } = activeKnobInfo;
      const deltaY = startY - e.clientY;
      const sensitivity = 0.5; 
      let newValue = startValue + (deltaY * sensitivity);
      newValue = Math.max(0, Math.min(10, Math.round(newValue))); 
      
      const channelsToUpdate = channelType === 'input' ? inputChannelsData : outputChannelsData;
      const channel = channelsToUpdate.find(ch => ch.id === channelId);
      if (channel) {
        const newEQ = { ...channel.eq, [eqType]: newValue };
        handleChannelUpdate(channelId, channelType, { eq: newEQ });
      }
    };

    const handleMouseUp = () => {
      if (activeKnobInfo) {
         const { channelId, channelType, eqType } = activeKnobInfo;
         const channelsToUpdate = channelType === 'input' ? inputChannelsData : outputChannelsData;
         const channel = channelsToUpdate.find(ch => ch.id === channelId);
         if (channel) {
            log(`Final EQ ${channel.name} ${eqType}: ${channel.eq[eqType]}`);
         }
      }
      setActiveKnobInfo(null);
      document.body.classList.remove('cursor-grabbing');
    };

    if (activeKnobInfo) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('cursor-grabbing');
    };
  }, [activeKnobInfo, inputChannelsData, outputChannelsData, log, handleChannelUpdate]);


  // Channel Drag and Drop Handlers REMOVED

  // Section Drag and Drop Handlers
  const handleSectionDragStart = (sectionType: 'input' | 'output', originalIndex: number) => {
    setDraggedSectionInfoState({ type: sectionType, originalIndex });
    log(`Dragging section: ${sectionType} from original index ${originalIndex}`);
  };

  const handleSetDropIndicatorSlot = (slot: number | null) => {
    setDropIndicatorSlot(slot);
  };
  
  const handleSectionDrop = () => {
    if (!draggedSectionInfoState || dropIndicatorSlot === null) {
      setDraggedSectionInfoState(null);
      setDropIndicatorSlot(null);
      return;
    }

    const { type: draggedType } = draggedSectionInfoState;
    
    let newOrder = sectionOrder.filter(s => s !== draggedType);
    const insertAtIndex = Math.max(0, Math.min(dropIndicatorSlot, newOrder.length));
    
    newOrder.splice(insertAtIndex, 0, draggedType);

    setSectionOrder(newOrder);
    log(`Section order changed. New order: ${newOrder.join(', ')}`);

    setDraggedSectionInfoState(null);
    setDropIndicatorSlot(null);
  };
  
  const handleSectionDragOverMainArea = (e: React.DragEvent<HTMLDivElement>) => {
    if (draggedSectionInfoState) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }
  };
  
  const handleMainMixerDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (draggedSectionInfoState && !e.currentTarget.contains(e.relatedTarget as Node)) {
        setDropIndicatorSlot(null);
    }
  };

  const handleGlobalDragEnd = () => {
    // Cleanup for section drag operations
    if (draggedSectionInfoState) {
      setDraggedSectionInfoState(null);
      setDropIndicatorSlot(null);
    }
     // Clear any active drop target styling that might be lingering from section drag
    document.querySelectorAll('.drop-target-active').forEach(el => el.classList.remove('drop-target-active'));
    document.querySelectorAll('.drop-target-section-active').forEach(el => el.classList.remove('drop-target-section-active'));
  };

  // Add New Channel Handlers
  const handleAddInputChannel = () => {
    newInputChannelCount++;
    const newChannel: Channel = {
      ...DEFAULT_NEW_INPUT_TEMPLATE,
      id: `new-input-${Date.now()}-${newInputChannelCount}`,
      name: `New Input ${newInputChannelCount}`,
    };
    setInputChannelsData(prev => [...prev, newChannel]);
    log(`Added new input channel: ${newChannel.name}`);
  };

  const handleAddOutputChannel = () => {
    newOutputChannelCount++;
    const newChannel: Channel = {
      ...DEFAULT_NEW_OUTPUT_TEMPLATE,
      id: `new-output-${Date.now()}-${newOutputChannelCount}`,
      name: `New Output ${newOutputChannelCount}`,
    };
    setOutputChannelsData(prev => [...prev, newChannel]);
    log(`Added new output channel: ${newChannel.name}`);
  };


  const sections: Record<'input' | 'output', Section> = {
    input: { title: 'INPUT CHANNELS', channels: inputChannelsData, isCollapsed: sectionsCollapsed.input, type: 'input' },
    output: { title: 'OUTPUT CHANNELS', channels: outputChannelsData, isCollapsed: sectionsCollapsed.output, type: 'output' },
  };


  return (
    <div 
        className="mixer-container flex flex-col h-screen bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_#0a0a0a_100%)] border-3 border-transparent relative"
        style={{ borderImage: 'linear-gradient(135deg, #00ff88 0%, #00ccff 20%, #333 50%, #00ccff 80%, #00ff88 100%) 1' }}
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => handleNativeMouseMove(e.nativeEvent)}
        onDragEnd={handleGlobalDragEnd}
    >
        <div className="absolute inset-[3px] border border-white/10 pointer-events-none"></div>
        
        <Header />
        <MasterControls
            masterVolume={masterVolume}
            onMasterVolumeChange={(val) => { setMasterVolume(val); log(`Master Volume: ${val}%`); }}
            masterMonitor={masterMonitor}
            onMasterMonitorChange={(val) => { setMasterMonitor(val); log(`Master Monitor: ${val}%`); }}
            consoleEnabled={consoleEnabled}
            onToggleConsole={() => {
                const newConsoleState = !consoleEnabled;
                setConsoleEnabled(newConsoleState);
                log(`Console output ${newConsoleState ? 'enabled' : 'disabled'}`);
            }}
            showingHidden={showingHidden}
            onToggleShowHidden={() => {
                const newShowingHiddenState = !showingHidden;
                setShowingHidden(newShowingHiddenState);
                log(`${newShowingHiddenState ? 'Showing' : 'Hiding'} hidden channels`);
            }}
            onAutoDetect={() => log('Auto-detecting applications...')}
            onLoadProfile={() => log('Loading profile...')}
            onSaveProfile={() => log('Saving profile...')}
            onAddInputChannel={handleAddInputChannel}
            onAddOutputChannel={handleAddOutputChannel}
            log={log}
        />

        <main 
            className="main-mixer flex-1 flex flex-col overflow-hidden min-h-0"
            onDragOver={handleSectionDragOverMainArea}
            onDrop={handleSectionDrop}
            onDragLeave={handleMainMixerDragLeave}
        >
            {sectionOrder.map((sectionType, index) => {
                const section = sections[sectionType];
                const isDropIndicatorHere = dropIndicatorSlot === index;
                const isDraggedItself = draggedSectionInfoState?.type === sectionType;

                return (
                  <React.Fragment key={`fragment-${section.type}`}>
                    {isDropIndicatorHere && draggedSectionInfoState && !isDraggedItself && (
                      <div className="h-1.5 bg-green-500 rounded-full mx-[30px] my-1 shadow-lg animate-pulse"></div>
                    )}
                    <MixerSection
                        section={section}
                        sectionIndex={index}
                        isFirstInOrder={index === 0} 
                        onToggleCollapse={() => handleToggleSectionCollapse(section.type)}
                        onChannelUpdate={handleChannelUpdate}
                        showingHidden={showingHidden}
                        log={log}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                        onKnobMouseDown={handleKnobMouseDown}
                        // Channel D&D props REMOVED
                        // Section D&D
                        onSectionDragStart={handleSectionDragStart} 
                        draggedSectionInfo={draggedSectionInfoState}
                        onSetDropIndicatorSlot={handleSetDropIndicatorSlot} 
                    />
                  </React.Fragment>
                );
            })}
            {/* Indicator after the last section */}
            {dropIndicatorSlot === sectionOrder.length && draggedSectionInfoState && (
                <div className="h-1.5 bg-green-500 rounded-full mx-[30px] my-1 shadow-lg animate-pulse"></div>
            )}
        </main>
        <Tooltip tooltip={tooltip} />
    </div>
  );
};

export default App;
