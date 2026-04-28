import Room from '../models/Room.js';
import Attendance from '../models/Attendance.js';
import logger from '../utils/logger.js';

export const createRoom = async (req, res) => {
  try {
    logger.info(`Creating room for teacher: ${req.user.userId}`, req.body);
    const { title, description, maxParticipants, isPrivate } = req.body;

    const room = await Room.create({
      title,
      description,
      isPrivate: isPrivate || false,
      teacher: req.user.userId,
      maxParticipants: maxParticipants || 100,
    });

    logger.info(`Room created successfully: ${room.roomCode}`);
    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    logger.error('Create room error:', error);
    res.status(500).json({ message: 'Error creating room: ' + (error.message || error) });
  }
};

export const getRoomByCode = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode }).populate('teacher', 'name avatar');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    logger.error('Get room error:', error);
    res.status(500).json({ message: 'Error fetching room' });
  }
};

export const startRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only teacher can start the room' });
    }

    room.isActive = true;
    room.startTime = new Date();
    await room.save();

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    logger.error('Start room error:', error);
    res.status(500).json({ message: 'Error starting room' });
  }
};

export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only teacher can end the room' });
    }

    room.isActive = false;
    room.endTime = new Date();
    await room.save();

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    logger.error('End room error:', error);
    res.status(500).json({ message: 'Error ending room' });
  }
};

export const getTeacherRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ teacher: req.user.userId });

    res.status(200).json({
      success: true,
      rooms: Array.isArray(rooms) ? rooms : [],
    });
  } catch (error) {
    logger.error('Get teacher rooms error:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};

export const getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false, isActive: true }).populate('teacher', 'name avatar');

    res.status(200).json({
      success: true,
      rooms: Array.isArray(rooms) ? rooms : [],
    });
  } catch (error) {
    logger.error('Get public rooms error:', error);
    res.status(500).json({ message: 'Error fetching public rooms' });
  }
};

export const updateRoomSettings = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { settings } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only teacher can update settings' });
    }

    room.settings = { ...room.settings, ...settings };
    const updatedRoom = await Room.findByIdAndUpdate(roomId, room, { new: true });

    res.status(200).json({
      success: true,
      room: updatedRoom,
    });
  } catch (error) {
    logger.error('Update room settings error:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};
