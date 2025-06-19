
import React from 'react';

const Header: React.FC = () => {
  return (
    <header 
        className="bg-[linear-gradient(135deg,_#2a2a2a_0%,_#1a1a1a_100%)] px-[30px] py-[20px] border-b-2 border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative"
        style={{ borderImage: 'linear-gradient(90deg, transparent, #00ff88, #00ccff, transparent) 1' }}
    >
      <div className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[linear-gradient(90deg,_transparent,_rgba(0,255,136,0.3),_rgba(0,204,255,0.3),_transparent)] animate-shimmer"></div>
      <style>{`
        @keyframes shimmer {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
        }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>
      <h1 className="text-2xl font-bold bg-[linear-gradient(135deg,_#00ff88_0%,_#00ccff_100%)] bg-clip-text text-transparent tracking-wider">
        Pro Audio Mixer
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Professional Grade Audio Control • VoiceMeeter Engine • Zero Latency
      </p>
    </header>
  );
};

export default Header;
