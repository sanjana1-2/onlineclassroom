import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants.js';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinRoom = (roomCode, userId, userName) => {
  const socket = getSocket();
  socket.emit('join-room', { roomCode, userId, userName });
};

export const leaveRoom = (roomCode, userId) => {
  const socket = getSocket();
  socket.emit('leave-room', { roomCode, userId });
};

export const sendWebRTCOffer = (roomCode, to, offer) => {
  const socket = getSocket();
  socket.emit('webrtc-offer', { roomCode, to, offer });
};

export const sendWebRTCAnswer = (roomCode, to, answer) => {
  const socket = getSocket();
  socket.emit('webrtc-answer', { roomCode, to, answer });
};

export const sendICECandidate = (roomCode, to, candidate) => {
  const socket = getSocket();
  socket.emit('ice-candidate', { roomCode, to, candidate });
};

export const startScreenShare = (roomCode, userId) => {
  const socket = getSocket();
  socket.emit('screen-share-start', { roomCode, userId });
};

export const stopScreenShare = (roomCode, userId) => {
  const socket = getSocket();
  socket.emit('screen-share-stop', { roomCode, userId });
};

export const raiseHand = (roomCode, userId, userName) => {
  const socket = getSocket();
  socket.emit('raise-hand', { roomCode, userId, userName });
};

export const lowerHand = (roomCode, userId) => {
  const socket = getSocket();
  socket.emit('lower-hand', { roomCode, userId });
};

export const sendEmojiReaction = (roomCode, emoji, userId) => {
  const socket = getSocket();
  socket.emit('emoji-reaction', { roomCode, emoji, userId });
};

export const sendChatMessage = (roomCode, message) => {
  const socket = getSocket();
  socket.emit('chat-message', { roomCode, message });
};
