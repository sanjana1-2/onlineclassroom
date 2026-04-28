import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  timestamps: [{
    time: String,
    text: String
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  generatedBy: {
    type: String,
    enum: ['ai', 'user'],
    default: 'user',
  }
}, { timestamps: true });

const Notes = mongoose.model('Notes', notesSchema);

export default Notes;
