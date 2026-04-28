console.log('[DEBUG] Vite Env VITE_API_URL:', import.meta.env.VITE_API_URL);
export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/';

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const ROOM_SETTINGS = {
  ALLOW_SCREEN_SHARE: 'allowScreenShare',
  ALLOW_CHAT: 'allowChat',
  ALLOW_RAISE_HAND: 'allowRaiseHand',
  ALLOW_POLLS: 'allowPolls',
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  EMOJI: 'emoji',
  SYSTEM: 'system',
};

export const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏'];

export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  WEBRTC_OFFER: 'webrtc-offer',
  WEBRTC_ANSWER: 'webrtc-answer',
  ICE_CANDIDATE: 'ice-candidate',
  SCREEN_SHARE_START: 'screen-share-start',
  SCREEN_SHARE_STOP: 'screen-share-stop',
  RAISE_HAND: 'raise-hand',
  LOWER_HAND: 'lower-hand',
  EMOJI_REACTION: 'emoji-reaction',
  CHAT_MESSAGE: 'chat-message',
};
