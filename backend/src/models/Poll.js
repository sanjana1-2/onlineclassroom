import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [{
    text: { type: String, required: true },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  allowMultiple: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
 