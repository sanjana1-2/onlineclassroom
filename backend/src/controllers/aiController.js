import Notes from '../models/Notes.js';
import { generateLectureSummary, generateTimestampedNotes, generateQuizQuestions } from '../services/aiService.js';
import logger from '../utils/logger.js';

export const generateNotesFromTranscript = async (req, res) => {
  try {
    const { roomId, transcript, title } = req.body;

    if (!transcript || !title) {
      return res.status(400).json({ message: 'Transcript and title are required' });
    }

    const summary = await generateLectureSummary(transcript);

    const notes = await Notes.create({
      room: roomId,
      createdBy: req.user.userId,
      title,
      content: transcript,
      summary,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      notes,
    });
  } catch (error) {
    logger.error('Generate notes error:', error);
    res.status(500).json({ message: 'Error generating notes' });
  }
};

export const generateTimestampedNotesFromTranscript = async (req, res) => {
  try {
    const { roomId, transcript, timestamps, title } = req.body;

    if (!transcript || !timestamps || !title) {
      return res.status(400).json({ message: 'Transcript, timestamps, and title are required' });
    }

    const notes = await generateTimestampedNotes(transcript, timestamps);

    const notesDoc = await Notes.create({
      room: roomId,
      createdBy: req.user.userId,
      title,
      content: transcript,
      summary: notes,
      timestamps,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      notes: notesDoc,
    });
  } catch (error) {
    logger.error('Generate timestamped notes error:', error);
    res.status(500).json({ message: 'Error generating timestamped notes' });
  }
};

export const getRoomNotes = async (req, res) => {
  try {
    const { roomId } = req.params;

    const notes = await Notes.find({ room: roomId })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    logger.error('Get room notes error:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

export const publishNotes = async (req, res) => {
  try {
    const { notesId } = req.params;

    const notes = await Notes.findById(notesId);
    if (!notes) {
      return res.status(404).json({ message: 'Notes not found' });
    }

    if (notes.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only creator can publish notes' });
    }

    notes.isPublished = true;
    await notes.save();

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    logger.error('Publish notes error:', error);
    res.status(500).json({ message: 'Error publishing notes' });
  }
};

export const generateQuizFromTranscript = async (req, res) => {
  try {
    const { transcript, numberOfQuestions } = req.body;

    if (!transcript) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    const questions = await generateQuizQuestions(transcript, numberOfQuestions);

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    logger.error('Generate quiz error:', error);
    res.status(500).json({ message: 'Error generating quiz questions' });
  }
};
