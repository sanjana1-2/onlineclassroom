import express from 'express';
import {
  generateNotesFromTranscript,
  generateTimestampedNotesFromTranscript,
  getRoomNotes,
  publishNotes,
  generateQuizFromTranscript,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/notes/generate', protect, authorize('teacher'), generateNotesFromTranscript);
router.post('/notes/timestamped', protect, authorize('teacher'), generateTimestampedNotesFromTranscript);
router.post('/quiz/generate', protect, authorize('teacher'), generateQuizFromTranscript);
router.get('/notes/room/:roomId', protect, getRoomNotes);
router.put('/notes/:notesId/publish', protect, publishNotes);

export default router;
