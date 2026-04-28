import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timeLimit: {
    type: Number, // in minutes
  },
  questions: [{
    text: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String }
  }],
  responses: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{ type: String }], // array of answer strings or option indices
    score: { type: Number },
    submittedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
