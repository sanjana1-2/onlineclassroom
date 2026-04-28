import express from 'express';
import {
  recordAttendance,
  endAttendance,
  getRoomAttendance,
  getStudentAttendance,
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, recordAttendance);
router.put('/:attendanceId/end', protect, endAttendance);
router.get('/room/:roomId', protect, authorize('teacher'), getRoomAttendance);
router.get('/student/records', protect, authorize('student'), getStudentAttendance);

export default router;
