import express from 'express';
import {
  createQuiz,
  submitQuizResponse,
  getQuizResults,
  getRoomQuizzes,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('teacher'), createQuiz);
router.post('/submit', protect, submitQuizResponse);
router.get('/:quizId/results', protect, authorize('teacher'), getQuizResults);
router.get('/room/:roomId', protect, getRoomQuizzes);

export default router;
