import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import { roomAPI, attendanceAPI } from '../../services/api.js';
import { VideoGrid } from './VideoGrid.jsx';
import { ChatWindow } from '../Chat/ChatWindow.jsx';
import { Controls } from './Controls.jsx';

export const Classroom = () => {
  const { roomCode } = useParams();
  const { user } = useAuth();
  const { on, off, emit, isConnected } = useSocket();
  console.log("Current user object:", user);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceId, setAttendanceId] = useState(null);
  const [participants, setParticipants] = useState([]);
  
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [controls, setControls] = useState(null);

  useEffect(() => {
    const handleRoomState = (existingUsers) => {
      setParticipants(existingUsers);
    };

    const handleUserJoined = (data) => {
      setParticipants(prev => {
        if (prev.find(p => p.socketId === data.socketId)) return prev;
        return [...prev, { userId: data.userId, userName: data.userName, socketId: data.socketId }];
      });
    };

    const handleUserLeft = (data) => {
      setParticipants(prev => prev.filter(p => p.socketId !== data.socketId));
    };

    on('room-state', handleRoomState);
    on('user-joined', handleUserJoined);
    on('user-left', handleUserLeft);

    return () => {
      off('room-state', handleRoomState);
      off('user-joined', handleUserJoined);
      off('user-left', handleUserLeft);
    };
  }, [on, off]);

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        // Fetch room details
        const roomResponse = await roomAPI.getRoomByCode(roomCode);
        setRoom(roomResponse.data.room);

        // Record attendance
        const attendanceResponse = await attendanceAPI.recordAttendance(roomResponse.data.room._id);
        setAttendanceId(attendanceResponse.data.attendance._id);

        // Wait for localStream to be ready before joining socket room
        // We will emit join-room in a separate useEffect that watches localStream
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to join room');
      } finally {
        setLoading(false);
      }
    };

    initializeRoom();

    return () => {
      if (attendanceId) {
        attendanceAPI.endAttendance(attendanceId);
      }
      emit('leave-room', { roomCode, userId: user._id });
    };
  }, [roomCode, user, emit]); // Removed attendanceId from dependency to avoid re-running

  // We need localStream ready before joining room so we don't miss WebRTC signals
  const [streamReady, setStreamReady] = useState(false);

  useEffect(() => {
    if (streamReady && room && isConnected) {
      emit('join-room', {
        roomCode,
        userId: user._id || user.id,
        userName: user.name,
      });
    }
  }, [streamReady, room, roomCode, user, emit, isConnected]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Top Header */}
      <div className="bg-gray-800 text-white p-3 px-6 flex justify-between items-center shadow-md z-10">
        <div>
          <h1 className="text-xl font-bold">{room?.title || 'Classroom'}</h1>
        </div>
        <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 border border-blue-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Room Code: {roomCode}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative bg-black/40">
        {/* Video Grid Area */}
        <div className="flex-1 overflow-auto relative">
          <VideoGrid 
            participants={participants} 
            roomCode={roomCode} 
            userId={user._id || user.id} 
            userName={user.name} 
            setControls={setControls} 
            teacherId={room?.teacher?._id || room?.teacher}
            setStreamReady={setStreamReady}
          />
        </div>
        
        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shadow-xl z-20">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Participants ({participants.length + 1})</h2>
              <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-200 font-medium">{user.name} (You)</span>
              </div>
              {participants.map(p => (
                <div key={p.userId} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {p.userName ? p.userName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="text-gray-200 font-medium">{p.userName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col shadow-xl z-20">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
              <h2 className="text-lg font-bold text-white">Meeting Chat</h2>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <ChatWindow roomId={room?._id} roomCode={roomCode} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <Controls 
        controls={controls} 
        onToggleChat={() => {
          setShowChat(!showChat);
          if (!showChat) setShowParticipants(false); // Optionally close the other
        }}
        onToggleParticipants={() => {
          setShowParticipants(!showParticipants);
          if (!showParticipants) setShowChat(false); // Optionally close the other
        }}
        showChat={showChat}
        showParticipants={showParticipants}
      />
    </div>
  );
};
