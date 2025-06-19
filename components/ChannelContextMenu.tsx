
import React, { useEffect, useRef, useState } from 'react';

interface ChannelContextMenuProps {
  channelType: 'input' | 'output';
  onRename: () => void;
  onSelectDevice: () => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  isChannelLocked: boolean;
}

const ChannelContextMenu: React.FC<ChannelContextMenuProps> = ({
  channelType,
  onRename,
  onSelectDevice,
  onClose,
  buttonRef,
  isChannelLocked,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, opacity: 0 });

  useEffect(() => {
    if (buttonRef.current && menuRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      // Temporarily make menu visible to get its dimensions if it's initially display:none or opacity:0 affects rect
      const originalOpacity = menuRef.current.style.opacity;
      const originalDisplay = menuRef.current.style.display;
      menuRef.current.style.opacity = '0';
      menuRef.current.style.display = 'block'; // Ensure it's in layout flow
      const menuRect = menuRef.current.getBoundingClientRect();
      menuRef.current.style.opacity = originalOpacity; // Restore
      menuRef.current.style.display = originalDisplay; // Restore


      const margin = 10; // Margin from viewport edges
      let top = buttonRect.bottom + window.scrollY + 2; // Position 2px below the button
      let left = buttonRect.right + window.scrollX - menuRect.width; // Align right edge of menu with right edge of button

      // Viewport collision detection
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust left position if it overflows left
      if (left < margin) {
        left = margin;
      }
      // Adjust left position further if it still overflows right (e.g., button is very wide or menu is wider)
      if (left + menuRect.width > viewportWidth - margin) {
        left = viewportWidth - menuRect.width - margin;
      }
       // Clamp again if previous adjustment was too much
      if (left < margin) {
        left = margin;
      }


      // Adjust top position if it overflows bottom
      if (top + menuRect.height > viewportHeight - margin) {
        top = buttonRect.top + window.scrollY - menuRect.height - 2; // Position 2px above the button
      }
      // Clamp top position if it overflows top (after trying to position above)
      if (top < margin) {
        top = margin;
      }
      
      setPosition({ top, left, opacity: 1 });
    }
  }, [buttonRef]); // Rerun if buttonRef changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, buttonRef]);

  const handleRenameClick = () => {
    if (isChannelLocked) return;
    onRename();
    onClose();
  };

  const handleSelectDeviceClick = () => {
    onSelectDevice();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute bg-[linear-gradient(135deg,_#2a2a2a_0%,_#1a1a1a_100%)] rounded-lg border border-gray-700 shadow-[0_5px_15px_rgba(0,0,0,0.7)] min-w-[180px] z-[1001] py-1 transition-opacity duration-150"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        opacity: position.opacity 
      }}
    >
      <div
        onClick={handleRenameClick}
        className={`px-4 py-2 text-xs transition-all duration-200 ${isChannelLocked ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200 hover:bg-[rgba(0,255,136,0.1)] hover:pl-5 cursor-pointer'}`}
        role="menuitem"
        aria-disabled={isChannelLocked}
      >
        Rename Label
      </div>
      <div
        onClick={handleSelectDeviceClick}
        className="px-4 py-2 text-xs text-gray-200 cursor-pointer hover:bg-[rgba(0,255,136,0.1)] hover:pl-5 transition-all duration-200"
        role="menuitem"
      >
        Select {channelType === 'input' ? 'Input' : 'Output'} Device
      </div>
    </div>
  );
};

export default ChannelContextMenu;
