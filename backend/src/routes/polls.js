import express from 'express';
import {
  createPoll,
  votePoll,
  closePoll,
  getRoomPolls,
} from '../controllers/pollController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('teacher'), createPoll);
router.post('/vote', protect, votePoll);
router.put('/:pollId/close', protect, authorize('teacher'), closePoll);
router.get('/room/:roomId', protect, getRoomPolls);

export default router;
