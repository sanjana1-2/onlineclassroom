import Message from '../models/Message.js';
import logger from '../utils/logger.js';

export const sendMessage = async (req, res) => {
  try {
    const { content, room, recipient, isPrivate } = req.body;

    const message = await Message.create({
      sender: req.user.userId,
      content,
      room: isPrivate ? null : room,
      recipient: isPrivate ? recipient : null,
      isPrivate,
    });

    await message.populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ room: roomId, isPrivate: false })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Message.countDocuments({ room: roomId, isPrivate: false });

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      total,
    });
  } catch (error) {
    logger.error('Get room messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({
      isPrivate: true,
      $or: [
        { sender: req.user.userId, recipient: userId },
        { sender: userId, recipient: req.user.userId },
      ],
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    logger.error('Get private messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    logger.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error marking message as read' });
  }
};
