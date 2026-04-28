import express from 'express';
import {
  sendMessage,
  getRoomMessages,
  getPrivateMessages,
  markAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/room/:roomId', protect, getRoomMessages);
router.get('/private/:userId', protect, getPrivateMessages);
router.put('/:messageId/read', protect, markAsRead);

export default router;
