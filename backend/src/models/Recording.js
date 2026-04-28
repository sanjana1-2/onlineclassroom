import mongoose from 'mongoose';

const recordingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
  size: {
    type: Number,
  }
}, { timestamps: true });

const Recording = mongoose.model('Recording', recordingSchema);

export default Recording;
