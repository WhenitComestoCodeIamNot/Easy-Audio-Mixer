
import React, { forwardRef } from 'react';

type IconGlyph = 'lockOpen' | 'lockClosed' | 'eye' | 'eyeSlash' | 'settings' | 'arrowDown' | 'arrowRight' | 'link' | 'linkBroken' | 'gripVertical' | 'ellipsisVertical';

interface IconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconGlyph;
  title?: string;
}

const Icon = forwardRef<HTMLButtonElement, IconProps>(({ icon, title, onClick, type = "button", className, ...props }, ref) => {
  const getIconContent = () => {
    switch (icon) {
      case 'lockOpen': return '🔓';
      case 'lockClosed': return '🔒';
      case 'eye': return '👁';
      case 'eyeSlash': return '🚫';
      case 'settings': return '⚙️';
      case 'arrowDown': return '▼';
      case 'arrowRight': return '►';
      case 'link': return '🔗';
      case 'linkBroken': return '💔';
      case 'gripVertical': return '⠿';
      case 'ellipsisVertical': return '⋮';
      default: return '';
    }
  };

  return (
    <button
      ref={ref} // Pass the ref to the button element
      type={type}
      title={title}
      onClick={onClick}
      className={`w-[18px] h-[18px] rounded-[3px] border border-gray-600 cursor-pointer flex items-center justify-center text-[10px] transition-all duration-300 bg-[linear-gradient(135deg,_#333_0%,_#555_100%)] text-gray-300 hover:scale-110 hover:bg-[linear-gradient(135deg,_#444_0%,_#666_100%)] hover:text-white hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {getIconContent()}
    </button>
  );
});

Icon.displayName = 'Icon'; // Optional: for better debugging messages

export default Icon;
