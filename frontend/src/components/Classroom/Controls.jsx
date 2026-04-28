import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Controls = ({ controls, onToggleChat, onToggleParticipants, showChat, showParticipants }) => {
  const navigate = useNavigate();

  const handleLeave = () => {
    navigate('/dashboard');
  };

  if (!controls) {
    return <div className="h-24 glass-dark border-t border-white/5 flex items-center justify-center text-gray-400 font-bold tracking-widest uppercase text-xs">Initializing Secure Stream...</div>;
  }

  const { isMuted, isVideoOff, isScreenSharing, toggleMute, toggleVideo, toggleScreenShare } = controls;

  return (
    <div className="h-24 glass-dark border-t border-white/10 px-8 flex items-center justify-between z-30">
      {/* Left side info */}
      <div className="w-1/4 hidden lg:flex items-center">
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
          <span className="text-gray-300 text-xs font-black uppercase tracking-widest">Encypted Session</span>
        </div>
      </div>

      {/* Center Controls */}
      <div className="flex items-center justify-center gap-4 flex-1">
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-[2rem] border border-white/5 shadow-inner">
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isMuted ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'hover:bg-white/10'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <span className="text-xl">{isMuted ? '🔇' : '🎤'}</span>
          </button>

          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isVideoOff ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'hover:bg-white/10'
            }`}
            title={isVideoOff ? 'Start Video' : 'Stop Video'}
          >
            <span className="text-xl">{isVideoOff ? '🚫' : '📷'}</span>
          </button>

          <button
            onClick={toggleScreenShare}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isScreenSharing ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'hover:bg-white/10'
            }`}
            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <span className="text-xl">🖥️</span>
          </button>
        </div>

        <div className="w-px h-10 bg-white/10 mx-2"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleParticipants}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              showParticipants ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
            title="Participants"
          >
            <span className="text-xl">👥</span>
          </button>

          <button
            onClick={onToggleChat}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              showChat ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
            title="Chat"
          >
            <span className="text-xl">💬</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="w-1/4 flex items-center justify-end">
        <button
          onClick={handleLeave}
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] py-3.5 px-8 rounded-2xl transition-all duration-300 border border-red-500/20 hover:border-red-500 shadow-lg hover:shadow-red-500/20 active:scale-95"
        >
          Exit Class
        </button>
      </div>
    </div>
  );
};

