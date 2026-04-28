import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './useSocket.js';

// STUN servers for ICE negotiation
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = (roomCode, userId) => {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]); // Array of { peerId (socketId), userId, peer, stream, userName }
  const peersRef = useRef([]); // Stable reference for use inside callbacks
  const { on, off, emit } = useSocket();

  // Controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const originalVideoTrackRef = useRef(null);

  // ─── Initialize local stream ────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        setLocalStream(stream);
        originalVideoTrackRef.current = stream.getVideoTracks()[0];
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn('Camera/mic unavailable, using fake stream:', err.message);

        // Fake stream for testing in environments without a real camera
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioContext();
          const oscillator = ctx.createOscillator();
          const dst = oscillator.connect(ctx.createMediaStreamDestination());
          oscillator.start();

          const canvas = document.createElement('canvas');
          canvas.width = 640; canvas.height = 480;
          const canvasCtx = canvas.getContext('2d');
          canvasCtx.fillStyle = '#1e293b';
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

          const fakeStream = new MediaStream([
            canvas.captureStream(1).getVideoTracks()[0],
            dst.stream.getAudioTracks()[0],
          ]);
          setLocalStream(fakeStream);
          setIsVideoOff(true);
          setIsMuted(true);
        } catch (e) {
          console.error('Failed to create fake stream', e);
        }
      });

    return () => { mounted = false; };
  }, []);

  // ─── Peer factory: initiator (we send the offer) ───────────────────────────
  // trickle: false → SDP + all ICE candidates are bundled into ONE signal,
  // eliminating the "ICE candidate arrives before remote description" race.
  const createPeer = useCallback((targetSocketId, stream, userName) => {
    console.log('[WebRTC] createPeer → target:', targetSocketId);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: ICE_SERVERS,
    });

    peer.on('signal', (signal) => {
      console.log('[WebRTC] sending offer to', targetSocketId, signal.type);
      emit('webrtc-offer', { roomCode, to: targetSocketId, offer: signal });
    });

    peer.on('error', (err) => console.error('[WebRTC] createPeer error:', err));

    return peer;
  }, [emit, roomCode]);

  // ─── Peer factory: answerer (we received an offer) ─────────────────────────
  // NOTE: Does NOT call peer.signal() internally — caller must do that AFTER
  // registering the 'stream' handler to avoid the race condition.
  const buildAnswerPeer = useCallback((callerSocketId, stream) => {
    console.log('[WebRTC] buildAnswerPeer ← caller:', callerSocketId);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: ICE_SERVERS,
    });

    peer.on('signal', (signal) => {
      console.log('[WebRTC] sending answer to', callerSocketId, signal.type);
      emit('webrtc-answer', { roomCode, to: callerSocketId, answer: signal });
    });

    peer.on('error', (err) => console.error('[WebRTC] buildAnswerPeer error:', err));

    return peer;
  }, [emit, roomCode]);

  // ─── Main socket/WebRTC event handlers (requires localStream) ─────────────
  useEffect(() => {
    if (!localStream) return;

    // ── room-state: fired for the newly joined user listing who's already here ──
    const handleRoomState = (existingUsers) => {
      console.log('[WebRTC] room-state, existing users:', existingUsers.length);
      // We don't initiate from here to avoid dual-initiation conflicts.
      // We will wait for 'user-joined' (if we were already here) or 'webrtc-offer' (if we just joined).
    };

    // ── user-joined: fired for existing users when someone new joins ──────────
    const handleUserJoined = (data) => {
      if (peersRef.current.find(p => p.peerId === data.socketId)) return;
      console.log('[WebRTC] user-joined:', data.userName, data.socketId);

      const peer = createPeer(data.socketId, localStream, data.userName);

      peer.on('stream', (remoteStream) => {
        console.log('[WebRTC] stream from user-joined peer:', data.userName);
        setPeers(prev => prev.map(p =>
          p.peerId === data.socketId ? { ...p, stream: remoteStream } : p
        ));
      });

      const entry = { peerId: data.socketId, userId: data.userId, peer, stream: null, userName: data.userName || 'Connecting...' };
      peersRef.current.push(entry);
      setPeers(prev => [...prev, entry]);
    };

    // ── user-left ─────────────────────────────────────────────────────────────
    const handleUserLeft = (data) => {
      const peerObj = peersRef.current.find(p => p.peerId === data.socketId);
      if (peerObj?.peer) peerObj.peer.destroy();
      peersRef.current = peersRef.current.filter(p => p.peerId !== data.socketId);
      setPeers(prev => prev.filter(p => p.peerId !== data.socketId));
    };

    // ── webrtc-offer: we are the answerer ─────────────────────────────────────
    const handleReceiveOffer = (data) => {
      console.log('[WebRTC] received offer from:', data.from, data.userName);

      // Destroy old peer for this socket if one exists (reconnect scenario)
      const existingIdx = peersRef.current.findIndex(p => p.peerId === data.from);
      if (existingIdx !== -1) {
        peersRef.current[existingIdx].peer?.destroy();
        peersRef.current.splice(existingIdx, 1);
      }

      const peer = buildAnswerPeer(data.from, localStream);

      // ⚠️  CRITICAL: register 'stream' handler BEFORE calling peer.signal()
      // so we never miss the stream event.
      peer.on('stream', (remoteStream) => {
        console.log('[WebRTC] stream from offer peer:', data.userName);
        setPeers(prev => prev.map(p =>
          p.peerId === data.from ? { ...p, stream: remoteStream } : p
        ));
      });

      // Now safe to apply the offer — stream handler is already registered
      peer.signal(data.offer);

      const entry = { peerId: data.from, userId: data.userId, peer, stream: null, userName: data.userName || 'Connecting...' };
      peersRef.current.push(entry);
      setPeers(prev => {
        if (prev.find(p => p.peerId === data.from)) return prev;
        return [...prev, entry];
      });
    };

    // ── webrtc-answer: we are the initiator, apply the answer ─────────────────
    const handleReceiveAnswer = (data) => {
      const peerObj = peersRef.current.find(p => p.peerId === data.from);
      if (peerObj?.peer) {
        console.log('[WebRTC] received answer from:', data.from);
        peerObj.peer.signal(data.answer);
      }
    };

    // (trickle:false → no separate ice-candidate messages needed,
    //  but keep handler in case of fallback / future change)
    const handleIceCandidate = (data) => {
      const peerObj = peersRef.current.find(p => p.peerId === data.from);
      if (peerObj?.peer) peerObj.peer.signal(data.candidate);
    };

    on('room-state', handleRoomState);
    on('user-joined', handleUserJoined);
    on('user-left', handleUserLeft);
    on('webrtc-offer', handleReceiveOffer);
    on('webrtc-answer', handleReceiveAnswer);
    on('ice-candidate', handleIceCandidate);

    return () => {
      off('room-state', handleRoomState);
      off('user-joined', handleUserJoined);
      off('user-left', handleUserLeft);
      off('webrtc-offer', handleReceiveOffer);
      off('webrtc-answer', handleReceiveAnswer);
      off('ice-candidate', handleIceCandidate);

      peersRef.current.forEach(p => p.peer?.destroy());
      peersRef.current = [];
    };
  }, [localStream, on, off, createPeer, buildAnswerPeer]);

  // ─── Sync participant names/userIds into peer entries ──────────────────────
  const updatePeerNames = useCallback((participantsList) => {
    setPeers(prev => {
      let changed = false;
      const next = prev.map(p => {
        const match = participantsList.find(pt => pt.socketId === p.peerId);
        if (match && (p.userName !== match.userName || p.userId !== match.userId)) {
          changed = true;
          return { ...p, userName: match.userName, userId: match.userId };
        }
        return p;
      });
      return changed ? next : prev;
    });
  }, []);

  // ─── Media controls ────────────────────────────────────────────────────────
  const toggleMute = () => {
    if (localStream) {
      const track = localStream.getAudioTracks()[0];
      if (track) { track.enabled = isMuted; setIsMuted(m => !m); }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const track = localStream.getVideoTracks()[0];
      if (track) { track.enabled = isVideoOff; setIsVideoOff(v => !v); }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        peersRef.current.forEach(peerObj => {
          peerObj.peer.replaceTrack(localStream.getVideoTracks()[0], screenTrack, localStream);
        });
        screenTrack.onended = stopScreenShare;
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Failed to share screen:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    peersRef.current.forEach(peerObj => {
      const senders = peerObj.peer._pc?.getSenders?.();
      if (senders) {
        const videoSender = senders.find(s => s.track?.kind === 'video');
        if (videoSender && originalVideoTrackRef.current) {
          videoSender.replaceTrack(originalVideoTrackRef.current);
        }
      }
    });
    setIsScreenSharing(false);
  };

  return {
    localStream,
    peers,
    updatePeerNames,
    controls: { isMuted, isVideoOff, isScreenSharing, toggleMute, toggleVideo, toggleScreenShare },
  };
};
