import Quiz from '../models/Quiz.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, roomId, timeLimit } = req.body;

    const quiz = await Quiz.create({
      room: roomId,
      createdBy: req.user.userId,
      title,
      description,
      questions: questions.map(q => ({
        _id: new mongoose.Types.ObjectId(),
        ...q,
      })),
      timeLimit,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    logger.error('Create quiz error:', error);
    res.status(500).json({ message: 'Error creating quiz' });
  }
};

export const submitQuizResponse = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let totalScore = 0;
    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question?.correctAnswer === answer.answer;
      const points = isCorrect ? question.points : 0;
      totalScore += points;

      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
        points,
      };
    });

    const response = {
      studentId: req.user.userId,
      answers: processedAnswers,
      totalScore,
      submittedAt: new Date(),
    };

    quiz.responses.push(response);
    await quiz.save();

    res.status(201).json({
      success: true,
      response,
    });
  } catch (error) {
    logger.error('Submit quiz response error:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
};

export const getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate('responses.studentId', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    logger.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Error fetching results' });
  }
};

export const getRoomQuizzes = async (req, res) => {
  try {
    const { roomId } = req.params;

    const quizzes = await Quiz.find({ room: roomId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    logger.error('Get room quizzes error:', error);
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
};
