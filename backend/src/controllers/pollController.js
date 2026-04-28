import Poll from '../models/Poll.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const createPoll = async (req, res) => {
  try {
    const { question, options, roomId, allowMultiple } = req.body;

    const poll = await Poll.create({
      room: roomId,
      createdBy: req.user.userId,
      question,
      options: options.map(opt => ({
        _id: new mongoose.Types.ObjectId(),
        text: opt,
        votes: 0,
      })),
      allowMultiple: allowMultiple || false,
    });

    res.status(201).json({
      success: true,
      poll,
    });
  } catch (error) {
    logger.error('Create poll error:', error);
    res.status(500).json({ message: 'Error creating poll' });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const hasVoted = poll.voters.some(v => v.userId.toString() === req.user.userId);
    if (hasVoted && !poll.allowMultiple) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    const option = poll.options.find(o => o._id.toString() === optionId);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    option.votes += 1;
    poll.voters.push({
      userId: req.user.userId,
      selectedOption: optionId,
      votedAt: new Date(),
    });

    await poll.save();

    res.status(200).json({
      success: true,
      poll,
    });
  } catch (error) {
    logger.error('Vote poll error:', error);
    res.status(500).json({ message: 'Error voting on poll' });
  }
};

export const closePoll = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (poll.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only creator can close poll' });
    }

    poll.isActive = false;
    poll.closedAt = new Date();
    await poll.save();

    res.status(200).json({
      success: true,
      poll,
    });
  } catch (error) {
    logger.error('Close poll error:', error);
    res.status(500).json({ message: 'Error closing poll' });
  }
};

export const getRoomPolls = async (req, res) => {
  try {
    const { roomId } = req.params;

    const polls = await Poll.find({ room: roomId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      polls,
    });
  } catch (error) {
    logger.error('Get room polls error:', error);
    res.status(500).json({ message: 'Error fetching polls' });
  }
};
