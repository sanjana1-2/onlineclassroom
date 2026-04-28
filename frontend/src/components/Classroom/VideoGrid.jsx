import React, { useEffect, useRef } from 'react';
import { useWebRTC } from '../../hooks/useWebRTC.js';

const VideoPlayer = ({ peerObj }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && peerObj.stream) {
      videoRef.current.srcObject = peerObj.stream;
    }
  }, [peerObj.stream]);

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden relative shadow-lg ring-1 ring-white/10 group transition-all duration-300 hover:ring-blue-500/50">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-3 left-3 glass text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/20">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        <span className="font-bold tracking-tight">{peerObj.userName || 'Connecting...'}</span>
      </div>
    </div>
  );
};

export const VideoGrid = ({ participants, roomCode, userId, userName, setControls, teacherId, setStreamReady }) => {
  const { localStream, peers, updatePeerNames, controls } = useWebRTC(roomCode, userId);

  // Two separate refs: one for the teacher spotlight (isLocalTeacher), one for student gallery tile
  const teacherSpotlightRef = useRef(null);
  const teacherRemoteVideoRef = useRef(null); // New ref for remote teacher stream
  const studentGalleryRef = useRef(null);

  // Robust ID comparison helper
  const compareIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    const s1 = String(id1).replace(/ObjectId\("|"\)/g, '').toLowerCase();
    const s2 = String(id2).replace(/ObjectId\("|"\)/g, '').toLowerCase();
    return s1 === s2;
  };

  // Ensure robust comparison between object IDs and string IDs
  const teacherIdStr = teacherId?._id || teacherId;
  const isLocalTeacher = compareIds(userId, teacherIdStr);
  
  // Find teacher peer
  const teacherPeer = peers.find(p => compareIds(p.userId, teacherIdStr));
  
  // Filter student peers
  const studentPeers = peers.filter(p => !compareIds(p.userId, teacherIdStr));

  // Sync localStream into whichever ref is mounted whenever stream changes
  useEffect(() => {
    if (teacherSpotlightRef.current && localStream) {
      teacherSpotlightRef.current.srcObject = localStream;
    }
    if (studentGalleryRef.current && localStream) {
      studentGalleryRef.current.srcObject = localStream;
    }
    if (localStream && setStreamReady) setStreamReady(true);
  }, [localStream, setStreamReady]);

  // Sync remote teacher stream
  useEffect(() => {
    if (teacherRemoteVideoRef.current && teacherPeer?.stream) {
      teacherRemoteVideoRef.current.srcObject = teacherPeer.stream;
    }
  }, [teacherPeer?.stream]);

  // Sync names from participants list
  useEffect(() => {
    updatePeerNames(participants);
  }, [participants, peers.length, updatePeerNames]);

  // Export controls to parent Classroom.jsx so we can use them in the bottom bar
  useEffect(() => {
    if (setControls) {
      setControls(controls);
    }
  }, [controls.isMuted, controls.isVideoOff, controls.isScreenSharing, setControls]);


  // Determine grid columns for student gallery based on total students
  const totalStudents = isLocalTeacher ? studentPeers.length : studentPeers.length + 1;
  let studentGridCols = "grid-cols-2";
  if (totalStudents >= 3 && totalStudents <= 4) studentGridCols = "grid-cols-2";
  else if (totalStudents >= 5 && totalStudents <= 9) studentGridCols = "grid-cols-3 md:grid-cols-2";
  else if (totalStudents >= 10) studentGridCols = "grid-cols-4 md:grid-cols-2";

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-6 overflow-hidden">
      
      {/* Teacher Spotlight Area */}
      <div className="flex-1 lg:flex-[3.5] h-full relative bg-gray-950 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col justify-center animate-fade-in">
        {isLocalTeacher ? (
          <>
            <div className="w-full h-full relative">
              {controls.isVideoOff && (
                <div className="absolute inset-0 z-10 w-full h-full bg-slate-900 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-2xl animate-float">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              <video
                ref={teacherSpotlightRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-contain bg-black ${!controls.isScreenSharing ? 'scale-x-[-1]' : ''} ${controls.isVideoOff ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
              />
            </div>
            <div className="absolute bottom-6 left-6 glass text-white text-base px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/20">
              {controls.isMuted && <span className="text-red-500 animate-pulse">🔇</span>}
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              <span className="font-bold tracking-tight">{userName} (Teacher - You)</span>
            </div>
          </>
        ) : (
          <>
            {teacherPeer ? (
              teacherPeer.stream ? (
                <div className="w-full h-full relative">
                   <video
                    ref={teacherRemoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                  <div className="absolute bottom-6 left-6 glass text-white text-base px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    <span className="font-bold tracking-tight">{teacherPeer.userName || 'Teacher'}</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-2xl animate-pulse">
                    T
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-xl mb-1 tracking-tight">Teacher Online</p>
                    <p className="text-gray-500 font-medium">Calibrating media stream...</p>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center gap-6">
                <div className="w-32 h-32 bg-gray-900 rounded-3xl flex items-center justify-center text-5xl font-black text-gray-700 shadow-inner border border-white/5 animate-float">
                  T
                </div>
                <div className="text-center">
                  <p className="text-gray-400 font-bold text-xl mb-1 tracking-tight">Class hasn't started</p>
                  <p className="text-gray-600 font-medium">Waiting for the teacher to arrive...</p>
                </div>
              </div>
            )}
            <div className="absolute top-6 right-6 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl">
              Spotlight
            </div>
          </>
        )}
      </div>

      {/* Student Gallery Area */}
      <div className="flex-1 lg:flex-[1.2] h-full overflow-y-auto no-scrollbar flex flex-col">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Participants Gallery</h3>
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-gray-500 font-bold">{totalStudents} Members</span>
        </div>
        
        <div className={`grid ${studentGridCols} gap-4 pb-4`}>
          {/* If the current user is a student, show them in the gallery */}
          {!isLocalTeacher && (
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-lg ring-1 ring-white/10 group transition-all duration-300 hover:ring-blue-500/50 animate-fade-in">
              <div className="w-full h-full relative">
                {controls.isVideoOff && (
                  <div className="absolute inset-0 z-10 w-full h-full bg-slate-800 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <video
                  ref={studentGalleryRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${!controls.isScreenSharing ? 'scale-x-[-1]' : ''} ${controls.isVideoOff ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                />
              </div>
              <div className="absolute bottom-3 left-3 glass text-white text-[10px] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20">
                {controls.isMuted && <span className="text-red-500">🔇</span>}
                <span className="font-bold truncate max-w-[80px] tracking-tight">{userName} (You)</span>
              </div>
            </div>
          )}

          {/* Render all other student peers */}
          {studentPeers.map((peerObj, idx) => (
            <div key={peerObj.peerId} className="aspect-video animate-fade-in" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
              <VideoPlayer peerObj={peerObj} />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

