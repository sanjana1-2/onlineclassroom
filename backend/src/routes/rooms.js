import express from 'express';
import {
  createRoom,
  getRoomByCode,
  startRoom,
  endRoom,
  getTeacherRooms,
  updateRoomSettings,
  getPublicRooms,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('teacher'), createRoom);
router.get('/teacher/rooms', protect, authorize('teacher'), getTeacherRooms);
router.get('/public', protect, getPublicRooms);
router.get('/code/:roomCode', protect, getRoomByCode);
router.post('/:roomId/start', protect, authorize('teacher'), startRoom);
router.post('/:roomId/end', protect, authorize('teacher'), endRoom);
router.put('/:roomId/settings', protect, authorize('teacher'), updateRoomSettings);

export default router;
