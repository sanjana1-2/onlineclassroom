import Attendance from '../models/Attendance.js';
import logger from '../utils/logger.js';

export const recordAttendance = async (req, res) => {
  try {
    const { roomId } = req.body;

    const existingAttendance = await Attendance.findOne({
      room: roomId,
      student: req.user.userId,
    });

    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        attendance: existingAttendance,
      });
    }

    const attendance = await Attendance.create({
      room: roomId,
      student: req.user.userId,
      joinedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      attendance,
    });
  } catch (error) {
    logger.error('Record attendance error:', error);
    res.status(500).json({ message: 'Error recording attendance' });
  }
};

export const endAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.leftAt = new Date();
    attendance.duration = Math.floor((attendance.leftAt - attendance.joinedAt) / 1000 / 60);
    await attendance.save();

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    logger.error('End attendance error:', error);
    res.status(500).json({ message: 'Error ending attendance' });
  }
};

export const getRoomAttendance = async (req, res) => {
  try {
    const { roomId } = req.params;

    const attendance = await Attendance.find({ room: roomId })
      .populate('student', 'name email')
      .sort({ joinedAt: -1 });

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    logger.error('Get room attendance error:', error);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user.userId })
      .populate('room', 'title')
      .sort({ joinedAt: -1 });

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    logger.error('Get student attendance error:', error);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};
