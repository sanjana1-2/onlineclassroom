import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import { messageAPI } from '../../services/api.js';

export const ChatWindow = ({ roomId, roomCode }) => {
  const { user } = useAuth();
  const { on, off, emit } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch existing messages
    if (roomId) {
      messageAPI.getRoomMessages(roomId).then(res => {
        setMessages(res.data.messages || []);
      }).catch(() => {});
    }

    // Store handler so we can remove the exact same reference on cleanup
    const handleChatMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    on('chat-message', handleChatMessage);

    return () => {
      off('chat-message', handleChatMessage);
    };
  }, [roomId, on, off]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageObj = {
      content: input,
      room: roomId,
      isPrivate: false,
      sender: { _id: user._id, name: user.name },
      createdAt: new Date().toISOString(),
    };

    // Optimistically add to local state so sender sees it immediately
    setMessages(prev => [...prev, messageObj]);
    setInput('');

    try {
      // Persist to DB
      await messageAPI.sendMessage({ content: input, room: roomId, isPrivate: false });
      // Broadcast to everyone else in the room — server expects { roomCode, message }
      emit('chat-message', { roomCode, message: messageObj });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user._id || msg.sender === user._id;
          return (
            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-blue-400' : 'text-gray-500'}`}>
                  {isMe ? 'You' : msg.sender?.name}
                </span>
                <span className="text-[9px] text-gray-700">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-950/50 backdrop-blur-md border-t border-white/5">
        <form onSubmit={handleSendMessage} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full pl-5 pr-14 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all duration-300"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

