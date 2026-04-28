import axios from 'axios';
import { API_URL } from '../utils/constants.js';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Room endpoints
export const roomAPI = {
  createRoom: (data) => api.post('/rooms', data),
  getRoomByCode: (roomCode) => api.get(`/rooms/code/${roomCode}`),
  startRoom: (roomId) => api.post(`/rooms/${roomId}/start`),
  endRoom: (roomId) => api.post(`/rooms/${roomId}/end`),
  getTeacherRooms: () => api.get('/rooms/teacher/rooms'),
  getPublicRooms: () => api.get('/rooms/public'),
  updateRoomSettings: (roomId, settings) => api.put(`/rooms/${roomId}/settings`, { settings }),
};

// Message endpoints
export const messageAPI = {
  sendMessage: (data) => api.post('/messages', data),
  getRoomMessages: (roomId, limit = 50, skip = 0) =>
    api.get(`/messages/room/${roomId}`, { params: { limit, skip } }),
  getPrivateMessages: (userId, limit = 50, skip = 0) =>
    api.get(`/messages/private/${userId}`, { params: { limit, skip } }),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
};

// Attendance endpoints
export const attendanceAPI = {
  recordAttendance: (roomId) => api.post('/attendance', { roomId }),
  endAttendance: (attendanceId) => api.put(`/attendance/${attendanceId}/end`),
  getRoomAttendance: (roomId) => api.get(`/attendance/room/${roomId}`),
  getStudentAttendance: () => api.get('/attendance/student/records'),
};

// Poll endpoints
export const pollAPI = {
  createPoll: (data) => api.post('/polls', data),
  votePoll: (data) => api.post('/polls/vote', data),
  closePoll: (pollId) => api.put(`/polls/${pollId}/close`),
  getRoomPolls: (roomId) => api.get(`/polls/room/${roomId}`),
};

// Quiz endpoints
export const quizAPI = {
  createQuiz: (data) => api.post('/quizzes', data),
  submitResponse: (data) => api.post('/quizzes/submit', data),
  getResults: (quizId) => api.get(`/quizzes/${quizId}/results`),
  getRoomQuizzes: (roomId) => api.get(`/quizzes/room/${roomId}`),
};

// AI endpoints
export const aiAPI = {
  generateNotes: (data) => api.post('/ai/notes/generate', data),
  generateTimestampedNotes: (data) => api.post('/ai/notes/timestamped', data),
  getRoomNotes: (roomId) => api.get(`/ai/notes/room/${roomId}`),
  publishNotes: (notesId) => api.put(`/ai/notes/${notesId}/publish`),
};

export default api;
